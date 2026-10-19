const pool = require('../config/db');

exports.getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await pool.query(
            `SELECT d.*, u.first_name, u.last_name, u.email, u.phone, dept.name as department_name 
             FROM doctors d 
             JOIN users u ON d.user_id = u.id 
             LEFT JOIN departments dept ON d.department_id = dept.id`
        );
        res.json({ status: 'success', data: doctors });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const [doctors] = await pool.query(
            `SELECT d.*, u.first_name, u.last_name, u.email, u.phone, dept.name as department_name 
             FROM doctors d 
             JOIN users u ON d.user_id = u.id 
             LEFT JOIN departments dept ON d.department_id = dept.id
             WHERE d.id = ?`, [req.params.id]
        );
        if (doctors.length === 0) return res.status(404).json({ status: 'error', message: 'Doctor not found' });
        res.json({ status: 'success', data: doctors[0] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
