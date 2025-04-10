const Consultation = require('../models/Consultation');
const Patient = require('../models/Patient');
const { scheduleReminder, cancelScheduledReminder } = require('../services/schedulerService');
const { sendEmail, sendSMS } = require('../utils/notificationService');
const { sendAppointmentNotification } = require('../utils/notificationService');
const Alert = require('../models/Alert');

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
  if (creatinineLevel === null || creatinineLevel === undefined || isNaN(creatinineLevel)) {
    return ''; // Valeur vide si le niveau n'est pas valide
  }
  
  if (creatinineLevel < 1.5) return 'débutant';
  if (creatinineLevel < 2.5) return 'intermédiaire';
  if (creatinineLevel < 4.0) return 'avancé';
  return 'chronique'; // Tout ce qui est >= 4.0
}
exports.createConsultation = async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { 
        _id: req.params.patientId, 
        isActive: true 
      },
      { $set: { attendingDoctor: req.user.id } },
      { new: true }
    );
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    
    const consultationData = {
      ...req.body,
      patient: patient._id,
      doctor: req.user.id
    };
    
    const consultation = new Consultation(consultationData);
    await consultation.save();
    
    if (consultationData.creatinineLevel) {
      patient.diseases.stage = calculateDiseaseStage(consultationData.creatinineLevel);
      await patient.save();
      if (patient.diseases.stage === 'chronique' || patient.diseases.stage === 'avancé') {
        await Alert.create({
          patient: patient._id,
          doctor: req.user.id,
          reason: patient.diseases.stage,
          creatinineLevel: req.body.creatinineLevel,
          consultation: consultation._id
        });
      }
    }
    
    // Envoi de notification si une prochaine consultation est programmée
    if (consultationData.nextAppointment) {
      await sendAppointmentNotification({
        patient,
        appointmentDate: consultationData.nextAppointment,
        doctorId: req.user.id
      });
      await scheduleReminder(consultation);
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