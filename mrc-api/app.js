require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const examRoutes = require('./routes/examRoutes');
const antecedentRoutes = require('./routes/antecedentRoutes');
const app = express();
const { scheduleAllReminders } = require('./services/schedulerService');
const alertRoutes = require('./routes/alertRoutes');


// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));
   scheduleAllReminders();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vérifiez que les routes sont bien importées
//console.log(authRoutes); // Doit afficher [Function: router]
//console.log(patientRoutes); // Doit afficher [Function: router]

// Documentation Swagger
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true // Garde le token entre les requêtes
    }
  })
);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/antecedents', antecedentRoutes);
app.use('/api/prescription', require('./routes/prescriptionRoutes'));
app.use('/api/alerts', alertRoutes);
// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue' });
});

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});