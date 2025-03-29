const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Vérification stricte du header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      code: 'MISSING_AUTH_HEADER',
      message: 'Authorization header is required'
    });
  }

  // 2. Vérification du format "Bearer <token>"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({
      code: 'INVALID_AUTH_FORMAT',
      message: 'Authorization header must be formatted: Bearer <token>'
    });
  }

  const [scheme, token] = parts;

  // 3. Vérification du schéma "Bearer"
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      code: 'INVALID_AUTH_SCHEME',
      message: 'Authorization scheme must be "Bearer"'
    });
  }

  // 4. Vérification de la présence du token
  if (!token) {
    return res.status(401).json({
      code: 'MISSING_TOKEN',
      message: 'Token is missing after Bearer'
    });
  }

  // 5. Vérification du token JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      code: 'INVALID_TOKEN',
      message: 'Token is invalid or expired',
      details: err.message
    });
  }
};