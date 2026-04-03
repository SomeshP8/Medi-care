const Record = require('../models/Record');
const { generateSHA256 } = require('../utils/hash');

const uploadRecord = async (req, res) => {
  try {
    const { userId, doctorName, notes } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!fileUrl) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const recordDataString = `${userId}-${doctorName}-${notes}-${fileUrl}-${Date.now()}`;
    const recordHash = generateSHA256(recordDataString);

    const record = await Record.create({
      userId,
      doctorName,
      notes,
      fileUrl,
      recordHash
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecords = async (req, res) => {
  try {
    const records = await Record.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadRecord, getRecords };
