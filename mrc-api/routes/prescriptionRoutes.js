const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Middleware d'authentification et de rôle (médecin/admin)
router.use(auth);
router.use(role(['doctor', 'admin']));

// Routes CRUD
router.post('/patients/:patientId/prescriptions', prescriptionController.createPrescription);
router.get('/patients/:patientId/prescriptions', prescriptionController.getPatientPrescriptions);
router.get('/:id', prescriptionController.getPrescription);
router.put('/:id', prescriptionController.updatePrescription);
router.delete('/:id', prescriptionController.deactivatePrescription);

// Recherche avancée
router.get('/prescriptions', prescriptionController.searchPrescriptions);
module.exports = router;