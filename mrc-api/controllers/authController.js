const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Nouvelle méthode pour l'inscription admin
exports.registerAdmin = async (req, res) => {
  try {
    // Vérifier s'il existe déjà un admin
    const adminExists = await User.exists({ role: 'admin' });
    if (adminExists) {
      return res.status(403).json({ message: 'Un administrateur existe déjà' });
    }

    const { firstName, lastName, email, password } = req.body;
    
    const admin = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'admin'
    });

    await admin.save();

    res.status(201).json({ 
      message: 'Compte administrateur créé avec succès',
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};
// Authentification d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérification de l'existence de l'utilisateur
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Vérification du mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Génération du token JWT
    const token = user.generateAuthToken();
    
    res.json({ 
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Récupération du profil utilisateur
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};