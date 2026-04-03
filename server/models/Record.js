const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  notes: { type: String, required: true },
  fileUrl: { type: String, required: true },
  recordHash: { type: String, required: true }, // SHA-256
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
