const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Middleware d'authentification pour toutes les routes patients
router.use(auth);
router.get('/:id', auth, (req, res, next) => {
  // L'admin peut accéder à tous les dossiers
  if (req.user.role === 'admin') {
    return Patient.findById(req.params.id)
      .then(patient => res.json(patient))
      .catch(next);
  }
  
  // Les médecins ne voient que leurs patients
  Patient.findOne({ _id: req.params.id, doctor: req.user.id })
    .then(patient => {
      if (!patient) return res.sendStatus(404);
      res.json(patient);
    })
    .catch(next);
});

// Routes
router.post('/', role(['doctor']), patientController.registerPatient);
router.get('/', patientController.listPatients);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);
router.get('/:id/summary', patientController.generateMedicalSummary);

module.exports = router; // <-- L'export doit être présent