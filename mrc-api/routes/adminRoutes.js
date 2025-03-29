const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Routes protégées pour les admins
router.use(auth);
router.use(role(['admin']));

// Gestion des comptes
router.post('/accounts', adminController.createAccount);
router.get('/accounts', adminController.listUsers);
router.delete('/accounts/:id', adminController.deactivateAccount); // Assurez-vous que cette fonction existe dans votre controller

module.exports = router;