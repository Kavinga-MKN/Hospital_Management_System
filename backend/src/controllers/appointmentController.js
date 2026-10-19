const pool = require('../config/db');
const auditLogger = require('../middleware/auditLogger');

exports.getAllAppointments = async (req, res) => {
    try {
        const [appointments] = await pool.query(
            `SELECT a.*, p.first_name as patient_first, p.last_name as patient_last, p.contact_number as patient_phone,
                    d_u.first_name as doctor_first, d_u.last_name as doctor_last, dept.name as department
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             JOIN doctors d ON a.doctor_id = d.id
             JOIN users d_u ON d.user_id = d_u.id
             LEFT JOIN departments dept ON d.department_id = dept.id
             ORDER BY a.appointment_date DESC, a.appointment_time DESC`
        );
        res.json({ status: 'success', data: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.getAppointmentById = async (req, res) => {
    try {
        const [appointments] = await pool.query(
            `SELECT a.*, p.first_name as patient_first, p.last_name as patient_last,
                    d_u.first_name as doctor_first, d_u.last_name as doctor_last
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             JOIN doctors d ON a.doctor_id = d.id
             JOIN users d_u ON d.user_id = d_u.id
             WHERE a.id = ?`, [req.params.id]
        );
        if (appointments.length === 0) return res.status(404).json({ status: 'error', message: 'Appointment not found' });
        res.json({ status: 'success', data: appointments[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const { patient_id, doctor_id, appointment_date, appointment_time, reason, status } = req.body;
        const [result] = await pool.query(
            `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [patient_id, doctor_id, appointment_date, appointment_time, reason, status || 'Scheduled']
        );
        await auditLogger(req.user.id, 'Create', 'Appointments', result.insertId, `Created appointment for patient ${patient_id}`, req);
        res.status(201).json({ status: 'success', message: 'Appointment created', data: { id: result.insertId } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const [result] = await pool.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
        if (result.affectedRows === 0) return res.status(404).json({ status: 'error', message: 'Appointment not found' });

        await auditLogger(req.user.id, 'Update Status', 'Appointments', id, `Updated appointment status to ${status}`, req);
        res.json({ status: 'success', message: 'Appointment updated successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
