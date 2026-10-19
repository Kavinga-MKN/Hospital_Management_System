const pool = require('../config/db');
const auditLogger = require('../middleware/auditLogger');

exports.getAllAdmissions = async (req, res) => {
    try {
        const [admissions] = await pool.query(
            `SELECT a.*, p.first_name as patient_first, p.last_name as patient_last,
                    d_u.first_name as doctor_first, d_u.last_name as doctor_last
             FROM admissions a
             JOIN patients p ON a.patient_id = p.id
             JOIN doctors d ON a.doctor_id = d.id
             JOIN users d_u ON d.user_id = d_u.id
             ORDER BY a.created_at DESC`
        );
        res.json({ status: 'success', data: admissions });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.createAdmission = async (req, res) => {
    try {
        const { patient_id, doctor_id, ward, bed, reason } = req.body;
        const [result] = await pool.query(
            `INSERT INTO admissions (patient_id, doctor_id, ward, bed, reason)
             VALUES (?, ?, ?, ?, ?)`,
            [patient_id, doctor_id, ward, bed, reason]
        );
        await auditLogger(req.user.id, 'Admit', 'Admissions', result.insertId, `Admitted patient ${patient_id} to ward ${ward}`, req);
        res.status(201).json({ status: 'success', message: 'Patient admitted', data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.dischargePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            'UPDATE admissions SET status = "Discharged", discharge_date = CURRENT_TIMESTAMP WHERE id = ?',
            [id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Admission not found' });

        await auditLogger(req.user.id, 'Discharge', 'Admissions', id, `Discharged admission ${id}`, req);
        res.json({ status: 'success', message: 'Patient discharged' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
