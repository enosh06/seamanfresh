import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles, ShieldCheck, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Sign In | SeamanFresh Premium";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await login(email, password);
            if (user.role === 'admin') navigate('/admin');
            else navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.message || err.response.data.error || 'Authentication failed.');
            } else {
                setError('Unable to reach the port. Check your connection.');
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
                        src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=1200"
                        alt="Ocean depths"
                        className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/40 to-sky-500/20"></div>
                </div>

                <div className="relative z-10 p-16 max-w-xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="w-24 h-24 bg-sky-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-sky-500/20"
                    >
                        <Sparkles size={48} className="text-slate-900" />
                    </motion.div>
                    <h1 className="text-6xl font-black font-display text-white mb-6 tracking-tighter leading-none shadow-sm">
                        PREMIUM <br /><span className="text-sky-500">RESUPPLY.</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed">
                        Access the world's most advanced seafood logistics platform.
                    </p>

                    <div className="mt-16 flex items-center justify-center gap-8">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white">50+</span>
                            <span className="text-[10px] text-sky-500 font-black uppercase tracking-[0.2em]">Countries</span>
                        </div>
                        <div className="w-px h-10 bg-white/10"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white">24h</span>
                            <span className="text-[10px] text-sky-500 font-black uppercase tracking-[0.2em]">Fulfillment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 relative bg-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 -z-0"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="mb-12">
                        <Link to="/" className="inline-flex items-center gap-2 text-sky-500 font-black text-[10px] uppercase tracking-widest mb-4 hover:gap-4 transition-all">
                            <ArrowRight size={14} className="rotate-180" /> Back to Market
                        </Link>
                        <h2 className="text-5xl font-black font-display text-slate-900 tracking-tighter uppercase mb-4">Sign In</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                            <ShieldCheck size={14} /> Secure Member Access
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

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Shipment ID (Email)</label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900"
                                    placeholder="Enter registered email"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center ml-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Key</label>
                                <Link to="/forgot-password" disabled className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:underline">Lost access?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full group bg-slate-900 hover:bg-sky-500 text-white hover:text-slate-900 font-black py-6 rounded-[28px] transition-all transform hover:-translate-y-1 shadow-2xl shadow-slate-900/10 hover:shadow-sky-500/30 flex items-center justify-center gap-4 ${isLoading ? 'opacity-50' : ''}`}
                        >
                            {isLoading ? 'Verifying Credentials...' : (
                                <>
                                    Authorize Access
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-12 border-t border-slate-50 text-center">
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                            New Partner?{' '}
                            <Link to="/signup" className="text-sky-500 font-black hover:underline ml-2">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
