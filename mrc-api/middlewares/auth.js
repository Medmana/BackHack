const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Récupération du token depuis l'en-tête Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé - Token manquant' });
  }
  
  try {
    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Accès non autorisé - Token invalide' });
  }
};