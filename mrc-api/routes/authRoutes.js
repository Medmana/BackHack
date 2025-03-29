const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Nouvelle route publique pour le premier enregistrement admin
router.post('/register-admin', authController.registerAdmin);
// Authentification
router.post('/login', authController.login);

// Récupération du profil utilisateur
router.get('/profile', authController.getProfile);

module.exports = router;