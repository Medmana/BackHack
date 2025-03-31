const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Création d'un compte (admin ou doctor)
exports.createUser = async (req, res) => {
  try {
    // Un admin peut créer n'importe quel type de compte
    const { username, email, password, role, ...rest } = req.body;
    
    const user = new User({
      username,
      email,
      password,
      role: role || 'doctor', // Par défaut doctor si non spécifié
      ...rest
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Accès à tous les utilisateurs
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Désactivation d'un compte médecin
exports.deleteUser = async (req, res) => {
  try {
    console.log(`Admin ${req.user.id} deleting user ${req.params.id}`);
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { permissions } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      message: 'Permissions mises à jour',
      user
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour',
      error: err.message 
    });
  }
};

// Modification d'un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Si le mot de passe est fourni, on le hash avant de l'enregistrer
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // On retire le mot de passe de la réponse
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: userWithoutPassword
    });

  } catch (err) {
    res.status(400).json({ 
      message: 'Erreur lors de la mise à jour',
      error: err.message 
    });
  }
};
