import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePrice } from '../hooks/usePrice';
import { CreditCard, Truck, CheckCircle, Lock, ShieldCheck, ArrowLeft, Package, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const { cart, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const { getFinalPrice, formatTotal, getRawDiscountedPrice } = usePrice();
    const [address, setAddress] = useState(user?.address || '');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Secure Checkout | SeamanFresh";
        if (cart.length === 0 && !isSuccess) {
            navigate('/products');
        }
    }, [cart, isSuccess, navigate]);

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();
        if (!address) return;

        setIsProcessing(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    product: item.id,
                    quantity: item.quantity,
                    price_at_purchase: (getRawDiscountedPrice(item, item.quantity) / item.quantity).toFixed(2)
                })),
                total_amount: subtotal,
                delivery_address: address
            };

            await api.post('/orders', orderData);

            setIsSuccess(true);

            // Notification sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => { });

            clearCart();
            setTimeout(() => {
                navigate('/dashboard');
            }, 4000);
        } catch (err) {
            console.error("Order Failure:", err);
            alert('Order failed to reach our dispatch. Please try again or contact support.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[40px] shadow-3xl p-12 text-center max-w-lg w-full border border-slate-100"
                >
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-black font-display text-slate-900 mb-4 tracking-tighter uppercase">Dispatch Confirmed</h2>
                    <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                        Your premium seafood selection has been secured. Our logistics team is now carving the fastest route to your table.
                    </p>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-1.5">
                            {[1, 2, 3].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                    className="w-2 h-2 bg-sky-500 rounded-full"
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Redirecting to Dashboard</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest mb-4 transition-colors"
                        >
                            <ArrowLeft size={14} /> Back to Net
                        </button>
                        <h1 className="text-5xl font-black font-display text-slate-900 tracking-tighter uppercase leading-none">Checkout</h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-slate-900">
                            <ShieldCheck size={18} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure AES-256 Protocol</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Delivery Card */}
                        <div className="bg-white rounded-[40px] shadow-sm p-10 border border-slate-100">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Delivery Logistics</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Cold-Chain Network</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Ship-to Address</label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none text-slate-700 font-medium leading-relaxed"
                                        rows="4"
                                        placeholder="Enter full street, city, postal code and country for priority delivery..."
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] text-emerald-700 font-black uppercase tracking-widest">Express Air-Freight Available for your location</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Card */}
                        <div className="bg-white rounded-[40px] shadow-sm p-10 border border-slate-100">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Payment Verification</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Secure Settlements</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="relative flex items-center p-6 border-4 border-sky-500 bg-sky-50/50 rounded-[32px] cursor-pointer transition-all">
                                    <div className="w-5 h-5 rounded-full border-4 border-sky-500 mr-4 bg-white"></div>
                                    <div className="flex-1">
                                        <span className="block font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Cash on Delivery</span>
                                        <span className="block text-[10px] text-slate-400 font-bold">Pay upon inspection of catch</span>
                                    </div>
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-sky-500">
                                        <Package size={20} />
                                    </div>
                                </label>

                                <div className="relative flex items-center p-6 border-2 border-slate-100 bg-slate-50/50 rounded-[32px] opacity-40 cursor-not-allowed">
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-200 mr-4"></div>
                                    <div className="flex-1">
                                        <span className="block font-black text-slate-400 uppercase text-xs tracking-widest mb-1">Digital Payment</span>
                                        <span className="block text-[10px] text-slate-300 font-bold italic">Enabling soon via AI-Pay</span>
                                    </div>
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-200">
                                        <Sparkles size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100 sticky top-max(2rem, 100px)">
                            <h3 className="text-3xl font-black font-display text-slate-900 mb-8 tracking-tighter uppercase">Order Grid</h3>

                            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-start pt-6 border-t border-slate-50 first:border-0 first:pt-0">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                                                <img src={item.image ? (item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`) : 'https://placehold.co/100x100?text=Fish'} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.quantity} KG</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-slate-900 text-sm">{formatTotal(item, item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-10 border-t border-slate-100">
                                <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    <span>Base Subtotal</span>
                                    <span>{getFinalPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    <span>Logistics Dispatch</span>
                                    <span className="text-sky-500">Free Priority</span>
                                </div>
                                <div className="flex justify-between items-center pt-6">
                                    <span className="text-xl font-black text-slate-900 uppercase tracking-tighter">Total Due</span>
                                    <div className="text-right">
                                        <div className="text-4xl font-black text-sky-500 tracking-tighter">
                                            {getFinalPrice(subtotal)}
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Taxes Included</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || !address || cart.length === 0}
                                className={`w-full mt-10 py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3
                                    ${isProcessing || !address || cart.length === 0
                                        ? 'bg-slate-100 text-slate-300 shadow-none cursor-not-allowed'
                                        : 'bg-slate-900 text-white hover:bg-sky-500 hover:text-slate-900 shadow-slate-900/10'}`}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        Confirm Dispatch
                                        <CheckCircle size={18} />
                                    </>
                                )}
                            </button>

                            <p className="mt-6 text-[10px] text-center text-slate-400 font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                                <Lock size={12} className="text-sky-500" />
                                End-to-End Secure
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
