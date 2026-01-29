import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import API_URL from '../config';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
    const { formatPrice } = useCurrency();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="bg-ocean/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShoppingBag size={64} className="text-ocean" />
                    </div>
                    <h2 className="text-3xl font-bold font-display text-midnight mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Looks like you haven't added any fresh seafood yet. Start exploring our premium collection!
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-ocean hover:bg-ocean-dark text-white font-bold rounded-full transition-all shadow-lg shadow-ocean/20"
                    >
                        Start Shopping
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-display text-midnight mb-2">Shopping Cart</h1>
                    <p className="text-gray-500">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={item.image_url ? `${API_URL}${item.image_url}` : 'https://placehold.co/120x120?text=Fish'}
                                            alt={item.name}
                                            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-midnight mb-1">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{item.category || 'Fresh Seafood'}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                                                <div className="flex items-center gap-2 bg-surface rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors text-ocean"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                                                        className="w-16 text-center font-bold text-midnight bg-transparent outline-none"
                                                        min="1"
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-colors text-ocean"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <span className="text-sm text-gray-500">kg</span>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500 mb-1">
                                                    {formatPrice(item.price)} × {item.quantity}kg
                                                </div>
                                                <div className="text-2xl font-bold text-ocean">
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold font-display text-midnight mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-midnight">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-ocean bg-ocean/5 p-3 rounded-lg">
                                    <Package size={16} />
                                    <span>Cold-chain packaging included</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-midnight">Total</span>
                                    <span className="text-3xl font-bold text-ocean">{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-ocean hover:bg-ocean-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-ocean/20 mb-4"
                            >
                                Proceed to Checkout
                                <ArrowRight size={20} />
                            </Link>

                            <Link
                                to="/products"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 hover:border-ocean hover:text-ocean font-semibold rounded-xl transition-all"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
