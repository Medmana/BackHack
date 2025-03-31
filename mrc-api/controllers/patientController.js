const Patient = require('../models/Patient');
const Consultation = require('../models/Consultation');
const { generatePDF } = require('../utils/pdfGenerator');
const mongoose = require('mongoose');
const User = require('../models/User');

// Enregistrement d'un nouveau patient
exports.registerPatient = async (req, res) => {
  try {
    // Vérification que l'utilisateur est un médecin
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const patientData = req.body;
    patientData.attendingDoctor = req.user.id;
    
    // Génération du numéro de dossier
    const count = await Patient.countDocuments();
    patientData.fileNumber = `MRC-${(count + 1).toString().padStart(6, '0')}`;
    
    const patient = new Patient(patientData);
    await patient.save();
    
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Récupération d'un patient par ID
exports.getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;
    
    // Récupérer le patient avec l'ID spécifié
    const patient = await Patient.findById(patientId)
      .select('firstName lastName fileNumber birthDate gender kidneyDisease.stage attendingDoctor');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    
    // Récupérer le médecin traitant si existant
    let attendingDoctorName = null;
    if (patient.attendingDoctor) {
      const doctor = await User.findById(patient.attendingDoctor)
        .select('firstName lastName');
      if (doctor) {
        attendingDoctorName = `${doctor.firstName} ${doctor.lastName}`;
      }
    }
    
    // Calculer l'âge du patient
    const calculateAge = (birthDate) => {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };
    
    // Formater la réponse
    const patientDetails = {
      ...patient.toObject(),
      age: calculateAge(patient.birthDate),
      attendingDoctorName,
      birthDate: patient.birthDate.toISOString().split('T')[0] // Format YYYY-MM-DD
    };
    
    res.json(patientDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};
// Mise à jour d'un patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    
    // Vérification des permissions
    if (req.user.role === 'doctor' && patient.attendingDoctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const updates = req.body;
    Object.assign(patient, updates);
    await patient.save();
    
    res.json(patient);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Suppression logique d'un patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    
    // Vérification des permissions
    if (req.user.role !== 'admin' && patient.attendingDoctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    patient.isActive = false;
    await patient.save();
    
    res.json({ message: 'Patient archivé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Liste de tous les patients (sans filtre par médecin)
exports.listPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: true })
      .select('firstName lastName fileNumber birthDate gender kidneyDisease.stage attendingDoctor')
      .sort({ lastName: 1 });
    
    // Récupérer les noms des médecins
    const doctorIds = patients.map(p => p.attendingDoctor).filter(Boolean);
    const doctors = await User.find({ _id: { $in: doctorIds } })
      .select('firstName lastName _id');
    
    // Créer un map pour accéder rapidement aux médecins
    const doctorMap = doctors.reduce((map, doctor) => {
      map[doctor._id] = `${doctor.firstName} ${doctor.lastName}`;
      return map;
    }, {});
    
    // Ajouter le nom du médecin et calculer l'âge pour chaque patient
    const patientsWithDoctorNamesAndAge = patients.map(patient => {
      // Calcul de l'âge
      const birthDate = new Date(patient.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return {
        ...patient.toObject(),
        age, // Ajout de l'âge calculé
        attendingDoctorName: patient.attendingDoctor ? doctorMap[patient.attendingDoctor] : null
      };
    });
    
    res.json(patientsWithDoctorNamesAndAge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Génération d'un PDF de synthèse médicale
exports.generateMedicalSummary = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    
    // Vérification des permissions
    if (req.user.role === 'doctor' && patient.attendingDoctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const consultations = await Consultation.find({ patient: patient._id })
      .sort({ date: -1 })
      .limit(10)
      .populate('doctor', 'firstName lastName');
    
    const pdfBuffer = await generatePDF(patient, consultations);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${patient.fileNumber}_summary.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

module.exports = exports;