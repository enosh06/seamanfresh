import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white pt-24 pb-12 mt-32 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Upper Footer - Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                    {/* Brand Column */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                                <Sparkles size={20} className="text-slate-900" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase">
                                SEAMAN<span className="text-sky-500">FRESH</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Pioneering the future of seafood logistics. From artisanal harvests to global kitchens with 24-hour precision.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-12 h-12 bg-white/5 hover:bg-sky-500 hover:text-slate-900 rounded-2xl flex items-center justify-center transition-all border border-white/10 group">
                                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="w-12 h-12 bg-white/5 hover:bg-sky-500 hover:text-slate-900 rounded-2xl flex items-center justify-center transition-all border border-white/10 group">
                                <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="w-12 h-12 bg-white/5 hover:bg-sky-500 hover:text-slate-900 rounded-2xl flex items-center justify-center transition-all border border-white/10 group">
                                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Navigation</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-slate-400 hover:text-white font-bold transition-colors">Home Experience</Link></li>
                            <li><Link to="/products" className="text-slate-400 hover:text-white font-bold transition-colors">Market Place</Link></li>
                            <li><Link to="/about" className="text-slate-400 hover:text-white font-bold transition-colors">Our Mission</Link></li>
                            <li><Link to="/contact" className="text-slate-400 hover:text-white font-bold transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Connect</h4>
                        <div className="space-y-6">
                            <a href="mailto:seamanfreshfish.inc@gmail.com" className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-slate-900 transition-all">
                                    <Mail size={18} />
                                </div>
                                <span className="text-slate-400 font-bold group-hover:text-white transition-colors text-sm break-all">seamanfreshfish.inc@gmail.com</span>
                            </a>
                            <a href="tel:+17099868050" className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-slate-900 transition-all">
                                    <Phone size={18} />
                                </div>
                                <span className="text-slate-400 font-bold group-hover:text-white transition-colors text-sm">+1 (709) 986-8050</span>
                            </a>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-sky-500">
                                    <MapPin size={18} />
                                </div>
                                <div className="relative">
                                    <span className="block text-slate-400 font-bold group-hover:text-white transition-colors text-sm">1, St. John's, NL</span>
                                    <span className="block text-xs text-slate-500 font-medium">Headquarters, Canada</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Container */}
                    <div className="space-y-8 bg-white/5 p-8 rounded-[40px] border border-white/10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Stay Fresh</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Join our dispatch for seasonal catches and exclusive member rates.</p>
                        <form className="relative mt-4">
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-sky-500/50 transition-all"
                            />
                            <button className="absolute right-2 top-2 bg-sky-500 text-slate-900 p-2.5 rounded-xl hover:bg-sky-400 transition-all">
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lower Footer - Logos & Badges */}
                <div className="pt-12 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={16} className="text-sky-500" />
                            Secure Payments
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            <Truck size={16} className="text-sky-500" />
                            Global Logistics
                        </div>
                    </div>

                    <div className="text-center lg:text-right">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                            &copy; {new Date().getFullYear()} SEAMAN FRESH INTERNATIONAL INC.
                        </p>
                        <div className="flex gap-4 justify-center lg:justify-end text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            <a href="#" className="hover:text-sky-500 transition-colors">Privacy</a>
                            <span>•</span>
                            <a href="#" className="hover:text-sky-500 transition-colors">Terms</a>
                            <span>•</span>
                            <a href="#" className="hover:text-sky-500 transition-colors">Sitemap</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
