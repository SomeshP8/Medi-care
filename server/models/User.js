const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  healthId: { type: String, required: true, unique: true }, // SHA-256 hash
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  emergencyInfo: {
    bloodGroup: { type: String },
    allergies: [{ type: String }],
    medications: [{ type: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
