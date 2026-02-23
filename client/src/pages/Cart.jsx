import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus, Package, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import API_URL from '../config';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
    const { getFinalPrice, formatTotal, formatPrice, currency } = usePrice();

    useEffect(() => {
        document.title = "Your Shopping Cart | SeamanFresh";
    }, []);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md bg-white p-12 rounded-[40px] shadow-xl border border-slate-100"
                >
                    <div className="bg-sky-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 text-sky-500 shadow-inner">
                        <ShoppingBag size={64} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-black font-display text-slate-900 mb-4 tracking-tight">Your Sea-Chest is Empty</h1>
                    <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                        The nets are empty for now. Explore our premium global collection of fresh seafood to fill them up!
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-sky-500 hover:bg-sky-400 text-slate-900 font-black rounded-3xl transition-all shadow-xl shadow-sky-500/20 transform hover:-translate-y-1"
                    >
                        Explore Products
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-5xl font-black font-display text-slate-900 tracking-tighter mb-2">Shopping Cart</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                            Managed by AI-Logistics • {cart.length} {cart.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {cart.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 group"
                                >
                                    <div className="flex flex-col sm:flex-row gap-8">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0 relative">
                                            <div className="w-32 h-32 md:w-44 md:h-44 rounded-[28px] overflow-hidden shadow-lg">
                                                <img
                                                    src={item.image ? (item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`) : 'https://placehold.co/200x200?text=SeamanFresh'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            {item.discount_percent > 0 && (
                                                <div className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                                                    -{item.discount_percent}%
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-sky-500 transition-colors uppercase tracking-tight">{item.name}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                                                {item.category || 'Fresh'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-3 rounded-2xl transition-all"
                                                        title="Remove item"
                                                    >
                                                        <Trash2 size={24} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mt-4">
                                                {/* Quantity Controls */}
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quantity (KG)</label>
                                                    <div className="flex items-center gap-1 bg-slate-50 rounded-2xl p-1.5 w-fit border border-slate-100 shadow-inner">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:text-sky-500 hover:shadow-sm transition-all text-slate-400"
                                                        >
                                                            <Minus size={20} />
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                                                            className="w-16 text-center font-black text-slate-900 bg-transparent outline-none text-lg"
                                                            min="1"
                                                        />
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:text-sky-500 hover:shadow-sm transition-all text-slate-400"
                                                        >
                                                            <Plus size={20} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                                                        Item Total
                                                    </div>
                                                    <div className="text-3xl font-black text-slate-900 tracking-tighter">
                                                        {formatTotal(item, item.quantity)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100 sticky top-max(2rem, 100px)">
                            <h3 className="text-3xl font-black font-display text-slate-900 mb-8 tracking-tighter">Summary</h3>

                            <div className="space-y-6 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-bold">Subtotal</span>
                                    <span className="text-xl font-black text-slate-900 tracking-tight">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-bold">Logistics Fee</span>
                                    <span className="text-emerald-500 font-black tracking-widest text-sm uppercase">Complimentary</span>
                                </div>
                                <div className="p-5 bg-sky-50/50 rounded-3xl border border-sky-100 space-y-4">
                                    <div className="flex items-center gap-3 text-xs text-sky-600 font-black uppercase tracking-widest">
                                        <Package size={16} />
                                        <span>Cold-Chain Protection</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-sky-600 font-black uppercase tracking-widest">
                                        <Truck size={16} />
                                        <span>24H Priority Global</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-sky-600 font-black uppercase tracking-widest">
                                        <ShieldCheck size={16} />
                                        <span>Quality Guaranteed</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-8 mb-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Total Due</span>
                                    <div className="text-right">
                                        <div className="text-4xl font-black text-sky-500 tracking-[calc(-0.02em)]">
                                            {formatPrice(subtotal)}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Inclusive of Taxes</div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="group w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 hover:bg-sky-500 text-white font-black rounded-3xl transition-all shadow-2xl hover:shadow-sky-500/20 mb-4 transform hover:-translate-y-1"
                            >
                                Secure Checkout
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/products"
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 border border-slate-100 text-slate-500 hover:text-sky-500 hover:border-sky-500 font-black rounded-3xl transition-all uppercase text-xs tracking-widest"
                            >
                                Continue Sourcing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
