const db = require('../config/db');

exports.createOrder = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const { items, total_amount, delivery_address } = req.body;
        const user_id = req.user.id;

        // 1. Create Order
        const [orderRows] = await connection.execute(
            'INSERT INTO orders (user_id, total_amount, delivery_address) VALUES (?, ?, ?) RETURNING id',
            [user_id, total_amount, delivery_address]
        );
        const orderId = orderRows.id; // From the RETURNING clause mapping in wrapper

        // 2. Create Order Items
        for (const item of items) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );

            // 3. Update Stock
            await connection.execute(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (connection) connection.release();
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const [orders] = await db.execute(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
            [req.user.id]
        );
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        let query = `
            SELECT o.*, u.name as user_name 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.id DESC
        `;

        const params = [];
        if (req.query.limit) {
            query += ' LIMIT ?';
            params.push(parseInt(req.query.limit));
        }

        const [orders] = await db.execute(query, params);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Order status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const [order] = await db.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        if (order.length === 0) return res.status(404).json({ message: 'Order not found' });

        const [items] = await db.execute(`
            SELECT oi.*, p.name, p.image_url 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        `, [req.params.id]);

        res.json({ ...order[0], items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteAllOrders = async (req, res) => {
    try {
        // Delete items first to maintain referential integrity
        await db.execute('DELETE FROM order_items');
        await db.execute('DELETE FROM orders');
        res.json({ message: 'All orders deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        // Get data for the last 7 days
        const [rows] = await db.execute(`
            SELECT 
                DATE(created_at) as date, 
                SUM(total_amount) as revenue 
            FROM orders 
            WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // Create a map of existing data
        const dataMap = new Map();
        rows.forEach(row => {
            // Format date as YYYY-MM-DD to ensure matching
            const dateStr = row.date.toISOString().split('T')[0];
            dataMap.set(dateStr, parseFloat(row.revenue));
        });

        // Generate last 7 days array including today, filling zeros for missing days
        const analytics = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            analytics.push({
                date: dateStr,
                // Format for display (e.g., "Mon", "Jan 10")
                displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: dataMap.get(dateStr) || 0
            });
        }

        res.json(analytics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
