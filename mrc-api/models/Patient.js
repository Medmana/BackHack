const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  bloodGroup: { type: String, enum: ['A+','A-','B+','B-', 'AB+','AB-','O+','O-']},
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: { type: String, default: 'Bénin' }
  },
  phone: { type: String, required: true, match: [/^\+229\d{10}$/, 'Numéro de téléphone béninois invalide'] },
  email: { type: String, lowercase: true },
  medicalHistory: {
    chronicDiseases: [String],
    allergies: [String],
    familyHistory: String
  },
  kidneyDisease: {
    stage: { type: Number, min: 1, max: 5 },
    diagnosisDate: Date,
    comorbidities: [String]
  },
  currentTreatments: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date
  }],
  attendingDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileNumber: { type: String, unique: true, required: true },
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