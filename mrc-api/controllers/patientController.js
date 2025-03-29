const Patient = require('../models/Patient');
const Consultation = require('../models/Consultation');
const { generatePDF } = require('../utils/pdfGenerator');
const mongoose = require('mongoose');

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
    const patient = await Patient.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).populate('attendingDoctor', 'firstName lastName');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    
    // Vérification des permissions
    if (req.user.role === 'doctor' && patient.attendingDoctor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(patient);
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

// Liste des patients pour un médecin
exports.listPatients = async (req, res) => {
  try {
    let query = { isActive: true };
    
    if (req.user.role === 'doctor') {
      query.attendingDoctor = req.user.id;
    }
    
    const patients = await Patient.find(query)
      .select('firstName lastName fileNumber birthDate gender kidneyDisease.stage')
      .sort({ lastName: 1 });
    
    res.json(patients);
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