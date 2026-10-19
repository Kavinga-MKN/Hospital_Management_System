const pool = require('../config/db');

const auditLogger = async (userId, action, moduleName, recordId, details, req) => {
    try {
        const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : null;
        await pool.query(
            'INSERT INTO audit_logs (user_id, action, module, record_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, action, moduleName, recordId, details, ipAddress]
        );
    } catch (error) {
        console.error('Audit Logging Error:', error);
    }
};

module.exports = auditLogger;
