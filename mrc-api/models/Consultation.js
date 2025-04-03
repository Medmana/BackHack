const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  reason: String,
  observations: String,
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  weight: Number,
  height: Number,
  creatinineLevel: Number,
  gfr: Number,
  otherTests: [{
    name: String,
    result: String,
    date: Date
  }],
  nextAppointment: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consultation', consultationSchema);