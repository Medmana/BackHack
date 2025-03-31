const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  bloodGroup: { type: String, enum: ['A+','A-','B+','B-', 'AB+','AB-','O+','O-','']},
  height: { type: Number, description: "Taille en cm" },
  weight: { type: Number, description: "Poids en kg" },
  diseases: [{
    name: { type: String, required: true },
    stage: { type: String, enum: ['débutant', 'intermédiaire', 'avancé', 'chronique',''] },
    diagnosisDate: { type: Date },}],
  address: {
    street: String,
    city: String,
    country: { type: String, default: 'Bénin' }
  },
  phone: { type: String, required: true, match: [/^\+229\d{10}$/, 'Numéro de téléphone béninois invalide'] },
  email: { type: String, lowercase: true },
  fileNumber: { type: String, unique: true, required: true },
  attendingDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pour mettre à jour la date de modification
patientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Patient', patientSchema);