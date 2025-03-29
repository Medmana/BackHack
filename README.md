# BackHack
# Documentation de l'API de Gestion des Patients MRC (Bénin)

Cette API permet aux professionnels de santé de gérer les dossiers des patients atteints de Maladie Rénale Chronique (MRC) au Bénin.
Elle offre des fonctionnalités d'authentification sécurisée, de gestion des patients, des consultations et des examens médicaux.

## 📌 Fonctionnalités
✅ Authentification JWT (JSON Web Token)  
✅ Gestion des patients (CRUD complet)  
✅ Suivi des consultations médicales  
✅ Génération de PDF (Synthèse médicale)  
✅ Gestion des rôles (Admin & Médecin)  
✅ Sécurité renforcée (Chiffrement, Validation des données)  

## ⚙️ Configuration requise
- **Node.js** (v16+)
- **MongoDB** (local ou Atlas)
- **Postman ou Insomnia** (pour tester l'API)

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-repo/mrc-api.git
cd mrc-api
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

Créez un fichier `.env` à la racine du projet et ajoutez :

```env
MONGODB_URI=mongodb://localhost:27017/mrc_database
JWT_SECRET=votre_clé_secrète_sécurisée_ici
PORT=3000
```

⚠️ **Important** :

Pour générer un JWT_SECRET sécurisé, exécutez :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ne partagez jamais cette clé et ne la commitez pas dans GitHub !

## 🔌 Démarrage du serveur

```bash
npm start
```

L'API sera disponible sur :  
👉 `http://localhost:3000/api`

## 📚 Documentation Swagger (OpenAPI)

Accédez à la documentation interactive :  
🔗 `http://localhost:3000/api-docs`

---

## 🔐 Authentification

### 1. Enregistrement du premier administrateur

```http
POST /api/auth/register-admin
```

**Body (JSON)** :

```json
{
  "firstName": "Admin",
  "lastName": "System",
  "email": "admin@mrc.bj",
  "password": "MotDePasseSecure123"
}
```

### 2. Connexion (Obtenir un JWT)

```http
POST /api/auth/login
```

**Body (JSON)** :

```json
{
  "email": "admin@mrc.bj",
  "password": "MotDePasseSecure123"
}
```

**Réponse** :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "5f8d0d55b54764421b7156c3",
    "firstName": "Admin",
    "lastName": "System",
    "email": "admin@mrc.bj",
    "role": "admin"
  }
}
```

Utilisez ce token dans le header `Authorization: Bearer <token>` pour accéder aux routes protégées.

---

## 👨‍⚕️ Gestion des Patients

### 1. Créer un patient (Médecin seulement)

```http
POST /api/patients
```

**Body (JSON)** :

```json
{
  "firstName": "Jean",
  "lastName": "Doe",
  "birthDate": "1980-05-15",
  "gender": "male",
  "phone": "+22912345678",
  "kidneyDisease": {
    "stage": 3,
    "diagnosisDate": "2020-01-10"
  }
}
```

### 2. Lister tous les patients

```http
GET /api/patients
```

### 3. Récupérer un patient spécifique

```http
GET /api/patients/{id}
```

### 4. Mettre à jour un patient

```http
PUT /api/patients/{id}
```

### 5. Supprimer (archiver) un patient

```http
DELETE /api/patients/{id}
```

### 6. Générer un PDF de synthèse médicale

```http
GET /api/patients/{id}/summary
```

---

## 🏥 Gestion des Consultations

### 1. Ajouter une consultation

```http
POST /api/consultations/{patientId}
```

**Body (JSON)** :

```json
{
  "reason": "Suivi trimestriel",
  "creatinineLevel": 1.8,
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  }
}
```

### 2. Voir l'historique des consultations

```http
GET /api/consultations/{patientId}
```

---

## 👨‍💻 Administration (Admin seulement)

### 1. Créer un nouveau compte (Admin ou Médecin)

```http
POST /api/admin/accounts
```

**Body (JSON)** :

```json
{
  "firstName": "Dr. Marie",
  "lastName": "Dupont",
  "email": "marie.dupont@mrc.bj",
  "role": "doctor",
  "specialty": "Néphrologie"
}
```

### 2. Lister tous les comptes

```http
GET /api/admin/accounts
```

### 3. Désactiver un compte

```http
DELETE /api/admin/accounts/{id}
```

---

## 🔧 Tests

Pour tester l'API, vous pouvez utiliser :

- **Postman** (Collection d'exemple disponible ici)  
- **Insomnia**  
- **Swagger UI** (`http://localhost:3000/api-docs`)

---

## 📜 Licence

MIT License © 2023 [Votre Nom]

## 🙏 Remerciements

Merci d'utiliser cette API ! Pour toute question, contactez `votre-email@example.com`.

🚀 Bonne utilisation ! 🚀
