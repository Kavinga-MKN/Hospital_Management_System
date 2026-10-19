const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/medicines', pharmacyController.getAllMedicines);
router.post('/medicines', authorizeRoles('Administrator', 'Pharmacist'), pharmacyController.addMedicine);
router.post('/dispense', authorizeRoles('Pharmacist'), pharmacyController.dispenseMedicine);

module.exports = router;
