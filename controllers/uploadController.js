const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (filePath, folder = 'uploads') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Helper function to delete local file
const deleteLocalFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted local file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting local file ${filePath}:`, error);
  }
};

// Upload single file
const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('Uploading single file:', req.file.originalname);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, 'single-uploads');

    // Delete local file after successful upload
    deleteLocalFile(req.file.path);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        originalName: req.file.originalname,
        cloudinaryId: result.public_id,
        url: result.secure_url,
        size: result.bytes,
        format: result.format,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    // Delete local file if upload failed
    if (req.file) {
      deleteLocalFile(req.file.path);
    }

    console.error('Single upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

// Upload multiple files
const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    console.log(`Uploading ${req.files.length} files`);

    const uploadPromises = req.files.map(async (file) => {
      try {
        const result = await uploadToCloudinary(file.path, 'multiple-uploads');
        deleteLocalFile(file.path);
        
        return {
          originalName: file.originalname,
          cloudinaryId: result.public_id,
          url: result.secure_url,
          size: result.bytes,
          format: result.format,
          uploadedAt: new Date().toISOString()
        };
      } catch (error) {
        deleteLocalFile(file.path);
        throw error;
      }
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: `${results.length} files uploaded successfully`,
      data: results
    });

  } catch (error) {
    // Clean up any remaining local files
    if (req.files) {
      req.files.forEach(file => {
        deleteLocalFile(file.path);
      });
    }

    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

// Upload multiple fields
const uploadMultifield = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    console.log('Uploading multifield files:', Object.keys(req.files));

    const results = {};

    // Process each field
    for (const [fieldName, files] of Object.entries(req.files)) {
      if (Array.isArray(files) && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          try {
            const result = await uploadToCloudinary(file.path, `multifield-uploads/${fieldName}`);
            deleteLocalFile(file.path);
            
            return {
              originalName: file.originalname,
              cloudinaryId: result.public_id,
              url: result.secure_url,
              size: result.bytes,
              format: result.format,
              uploadedAt: new Date().toISOString()
            };
          } catch (error) {
            deleteLocalFile(file.path);
            throw error;
          }
        });

        results[fieldName] = await Promise.all(uploadPromises);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Multifield files uploaded successfully',
      data: results
    });

  } catch (error) {
    // Clean up any remaining local files
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        deleteLocalFile(file.path);
      });
    }

    console.error('Multifield upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadMultifield
}; 