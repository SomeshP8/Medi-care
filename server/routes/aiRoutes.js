const express = require('express');
const router = express.Router();
const { aiPredict } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ai-predict', protect, aiPredict);

module.exports = router;
