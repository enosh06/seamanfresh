const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(products[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock_quantity, wholesale_price, wholesale_moq, low_stock_threshold, discount_percent } = req.body;
        const image_url = req.file ? req.file.path : null;

        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, image_url, category, stock_quantity, wholesale_price, wholesale_moq, low_stock_threshold, discount_percent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, image_url, category, stock_quantity, wholesale_price || null, wholesale_moq || 0, low_stock_threshold || 5, discount_percent || 0]
        );

        res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock_quantity, wholesale_price, wholesale_moq, low_stock_threshold, discount_percent } = req.body;

        // Handle empty strings for wholesale fields
        const w_price = wholesale_price === '' ? null : wholesale_price;
        const w_moq = wholesale_moq === '' ? 0 : wholesale_moq;
        const ls_threshold = low_stock_threshold === '' ? 5 : low_stock_threshold;
        const d_percent = discount_percent === '' ? 0 : discount_percent;

        const updateParams = [name, description, price, category, stock_quantity, w_price, w_moq, ls_threshold, d_percent];
        let query = 'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock_quantity = ?, wholesale_price = ?, wholesale_moq = ?, low_stock_threshold = ?, discount_percent = ?';

        if (req.file) {
            query += ', image_url = ?';
            updateParams.push(req.file.path);
        }

        query += ' WHERE id = ?';
        updateParams.push(req.params.id);

        await db.execute(query, updateParams);

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const { stock_quantity } = req.body;
        await db.execute('UPDATE products SET stock_quantity = ? WHERE id = ?', [stock_quantity, req.params.id]);
        res.json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
