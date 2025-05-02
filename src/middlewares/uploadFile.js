const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to ensure the upload directory exists
const ensureUploadsDirectory = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

// Function to create a dynamic multer instance
const createMulterInstance = (uploadPath = "src/public/uploads/", allowedTypes = []) => {
  ensureUploadsDirectory(uploadPath);

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "-");
      const newFileName = `${baseName}-${Date.now()}${ext}`;
      callback(null, newFileName);
    },
  });

  const fileFilter = (req, file, callback) => {
    if (!allowedTypes || allowedTypes.includes("*") || allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error(`File type not allowed: ${file.mimetype}`));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024 * 1024, // 2GB max file size
    },
  });
};

module.exports = { createMulterInstance };
