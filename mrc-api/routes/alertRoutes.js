// routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/', alertController.getAllAlerts);

router.get('/unread-count', alertController.getUnreadAlertCount);

// Marquer une alerte comme lue
router.put('/:id/read', alertController.markAlertAsRead);

// Résoudre une alerte
router.put('/:id/resolve', alertController.resolveAlert);

// Supprimer une alerte
router.delete('/:id', alertController.deleteAlert);

// Marquer toutes les alertes comme lues
router.put('/mark-all-read', alertController.markAllAsRead);
module.exports = router;