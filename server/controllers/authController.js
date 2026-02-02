const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body || {};

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Check if user exists
        const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?) RETURNING id',
            [name, email, hashedPassword, phone, address]
        );

        res.status(201).json({ message: 'User created successfully', userId: result[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        console.log('--- Login Attempt ---');
        console.log('Email:', email);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        console.log('Users found:', users.length);

        if (users.length === 0) {
            console.log('Login Result: Invalid Email');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        console.log('User role:', user.role);

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch);

        if (!isMatch) {
            console.log('Login Result: Invalid Password');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log('Login Result: Success');
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(__dirname, '../server_error.log');
        const logMessage = `[${new Date().toISOString()}] LOGIN ERROR: ${error.stack}\n`;
        fs.appendFile(logPath, logMessage, (err) => { if (err) console.error('Failed to write to log:', err); });

        console.error('CRITICAL LOGIN ERROR:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body || {};
        const userId = req.user.id; // From verifyToken middleware

        // Get current user
        const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
