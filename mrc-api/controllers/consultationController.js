const Consultation = require('../models/Consultation');
const Patient = require('../models/Patient');

// Enregistrement d'une nouvelle consultation
exports.createConsultation = async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { 
        _id: req.params.patientId, 
        isActive: true 
      },
      { $set: { attendingDoctor: req.user.id } }, // Optionnel: mettre à jour le médecin traitant
      { new: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    
    const consultationData = {
      ...req.body,
      patient: patient._id,
      doctor: req.user.id // Le médecin qui crée la consultation
    };
    
    const consultation = new Consultation(consultationData);
    await consultation.save();
    
    if (consultationData.creatinineLevel) {
      patient.diseases.stage = calculateDiseaseStage(consultationData.creatinineLevel);
      await patient.save();
    }
    
    res.status(201).json(consultation);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Liste des consultations d'un patient
exports.getPatientConsultations = async (req, res) => {
  console.log("ppp")
  try {
    const patient = await Patient.findOne({ 
      _id: req.params.patientId, 
      isActive: true 
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    
  
    
    const consultations = await Consultation.find({ patient: patient._id })
      .sort({ date: -1 })
      .populate('doctor', 'firstName lastName');
    
    res.json(consultations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Fonction utilitaire pour calculer le stade de la maladie rénale
function calculateDiseaseStage(creatinineLevel) {
  // Implémentation simplifiée - à adapter selon les critères médicaux
  if (creatinineLevel < 1.5) return 1;
  if (creatinineLevel < 2.5) return 2;
  if (creatinineLevel < 4.0) return 3;
  if (creatinineLevel < 5.0) return 4;
  return 5;
}