const pool = require('../config/db');
const auditLogger = require('../middleware/auditLogger');

exports.getAllMedicines = async (req, res) => {
    try {
        const [medicines] = await pool.query('SELECT * FROM medicines ORDER BY name ASC');
        res.json({ status: 'success', data: medicines });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.addMedicine = async (req, res) => {
    try {
        const { name, category, manufacturer, batch_number, quantity, unit_price, expiry_date, reorder_level } = req.body;
        const [result] = await pool.query(
            `INSERT INTO medicines (name, category, manufacturer, batch_number, quantity, unit_price, expiry_date, reorder_level)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, category, manufacturer, batch_number, quantity, unit_price, expiry_date, reorder_level]
        );
        await auditLogger(req.user.id, 'Create', 'Pharmacy', result.insertId, `Added new medicine ${name}`, req);
        res.status(201).json({ status: 'success', message: 'Medicine added', data: { id: result.insertId } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.dispenseMedicine = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { prescription_id, medicine_id, quantity, remarks } = req.body;

        await connection.beginTransaction();

        // Check stock
        const [medicines] = await connection.query('SELECT quantity FROM medicines WHERE id = ? FOR UPDATE', [medicine_id]);
        if (medicines.length === 0) throw new Error('Medicine not found');
        if (medicines[0].quantity < quantity) throw new Error('Insufficient stock');

        // Deduct stock
        await connection.query('UPDATE medicines SET quantity = quantity - ? WHERE id = ?', [quantity, medicine_id]);

        // Record transaction
        const [result] = await connection.query(
            `INSERT INTO pharmacy_transactions (prescription_id, medicine_id, transaction_type, quantity, remarks, processed_by)
             VALUES (?, ?, 'Out', ?, ?, ?)`,
            [prescription_id, medicine_id, quantity, remarks, req.user.id]
        );

        if (prescription_id) {
            // Update prescription item dispensed amount (simplified)
            await connection.query(
                'UPDATE prescription_items SET quantity_dispensed = quantity_dispensed + ? WHERE prescription_id = ? AND medicine_id = ?',
                [quantity, prescription_id, medicine_id]
            );
        }

        await connection.commit();
        await auditLogger(req.user.id, 'Dispense', 'Pharmacy', result.insertId, `Dispensed ${quantity} of medicine ID ${medicine_id}`, req);

        res.json({ status: 'success', message: 'Medicine dispensed successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        if (error.message === 'Insufficient stock' || error.message === 'Medicine not found') {
            return res.status(400).json({ status: 'error', message: error.message });
        }
        res.status(500).json({ status: 'error', message: 'Server Error' });
    } finally {
        connection.release();
    }
};
