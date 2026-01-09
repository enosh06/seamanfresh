const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/', bannerController.getAllBanners);
router.post('/', verifyToken, isAdmin, upload.single('image'), bannerController.createBanner);
router.delete('/:id', verifyToken, isAdmin, bannerController.deleteBanner);

module.exports = router;
