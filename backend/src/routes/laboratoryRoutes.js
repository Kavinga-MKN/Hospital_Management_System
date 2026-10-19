const express = require('express');
const router = express.Router();
const laboratoryController = require('../controllers/laboratoryController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/tests', laboratoryController.getAllLabTests);
router.get('/patient/:patientId', laboratoryController.getLabResultsByPatient);
router.post('/request', laboratoryController.requestLabTest);
router.patch('/:id', laboratoryController.updateLabResult);

module.exports = router;
