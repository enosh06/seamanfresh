import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, Globe, DollarSign, User, Settings, ChevronDown, MessageSquare, LayoutDashboard, Heart, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useUserType } from '../context/UserTypeContext';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { language, setLanguage } = useLanguage();
    const { currency, setCurrency } = useCurrency();
    const { userType, setUserType, isWholesale } = useUserType();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleUserType = () => {
        setUserType(isWholesale ? 'retail' : 'wholesale');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const navLinkClasses = ({ isActive }) =>
        `px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        }`;

    const mobileNavLinkClasses = ({ isActive }) =>
        `flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-black transition-all duration-300 ${isActive
            ? "bg-sky-500 text-slate-900 shadow-xl shadow-sky-500/20"
            : "bg-white text-slate-500 hover:bg-slate-50"
        }`;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`relative flex justify-between items-center transition-all duration-500 px-6 h-20 rounded-[32px] border border-white/20 shadow-2xl backdrop-blur-2xl ${scrolled ? 'bg-white/90' : 'bg-white/70'
                    }`}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg">
                            <span className="text-white font-black text-xl">S</span>
                        </div>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter hidden sm:block">
                            Seaman<span className="text-sky-500">Fresh</span>
                        </span>
                    </Link>

                    {/* Desktop Center Links */}
                    <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <NavLink to="/" className={navLinkClasses}>Home</NavLink>
                        <NavLink to="/products" className={navLinkClasses}>Products</NavLink>
                        <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden lg:flex items-center gap-4 border-l border-slate-100 pl-6">
                        {/* Currency/Lang Switchers */}
                        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2">
                                <Globe size={14} className="text-slate-400" />
                                <select
                                    className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-600"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="en">EN</option>
                                    <option value="es">ES</option>
                                </select>
                            </div>
                            <div className="w-px h-4 bg-slate-200"></div>
                            <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-slate-400" />
                                <select
                                    className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-600"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="INR">INR</option>
                                </select>
                            </div>
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 hover:text-sky-500 hover:border-sky-500 transition-all shadow-sm">
                            <ShoppingCart size={20} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-sky-500 text-slate-900 text-[10px] font-black flex items-center justify-center rounded-lg border-4 border-white shadow-lg animate-bounce">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        {/* User / Partner Mode */}
                        <button
                            onClick={toggleUserType}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm border ${isWholesale
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                                : 'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100'
                                }`}
                        >
                            {isWholesale ? 'Wholesale Partner' : 'Retail Member'}
                        </button>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                                    className="flex items-center gap-3 pl-2 group"
                                >
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all group-hover:scale-105">
                                        <User size={20} />
                                    </div>
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${showAdminMenu ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showAdminMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-64 bg-white rounded-[32px] shadow-2xl border border-slate-50 p-3 z-50 overflow-hidden"
                                        >
                                            <div className="px-4 py-3 mb-2">
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Signed in as</p>
                                                <p className="text-sm font-black text-slate-900 truncate">{user.name || user.email}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <Link to="/dashboard" onClick={() => setShowAdminMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all">
                                                    <LayoutDashboard size={18} /> My Dashboard
                                                </Link>
                                                <Link to="/settings" onClick={() => setShowAdminMenu(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all">
                                                    <Settings size={18} /> Account Settings
                                                </Link>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                                                    <LogOut size={18} /> Log Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="px-8 py-3.5 bg-slate-900 text-white hover:bg-sky-500 text-sm font-black rounded-2xl shadow-xl shadow-slate-900/20 transition-all transform hover:-translate-y-1">
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Controls (Always visible actions) */}
                    <div className="flex lg:hidden items-center gap-3">
                        <Link to="/cart" className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-600 shadow-sm">
                            <ShoppingCart size={20} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-slate-900 text-[10px] font-black flex items-center justify-center rounded-lg shadow-lg">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                        <button
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Premium Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[101] bg-white lg:hidden flex flex-col pt-32 p-6"
                    >
                        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                            <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkClasses}>Home</NavLink>
                            <NavLink to="/products" onClick={() => setIsOpen(false)} className={mobileNavLinkClasses}>Products</NavLink>
                            <NavLink to="/contact" onClick={() => setIsOpen(false)} className={mobileNavLinkClasses}>Contact</NavLink>

                            {user && (
                                <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={mobileNavLinkClasses}>
                                    <Package size={20} /> My Dashboard
                                </NavLink>
                            )}

                            <div className="h-px bg-slate-100 my-6"></div>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={toggleUserType}
                                    className={`w-full p-6 rounded-[28px] border-2 text-left transition-all ${isWholesale
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-sky-500 bg-sky-50 text-sky-700'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Active Mode</span>
                                        <div className={`w-3 h-3 rounded-full animate-pulse ${isWholesale ? 'bg-emerald-500' : 'bg-sky-500'}`}></div>
                                    </div>
                                    <h4 className="text-xl font-black">{isWholesale ? 'Wholesale Partner' : 'Retail Member'}</h4>
                                    <p className="text-xs opacity-60 mt-2">Tap to switch to {isWholesale ? 'Retail' : 'Wholesale'} pricing</p>
                                </button>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-4">Currency</span>
                                        <div className="flex flex-col gap-3">
                                            {['USD', 'EUR', 'INR'].map(cur => (
                                                <button
                                                    key={cur}
                                                    onClick={() => setCurrency(cur)}
                                                    className={`text-left font-black text-sm px-2 py-1 rounded-lg ${currency === cur ? 'text-sky-500 bg-white shadow-sm' : 'text-slate-400'}`}
                                                >
                                                    {cur}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-4">Language</span>
                                        <div className="flex flex-col gap-3">
                                            {['en', 'es'].map(lang => (
                                                <button
                                                    key={lang}
                                                    onClick={() => setLanguage(lang)}
                                                    className={`text-left font-black text-sm px-2 py-1 rounded-lg uppercase ${language === lang ? 'text-sky-500 bg-white shadow-sm' : 'text-slate-400'}`}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 space-y-4">
                            {user ? (
                                <button onClick={handleLogout} className="w-full py-5 bg-red-50 text-red-500 font-black rounded-3xl flex items-center justify-center gap-3">
                                    <LogOut size={20} /> Sign Out
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-5 bg-slate-900 text-white font-black text-center rounded-3xl shadow-xl shadow-slate-900/20">
                                    Sign In to SeamanFresh
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
