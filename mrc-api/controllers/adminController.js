const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Création d'un compte (admin ou doctor)
exports.createAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, role, phone, specialty } = req.body;
    
    // Génération d'un mot de passe aléatoire
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
      specialty
    });
    
    await user.save();
    
    res.status(201).json({
      message: `Compte ${role} créé avec succès`,
      temporaryPassword: password // À envoyer par email en production
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Liste des utilisateurs (admins et doctors)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ role: 1, lastName: 1 });
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};
// Désactivation d'un compte médecin
exports.deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'Compte désactivé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

