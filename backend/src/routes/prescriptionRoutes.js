const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/patient/:patientId', prescriptionController.getPrescriptionsByPatient);
router.post('/', prescriptionController.createPrescription);
router.patch('/:id/status', prescriptionController.updatePrescriptionStatus);

module.exports = router;
