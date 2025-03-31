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

    const { username, firstName, lastName, email, password } = req.body;
    
    const admin = new User({
      username,
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
        username: admin.username,
        role: admin.role
      }
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Cet username est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};
// Authentification d'un utilisateur
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(), // Conversion explicite en string
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '8h',
      algorithm: 'HS256', // Spécification explicite
      header: {
        typ: 'JWT',
        alg: 'HS256'
      }
    }
  );
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });
    }
    const token = generateToken(user);
    const userWithoutPassword = await User.findOne({ username }).select('-password');
    res.json({
      token_type: 'Bearer',
      access_token: token,
      expires_in: 28800, // 8 heures en secondes
      user: userWithoutPassword
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Authentication failed' });
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