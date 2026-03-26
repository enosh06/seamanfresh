import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Fish, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: '100vh', background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <Fish size={48} color="#0ea5e9" style={{ marginBottom: '15px' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Seaman Admin</h2>
                    <p style={{ color: '#64748b' }}>Enter your stateless credentials</p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2', color: '#b91c1c', padding: '12px',
                        borderRadius: '12px', marginBottom: '20px', fontSize: '13px',
                        textAlign: 'center', fontWeight: '600'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Admin Username</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                                style={{ paddingLeft: '40px', borderRadius: '12px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Admin Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ paddingLeft: '40px', borderRadius: '12px' }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                        style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '10px' }}
                    >
                        {isSubmitting ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
