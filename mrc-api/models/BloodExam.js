const mongoose = require('mongoose');

const bloodExamSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  examDate: {
    type: Date,
    default: Date.now
  },
  // Hématologie
  redBloodCells: Number,
  hematocrit: Number,
  hemoglobin: Number,
  mcv: Number,
  mch: Number,
  mchc: Number,
  rdw: Number,
  reticulocytes: Number,
  reticulocyteHemoglobin: Number,
  
  // Leucocytes
  whiteBloodCells: Number,
  neutrophils: Number,
  lymphocytes: Number,
  monocytes: Number,
  eosinophils: Number,
  basophils: Number,
  
  // Autres paramètres
  platelets: { value: Number, comment: String },
  glucose: Number,
  creatinine: Number,
  urea: Number,
  totalProteins: Number,
  albumin: Number,
  globulin: Number,
  alt: Number,
  alp: Number,
  lactate: Number,
  
  // Électrolytes
  sodium: Number,
  potassium: Number,
  chloride: Number,
  magnesium: Number,
  calcium: Number,
  
  // Métadonnées
  labNotes: String,
  interpretation: String,
  isAbnormal: Boolean,
  followUpRequired: Boolean
}, { timestamps: true });

module.exports = mongoose.model('BloodExam', bloodExamSchema);