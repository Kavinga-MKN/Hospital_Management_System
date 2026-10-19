const express = require('express');
const router = express.Router();
const admissionsController = require('../controllers/admissionsController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/', admissionsController.getAllAdmissions);
router.post('/', authorizeRoles('Administrator', 'Nurse', 'Receptionist', 'Doctor'), admissionsController.createAdmission);
router.patch('/:id/discharge', authorizeRoles('Administrator', 'Doctor', 'Nurse'), admissionsController.dischargePatient);

module.exports = router;
