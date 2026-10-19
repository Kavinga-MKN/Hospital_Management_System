const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);
router.post('/generate', authorizeRoles('Administrator', 'Accountant', 'Receptionist'), billingController.generateBill);
router.get('/patient/:patientId', billingController.getBillsByPatient);
router.post('/pay', authorizeRoles('Administrator', 'Accountant', 'Receptionist'), billingController.recordPayment);

module.exports = router;
