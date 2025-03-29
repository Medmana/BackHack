// generateSecret.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Génère une clé secrète de 64 bytes (512 bits)
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Chemin vers le fichier .env
const envPath = path.join(__dirname, '.env');

// Mise à jour du fichier .env
let envContents = '';
if (fs.existsSync(envPath)) {
  envContents = fs.readFileSync(envPath, 'utf8');
  
  // Supprime l'ancien JWT_SECRET s'il existe
  envContents = envContents.replace(/JWT_SECRET=.*\n/, '');
}

// Ajoute le nouveau JWT_SECRET
envContents += `JWT_SECRET=${jwtSecret}\n`;

fs.writeFileSync(envPath, envContents);

console.log('Nouveau JWT_SECRET généré:');
console.log(jwtSecret);
console.log('Le fichier .env a été mis à jour');