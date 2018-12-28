const router = require('koa-router')();
const multer = require('koa-multer');
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
    }
);

router.post('/image', upload.single('image'), async (ctx, next) => {
    ctx.status = 200;
    ctx.body = {
        message: 'Image uploaded',
        checkSum: crypto.createHash('sha256').update(ctx.req.file.originalname).digest('hex')
    };
});

router.get('/image', async (ctx, next) => {
    ctx.status = 200;
    ctx.body = {
        message: 'Handling /image'
    };
});

router.get('/image/:checksum', async (ctx, next) => {
    const checksum = ctx.params.checksum;

    fs.readdirSync('./uploads').forEach(file => {
        fileChecksum = file.substring(0, file.indexOf('.'));
        if (fileChecksum === checksum) {
            ctx.status = 200;
            ctx.body = {
                message: "Found image with checksum: " + checksum            
            };
        }
    });

    if (ctx.status !== 200) {
        ctx.status = 404;
        ctx.body = {
            message: "Couldn't find image with checksum: " + checksum
        };
    }
});

module.exports = router;