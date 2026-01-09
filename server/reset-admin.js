const db = require('./config/db');
const bcrypt = require('bcryptjs');

async function resetAdmin() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await db.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, 'admin@seamanfresh.com']
        );

        console.log('Admin password reset successfully to: admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting admin:', error);
        process.exit(1);
    }
}

resetAdmin();
