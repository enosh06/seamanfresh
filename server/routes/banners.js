const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', bannerController.getAllBanners);
router.post('/', verifyToken, isAdmin, upload.single('image'), bannerController.createBanner);
router.delete('/:id', verifyToken, isAdmin, bannerController.deleteBanner);

module.exports = router;
