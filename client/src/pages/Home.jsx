import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useUserType } from '../context/UserTypeContext';
import { ArrowRight, Star, Globe, ShieldCheck, Truck, Sparkles, ShoppingCart, Users, Building2, CheckCircle, Award, Clock, Package, Quote, X } from 'lucide-react';

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

        // Show user type modal if not set
        if (!userType) {
            setTimeout(() => setShowUserTypeModal(true), 1000);
        }
    }, [userType]);

    const handleUserTypeSelect = (type) => {
        setUserType(type);
        setShowUserTypeModal(false);
    };

    const recommendedProducts = products.slice(0, 3);
    const featuredProducts = products.slice(0, 8);

    return (
        <div className="font-sans text-midnight bg-surface min-h-screen">

            {/* User Type Selection Modal */}
            {showUserTypeModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
                        <button
                            onClick={() => setShowUserTypeModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-bold font-display text-midnight mb-4 text-center">
                            Welcome to <span className="text-ocean">SeamanFresh</span>
                        </h2>
                        <p className="text-gray-600 text-center mb-8">Choose your shopping preference to get the best prices</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={() => handleUserTypeSelect('retail')}
                                className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-ocean hover:bg-ocean/5 transition-all"
                            >
                                <Users className="text-ocean mx-auto mb-4" size={48} />
                                <h3 className="text-2xl font-bold text-midnight mb-2">Retail</h3>
                                <p className="text-gray-600 mb-4">Perfect for individuals and small families</p>
                                <div className="bg-surface px-4 py-2 rounded-lg">
                                    <span className="text-sm text-gray-500">Standard Pricing</span>
                                </div>
                            </button>

                            <button
                                onClick={() => handleUserTypeSelect('wholesale')}
                                className="group p-8 border-2 border-ocean bg-ocean/5 rounded-2xl hover:bg-ocean/10 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    20% OFF
                                </div>
                                <Building2 className="text-ocean mx-auto mb-4" size={48} />
                                <h3 className="text-2xl font-bold text-midnight mb-2">Wholesale</h3>
                                <p className="text-gray-600 mb-4">For restaurants, hotels & bulk buyers</p>
                                <div className="bg-white px-4 py-2 rounded-lg border border-ocean">
                                    <span className="text-sm font-bold text-ocean">20% Discount</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-midnight via-[#003f63] to-ocean">
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="max-w-3xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-ocean/20 border border-ocean/40 text-ocean-light font-semibold text-sm mb-6 animate-pulse">
                            {isWholesale ? '🏢 Wholesale Pricing Active' : '🌍 Global Export Certified'}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-6">
                            {t('welcome')}
                        </h1>
                        <p className="text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-2xl">
                            From the pristine waters of the Pacific to your doorstep. We utilize AI-driven logistics to ensure
                            <span className="text-ocean-light font-semibold"> 24-hour delivery</span> anywhere in the world.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/products" className="group px-8 py-4 bg-ocean hover:bg-white hover:text-ocean text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 text-lg shadow-xl shadow-ocean/20">
                                {t('order')}
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/about" className="px-8 py-4 border border-gray-600 text-gray-300 hover:border-white hover:text-white font-semibold rounded-full transition-all text-center">
                                {t('explore')}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 right-4 md:right-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hidden md:block">
                    <div className="flex gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">50+</div>
                            <div className="text-xs text-ocean-light uppercase tracking-wider">Countries</div>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">24h</div>
                            <div className="text-xs text-ocean-light uppercase tracking-wider">Delivery</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatCard number="10K+" label="Happy Customers" />
                        <StatCard number="50+" label="Countries Served" />
                        <StatCard number="24/7" label="Customer Support" />
                        <StatCard number="100%" label="Fresh Guarantee" />
                    </div>
                </div>
            </section>

            {/* AI Recommendations */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-10">
                        <Sparkles className="text-ocean w-6 h-6" />
                        <h2 className="text-2xl font-bold text-midnight tracking-tight">{t('rec')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recommendedProducts.map((product, index) => (
                            <div key={product.id} className="group relative bg-surface rounded-2xl p-4 transition-all hover:bg-ocean/5 border border-transparent hover:border-ocean/20">
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-ocean shadow-sm z-10">
                                    {index === 0 ? 'Best Match 98%' : 'Trending'}
                                </div>
                                <div className="h-48 rounded-xl overflow-hidden mb-4">
                                    <img
                                        src={product.image_url ? `${API_URL}${product.image_url}` : 'https://placehold.co/400x300?text=Seafood'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-ocean transition-colors">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Premium quality {product.category || 'seafood'} sourced directly.</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-midnight">{formatPrice(product.price)}</span>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-ocean hover:bg-ocean hover:text-white transition-all shadow-sm"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-midnight mb-4">
                            Why Choose <span className="text-ocean">SeamanFresh</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We're committed to delivering the freshest seafood with unmatched quality and service
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<ShieldCheck className="w-12 h-12 text-ocean" />}
                            title="Quality Guaranteed"
                            description="100% fresh guarantee with rigorous quality checks at every step"
                        />
                        <FeatureCard
                            icon={<Truck className="w-12 h-12 text-ocean" />}
                            title="Fast Delivery"
                            description="24-hour cold-chain delivery to preserve freshness worldwide"
                        />
                        <FeatureCard
                            icon={<Award className="w-12 h-12 text-ocean" />}
                            title="Certified Suppliers"
                            description="Partnered with certified fisheries following sustainable practices"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-midnight mb-4">
                            How It Works
                        </h2>
                        <p className="text-gray-600">Simple steps to get fresh seafood delivered to your door</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <ProcessStep number="1" title="Browse" description="Explore our wide selection of fresh seafood" />
                        <ProcessStep number="2" title="Order" description="Add items to cart and checkout securely" />
                        <ProcessStep number="3" title="Pack" description="We carefully pack with cold-chain technology" />
                        <ProcessStep number="4" title="Deliver" description="Receive fresh seafood at your doorstep" />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-ocean/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-midnight mb-4">
                            What Our Customers Say
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Sarah Johnson"
                            role="Restaurant Owner"
                            text="The quality is outstanding! My customers love the fresh seafood, and the wholesale pricing helps my business thrive."
                            rating={5}
                        />
                        <TestimonialCard
                            name="Michael Chen"
                            role="Home Chef"
                            text="Fast delivery and always fresh. I've been ordering for months and never disappointed. Highly recommend!"
                            rating={5}
                        />
                        <TestimonialCard
                            name="Emma Williams"
                            role="Hotel Manager"
                            text="Reliable supplier with consistent quality. The 24-hour delivery is a game-changer for our kitchen operations."
                            rating={5}
                        />
                    </div>
                </div>
            </section>

            {/* Global Reach */}
            <section className="py-24 bg-midnight relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-contain pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="text-ocean-light font-bold tracking-widest uppercase text-sm mb-4 block">International Logistics</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-12">
                        Serving <span className="text-ocean">120+ Cities</span> Worldwide
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <FeatureCard
                            icon={<Globe className="w-8 h-8 text-ocean" />}
                            title="Global Tracking"
                            desc="Real-time satellite tracking for every shipment from port to plate."
                        />
                        <FeatureCard
                            icon={<Truck className="w-8 h-8 text-ocean" />}
                            title="Express Shipping"
                            desc="Priority cold-chain logistics ensuring 24-hour delivery worldwide."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-8 h-8 text-ocean" />}
                            title="Quality Assurance"
                            desc="Temperature-controlled packaging with freshness guaranteed."
                        />
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-display font-bold text-midnight mb-12 text-center">Global Favorites</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ocean/10 transition-all duration-300">
                                <div className="h-64 overflow-hidden relative group">
                                    <img
                                        src={product.image_url ? `${API_URL}${product.image_url}` : 'https://placehold.co/400x300?text=Fish'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Link to={`/product/${product.id}`} className="bg-white text-midnight font-bold px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-midnight">{product.name}</h3>
                                        <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                                            <Star size={12} fill="currentColor" /> 4.9
                                        </div>
                                    </div>
                                    <p className="text-ocean font-bold text-xl mb-4">{formatPrice(product.price)} <span className="text-sm text-gray-400 font-normal">/ kg</span></p>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full py-3 border border-ocean text-ocean font-bold rounded-xl hover:bg-ocean hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

// Sub-components
const StatCard = ({ number, label }) => (
    <div className="text-center">
        <div className="text-4xl font-bold text-ocean mb-2">{number}</div>
        <div className="text-gray-600 font-medium">{label}</div>
    </div>
);

const FeatureCard = ({ icon, title, desc, description }) => (
    <div className="bg-white/5 backdrop-blur border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
        <div className="bg-ocean/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc || description}</p>
    </div>
);

const ProcessStep = ({ number, title, description }) => (
    <div className="text-center">
        <div className="w-16 h-16 bg-ocean text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            {number}
        </div>
        <h3 className="text-lg font-bold text-midnight mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

const TestimonialCard = ({ name, role, text, rating }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
        <Quote className="text-ocean/20 mb-4" size={40} />
        <p className="text-gray-700 mb-6 leading-relaxed">"{text}"</p>
        <div className="flex items-center gap-1 mb-4">
            {[...Array(rating)].map((_, i) => (
                <Star key={i} size={16} fill="#FFA500" className="text-yellow-400" />
            ))}
        </div>
        <div>
            <div className="font-bold text-midnight">{name}</div>
            <div className="text-sm text-gray-500">{role}</div>
        </div>
    </div>
);

export default Home;
