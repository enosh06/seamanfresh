import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useUserType } from '../context/UserTypeContext';
import { usePrice } from '../hooks/usePrice';
import API_URL from '../config';
import { ArrowRight, Star, Globe, ShieldCheck, Truck, Sparkles, ShoppingCart, Users, Building2, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [showUserTypeModal, setShowUserTypeModal] = useState(false);
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const { userType, setUserType, isWholesale } = useUserType();
    const { getFinalPrice } = usePrice();

    useEffect(() => {
        document.title = "SeamanFresh | Premium Global Seafood Delivery";
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data.results || res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();

        if (!userType) {
            const timer = setTimeout(() => setShowUserTypeModal(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [userType]);

    const handleUserTypeSelect = (type) => {
        setUserType(type);
        setShowUserTypeModal(false);
    };

    const recommendedProducts = useMemo(() => products.slice(0, 3), [products]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    return (
        <div className="font-sans text-slate-900 bg-gray-50 min-h-screen overflow-x-hidden">
            {/* User Type Selection Modal */}
            <AnimatePresence>
                {showUserTypeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[40px] max-w-2xl w-full p-10 relative shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 to-blue-600"></div>

                            <button
                                onClick={() => setShowUserTypeModal(false)}
                                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-slate-900 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={24} />
                            </button>

                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-bold font-display text-slate-900 mb-4">
                                    Tailored <span className="text-sky-500">Experience</span>
                                </h2>
                                <p className="text-gray-500 text-lg">Select your account type to access specialized pricing</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <motion.button
                                    whileHover={{ y: -5 }}
                                    onClick={() => handleUserTypeSelect('retail')}
                                    className="group p-8 border border-gray-100 rounded-[32px] hover:border-sky-500 hover:bg-sky-50 transition-all text-left shadow-sm hover:shadow-xl hover:shadow-sky-500/5"
                                >
                                    <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-6 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                                        <Users size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Retail</h3>
                                    <p className="text-gray-500 mb-6 leading-relaxed">Premium fresh catches for your home kitchen</p>
                                    <div className="inline-flex items-center gap-2 text-sky-600 font-bold group-hover:gap-4 transition-all uppercase text-xs tracking-wider">
                                        Continue <ArrowRight size={16} />
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ y: -5 }}
                                    onClick={() => handleUserTypeSelect('wholesale')}
                                    className="group p-8 border border-sky-100 bg-sky-50/50 rounded-[32px] hover:border-sky-500 hover:bg-sky-500 transition-all text-left relative overflow-hidden shadow-sm hover:shadow-xl"
                                >
                                    <div className="absolute top-6 right-6 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                                        Best Value
                                    </div>
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 text-sky-500 group-hover:bg-white/20 group-hover:text-white transition-colors shadow-sm">
                                        <Building2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-white mb-2">Wholesale</h3>
                                    <p className="text-gray-500 group-hover:text-sky-100 mb-6 leading-relaxed">Bulk supplies for restaurants and retail partners</p>
                                    <div className="inline-flex items-center gap-2 text-sky-600 group-hover:text-white font-bold group-hover:gap-4 transition-all uppercase text-xs tracking-wider">
                                        Explore Rates <ArrowRight size={16} />
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky-500/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]"></div>
                    <img
                        src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80"
                        alt="Seafood Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-white/10 border border-white/20 text-sky-400 font-bold text-xs mb-8 backdrop-blur-xl tracking-wider uppercase">
                            <Sparkles size={14} className="animate-pulse" />
                            {isWholesale ? 'Premium Wholesale Partner' : 'Sustainable Seafood Global Leader'}
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-[100px] font-display font-black text-white leading-[0.9] mb-8 tracking-tighter">
                            {t('welcome').split(' ').map((word, i) => (
                                <span key={i} className={i === 1 ? "text-sky-500 block" : "block"}>{word}</span>
                            ))}
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-300 mb-12 font-medium leading-relaxed max-w-2xl">
                            From the pristine waters of the Pacific to your table. We utilize AI-optimized logistics to ensure
                            <span className="text-white border-b-2 border-sky-500 ml-1"> 24-hour global delivery</span>.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6">
                            <Link to="/products" className="group flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-400 text-slate-900 text-lg px-10 py-5 rounded-3xl font-black transition-all shadow-2xl shadow-sky-500/20 hover:shadow-sky-500/40 transform hover:-translate-y-1">
                                {t('order')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/about" className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-3xl font-bold backdrop-blur-xl transition-all">
                                {t('explore')}
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="absolute bottom-12 right-12 hidden xl:flex gap-8"
                >
                    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl">
                        <div className="flex gap-16 items-center">
                            <div className="text-center">
                                <div className="text-5xl font-black text-white mb-2 font-display tracking-tighter">50+</div>
                                <div className="text-[10px] text-sky-500 uppercase tracking-[0.2em] font-black">Countries</div>
                            </div>
                            <div className="w-px h-16 bg-white/10"></div>
                            <div className="text-center">
                                <div className="text-5xl font-black text-white mb-2 font-display tracking-tighter">24h</div>
                                <div className="text-[10px] text-sky-500 uppercase tracking-[0.2em] font-black">Ship Time</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Why Choose Us */}
            <section className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-1/2">
                            <span className="text-sky-500 font-black tracking-[0.3em] text-xs uppercase mb-4 block">The SeamanFresh Standard</span>
                            <h2 className="text-5xl md:text-6xl font-display font-black text-slate-900 mb-8 tracking-tighter leading-none">
                                Raising the bar for <span className="text-sky-500">Freshness.</span>
                            </h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-12">
                                We've revolutionized seafood logistics by bridging the gap between artisanal fisheries and global kitchens, maintaining the cold chain unbroken across oceans.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 items-start">
                                    <div className="bg-sky-500 text-white p-2 rounded-xl shadow-lg shadow-sky-500/20">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Cold-Chain Only</h4>
                                        <p className="text-xs text-slate-500">Temperature monitored 24/7</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 items-start">
                                    <div className="bg-sky-500 text-white p-2 rounded-xl shadow-lg shadow-sky-500/20">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Source Verified</h4>
                                        <p className="text-xs text-slate-500">Full traceability for every catch</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 rounded-[60px] overflow-hidden shadow-3xl">
                                <img
                                    src="https://images.unsplash.com/photo-1559737558-2f5a35f4524b?auto=format&fit=crop&q=80"
                                    alt="Fresh Fish"
                                    className="w-full h-[600px] object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-sky-500 rounded-[50px] -z-0"></div>
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-slate-900 rounded-[40px] -z-0"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommendations */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <span className="text-sky-500 font-black tracking-[0.3em] text-xs uppercase mb-3 block">Market View</span>
                            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight">{t('rec')}</h2>
                        </div>
                        <Link to="/products" className="hidden sm:flex items-center gap-3 text-slate-900 font-bold hover:text-sky-500 transition-colors bg-white px-8 py-4 rounded-3xl shadow-sm">
                            Full Catalog <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {recommendedProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group bg-white rounded-[48px] p-6 shadow-sm hover:shadow-2xl hover:shadow-sky-500/5 transition-all duration-500 border border-slate-100"
                            >
                                <div className="h-[300px] rounded-[40px] overflow-hidden mb-8 relative">
                                    <div className="absolute top-6 left-6 z-20">
                                        <div className="bg-white/90 backdrop-blur-md text-sky-600 text-[10px] font-black px-4 py-2 rounded-full shadow-sm tracking-widest uppercase">
                                            {product.category || 'Premium'}
                                        </div>
                                    </div>
                                    <img
                                        src={product.image ? (product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`) : 'https://placehold.co/400x300?text=SeamanFresh'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="absolute bottom-6 right-6 z-20 bg-slate-900 text-white w-16 h-16 rounded-[28px] flex items-center justify-center shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-sky-500"
                                    >
                                        <ShoppingCart size={24} />
                                    </button>
                                </div>

                                <div className="px-2">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-black text-2xl text-slate-900">{product.name}</h3>
                                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-500 px-3 py-1.5 rounded-2xl font-black text-xs">
                                            <Star size={14} fill="currentColor" /> 4.9
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed h-10">Our finest {product.name}, hand-selected and flash-frozen within hours of harvest.</p>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div>
                                            <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                                {getFinalPrice(product.price)}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">/ KG</span>
                                        </div>
                                        <Link to={`/product/${product.id}`} className="text-sky-500 font-black text-xs uppercase tracking-widest hover:underline">
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Infrastructure Section */}
            <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10">
                    <img src="https://www.transparenttextures.com/patterns/asfalt-dark.png" alt="pattern" className="w-full h-full object-cover" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col items-center text-center mb-24">
                        <span className="text-sky-500 font-bold tracking-[0.4em] text-xs uppercase mb-6 block">Supply Chain AI</span>
                        <h2 className="text-5xl md:text-7xl font-display font-black mb-8 tracking-tighter leading-none">
                            Freshness at the <br />Speed of <span className="text-sky-500 underline decoration-sky-500/30 underline-offset-8">Light.</span>
                        </h2>
                        <p className="max-w-3xl text-slate-400 text-xl font-medium leading-relaxed">
                            Our proprietary AI logistics engine predicts ocean patterns and flight schedules to carve the fastest path from fisherman to table.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 border border-white/10 p-12 rounded-[50px] backdrop-blur-3xl hover:bg-white/10 transition-all group">
                            <div className="w-16 h-16 bg-sky-500 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-sky-500/20 group-hover:scale-110 transition-transform">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-3xl font-black mb-4 tracking-tight">120+ Cities</h3>
                            <p className="text-slate-400 leading-relaxed font-medium">Fully operational distribution hubs in 6 continents ensuring local delivery speed on a global scale.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-12 rounded-[50px] backdrop-blur-3xl hover:bg-white/10 transition-all group">
                            <div className="w-16 h-16 bg-sky-500 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-sky-500/20 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-3xl font-black mb-4 tracking-tight">100% Secure</h3>
                            <p className="text-slate-400 leading-relaxed font-medium">Smart packaging with active sensors monitors temperature and humidity every second of the journey.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-12 rounded-[50px] backdrop-blur-3xl hover:bg-white/10 transition-all group">
                            <div className="w-16 h-16 bg-sky-500 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-sky-500/20 group-hover:scale-110 transition-transform">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-3xl font-black mb-4 tracking-tight">Carbon Neutral</h3>
                            <p className="text-slate-400 leading-relaxed font-medium">We offset 100% of carbon emissions from our shipping through marine conservation projects.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
