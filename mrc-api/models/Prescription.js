const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Le patient est obligatoire']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le médecin prescripteur est obligatoire']
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  expirationDate: {
    type: Date,
    required: [true, 'La date d\'expiration est obligatoire']
  },
  medications: [{
    name: {
      type: String,
      required: [true, 'Le nom du médicament est obligatoire']
    },
    dosage: {
      type: String,
      required: [true, 'Le dosage est obligatoire']
    },
    frequency: {
      type: String,
      required: [true, 'La fréquence est obligatoire']
    },
    duration: {
      type: String,
      required: [true, 'La durée est obligatoire']
    },
    instructions: {
      type: String
    }
  }],
  notes: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les requêtes fréquentes
prescriptionSchema.index({ patientId: 1, isActive: 1 });
prescriptionSchema.index({ doctorId: 1, date: -1 });

// Middleware pour mettre à jour la date de modification
prescriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Prescription || 
       mongoose.model('Prescription', prescriptionSchema);