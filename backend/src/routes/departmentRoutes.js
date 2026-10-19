const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/', departmentController.getAllDepartments);
router.post('/', authorizeRoles('Administrator'), departmentController.createDepartment);

module.exports = router;
