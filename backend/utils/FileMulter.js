const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.memoryStorage(); // Store file in memory

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.ms-powerpoint',
      'application/vnd.ms-excel',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

module.exports = { upload };
