const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All patient routes require authentication
router.use(authenticateToken);

// Receptionist, Admin, Doctor, Nurse can view patients
router.get('/', authorizeRoles('Administrator', 'Doctor', 'Nurse', 'Receptionist'), patientController.getAllPatients);
router.get('/:id', authorizeRoles('Administrator', 'Doctor', 'Nurse', 'Receptionist'), patientController.getPatientById);

// Only Admin and Receptionist can create/update patients
router.post('/', authorizeRoles('Administrator', 'Receptionist'), patientController.createPatient);
router.put('/:id', authorizeRoles('Administrator', 'Receptionist'), patientController.updatePatient);

// Only Admin can delete
router.delete('/:id', authorizeRoles('Administrator'), patientController.deletePatient);

module.exports = router;
