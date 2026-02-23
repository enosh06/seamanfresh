import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Send, Mail, MapPin, Phone, MessageSquare, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        document.title = "Contact Support | SeamanFresh Global";
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('/messages', {
                ...formData,
                userId: user?.id
            });
            setStatus({ type: 'success', message: 'Your transmission has been received. A logistics specialist will respond shortly.' });
            setFormData({ ...formData, subject: '', message: '' });
        } catch {
            setStatus({ type: 'error', message: 'Connection failed. Please re-attempt transmission.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Elite Header */}
            <section className="bg-slate-900 pt-40 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <span className="text-sky-500 font-black tracking-[0.4em] text-[10px] uppercase block mb-6">Dispatch Center</span>
                        <h1 className="text-6xl md:text-8xl font-black font-display text-white tracking-tighter uppercase leading-none mb-8">
                            CONNECT <br /><span className="text-sky-500 text-outline-sky">GLOBALLY.</span>
                        </h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                            Our support infrastructure is active 24/7 across all international docking zones.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Contact Stats/Info */}
                    <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        <ContactInfoBox
                            icon={<Phone size={24} />}
                            title="Hotline"
                            detail="+1 (709) 986-8050"
                            desc="Emergency support active"
                        />
                        <ContactInfoBox
                            icon={<Mail size={24} />}
                            title="Protocol"
                            detail="seamanfreshfish.inc@gmail.com"
                            desc="Digital correspondence"
                        />
                        <ContactInfoBox
                            icon={<MapPin size={24} />}
                            title="Headquarters"
                            detail="St. John's, NL, Canada"
                            desc="Strategic operations base"
                        />
                    </div>

                    {/* Contact Form Container */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[48px] shadow-3xl p-10 md:p-16 border border-slate-50 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <MessageSquare size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Open Inquiry</h2>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Priority Support Encryption</p>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {status.message && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className={`p-6 rounded-3xl mb-8 font-black text-xs uppercase tracking-widest flex items-center gap-4 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                                }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            {status.message}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Partner Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900"
                                                placeholder="Full Name"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Return Line (Email)</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900"
                                                placeholder="Email Address"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Subject Matter</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900"
                                            placeholder="Nature of Inquiry"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Comprehensive Details</label>
                                        <textarea
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="6"
                                            className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:bg-white focus:border-sky-500 transition-all font-bold text-slate-900 resize-none"
                                            placeholder="Provide detailed information regarding your request..."
                                        ></textarea>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-8 pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full sm:w-auto px-12 py-6 bg-slate-900 hover:bg-sky-500 text-white hover:text-slate-900 rounded-[32px] font-black uppercase text-sm tracking-widest transition-all shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-4 disabled:opacity-50"
                                        >
                                            {loading ? 'Transmitting...' : (
                                                <>
                                                    Transmit Message <Send size={20} />
                                                </>
                                            )}
                                        </button>

                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                            <ShieldCheck size={16} className="text-sky-500" />
                                            End-to-End Encrypted
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Trust Bar */}
            <div className="max-w-7xl mx-auto px-4 mt-32">
                <div className="bg-slate-50 rounded-[48px] p-12 flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                        <Globe size={20} className="text-sky-500" /> Global Support
                    </div>
                    <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                        <ShieldCheck size={20} className="text-sky-500" /> Certified Partners
                    </div>
                    <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest">
                        <Sparkles size={20} className="text-sky-500" /> Premium Quality
                    </div>
                </div>
            </div>
        </div>
    );
};

const ContactInfoBox = ({ icon, title, detail, desc }) => (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-sky-50 transition-all group">
        <div className="w-14 h-14 bg-slate-50 rounded-[22px] flex items-center justify-center text-sky-500 mb-8 group-hover:bg-sky-500 group-hover:text-slate-900 transition-all shadow-inner">
            {icon}
        </div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</h4>
        <p className="font-black text-slate-900 text-sm mb-1 leading-tight">{detail}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{desc}</p>
    </div>
);

export default Contact;
