import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-sky-900 text-white py-16 mt-20 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Brand Column */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img src="/logo.png" alt="Seaman Fresh Logo" className="w-10 h-10 object-cover" />
                        </div>
                        <span className="text-2xl font-bold font-display tracking-tight">
                            SEAMAN <span className="text-sky-400">FRESH</span>
                        </span>
                    </div>
                    <p className="text-white/80 leading-relaxed mb-6">
                        Providing the freshest seafood directly from the ocean to your plate.
                        Experience premium quality and global delivery speed.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-bold mb-6 font-display">Quick Links</h4>
                    <ul className="space-y-3">
                        <li>
                            <Link to="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/products" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span> Fresh Fish
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" className="text-white/70 hover:text-white transition-colors flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span> Your Cart
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-bold mb-6 font-display">Contact Info</h4>
                    <div className="space-y-4">
                        <p className="flex items-center gap-3 text-white/80">
                            <Mail size={18} className="text-sky-400" />
                            seamanfreshfish.inc@gmail.com
                        </p>
                        <p className="flex items-center gap-3 text-white/80">
                            <Phone size={18} className="text-sky-400" />
                            +1 (709) 986-8050
                        </p>
                        <p className="flex items-start gap-3 text-white/80">
                            <MapPin size={18} className="text-sky-400 mt-1" />
                            1, St. John's, NL, Canada
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
                <p>&copy; {new Date().getFullYear()} SEAMAN FRESH INC. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
