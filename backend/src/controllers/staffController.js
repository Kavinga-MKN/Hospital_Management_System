const pool = require('../config/db');

exports.getAllEmployees = async (req, res) => {
    try {
        const [employees] = await pool.query(
            `SELECT e.*, u.first_name, u.last_name, u.email, u.phone, 
                    dept.name as department_name, r.name as role 
             FROM employees e
             LEFT JOIN users u ON e.user_id = u.id
             LEFT JOIN departments dept ON e.department_id = dept.id
             LEFT JOIN roles r ON u.role_id = r.id`
        );
        res.json({ status: 'success', data: employees });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const [logs] = await pool.query(
            `SELECT a.*, u.first_name, u.last_name, r.name as role
             FROM audit_logs a
             LEFT JOIN users u ON a.user_id = u.id
             LEFT JOIN roles r ON u.role_id = r.id
             ORDER BY a.created_at DESC
             LIMIT 100` // Limit to latest 100 for performance
        );
        res.json({ status: 'success', data: logs });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
