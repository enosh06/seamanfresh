import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Sparkles, ShieldCheck, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', address: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Join SeamanFresh | Global Seafood Network";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await signup(formData);
            navigate('/login');
        } catch (err) {
            console.error('Signup error:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Signup failed. Please verify your details.');
            } else {
                setError('Network error. Our crew couldn\'t reach the server.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* Left Side - Luxury Brand Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 justify-center items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&q=80&w=1200"
                        alt="Join our community"
                        className="w-full h-full object-cover opacity-30 mix-blend-luminosity scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/60 to-sky-500/10"></div>
                </div>

                <div className="relative z-10 p-16 max-w-xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 bg-sky-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-sky-500/20"
                    >
                        <Waves size={48} className="text-slate-900" />
                    </motion.div>
                    <h1 className="text-6xl font-black font-display text-white mb-6 tracking-tighter leading-none shadow-sm">
                        JOIN THE <br /><span className="text-sky-500">NETWORK.</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed">
                        Become part of the most exclusive fresh seafood supply chain on the planet.
                    </p>

                    <div className="mt-16 grid grid-cols-2 gap-8">
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10">
                            <span className="text-2xl font-black text-white block mb-1">24h</span>
                            <span className="text-[10px] text-sky-500 font-black uppercase tracking-[0.2em]">Global Air-Freight</span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10">
                            <span className="text-2xl font-black text-white block mb-1">100%</span>
                            <span className="text-[10px] text-sky-500 font-black uppercase tracking-[0.2em]">Source Verified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 relative bg-white">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full -ml-32 -mb-32 -z-0"></div>

                <div className="w-full max-w-lg relative z-10">
                    <div className="mb-12">
                        <Link to="/" className="inline-flex items-center gap-2 text-sky-500 font-black text-[10px] uppercase tracking-widest mb-4 hover:gap-4 transition-all">
                            <ArrowRight size={14} className="rotate-180" /> Back to Market
                        </Link>
                        <h2 className="text-5xl font-black font-display text-slate-900 tracking-tighter uppercase mb-4">Create Account</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            <Sparkles size={14} /> Exclusive Member Benefits
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="mb-8 p-6 bg-red-50 border border-red-100 rounded-[28px] text-red-600 font-bold text-xs"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900 text-sm"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Shipment ID (Email)</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900 text-sm"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Secure Key (Pass)</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900 text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Comms Line (Phone)</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900 text-sm"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Home Port (Address)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-6 text-slate-300 group-focus-within:text-sky-500 transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                    rows="3"
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900 text-sm resize-none"
                                    placeholder="Full Delivery Address"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full group bg-slate-900 hover:bg-sky-500 text-white hover:text-slate-900 font-black py-6 rounded-[28px] transition-all transform hover:-translate-y-1 shadow-2xl shadow-slate-900/10 hover:shadow-sky-500/30 flex items-center justify-center gap-4 ${isLoading ? 'opacity-50' : ''}`}
                        >
                            {isLoading ? 'Processing Ingress...' : (
                                <>
                                    Establish Account
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                            Authorized already?{' '}
                            <Link to="/login" className="text-sky-500 font-black hover:underline ml-2">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
