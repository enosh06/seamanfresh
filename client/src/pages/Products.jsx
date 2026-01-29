import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import API_URL from '../config';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useUserType } from '../context/UserTypeContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const { isWholesale, formatPrice: userTypeFormatPrice } = useUserType();

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await api.get('/products');
            setProducts(res.data);
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    return (
        <div className="min-h-screen bg-surface py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-display text-midnight mb-2">
                            Sea <span className="text-ocean">Collection</span>
                        </h1>
                        <p className="text-gray-500">Discover our premium selection of fresh seafood</p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search fresh fish..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ocean/10 transition-all duration-300 group">
                            <Link to={`/product/${product.id}`} className="block relative overflow-hidden h-64">
                                <img
                                    src={product.image_url ? `${API_URL}${product.image_url}` : 'https://placehold.co/400x300?text=Fish'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-midnight text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                    {product.category || 'Fresh'}
                                </div>
                                {product.stock_quantity <= 0 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="bg-red-500 text-white px-6 py-2 rounded-full font-bold">Out of Stock</span>
                                    </div>
                                )}
                            </Link>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-midnight group-hover:text-ocean transition-colors">{product.name}</h3>
                                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                                        <Star size={12} fill="currentColor" /> 4.9
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                                    {product.description || 'Premium quality seafood sourced directly from trusted fisheries.'}
                                </p>

                                <div className="flex justify-between items-center">
                                    <div>
                                        {isWholesale && product.wholesale_price ? (
                                            <>
                                                <span className="text-ocean font-bold text-2xl">${formatPrice(product.wholesale_price).replace('$', '')}</span>
                                                <span className="text-gray-400 text-sm ml-1">/ kg</span>
                                                <div className="text-xs text-blue-600 font-semibold mt-1">Wholesale Rate</div>
                                                {product.wholesale_moq > 0 && (
                                                    <div className="text-xs text-gray-500 mt-0.5">Min Order: {product.wholesale_moq} kg</div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {product.discount_percent > 0 ? (
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-400 text-sm line-through">${userTypeFormatPrice(product.price)}</span>
                                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">-{product.discount_percent}%</span>
                                                        </div>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-ocean font-bold text-2xl">
                                                                ${(parseFloat(product.price) * (1 - product.discount_percent / 100)).toFixed(2)}
                                                            </span>
                                                            <span className="text-gray-400 text-sm">/ kg</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="text-ocean font-bold text-2xl">${userTypeFormatPrice(product.price)}</span>
                                                        <span className="text-gray-400 text-sm ml-1">/ kg</span>
                                                    </>
                                                )}

                                                {isWholesale && (
                                                    <div className="text-xs text-green-600 font-semibold mt-1">💰 20% Wholesale Discount</div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock_quantity <= 0}
                                        className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${product.stock_quantity > 0
                                            ? 'bg-ocean text-white hover:bg-ocean-dark shadow-lg shadow-ocean/20'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <ShoppingCart size={18} />
                                        {product.stock_quantity > 0 ? 'Add' : 'Out'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No products found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
