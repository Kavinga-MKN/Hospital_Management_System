const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);
// Staff management
router.get('/employees', authorizeRoles('Administrator'), staffController.getAllEmployees);
// Audit Logs
router.get('/audit-logs', authorizeRoles('Administrator'), staffController.getAuditLogs);

module.exports = router;
