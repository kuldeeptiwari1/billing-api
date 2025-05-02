const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');
const multer = require('multer');
const s3Client = require('../utils/aws-client');
const { getMessage } = require('../utils/constant');

const createS3Storage = (bucketName, allowedTypes = []) => {
  const storage = multer.memoryStorage(); // Keep file in memory for direct S3 upload

  const fileFilter = (req, file, cb) => {
    if (!allowedTypes || allowedTypes.includes("*") || allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`));
    }
  };

  const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024 * 1024, // 2GB
    },
  });

  // Middleware wrapper to handle S3 upload manually after multer parses it
  const handleUploadToS3 = async (req, res, next) => {
    if (!req.files || !req.files.length) return next();

    const type = req.query.type || "all";
    const folder = type === 'image' ? 'gallery' : type === 'pdf' ? 'pdf' : 'all';
    try {
      const uploadedFiles = await Promise.all(req.files.map(async (file) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
        const fileName = `uploads/${folder}/${baseName}-${Date.now()}${ext}`;

        const parallelUpload = new Upload({
          client: s3Client,
          params: {
            Bucket: bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'private',
          },
        });

        await parallelUpload.done();

        file.s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        file.s3Key = fileName;

        return file;
      }));

      req.files = uploadedFiles;
      next();
    } catch (err) {
      console.error("S3 Upload Error: ", err);
      res.status(500).json( {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'uploadFailed', 'galleries'),
        errorStack: err.message
      });
    }
  };

  return {
    uploadMiddleware,
    handleUploadToS3
  };
};

module.exports = createS3Storage;
