const Antecedent = require('../models/Antecedent');

exports.create = async (req, res) => {
  try {
    const { patientId } = req.params;
    const antecedentData = {
      ...req.body,
      patientId,
      createdBy: req.user.id
    };

    const antecedent = await Antecedent.create(antecedentData);
    res.status(201).json(antecedent);
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.list = async (req, res) => {
  try {
    const { patientId } = req.params;
    const antecedents = await Antecedent.find({ patientId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'firstName lastName');

    res.json({
      success: true,
      data: antecedents
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { antecedentId } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    const antecedent = await Antecedent.findByIdAndUpdate(
      antecedentId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!antecedent) {
      return res.status(404).json({
        success: false,
        error: 'Antécédent non trouvé'
      });
    }

    res.json({
      success: true,
      data: antecedent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { antecedentId } = req.params;
    const antecedent = await Antecedent.findByIdAndDelete(antecedentId);

    if (!antecedent) {
      return res.status(404).json({
        success: false,
        error: 'Antécédent non trouvé'
      });
    }

    res.json({
      success: true,
      data: { message: 'Antécédent supprimé avec succès' }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.bulkCreate = async (req, res) => {
  try {
    const { patientId } = req.params;
    const antecedentsData = req.body.map(item => ({
      ...item,
      patientId,
      createdBy: req.user.id
    }));

    const antecedents = await Antecedent.insertMany(antecedentsData);
    res.status(201).json({
      success: true,
      data: antecedents
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};