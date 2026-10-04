const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
const subdirs = ['announcements', 'events', 'notes', 'lostfound'];
subdirs.forEach(dir => {
  const dirPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Allowed file types for notes
const noteFileTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt/;
const noteMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
];

// Allowed image types
const imageFileTypes = /jpeg|jpg|png|gif|webp/;
const imageMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

// Dangerous extensions to block
const dangerousExtensions = /exe|bat|cmd|sh|ps1|vbs|js|msi|dll|com|scr|pif/;

// Storage configuration
const createStorage = (subfolder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = path.join(uploadsDir, subfolder);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${subfolder}-${uniqueSuffix}${ext}`);
    }
  });
};

// File filter for images
const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (dangerousExtensions.test(ext)) {
    return cb(new Error('Dangerous file types are not allowed.'), false);
  }
  
  if (imageFileTypes.test(ext) && imageMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed.'), false);
  }
};

// File filter for notes (documents)
const noteFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (dangerousExtensions.test(ext)) {
    return cb(new Error('Dangerous file types are not allowed.'), false);
  }
  
  if (noteFileTypes.test(ext) && noteMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only document files (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT) are allowed.'), false);
  }
};

// General file filter (images + documents)
const generalFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (dangerousExtensions.test(ext)) {
    return cb(new Error('Dangerous file types are not allowed.'), false);
  }
  
  const allAllowedMimes = [...imageMimeTypes, ...noteMimeTypes];
  if (allAllowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed.'), false);
  }
};

// Upload configurations
const uploadImage = (subfolder) => multer({
  storage: createStorage(subfolder),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadNote = multer({
  storage: createStorage('notes'),
  fileFilter: noteFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB
});

const uploadGeneral = (subfolder) => multer({
  storage: createStorage(subfolder),
  fileFilter: generalFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Error handler middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Please check the file size limit.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// Helper to delete a file
const deleteFile = (filePath) => {
  if (filePath) {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

module.exports = {
  uploadImage,
  uploadNote,
  uploadGeneral,
  handleUploadError,
  deleteFile
};
