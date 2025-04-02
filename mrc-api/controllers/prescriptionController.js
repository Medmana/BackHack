const Prescription = require('../models/Prescription');

// Créer une nouvelle prescription
exports.createPrescription = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { medications, expirationDate, notes } = req.body;

    const newPrescription = await Prescription.create({
      patientId,
      doctorId: req.user.id, // ID du médecin connecté
      medications,
      expirationDate: new Date(expirationDate),
      notes,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: newPrescription
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer toutes les prescriptions d'un patient
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const prescriptions = await Prescription.find({ patientId })
      .populate('doctorId', 'firstName lastName specialty')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer une prescription spécifique
exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('doctorId', 'firstName lastName specialty')
      .populate('patientId', 'firstName lastName');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        error: 'Prescription non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour une prescription
exports.updatePrescription = async (req, res) => {
  try {
    const { medications, expirationDate, notes, isActive } = req.body;

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      {
        medications,
        expirationDate: expirationDate ? new Date(expirationDate) : undefined,
        notes,
        isActive,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedPrescription) {
      return res.status(404).json({
        success: false,
        error: 'Prescription non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPrescription
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Désactiver une prescription (soft delete)
exports.deactivatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        error: 'Prescription non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: { message: 'Prescription désactivée avec succès' }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Recherche avancée des prescriptions
exports.searchPrescriptions = async (req, res) => {
  try {
    const { patientId, doctorId, startDate, endDate, isActive } = req.query;
    const query = {};

    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    if (isActive) query.isActive = isActive === 'true';
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const prescriptions = await Prescription.find(query)
      .populate('doctorId', 'firstName lastName')
      .populate('patientId', 'firstName lastName')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};