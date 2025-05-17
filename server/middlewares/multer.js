import multer from 'multer';
import fs from 'fs';
import path from 'path';

// File filter to accept images and videos
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|mp4|mov|avi/; // Valid image and video types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true); // Allow file upload
    } else {
        cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
};

// Storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads"); // Folder where files will be stored
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
        cb(null, `${Date.now()}_${file.originalname}`); // Create a unique filename using timestamp
    },
});

// Multer instance with file filter and storage configuration
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,  // Add file filter to check for valid image/video types
});

export default upload;
