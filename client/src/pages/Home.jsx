import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useUserType } from '../context/UserTypeContext';
import { ArrowRight, Star, Globe, ShieldCheck, Truck, Sparkles, ShoppingCart, Users, Building2, Quote, X, CheckCircle, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [showUserTypeModal, setShowUserTypeModal] = useState(false);
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();
    const { addToCart } = useCart();
    const { userType, setUserType, isWholesale } = useUserType();

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/products`);
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();

        if (!userType) {
            setTimeout(() => setShowUserTypeModal(true), 1500);
        }
    }, [userType]);

    const handleUserTypeSelect = (type) => {
        setUserType(type);
        setShowUserTypeModal(false);
    };

    const recommendedProducts = products.slice(0, 3);
    const featuredProducts = products.slice(0, 8);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl"
                        >
                            <button
                                onClick={() => setShowUserTypeModal(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-3xl font-bold font-display text-slate-900 mb-4 text-center">
                                Welcome to <span className="text-sky-500">SeamanFresh</span>
                            </h2>
                            <p className="text-gray-600 text-center mb-8">Choose your shopping preference to get the best prices</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleUserTypeSelect('retail')}
                                    className="group p-8 border-2 border-gray-100 rounded-2xl hover:border-sky-500 hover:bg-sky-500/5 transition-all text-left"
                                >
                                    <Users className="text-sky-500 mb-4" size={48} />
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Retail</h3>
                                    <p className="text-gray-600 mb-4">Perfect for individuals and small families</p>
                                    <div className="bg-gray-50 px-4 py-2 rounded-lg inline-block">
                                        <span className="text-sm text-gray-500 font-medium">Standard Pricing</span>
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleUserTypeSelect('wholesale')}
                                    className="group p-8 border-2 border-sky-500 bg-sky-500/5 rounded-2xl hover:bg-sky-500/10 transition-all text-left relative overflow-hidden"
                                >
                                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-green-500/30">
                                        20% OFF
                                    </div>
                                    <Building2 className="text-sky-500 mb-4" size={48} />
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Wholesale</h3>
                                    <p className="text-gray-600 mb-4">For restaurants, hotels & bulk buyers</p>
                                    <div className="bg-white px-4 py-2 rounded-lg border border-sky-500 inline-block">
                                        <span className="text-sm font-bold text-sky-500">20% Discount</span>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-[#003f63] to-sky-500">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-3xl"
                    >
                        <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/10 border border-white/20 text-sky-400 font-semibold text-sm mb-6 backdrop-blur-md">
                            {isWholesale ? <Building2 size={14} /> : <Globe size={14} />}
                            {isWholesale ? 'Wholesale Pricing Active' : 'Global Export Certified'}
                        </motion.span>
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight mb-6">
                            {t('welcome')}
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-xl text-gray-200 mb-10 font-light leading-relaxed max-w-2xl bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                            From the pristine waters of the Pacific to your doorstep. We utilize AI-driven logistics to ensure
                            <span className="text-sky-400 font-semibold"> 24-hour delivery</span> anywhere in the world.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                            <Link to="/products" className="btn btn-primary text-lg px-8 py-4 rounded-full">
                                {t('order')}
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/about" className="btn px-8 py-4 bg-white/10 text-white hover:bg-white/20 hover:backdrop-blur-lg border border-white/20 rounded-full font-semibold">
                                {t('explore')}
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="absolute bottom-10 right-4 md:right-10 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 hidden lg:block shadow-2xl"
                >
                    <div className="flex gap-12">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-1">50+</div>
                            <div className="text-xs text-sky-400 uppercase tracking-widest font-bold">Countries</div>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-1">24h</div>
                            <div className="text-xs text-sky-400 uppercase tracking-widest font-bold">Delivery</div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        <StatCard number="10K+" label="Happy Customers" delay={0.1} />
                        <StatCard number="50+" label="Countries Served" delay={0.2} />
                        <StatCard number="24/7" label="Customer Support" delay={0.3} />
                        <StatCard number="100%" label="Fresh Guarantee" delay={0.4} />
                    </motion.div>
                </div>
            </section>

            {/* AI Recommendations */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-500">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t('rec')}</h2>
                                <p className="text-gray-500 mt-1">Curated specifically for your taste</p>
                            </div>
                        </div>
                        <Link to="/products" className="text-sky-500 font-bold hover:text-sky-700 flex items-center gap-2 group">
                            View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recommendedProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative bg-white rounded-3xl p-4 transition-all hover:shadow-xl hover:shadow-ocean/10 border border-gray-100"
                            >
                                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-sky-500 shadow-lg z-10 border border-sky-500/10">
                                    {index === 0 ? 'Best Match 98%' : 'Trending'}
                                </div>
                                <div className="h-64 rounded-2xl overflow-hidden mb-5 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <img
                                        src={product.image_url ? `${API_URL}${product.image_url}` : 'https://placehold.co/400x300?text=Seafood'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="absolute bottom-4 right-4 z-20 bg-white text-sky-500 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg transform translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-sky-500 hover:text-white"
                                    >
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                                <h3 className="font-bold text-xl mb-2 text-slate-900">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Premium quality {product.category || 'seafood'} sourced directly.</p>
                                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                    <span className="text-2xl font-bold text-slate-900">{formatPrice(product.price)}</span>
                                    <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                                        <Star size={14} fill="currentColor" /> 4.9
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute -left-20 top-20 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-sky-500 font-bold tracking-widest text-sm uppercase mb-3 block">Our Promise</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                            Why Choose <span className="text-sky-500">SeamanFresh</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            We're committed to delivering the freshest seafood with unmatched quality and service
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<ShieldCheck className="w-12 h-12 text-sky-500" />}
                            title="Quality Guaranteed"
                            description="100% fresh guarantee with rigorous quality checks at every step"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Truck className="w-12 h-12 text-sky-500" />}
                            title="Fast Delivery"
                            description="24-hour cold-chain delivery to preserve freshness worldwide"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Award className="w-12 h-12 text-sky-500" />}
                            title="Certified Suppliers"
                            description="Partnered with certified fisheries following sustainable practices"
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* Global Reach */}
            <section className="py-32 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-contain pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-sky-400 font-bold tracking-widest uppercase text-sm mb-4 block">International Logistics</span>
                            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
                                Serving <span className="text-sky-500">120+ Cities</span> Worldwide
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Our verified supply chain spans across continents ensuring that you get the same premium quality whether you are in Tokyo, New York, or London.
                            </p>
                            <div className="flex gap-4">
                                <button className="btn btn-primary">View Coverage Map</button>
                                <button className="btn btn-outline border-white text-white hover:bg-white hover:text-slate-900">Contact Sales</button>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 gap-6">
                            <FeatureCard
                                icon={<Globe className="w-8 h-8 text-sky-500" />}
                                title="Global Tracking"
                                desc="Real-time satellite tracking for every shipment from port to plate."
                                dark
                            />
                            <FeatureCard
                                icon={<Truck className="w-8 h-8 text-sky-500" />}
                                title="Express Shipping"
                                desc="Priority cold-chain logistics ensuring 24-hour delivery worldwide."
                                dark
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                            What Our Customers Say
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Sarah Johnson"
                            role="Restaurant Owner"
                            text="The quality is outstanding! My customers love the fresh seafood, and the wholesale pricing helps my business thrive."
                            rating={5}
                            delay={0.1}
                        />
                        <TestimonialCard
                            name="Michael Chen"
                            role="Home Chef"
                            text="Fast delivery and always fresh. I've been ordering for months and never disappointed. Highly recommend!"
                            rating={5}
                            delay={0.2}
                        />
                        <TestimonialCard
                            name="Emma Williams"
                            role="Hotel Manager"
                            text="Reliable supplier with consistent quality. The 24-hour delivery is a game-changer for our kitchen operations."
                            rating={5}
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

// Sub-components with animations
const StatCard = ({ number, label, delay }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } }
        }}
        className="text-center group cursor-default"
    >
        <div className="text-4xl md:text-5xl font-bold text-sky-500 mb-2 group-hover:scale-110 transition-transform duration-300">{number}</div>
        <div className="text-gray-600 font-medium tracking-wide uppercase text-sm">{label}</div>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc, description, delay, dark }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className={`${dark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-100 hover:shadow-xl hover:shadow-ocean/5'} border p-8 rounded-3xl transition-all duration-300`}
    >
        <div className="bg-sky-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-sky-500">
            {icon}
        </div>
        <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className={`${dark ? 'text-gray-400' : 'text-gray-500'} leading-relaxed`}>{desc || description}</p>
    </motion.div>
);

const TestimonialCard = ({ name, role, text, rating, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative group"
    >
        <Quote className="text-sky-500/10 absolute top-8 right-8 group-hover:text-sky-500/20 transition-colors" size={60} />
        <div className="flex items-center gap-1 mb-6">
            {[...Array(rating)].map((_, i) => (
                <Star key={i} size={18} fill="#FFB703" className="text-[#FFB703]" />
            ))}
        </div>
        <p className="text-gray-700 mb-8 leading-relaxed text-lg italic">"{text}"</p>
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400">
                {name.charAt(0)}
            </div>
            <div>
                <div className="font-bold text-slate-900">{name}</div>
                <div className="text-sm text-gray-500">{role}</div>
            </div>
        </div>
    </motion.div>
);

export default Home;
