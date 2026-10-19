const pool = require('../config/db');
const auditLogger = require('../middleware/auditLogger');

exports.generateBill = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { patient_id, admission_id, appointment_id, items, discount } = req.body;

        await connection.beginTransaction();

        const subtotal = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const total = subtotal - (discount || 0);

        const [result] = await connection.query(
            `INSERT INTO bills (patient_id, admission_id, appointment_id, subtotal, discount, total, status)
             VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
            [patient_id, admission_id, appointment_id, subtotal, discount || 0, total]
        );
        const billId = result.insertId;

        for (const item of items) {
            await connection.query(
                `INSERT INTO bill_items (bill_id, item_type, description, amount)
                 VALUES (?, ?, ?, ?)`,
                [billId, item.item_type, item.description, item.amount]
            );
        }

        await connection.commit();
        await auditLogger(req.user.id, 'Create', 'Billing', billId, `Generated bill for patient ${patient_id}`, req);

        res.status(201).json({ status: 'success', message: 'Bill generated', data: { id: billId } });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    } finally {
        connection.release();
    }
};

exports.getBillsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const [bills] = await pool.query('SELECT * FROM bills WHERE patient_id = ? ORDER BY created_at DESC', [patientId]);
        res.json({ status: 'success', data: bills });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.recordPayment = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { bill_id, amount, payment_method } = req.body;

        await connection.beginTransaction();

        await connection.query(
            `INSERT INTO payments (bill_id, amount, payment_method, processed_by)
             VALUES (?, ?, ?, ?)`,
            [bill_id, amount, payment_method, req.user.id]
        );

        // Calculate new status
        const [billRows] = await connection.query('SELECT total FROM bills WHERE id = ?', [bill_id]);
        const [paymentRows] = await connection.query('SELECT SUM(amount) as paid FROM payments WHERE bill_id = ?', [bill_id]);

        const total = parseFloat(billRows[0].total);
        const paid = parseFloat(paymentRows[0].paid || 0);

        let status = 'Pending';
        if (paid >= total) status = 'Paid';
        else if (paid > 0) status = 'Partially Paid';

        await connection.query('UPDATE bills SET status = ? WHERE id = ?', [status, bill_id]);

        await connection.commit();
        await auditLogger(req.user.id, 'Payment', 'Billing', bill_id, `Received payment of ${amount}`, req);

        res.json({ status: 'success', message: 'Payment recorded', data: { new_status: status } });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    } finally {
        connection.release();
    }
};
