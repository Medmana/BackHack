const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Middleware d'authentification pour toutes les routes patients
router.use(auth);
router.get('/:id', auth, (req, res, next) => {
  if (req.user.role === 'admin') {
    return Patient.findById(req.params.id)
      .then(patient => res.json(patient))
      .catch(next);
  }
  return patientController.getPatientById(req, res, next); // Passez au contrôleur normal
});

// Routes
router.post('/', role(['doctor']), patientController.registerPatient);
router.get('/', patientController.listPatients);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);
router.get('/:id/summary', patientController.generateMedicalSummary);
router.get('/:patientId/dossier', patientController.generatePatientDossier);
router.post('/messages/send',
  patientController.sendBulkMessages
);

// Route pour l'historique des messages
router.get('/messages/history', 
  patientController.getMessageHistory
);

// Route pour les détails d'un message
router.get('/messages/:id',
  patientController.getMessageDetails
);

module.exports = router; // <-- L'export doit être présent