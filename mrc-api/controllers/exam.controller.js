const BloodExam = require('../models/BloodExam');
const UrinExam = require('../models/UrinExam');

// Helper pour gérer les erreurs
const handleError = (err, res) => {
  console.error(err);
  
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    return res.status(400).json({ 
      message: 'Validation error',
      details: errors 
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  res.status(500).json({ message: 'Internal server error' });
};

// CRUD pour BloodExam
exports.createBloodExam = async (req, res) => {
  try {
    const bloodExam = new BloodExam({
      ...req.body,
      doctorId: req.user.doctorId,
      patientId: req.body.patientId
    });
    
    await bloodExam.save();
    res.status(201).json(bloodExam);
  } catch (err) {
    handleError(err, res);
  }
};

exports.getBloodExams = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.query.patientId;
    
    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }

    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: 'Invalid Patient ID format' });
    }

    // Récupérer les examens pour ce patient uniquement
    const exams = await BloodExam.find({ patientId })
      .sort({ createdAt: -1 });
      
    res.json(exams);
  } catch (err) {
    handleError(err, res);
  }
};

exports.getBloodExamById = async (req, res) => {
  try {
    const exam = await BloodExam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (err) {
    handleError(err, res);
  }
};

exports.updateBloodExam = async (req, res) => {
  try {
    const exam = await BloodExam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

   

    const { patientId, doctorId, ...updateData } = req.body;
    const updatedExam = await BloodExam.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedExam);
  } catch (err) {
    handleError(err, res);
  }
};

exports.deleteBloodExam = async (req, res) => {
  try {
    const exam = await BloodExam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    

    await BloodExam.deleteOne({ _id: req.params.id });
    res.json({ message: 'Exam deleted successfully' });
  } catch (err) {
    handleError(err, res);
  }
};

// CRUD pour UrinExam (structure identique)
exports.createUrinExam = async (req, res) => {
  try {
    const urinExam = new UrinExam({
      ...req.body,
      doctorId: req.user.doctorId,
      patientId: req.body.patientId
    });
    
    await urinExam.save();
    res.status(201).json(urinExam);
  } catch (err) {
    handleError(err, res);
  }
};

exports.getUrinExams = async (req, res) => {
  try {
    const exams = await UrinExam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    handleError(err, res);
  }
};

exports.getUrinExamById = async (req, res) => {
  try {
    const exam = await UrinExam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (err) {
    handleError(err, res);
  }
};

exports.updateUrinExam = async (req, res) => {
  try {
    const exam = await UrinExam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    

    const { patientId, doctorId, ...updateData } = req.body;
    const updatedExam = await UrinExam.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedExam);
  } catch (err) {
    handleError(err, res);
  }
};

exports.deleteUrinExam = async (req, res) => {
  try {
    const exam = await UrinExam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

   

    await UrinExam.deleteOne({ _id: req.params.id });
    res.json({ message: 'Exam deleted successfully' });
  } catch (err) {
    handleError(err, res);
  }
};