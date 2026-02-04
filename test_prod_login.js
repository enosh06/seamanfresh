const axios = require('axios');

async function testLogin() {
    const email = 'admin@seamanfresh.com';
    const password = 'admin123';

    console.log(`Testing login for ${email}...`);

    try {
        const response = await axios.post('https://seaman-fresh-final.onrender.com/api/auth/login', {
            email,
            password
        });

        console.log('Login Success!');
        console.log('User:', response.data.user);
    } catch (error) {
        if (error.response) {
            console.error('Login Failed:', error.response.status, error.response.data);
        } else {
            console.error('Network Error:', error.message);
        }
    }
}

testLogin();
