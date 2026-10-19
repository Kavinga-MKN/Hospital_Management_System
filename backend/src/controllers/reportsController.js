const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const queries = [
            'SELECT COUNT(*) as count FROM patients',
            'SELECT COUNT(*) as count FROM appointments WHERE appointment_date = CURDATE()',
            'SELECT SUM(total) as count FROM bills WHERE status = "Paid"',
            'SELECT COUNT(*) as count FROM laboratory_results WHERE sample_status = "Requested"'
        ];

        const results = await Promise.all(queries.map(q => pool.query(q)));

        res.json({
            status: 'success',
            data: {
                totalPatients: results[0][0][0].count,
                todaysAppointments: results[1][0][0].count,
                totalRevenue: results[2][0][0].count || 0,
                pendingLabRequests: results[3][0][0].count
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
