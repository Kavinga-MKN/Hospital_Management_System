const pool = require('../config/db');
const auditLogger = require('../middleware/auditLogger');

exports.getMedicalRecordsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const [records] = await pool.query(
            `SELECT m.*, d_u.first_name as doctor_first, d_u.last_name as doctor_last
             FROM medical_records m
             JOIN doctors d ON m.doctor_id = d.id
             JOIN users d_u ON d.user_id = d_u.id
             WHERE m.patient_id = ?
             ORDER BY m.created_at DESC`, [patientId]
        );
        res.json({ status: 'success', data: records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.createMedicalRecord = async (req, res) => {
    try {
        const { patient_id, doctor_id, appointment_id, symptoms, diagnosis, treatment, notes } = req.body;
        const [result] = await pool.query(
            `INSERT INTO medical_records (patient_id, doctor_id, appointment_id, symptoms, diagnosis, treatment, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [patient_id, doctor_id, appointment_id, symptoms, diagnosis, treatment, notes]
        );

        await auditLogger(req.user.id, 'Create', 'MedicalRecords', result.insertId, `Created medical record for patient ${patient_id}`, req);
        res.status(201).json({ status: 'success', message: 'Medical record created', data: { id: result.insertId } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
