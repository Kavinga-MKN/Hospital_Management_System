const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);

module.exports = router;
