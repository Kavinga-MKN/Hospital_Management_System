const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/patient/:patientId', medicalRecordController.getMedicalRecordsByPatient);
router.post('/', medicalRecordController.createMedicalRecord);

module.exports = router;
