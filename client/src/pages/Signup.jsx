import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Anchor } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', address: ''
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(formData);
            // Optionally could auto-login here, but redirecting to login is safer for now
            navigate('/login');
        } catch (err) {
            console.error('Signup error:', err);
            // Show specific message from backend if available
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Signup failed. Please try again or check your connection.');
            }
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Ocean Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-midnight via-ocean-dark to-ocean overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl mb-8 border border-white/20">
                        <Anchor size={60} className="text-ocean-light" />
                    </div>
                    <h1 className="text-5xl font-bold font-display mb-4 text-center">Join Our Community</h1>
                    <p className="text-xl text-ocean-light text-center max-w-md leading-relaxed">
                        Start your journey with the world's finest seafood delivered to your door
                    </p>
                    <div className="mt-12 flex gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold">50+</div>
                            <div className="text-sm text-ocean-light">Countries</div>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div>
                            <div className="text-3xl font-bold">24h</div>
                            <div className="text-sm text-ocean-light">Delivery</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold font-display text-midnight mb-2">Create Account</h2>
                        <p className="text-gray-500">Join thousands of seafood lovers worldwide</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
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
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Delivery Address
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                    rows="2"
                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all resize-none"
                                    placeholder="123 Ocean Drive, City, Country"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-ocean hover:bg-ocean-dark text-white font-bold py-4 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-ocean/20 flex items-center justify-center gap-2 group mt-6"
                        >
                            Create Account
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-ocean font-bold hover:text-ocean-dark transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
