// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  content: { type: String, required: true },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  criteria: {
    categories: [String],
    diseaseStages: [String],
    customSelection: [mongoose.Schema.Types.ObjectId]
  },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sentAt: { type: Date, default: Date.now },
  channel: { type: String, enum: ['email', 'sms', 'both'], required: true },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' }
});

module.exports = mongoose.model('Message', messageSchema);