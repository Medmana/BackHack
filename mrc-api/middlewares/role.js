module.exports = (requiredRoles) => {
  return (req, res, next) => {
    // L'admin a toujours tous les droits
    if (req.user.role === 'admin') {
      return next();
    }

    // Vérification des rôles pour les non-admins
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès refusé - Permissions insuffisantes' 
      });
    }
    next();
  };
};