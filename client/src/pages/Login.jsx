import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Waves } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            // Show specific message from backend if available
            if (err.response && err.response.data) {
                // If the backend sends detailed error info (which we added for 500s), show it.
                if (err.response.data.error) {
                    setError(`System Error: ${err.response.data.error}`);
                } else if (err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('An unexpected error occurred.');
                }
            } else {
                setError('Network error. Please check your connection.');
            }
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Ocean Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-ocean overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-ocean via-ocean-dark to-midnight opacity-90"></div>
                <img
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=1200"
                    alt="Ocean waves"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                />
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
                    <Waves size={80} className="mb-8 text-ocean-light" />
                    <h1 className="text-5xl font-bold font-display mb-4 text-center">Welcome Back</h1>
                    <p className="text-xl text-ocean-light text-center max-w-md">
                        Dive back into the freshest seafood marketplace
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold font-display text-midnight mb-2">Sign In</h2>
                        <p className="text-gray-500">Access your Seaman Fresh account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                            {error}
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

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="text-right mt-2">
                                <Link to="/forgot-password" className="text-sm text-ocean hover:text-ocean-dark font-semibold transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-ocean hover:bg-ocean-dark text-white font-bold py-4 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-ocean/20 flex items-center justify-center gap-2 group"
                        >
                            Sign In
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-ocean font-bold hover:text-ocean-dark transition-colors">
                                Create one now
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

export default Login;
