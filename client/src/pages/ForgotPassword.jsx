import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Waves } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage({
                type: 'success',
                text: 'Password reset instructions have been sent to your email!'
            });
            setEmail('');
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to send reset email. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Ocean Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-ocean overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-ocean via-ocean-dark to-midnight opacity-90"></div>
                <img
                    src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&q=80&w=1200"
                    alt="Ocean waves"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                />
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
                    <Waves size={80} className="mb-8 text-ocean-light" />
                    <h1 className="text-5xl font-bold font-display mb-4 text-center">Reset Password</h1>
                    <p className="text-xl text-ocean-light text-center max-w-md">
                        We'll help you get back into your account
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
                <div className="w-full max-w-md">
                    <Link to="/login" className="inline-flex items-center gap-2 text-ocean hover:text-ocean-dark font-semibold mb-8 transition-colors">
                        <ArrowLeft size={20} />
                        Back to Login
                    </Link>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold font-display text-midnight mb-2">Forgot Password?</h2>
                        <p className="text-gray-500">Enter your email and we'll send you reset instructions</p>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-600'
                            }`}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            <span className="font-semibold text-sm">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-ocean hover:bg-ocean-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-ocean/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Instructions'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Remember your password?{' '}
                            <Link to="/login" className="text-ocean font-bold hover:text-ocean-dark transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Mobile Ocean Accent */}
                    <div className="lg:hidden mt-12 flex justify-center">
                        <Waves size={40} className="text-ocean opacity-20" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
