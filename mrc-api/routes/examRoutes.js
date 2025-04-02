// routes/exam.routes.js
const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Middlewares globaux
router.use(auth);
router.use(role(['doctor', 'admin']));

// Routes BloodExam
router.post('/blood', examController.createBloodExam);
router.get('/blood/:patientId', examController.getBloodExams); // Via URL param
router.get('/blood/exam/:id', examController.getBloodExamById);
router.put('/blood/:id', examController.updateBloodExam);
router.delete('/blood/:id', examController.deleteBloodExam);

// UrinExam Routes
router.post('/urin', examController.createUrinExam);
router.get('/urin/:patientId', examController.getUrinExams);
router.get('/urin/exam/:id', examController.getUrinExamById);
router.put('/urin/:id', examController.updateUrinExam);
router.delete('/urin/:id', examController.deleteUrinExam);

module.exports = router;