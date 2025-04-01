const mongoose = require('mongoose');

const antecedentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['familial', 'personnel', 'chirurgical', 'allergie', 'traitement', 'autre']
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['léger', 'modéré', 'sévère', null],
    default: null
  },
  diagnosisDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index pour les requêtes fréquentes
antecedentSchema.index({ patientId: 1, type: 1 });

module.exports = mongoose.model('Antecedent', antecedentSchema);