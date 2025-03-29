const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Génère une clé secrète de 64 bytes (512 bits)
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Chemin vers le fichier .env
const envPath = path.join(__dirname, '.env');

// Ajoute ou met à jour la variable JWT_SECRET dans le .env
if (fs.existsSync(envPath)) {
  let envFile = fs.readFileSync(envPath, 'utf8');
  
  // Si JWT_SECRET existe déjà, on la met à jour
  if (envFile.includes('JWT_SECRET=')) {
    envFile = envFile.replace(/JWT_SECRET=.*/, `JWT_SECRET=${jwtSecret}`);
  } else {
    // Sinon on l'ajoute
    envFile += `\nJWT_SECRET=${jwtSecret}\n`;
  }
  
  fs.writeFileSync(envPath, envFile);
} else {
  // Crée un nouveau fichier .env
  fs.writeFileSync(envPath, `JWT_SECRET=${jwtSecret}\n`);
}

console.log('Nouveau JWT_SECRET généré et ajouté au fichier .env');
console.log('Clé générée:', jwtSecret);