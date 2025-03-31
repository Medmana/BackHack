// routes/exam.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Destructuration correcte
const examController = require('../controllers/exam.controller');

// Utilisation correcte du middleware
router.use(auth); // Pas de parenthèses ici

// Routes BloodExam
router.post('/blood', examController.createBloodExam);
router.get('/blood', examController.getBloodExams);

// Routes UrinExam
router.post('/urin', examController.createUrinExam);
router.get('/urin', examController.getUrinExams);

module.exports = router;