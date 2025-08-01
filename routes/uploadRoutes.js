const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, uploadMultifield } = require('../controllers/uploadController');
const { single, multiple, multifield } = require('../middleware/upload');

// Route for single file upload
router.post('/upload/single', single, uploadSingle);

// Route for multiple files from single field
router.post('/upload/multiple', multiple, uploadMultiple);

// Route for multiple fields with arrays of files
router.post('/upload/multifield', multifield, uploadMultifield);

module.exports = router; 