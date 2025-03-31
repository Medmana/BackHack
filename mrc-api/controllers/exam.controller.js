const BloodExam = require('../models/BloodExam');
const UrinExam = require('../models/UrinExam');

// BloodExam
exports.createBloodExam = async (req, res) => {
  try {
    const bloodExam = new BloodExam({
      ...req.body,
      patient: req.user.patientId || req.body.patient,
      doctor: req.user.doctorId || req.body.doctor
    });
    
    await bloodExam.save();
    res.status(201).json(bloodExam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBloodExams = async (req, res) => {
  try {
    const query = req.user.role === 'doctor' 
      ? { doctor: req.user.doctorId } 
      : {};
      
    const exams = await BloodExam.find(query).populate('patient doctor');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UrinExam (similaire)
exports.createUrinExam = async (req, res) => {
  try {
    const urinExam = new UrinExam({
      ...req.body,
      patient: req.user.patientId || req.body.patient,
      doctor: req.user.doctorId || req.body.doctor
    });
    
    await urinExam.save();
    res.status(201).json(urinExam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUrinExams = async (req, res) => {
  try {
    const query = req.user.role === 'doctor' 
      ? { doctor: req.user.doctorId } 
      : {};
      
    const exams = await UrinExam.find(query).populate('patient doctor');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};