const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Routes protégées par authentification
router.use(auth);

// Gestion des patients
router.post('/', role(['doctor']), patientController.registerPatient);
router.get('/', patientController.listPatients);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);
router.get('/:id/summary', patientController.generateMedicalSummary);

module.exports = router;