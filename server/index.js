const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const compression = require('compression');


dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
// Middleware
app.use(compression());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        // Obfuscate sensitive data for logs
        const loggedBody = { ...req.body };
        if (loggedBody.password) loggedBody.password = '********';
        console.log('Body:', JSON.stringify(loggedBody, null, 2));
    }
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const bannerRoutes = require('./routes/banners');
const messageRoutes = require('./routes/messages');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/setup', require('./routes/setup'));

app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.send('Seaman Fresh API is running...');
});

const PORT = process.env.PORT || 5000;

// Global error handler
app.use((err, req, res, next) => {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(__dirname, 'server_error.log');
    const logMessage = `[${new Date().toISOString()}] GLOBAL ERROR: ${err.stack}\n`;
    fs.appendFileSync(logPath, logMessage);

    console.error('SERVER ERROR:', err);
    res.status(500).json({
        message: 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
