const mongoose = require('mongoose');

const urinExamSchema = new mongoose.Schema({
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
  labReference: String,
  clinicalInfo: String,

  // Macroscopic
  appearance: String,
  color: String,
  turbidity: String,
  pH: String,

  // Microscopic
  leukocytes: Number,
  erythrocytes: Number,
  epithelialCells: Number,
  bladderCells: Number,
  renalCells: Number,
  crystals: String,
  pathologicalCylinders: String,
  yeasts: {
    present: Boolean,
    count: Number
  },

  // Bacteriology
  germCount: Number,
  identifiedBacteria: String,

  // Conclusion
  conclusion: String,
  isAbnormal: Boolean,
  requiresFollowUp: Boolean
}, { timestamps: true });

module.exports = mongoose.model('UrinExam', urinExamSchema);