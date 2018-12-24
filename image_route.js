const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, crypto.createHash('sha256').update(file.originalname).digest('hex') + ".jpg");
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true);
    } else {
        cb(new Error('Wrong file type, please use .JPG, .PNG or .GIF'), false);
    }
};

const upload = multer(
    {
        storage: storage,
        limits: {
            fileSize: 1000 * 1000 * 1.5
        },
        fileFilter: fileFilter
    });

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests for /image'
    });
});

router.post('/', upload.single('image'), (req, res, next) => {
    res.status(200).json({
        message: 'Image uploaded',
        checkSum: crypto.createHash('sha256').update(req.file.originalname).digest('hex')
    });
});

router.get('/:checksum', (req, res, next) => {
    const checksum = req.params.checksum;

    fs.readdirSync('./uploads').forEach(file => {
        fileChecksum = file.substring(0, file.indexOf('.'));
        if (fileChecksum === checksum) {
            res.status(200).json({
                message: "Found image with checksum: " + checksum            
            });
        }
    });

    res.status(404).json({
        message: "Couldn't find image with checksum: " + checksum
    });    
});

module.exports = router;