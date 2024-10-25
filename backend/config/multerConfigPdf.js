const multer = require('multer');

// Set up storage options
const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, 'uploads/'); // Ensure this directory exists
    // },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Append timestamp to avoid filename collisions
    },
});

// Create multer instance with defined storage and file filter
const pdfUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const isPdf = file.mimetype === 'application/pdf';
        cb(null, isPdf); // Accepts only PDF files
    },
});

module.exports = { pdfUpload }; // Ensure proper export
