const db = require('../config/db');

exports.getAllBanners = async (req, res) => {
    try {
        const [banners] = await db.execute('SELECT * FROM banners');
        res.json(banners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createBanner = async (req, res) => {
    try {
        const { title, subtitle, link } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        await db.execute(
            'INSERT INTO banners (title, subtitle, link, image_url) VALUES (?, ?, ?, ?)',
            [title, subtitle, link, image_url]
        );

        res.status(201).json({ message: 'Banner created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        await db.execute('DELETE FROM banners WHERE id = ?', [req.params.id]);
        res.json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
