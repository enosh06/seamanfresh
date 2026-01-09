import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X, Globe, DollarSign, User, Settings, ChevronDown, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useUserType } from '../context/UserTypeContext';

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
            ? "text-ocean font-bold transition-colors"
            : "text-gray-600 hover:text-ocean font-medium transition-colors";

    const mobileNavLinkClasses = ({ isActive }) =>
        isActive
            ? "text-lg font-bold text-ocean"
            : "text-lg font-medium text-gray-800";


    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <div className=" rounded-xl shadow-lg shadow-ocean/30 overflow-hidden">
                            <img src="/logo.png" alt="Seaman Fresh Logo" className="w-12 h-12 object-cover" />
                        </div>
                        <span className="text-2xl font-display font-bold text-midnight tracking-tight">
                            Seaman<span className="text-ocean">Fresh</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" className={navLinkClasses}>Home</NavLink>
                        <NavLink to="/products" className={navLinkClasses}>Products</NavLink>
                        <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>


                        {/* User Type Switcher */}
                        {userType && (
                            <button
                                onClick={toggleUserType}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 cursor-pointer ${isWholesale ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
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
                                    className="text-sm bg-transparent font-medium text-gray-700 outline-none cursor-pointer"
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
                                    className="text-sm bg-transparent font-medium text-gray-700 outline-none cursor-pointer"
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
                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-ocean transition-colors">
                                <ShoppingCart size={22} />
                                {cart.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-ocean text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
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
                                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:border-ocean hover:text-ocean transition-all"
                                            >
                                                <User size={16} />
                                                Admin
                                                <ChevronDown size={14} className={`transition-transform ${showAdminMenu ? 'rotate-180' : ''}`} />
                                            </button>
                                            {showAdminMenu && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setShowAdminMenu(false)}
                                                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-ocean/5 hover:text-ocean transition-colors"
                                                    >
                                                        <User size={16} />
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        to="/admin/settings"
                                                        onClick={() => setShowAdminMenu(false)}
                                                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-ocean/5 hover:text-ocean transition-colors"
                                                    >
                                                        <Settings size={16} />
                                                        Settings
                                                    </Link>
                                                    <Link
                                                        to="/admin/messages"
                                                        onClick={() => setShowAdminMenu(false)}
                                                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-ocean/5 hover:text-ocean transition-colors"
                                                    >
                                                        <MessageSquare size={16} />
                                                        Messages
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link to='/dashboard'
                                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:border-ocean hover:text-ocean transition-all">
                                            <User size={16} />
                                            Account
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="px-6 py-2.5 bg-ocean hover:bg-ocean-dark text-white rounded-full font-semibold shadow-lg shadow-ocean/20 transition-all transform hover:-translate-y-0.5">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full px-4 py-6 shadow-xl flex flex-col gap-4 animate-fade-in-down">
                    <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkClasses}>Home</NavLink>
                    <NavLink to="/products" onClick={() => setIsOpen(false)} className={mobileNavLinkClasses}>Products</NavLink>
                    <NavLink to="/contact" onClick={() => setIsOpen(false)} className={mobileNavLinkClasses}>Contact</NavLink>

                    <div className="h-px bg-gray-100 my-2"></div>

                    {/* Mobile Global Settings */}
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500 text-sm">Language</span>
                        <div className="flex gap-2 text-sm font-bold text-ocean">
                            <button onClick={() => setLanguage('en')} className={language === 'en' ? 'underline' : ''}>EN</button>
                            <button onClick={() => setLanguage('es')} className={language === 'es' ? 'underline' : ''}>ES</button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500 text-sm">Currency</span>
                        <div className="flex gap-2 text-sm font-bold text-ocean">
                            <button onClick={() => setCurrency('USD')} className={currency === 'USD' ? 'underline' : ''}>$</button>
                            <button onClick={() => setCurrency('EUR')} className={currency === 'EUR' ? 'underline' : ''}>€</button>
                        </div>
                    </div>

                    {user ? (
                        <button onClick={handleLogout} className="w-full py-3 text-red-500 font-bold bg-red-50 rounded-lg mt-4">Log Out</button>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-3 bg-ocean text-white font-bold text-center rounded-lg mt-4 shadow-lg shadow-ocean/20">Sign In</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
