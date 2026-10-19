const pool = require('../config/db');
const auditLogger = require('../middleware/auditLogger');

exports.getAllLabTests = async (req, res) => {
    try {
        const [tests] = await pool.query('SELECT * FROM laboratory_tests WHERE is_active = TRUE');
        res.json({ status: 'success', data: tests });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.getLabResultsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const [results] = await pool.query(
            `SELECT lr.*, lt.name as test_name, lt.reference_range,
                    d_u.first_name as doctor_first, d_u.last_name as doctor_last
             FROM laboratory_results lr
             JOIN laboratory_tests lt ON lr.test_id = lt.id
             LEFT JOIN doctors d ON lr.doctor_id = d.id
             LEFT JOIN users d_u ON d.user_id = d_u.id
             WHERE lr.patient_id = ?
             ORDER BY lr.created_at DESC`, [patientId]
        );
        res.json({ status: 'success', data: results });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.requestLabTest = async (req, res) => {
    try {
        const { patient_id, doctor_id, test_id } = req.body;
        const [result] = await pool.query(
            `INSERT INTO laboratory_results (patient_id, doctor_id, test_id) VALUES (?, ?, ?)`,
            [patient_id, doctor_id, test_id]
        );
        await auditLogger(req.user.id, 'Request', 'Laboratory', result.insertId, `Lab test requested for patient ${patient_id}`, req);
        res.status(201).json({ status: 'success', message: 'Lab test requested', data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.updateLabResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { sample_status, result: testResult } = req.body; // alias result to testResult

        let query = 'UPDATE laboratory_results SET sample_status = ?';
        let params = [sample_status];

        if (testResult !== undefined) {
            query += ', result = ?, result_date = CURRENT_TIMESTAMP, performed_by = ?';
            params.push(testResult, req.user.id);
        }

        query += ' WHERE id = ?';
        params.push(id);

        const [mysqlResult] = await pool.query(query, params);
        if (mysqlResult.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Lab request not found' });

        await auditLogger(req.user.id, 'Update', 'Laboratory', id, `Lab result updated`, req);
        res.json({ status: 'success', message: 'Lab result updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
