const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

// Seul l'admin peut accéder à ces routes
router.use(auth);
router.use(role(['admin'])); // Le middleware laissera passer tous les admins

// Routes admin avec permissions complètes
router.post('/users', adminController.createUser);
router.get('/users', adminController.listUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/permissions', adminController.updatePermissions);

module.exports = router;