import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, CheckCircle, Lock } from 'lucide-react';

import { useUserType } from '../context/UserTypeContext';
import API_URL from '../config';

const Checkout = () => {
    const { cart, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const { isWholesale } = useUserType();
    const [address, setAddress] = useState(user?.address || '');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    // Helper to get the correct price for display
    const getItemPrice = (item) => {
        if (isWholesale) {
            const moq = item.wholesale_moq || 0;
            if (item.quantity >= moq) {
                if (item.wholesale_price) {
                    return parseFloat(item.wholesale_price);
                }
                return parseFloat(item.price) * 0.8; // 20% discount fallback
            }
        }
        return parseFloat(item.price);
    };
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const token = localStorage.getItem('token');
            const orderData = {
                items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price: getItemPrice(item) })),
                total_amount: subtotal,
                delivery_address: address
            };

            await axios.post(`${API_URL}/api/orders`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsSuccess(true);
            // Play local 'new-notification' alert sound
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.8;
            audio.play().catch(e => console.log("Audio play blocked by browser:", e));

            clearCart();
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (err) {
            console.error(err);
            alert('Order failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg w-full transform animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-midnight mb-4">Order Confirmed!</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Thank you for choosing Seaman Fresh. Your premium seafood is being prepared and will be on its way to you soon.
                    </p>
                    <div className="inline-flex items-center gap-2 text-ocean font-semibold">
                        <div className="w-2 h-2 bg-ocean rounded-full animate-bounce"></div>
                        Redirecting to dashboard...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-display font-bold text-midnight mb-2">Checkout</h1>
                    <p className="text-gray-500">Securely finalize your order</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-ocean/10 rounded-xl">
                                    <Truck className="text-ocean" size={24} />
                                </div>
                                <h3 className="text-xl font-display font-bold text-gray-800">Delivery Information</h3>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-700">Delivery Address</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all resize-none bg-gray-50"
                                    rows="3"
                                    placeholder="Enter your full delivery address..."
                                    required
                                />
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    We deliver within 24 hours
                                </p>
                            </div>
                        </div>

                        {/* Payment Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-ocean/10 rounded-xl">
                                    <CreditCard className="text-ocean" size={24} />
                                </div>
                                <h3 className="text-xl font-display font-bold text-gray-800">Payment Method</h3>
                            </div>

                            <label className="relative flex items-center p-4 border-2 border-ocean bg-ocean/5 rounded-xl cursor-pointer transition-all hover:bg-ocean/10">
                                <input type="radio" checked readOnly className="w-5 h-5 text-ocean focus:ring-ocean" />
                                <div className="ml-4 flex-1">
                                    <span className="block font-bold text-gray-800">Cash on Delivery</span>
                                    <span className="block text-sm text-gray-500">Pay securely when you receive your order</span>
                                </div>
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <span className="text-xl font-bold text-ocean">$</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-display font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Order Summary</h3>

                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-start py-2">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-gray-800">${(getItemPrice(item) * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="h-px bg-gray-100 my-2"></div>
                                <div className="flex justify-between text-xl font-bold text-midnight">
                                    <span>Total</span>
                                    <span className="text-ocean">${subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || !address || cart.length === 0}
                                className={`w-full mt-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2
                                    ${isProcessing || !address ? 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none' : 'bg-ocean hover:bg-ocean-dark shadow-ocean/30'}`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-2">Processing...</span>
                                ) : (
                                    <>
                                        Place Order
                                        <CheckCircle size={20} />
                                    </>
                                )}
                            </button>

                            <p className="mt-4 text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                                <Lock size={12} />
                                Secure Checkout Process
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
