require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/ai', aiRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medchain')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
