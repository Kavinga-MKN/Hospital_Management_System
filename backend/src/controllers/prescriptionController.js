const pool = require('../config/db');
const auditLogger = require('../middleware/auditLogger');

exports.getPrescriptionsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const [prescriptions] = await pool.query(
            `SELECT p.*, d_u.first_name as doctor_first, d_u.last_name as doctor_last
             FROM prescriptions p
             JOIN doctors d ON p.doctor_id = d.id
             JOIN users d_u ON d_u.id = d.user_id
             WHERE p.patient_id = ?
             ORDER BY p.created_at DESC`, [patientId]
        );

        // Fetch items for each prescription (simple approach)
        for (let i = 0; i < prescriptions.length; i++) {
            const [items] = await pool.query(
                `SELECT pi.*, m.name as medicine_name 
                 FROM prescription_items pi
                 JOIN medicines m ON pi.medicine_id = m.id
                 WHERE pi.prescription_id = ?`,
                [prescriptions[i].id]
            );
            prescriptions[i].items = items;
        }

        res.json({ status: 'success', data: prescriptions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.createPrescription = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { medical_record_id, patient_id, doctor_id, items } = req.body;

        await connection.beginTransaction();

        const [result] = await connection.query(
            `INSERT INTO prescriptions (medical_record_id, patient_id, doctor_id, status)
             VALUES (?, ?, ?, 'Pending')`,
            [medical_record_id, patient_id, doctor_id]
        );
        const prescriptionId = result.insertId;

        for (const item of items) {
            await connection.query(
                `INSERT INTO prescription_items (prescription_id, medicine_id, dosage, frequency, duration, instructions)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [prescriptionId, item.medicine_id, item.dosage, item.frequency, item.duration, item.instructions]
            );
        }

        await connection.commit();
        await auditLogger(req.user.id, 'Create', 'Prescriptions', prescriptionId, `Created prescription for patient ${patient_id}`, req);

        res.status(201).json({ status: 'success', message: 'Prescription created', data: { id: prescriptionId } });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    } finally {
        connection.release();
    }
};

exports.updatePrescriptionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const [result] = await pool.query('UPDATE prescriptions SET status = ? WHERE id = ?', [status, id]);

        if (result.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Prescription not found' });

        await auditLogger(req.user.id, 'Update Status', 'Prescriptions', id, `Updated prescription status to ${status}`, req);
        res.json({ status: 'success', message: 'Prescription updated' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
