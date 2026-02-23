import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import API_URL from '../config';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Star, Filter, Sparkles, Anchor, Waves } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { addToCart } = useCart();
    const { getFinalPrice, isWholesale, formatTotal } = usePrice();

    useEffect(() => {
        document.title = "Fresh Market Collection | SeamanFresh";
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data.results || res.data);
            } catch (err) {
                console.error("Failed to load products:", err);
            }
        };
        fetchProducts();
    }, []);

    const categories = useMemo(() => {
        const cats = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
        return cats;
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const handleAddToCart = (product) => {
        addToCart(product, 1);
    };

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Elite Header */}
            <section className="bg-slate-900 pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500 rounded-full blur-[120px]"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-end gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-2xl"
                    >
                        <span className="text-sky-500 font-black tracking-[0.4em] text-[10px] uppercase block mb-4">Live Inventory</span>
                        <h1 className="text-6xl md:text-8xl font-black font-display text-white tracking-tighter uppercase leading-none mb-6">
                            GLOBAL <br /><span className="text-sky-500 text-outline-sky">HARVEST.</span>
                        </h1>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed">
                            Access real-time availability from our international docking zones.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
                    >
                        {/* Search */}
                        <div className="relative group w-full sm:w-80">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Locate specific stock..."
                                className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[28px] text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:bg-white/10 focus:border-white/20 transition-all placeholder:text-slate-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* Category Filter */}
                        <div className="relative w-full sm:w-auto">
                            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-14 pr-12 py-5 bg-white/5 border border-white/10 rounded-[28px] text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-sky-500/10 outline-none appearance-none cursor-pointer transition-all hover:bg-white/10"
                            >
                                {categories.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
                            </select>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                {/* Result Count */}
                <div className="mb-12 flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-100"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Showing {filteredProducts.length} Premium Options</span>
                    <div className="h-px flex-1 bg-slate-100"></div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
                    <AnimatePresence>
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative"
                            >
                                <div className="bg-white rounded-[48px] overflow-hidden shadow-sm hover:shadow-4xl transition-all duration-500 border border-slate-50 flex flex-col h-full hover:-translate-y-2">
                                    <Link to={`/product/${product.id}`} className="block relative overflow-hidden h-72">
                                        <img
                                            src={product.image ? (product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`) : 'https://placehold.co/600x800?text=Fish'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            loading="lazy"
                                        />

                                        {/* Status Overlays */}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            <div className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-2xl uppercase tracking-widest flex items-center gap-2">
                                                <Waves size={12} className="text-sky-500" /> {product.category || 'Fresh'}
                                            </div>
                                            {product.discount_percent > 0 && (
                                                <div className="bg-sky-500 text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-2xl uppercase tracking-widest">
                                                    Member Deal
                                                </div>
                                            )}
                                        </div>

                                        {product.stock_quantity <= 0 && (
                                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] flex items-center justify-center">
                                                <span className="bg-white text-slate-900 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl">Depleted</span>
                                            </div>
                                        )}

                                        {/* Hover Details Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-white">
                                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <Sparkles size={12} className="text-sky-500" /> Sourced Verified
                                            </p>
                                            <p className="text-sm font-bold truncate">Premium grade quality from deep sea origins.</p>
                                        </div>
                                    </Link>

                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-black text-xl text-slate-900 line-clamp-1 tracking-tight">{product.name}</h3>
                                            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-500 px-2.5 py-1 rounded-xl font-black text-xs">
                                                <Star size={14} fill="currentColor" /> 4.9
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4 opacity-40">
                                                <div className="w-px h-4 bg-slate-200"></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Global Supply</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex justify-between items-end gap-2">
                                            <div className="space-y-1">
                                                {isWholesale && product.wholesale_price ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sky-500 font-black text-3xl tracking-tighter">
                                                            {getFinalPrice(product, product.wholesale_moq || 1)}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                            Partner Rate
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-slate-900 font-black text-3xl tracking-tighter">
                                                                {getFinalPrice(product)}
                                                            </span>
                                                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">/ kg</span>
                                                        </div>
                                                        {product.discount_percent > 0 && (
                                                            <span className="text-[10px] text-slate-300 line-through font-bold">{getFinalPrice(product.price)}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stock_quantity <= 0}
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${product.stock_quantity > 0
                                                    ? 'bg-slate-900 text-white hover:bg-sky-500 hover:text-slate-900 hover:shadow-sky-500/30'
                                                    : 'bg-slate-50 text-slate-200 cursor-not-allowed shadow-none border border-slate-100'
                                                    }`}
                                            >
                                                <ShoppingCart size={22} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-40 bg-slate-50 rounded-[60px] border-2 border-dashed border-slate-100 mt-12"
                    >
                        <div className="bg-white w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <Anchor className="text-slate-200" size={40} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Zero Matches Found</h3>
                        <p className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">Adjust your search coordinates for better results.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="mt-10 bg-slate-900 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-sky-500 hover:text-slate-900 transition-all shadow-xl"
                        >
                            Reset System Filters
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Products;
