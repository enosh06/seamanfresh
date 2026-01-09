const db = require('../config/db');

// Create a new message
exports.createMessage = async (req, res) => {
    try {
        const { name, email, subject, message, userId } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email and message are required' });
        }

        await db.execute(
            'INSERT INTO contact_messages (user_id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)',
            [userId || null, name, email, subject, message]
        );

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all messages (Admin only)
exports.getMessages = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a message (Admin only)
exports.deleteMessage = async (req, res) => {
    try {
        await db.execute('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
