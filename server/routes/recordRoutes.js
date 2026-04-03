const express = require('express');
const router = express.Router();
const { uploadRecord, getRecords } = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/upload-record', protect, upload.single('file'), uploadRecord);
router.get('/:userId', protect, getRecords);

module.exports = router;
