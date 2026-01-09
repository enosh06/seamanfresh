import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Upload, Package } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: '', stock_quantity: '', wholesale_price: '', wholesale_moq: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchProducts = async () => {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock_quantity: product.stock_quantity,
            wholesale_price: product.wholesale_price || '',
            wholesale_moq: product.wholesale_moq || ''
        });
        setImagePreview(product.image_url ? `http://localhost:5000${product.image_url}` : null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            if (editingProduct) {
                await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/products', data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            setEditingProduct(null);
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: '', stock_quantity: '', wholesale_price: '', wholesale_moq: '' });
            setImage(null);
            setImagePreview(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', category: '', stock_quantity: '', wholesale_price: '', wholesale_moq: '' });
        setImage(null);
        setImagePreview(null);
    };

    return (
        <div className="min-h-screen bg-surface py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-midnight mb-2">
                            Inventory <span className="text-ocean">Control</span>
                        </h1>
                        <p className="text-gray-500">{products.length} products in stock</p>
                    </div>
                    <button
                        onClick={() => { setEditingProduct(null); setShowModal(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-ocean hover:bg-ocean-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-ocean/20"
                    >
                        <Plus size={20} />
                        Add New Product
                    </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 bg-gray-100 relative">
                                <img
                                    src={product.image_url ? `http://localhost:5000${product.image_url}` : 'https://placehold.co/400x300?text=No+Image'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 bg-midnight text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                    {product.category || 'Uncategorized'}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-midnight mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <span className="text-2xl font-bold text-ocean">${product.price}</span>
                                        <span className="text-sm text-gray-400 ml-1">/ kg</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock_quantity > 10 ? 'bg-green-100 text-green-700' :
                                        product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {product.stock_quantity} kg
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-ocean text-ocean hover:bg-ocean hover:text-white rounded-xl transition-all font-semibold"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex items-center justify-center px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-20">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400 text-lg">No products yet. Add your first product!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold font-display text-midnight">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-ocean transition-colors">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={() => { setImage(null); setImagePreview(null); }}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                                            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                            <input
                                                type="file"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label htmlFor="image-upload" className="cursor-pointer text-ocean font-semibold hover:text-ocean-dark">
                                                Browse Files
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                                        placeholder="e.g., Atlantic Salmon"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                                        placeholder="e.g., Fresh Fish"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent resize-none"
                                    placeholder="Describe the product..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (per kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity (kg)</label>
                                    <input
                                        type="number"
                                        value={formData.stock_quantity}
                                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Wholesale Price (per kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.wholesale_price}
                                        onChange={(e) => setFormData({ ...formData, wholesale_price: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Wholesale MOQ (kg)</label>
                                    <input
                                        type="number"
                                        value={formData.wholesale_moq}
                                        onChange={(e) => setFormData({ ...formData, wholesale_moq: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-ocean hover:bg-ocean-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-ocean/20"
                                >
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
