import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, Globe, DollarSign, User, Settings, ChevronDown, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useUserType } from '../context/UserTypeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    const { language, setLanguage } = useLanguage();
    const { currency, setCurrency } = useCurrency();
    const { userType, setUserType, isWholesale } = useUserType();

    const toggleUserType = () => {
        setUserType(isWholesale ? 'retail' : 'wholesale');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const navLinkClasses = ({ isActive }) =>
        isActive
            ? "text-sky-500 font-bold transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-sky-500 after:rounded-full"
            : "text-gray-600 hover:text-sky-500 font-medium transition-colors hover:bg-gray-50 px-3 py-1 rounded-lg";

    const mobileNavLinkClasses = ({ isActive }) =>
        isActive
            ? "text-lg font-bold text-sky-500 bg-sky-500/5 px-4 py-3 rounded-xl border-l-4 border-ocean flex items-center"
            : "text-lg font-medium text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl flex items-center";


    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20 px-4 sm:px-6 lg:px-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
                        <div className="rounded-xl shadow-lg shadow-sky-500/20 overflow-hidden transform group-hover:rotate-12 transition-transform duration-300">
                            <img src="/logo.png" alt="Seaman Fresh Logo" className="w-10 h-10 object-cover" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                            Seaman<span className="text-sky-500">Fresh</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex items-center space-x-2 bg-gray-50/50 p-1 rounded-full border border-gray-100">
                            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
                            <NavLink to="/products" className={navLinkClasses}>Products</NavLink>
                            <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
                        </div>


                        {/* User Type Switcher */}
                        {userType && (
                            <button
                                onClick={toggleUserType}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-sm border ${isWholesale
                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                    }`}
                                title="Click to switch between Wholesale and Retail"
                            >
                                {isWholesale ? '🏢 Wholesale' : '👤 Retail'}
                            </button>
                        )}

                        {/* Global Switchers */}
                        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                            {/* Language */}
                            <div className="flex items-center gap-1">
                                <Globe size={16} className="text-gray-400" />
                                <select
                                    className="text-sm bg-transparent font-medium text-gray-700 outline-none cursor-pointer hover:text-sky-500 transition-colors"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="en">EN</option>
                                    <option value="es">ES</option>
                                    <option value="fr">FR</option>
                                </select>
                            </div>

                            {/* Currency */}
                            <div className="flex items-center gap-1">
                                <DollarSign size={16} className="text-gray-400" />
                                <select
                                    className="text-sm bg-transparent font-medium text-gray-700 outline-none cursor-pointer hover:text-sky-500 transition-colors"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="INR">INR</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pl-2">
                            <Link to="/cart" className="relative p-2.5 text-gray-600 hover:text-sky-500 hover:bg-sky-500/5 rounded-full transition-all">
                                <ShoppingCart size={22} />
                                {cart.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm transform scale-100 animate-pulse">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    {user.role === 'admin' ? (
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowAdminMenu(!showAdminMenu)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:border-sky-500 hover:text-sky-500 hover:bg-sky-500/5 transition-all"
                                            >
                                                <User size={16} />
                                                Admin
                                                <ChevronDown size={14} className={`transition-transform duration-300 ${showAdminMenu ? 'rotate-180' : ''}`} />
                                            </button>
                                            <AnimatePresence>
                                                {showAdminMenu && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                                                    >
                                                        <div className="px-4 py-2 border-b border-gray-50">
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Management</p>
                                                        </div>
                                                        <Link
                                                            to="/admin"
                                                            onClick={() => setShowAdminMenu(false)}
                                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-sky-500/5 hover:text-sky-500 transition-colors"
                                                        >
                                                            <User size={16} />
                                                            Dashboard
                                                        </Link>
                                                        <Link
                                                            to="/admin/settings"
                                                            onClick={() => setShowAdminMenu(false)}
                                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-sky-500/5 hover:text-sky-500 transition-colors"
                                                        >
                                                            <Settings size={16} />
                                                            Settings
                                                        </Link>
                                                        <Link
                                                            to="/admin/messages"
                                                            onClick={() => setShowAdminMenu(false)}
                                                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-sky-500/5 hover:text-sky-500 transition-colors"
                                                        >
                                                            <MessageSquare size={16} />
                                                            Messages
                                                        </Link>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link to='/dashboard'
                                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:border-sky-500 hover:text-sky-500 hover:bg-sky-500/5 transition-all">
                                            <User size={16} />
                                            Account
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Logout">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="px-6 py-2.5 bg-slate-900 text-white hover:bg-sky-500 text-sm font-bold rounded-full shadow-lg shadow-slate-900/20 hover:shadow-sky-500/30 transition-all transform hover:-translate-y-0.5">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-white border-t border-gray-100"
                    >
                        <div className="px-4 py-6 flex flex-col gap-3">
                            <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkClasses}>Home</NavLink>
                            <NavLink to="/products" onClick={() => setIsOpen(false)} className={mobileNavLinkClasses}>Products</NavLink>
                            <NavLink to="/contact" onClick={() => setIsOpen(false)} className={mobileNavLinkClasses}>Contact</NavLink>

                            <div className="h-px bg-gray-100 my-2"></div>

                            {/* Mobile Global Settings */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Language</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded-md text-sm font-bold transition-colors ${language === 'en' ? 'bg-white shadow-sm text-sky-500' : 'text-gray-500'}`}>EN</button>
                                        <button onClick={() => setLanguage('es')} className={`px-2 py-1 rounded-md text-sm font-bold transition-colors ${language === 'es' ? 'bg-white shadow-sm text-sky-500' : 'text-gray-500'}`}>ES</button>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Currency</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setCurrency('USD')} className={`px-2 py-1 rounded-md text-sm font-bold transition-colors ${currency === 'USD' ? 'bg-white shadow-sm text-sky-500' : 'text-gray-500'}`}>USD</button>
                                        <button onClick={() => setCurrency('EUR')} className={`px-2 py-1 rounded-md text-sm font-bold transition-colors ${currency === 'EUR' ? 'bg-white shadow-sm text-sky-500' : 'text-gray-500'}`}>EUR</button>
                                    </div>
                                </div>
                            </div>

                            {user ? (
                                <button onClick={handleLogout} className="w-full py-4 text-red-500 font-bold bg-red-50 hover:bg-red-100 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2">
                                    <LogOut size={18} /> Log Out
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-4 bg-slate-900 text-white font-bold text-center rounded-xl mt-4 shadow-lg shadow-slate-900/20 hover:bg-sky-500 transition-colors">Sign In</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
