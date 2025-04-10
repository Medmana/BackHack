const Alert = require('../models/Alert');
const Patient = require('../models/Patient');
const User = require('../models/User');

/**
 * Récupère toutes les alertes avec filtres optionnels
 */
exports.getAllAlerts = async (req, res) => {
  try {
    const { status, readStatus } = req.query;
    
    // Construction de la requête
    const query = {};
    
    if (status) {
      query.isActive = status === 'active';
    }
    
    if (readStatus) {
      query.isRead = readStatus === 'read';
    }

    const alerts = await Alert.find(query)
      .populate('patient', 'firstName lastName fileNumber')
      .populate('doctor', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

/**
 * Marque une alerte comme lue
 */
exports.markAlertAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alerte non trouvée' });
    }

    res.json({ message: 'Alerte marquée comme lue', alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

/**
 * Résout une alerte (la désactive)
 */
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isActive: false, isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alerte non trouvée' });
    }

    res.json({ message: 'Alerte résolue', alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

/**
 * Supprime une alerte
 */
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alerte non trouvée' });
    }

    res.json({ message: 'Alerte supprimée avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

/**
 * Compte les alertes non lues
 */
exports.getUnreadAlertCount = async (req, res) => {
  try {
    const count = await Alert.countDocuments({ 
      isActive: true,
      isRead: false
    });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

/**
 * Marque toutes les alertes comme lues
 */
exports.markAllAsRead = async (req, res) => {
  try {
    await Alert.updateMany(
      { isActive: true, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true, message: 'Toutes les alertes marquées comme lues' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};