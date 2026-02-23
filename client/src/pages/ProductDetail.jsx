import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import API_URL from '../config';
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, ShieldCheck, Truck, Sparkles, CheckCircle2, Package, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUserType } from '../context/UserTypeContext';
import { usePrice } from '../hooks/usePrice';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedFeedback, setAddedFeedback] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { isWholesale } = useUserType();
    const { getFinalPrice, formatTotal } = usePrice();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);

                // Set default quantity for wholesale
                if (isWholesale && res.data.wholesale_moq > 0) {
                    setQuantity(res.data.wholesale_moq);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                navigate('/products');
            }
        };
        fetchProduct();
    }, [id, isWholesale, navigate]);

    useEffect(() => {
        if (product) {
            document.title = `${product.name} | SeamanFresh Premium Selection`;
        }
    }, [product]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 3000);
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Authenticating Supply Chain...</p>
                </div>
            </div>
        );
    }

    const isMoqMet = !isWholesale || !product.wholesale_moq || quantity >= product.wholesale_moq;

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header / Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all"
                >
                    <div className="w-10 h-10 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:border-slate-900 transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Market
                </button>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {product.stock_quantity > 0 ? 'Live Availability' : 'Out of Stock'}
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">

                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-7 space-y-8"
                    >
                        <div className="relative aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-[60px] overflow-hidden shadow-3xl group">
                            <div className="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                            <img
                                src={product.image ? (product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`) : 'https://placehold.co/800x1000?text=SeamanFresh'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            {/* Badges */}
                            <div className="absolute top-8 left-8 flex flex-col gap-4">
                                <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-2xl flex items-center gap-2">
                                    <Sparkles size={16} className="text-sky-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Premium Cut</span>
                                </div>
                                {product.discount_percent > 0 && (
                                    <div className="bg-red-500 px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 text-white">
                                        <span className="text-[10px] font-black uppercase tracking-widest">-{product.discount_percent}% Member Promo</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col items-center text-center">
                                <ShieldCheck size={24} className="text-sky-500 mb-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Lab Tested</span>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col items-center text-center">
                                <Truck size={24} className="text-sky-500 mb-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Cold Chain</span>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col items-center text-center">
                                <Globe size={24} className="text-sky-500 mb-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Global Origin</span>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col items-center text-center">
                                <Package size={24} className="text-sky-500 mb-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Eco Packed</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Details Column */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-sky-50 text-sky-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {product.category || 'Ocean Selection'}
                                </span>
                                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-500 px-3 py-1.5 rounded-full font-black text-xs">
                                    <Star size={14} fill="currentColor" /> 4.9
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black font-display text-slate-900 tracking-tighter mb-8 leading-none">
                                {product.name}
                            </h1>

                            {/* Price Presentation */}
                            <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 mb-12">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                                        {getFinalPrice(product, quantity)}
                                    </span>
                                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">/ KG</span>
                                </div>

                                {isWholesale && product.wholesale_moq > 0 && (
                                    <div className={`flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest ${isMoqMet ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        <CheckCircle2 size={14} />
                                        {isMoqMet ? 'Wholesale Pricing Applied' : `Min Order For Partner Rate: ${product.wholesale_moq}kg`}
                                    </div>
                                )}

                                <div className="mt-8 pt-8 border-t border-slate-200 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Estimated</span>
                                        <span className="text-2xl font-black text-sky-500">{formatTotal(product, quantity)}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Delivery</span>
                                        <span className="text-sm font-black text-slate-900">~ 24 Hours</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">The Selection</h4>
                                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                        {product.description || "Indulge in our premium selection, sourced from deep-sea sustainable fisheries. Each cut is flash-frozen at the peak of freshness to preserve flavor, texture, and nutritional value."}
                                    </p>
                                </div>

                                {/* Order Interactions */}
                                {product.stock_quantity > 0 ? (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Quantity (Kilograms)</span>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 bg-slate-100 rounded-3xl p-2 border border-slate-200">
                                                    <button
                                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm hover:bg-slate-900 hover:text-white transition-all disabled:opacity-20"
                                                        disabled={quantity <= 1}
                                                    >
                                                        <Minus size={20} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                        className="w-20 text-center text-2xl font-black text-slate-900 bg-transparent outline-none"
                                                    />
                                                    <button
                                                        onClick={() => setQuantity(q => q + 1)}
                                                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm hover:bg-slate-900 hover:text-white transition-all"
                                                    >
                                                        <Plus size={20} />
                                                    </button>
                                                </div>
                                                <div className="text-slate-400 font-bold">KG</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-6">
                                            <button
                                                onClick={handleAddToCart}
                                                className="flex-1 group bg-slate-900 hover:bg-sky-500 text-white hover:text-slate-900 text-lg px-10 py-6 rounded-[32px] font-black transition-all shadow-2xl shadow-slate-900/10 hover:shadow-sky-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-4"
                                            >
                                                <ShoppingCart size={24} />
                                                Add to Net
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {addedFeedback && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="p-5 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4"
                                                >
                                                    <div className="bg-emerald-500 text-white p-2 rounded-xl">
                                                        <CheckCircle2 size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-900 font-black text-sm uppercase tracking-tight">Success</p>
                                                        <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest">{quantity}kg of {product.name} added to cart.</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="bg-red-50 p-8 rounded-[40px] border border-red-100 flex items-center gap-6">
                                        <div className="bg-red-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 uppercase tracking-tight">Sold Out</h4>
                                            <p className="text-red-700 text-sm font-bold uppercase tracking-widest">Check back soon for the next catch.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-20 pt-12 border-t border-slate-100 grid grid-cols-2 gap-8">
                            <div>
                                <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</h6>
                                <p className="text-slate-900 font-black uppercase text-xs">{product.category}</p>
                            </div>
                            <div>
                                <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Logistics</h6>
                                <p className="text-slate-900 font-black uppercase text-xs">Direct Air-Freight</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
