const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Routes protégées par authentification
router.use(auth);
router.use(role(['doctor']));

// Gestion des consultations
router.post('/:patientId', consultationController.createConsultation);
router.get('/:patientId', consultationController.getPatientConsultations);

module.exports = router;