import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import API_URL from '../config';
import { Plus, Edit, Trash2, X, Upload, Ban, ArrowDown } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: 'Fresh Fish', stock_quantity: '', low_stock_threshold: '5', discount_percent: ''
    });
    const [image, setImage] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const location = useLocation();

    useEffect(() => {
        fetchProducts();
        if (location.state?.openAddModal) {
            setShowModal(true);
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: 'Fresh Fish', stock_quantity: '', low_stock_threshold: '5', discount_percent: '' });
            // Clear state so it doesn't reopen on refresh (optional but good practice)
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category: product.category,
            stock_quantity: product.stock_quantity,
            low_stock_threshold: product.low_stock_threshold || 5,
            discount_percent: product.discount_percent || ''
        });
        setShowModal(true);
    };

    const handleSetLowStock = async (id, threshold) => {
        const lowVal = Math.max(0, (parseInt(threshold) || 5) - 1); // Set to 1 below threshold
        if (window.confirm(`Set stock to ${lowVal} (Low Stock) for testing?`)) {
            try {
                await api.patch(`/products/${id}/stock/`,
                    { stock_quantity: lowVal }
                );
                fetchProducts();
            } catch (err) {
                console.error(err);
                alert('Failed to update stock status.');
            }
        }
    };

    const handleStockOut = async (id, currentStock) => {
        if (currentStock === 0) return; // Already out of stock
        if (window.confirm('Mark this product as Out of Stock?')) {
            try {
                await api.patch(`/products/${id}/stock/`,
                    { stock_quantity: 0 }
                );
                fetchProducts();
            } catch (err) {
                console.error(err);
                alert('Failed to update stock status.');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (err) {
                console.error(err);
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            if (editingProduct) {
                if (!image && editingProduct.image) {
                    data.append('image', editingProduct.image);
                }
                await api.put(`/products/${editingProduct.id}`, data);
            } else {
                await api.post('/products', data);
            }
            setShowModal(false);
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: 'Fresh Fish', stock_quantity: '', low_stock_threshold: '5', discount_percent: '' });
            setImage(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Operation failed. Please check server logs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1>Inventory Management</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Manage your seafood catalog</p>
                </div>
                <button
                    onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', category: 'Fresh Fish', stock_quantity: '', low_stock_threshold: '5', discount_percent: '' }); setShowModal(true); }}
                    className="btn btn-primary"
                >
                    <Plus size={18} /> Add New Listing
                </button>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ margin: 0 }}>
                    <thead>
                        <tr>
                            <th>Product Details</th>
                            <th>Category</th>
                            <th style={{ textAlign: 'right' }}>Price ($/kg)</th>
                            <th style={{ textAlign: 'center' }}>Available Stock</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <img
                                        src={p.image ? (p.image.startsWith('http') ? p.image : `${API_URL}${p.image}`) : 'https://placehold.co/50x50?text=Fish'}
                                        alt=""
                                        style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{p.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: #{p.id}</div>
                                    </div>
                                </td>
                                <td>
                                    <span style={{
                                        background: 'rgba(14, 165, 233, 0.1)',
                                        color: 'var(--accent)',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {p.category}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: '600' }}>
                                    {p.discount_percent > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <span style={{ fontSize: '11px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>${p.price}</span>
                                            <span style={{ color: 'var(--success)' }}>
                                                ${(p.price * (1 - p.discount_percent / 100)).toFixed(2)}
                                                <span style={{ fontSize: '10px', background: 'var(--success)', color: 'white', padding: '1px 4px', borderRadius: '4px', marginLeft: '4px' }}>-{p.discount_percent}%</span>
                                            </span>
                                        </div>
                                    ) : (
                                        `$${p.price}`
                                    )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{
                                            color: p.stock_quantity < (p.low_stock_threshold || 5) ? 'var(--danger)' : 'var(--success)',
                                            fontWeight: '600'
                                        }}>
                                            {p.stock_quantity} kg
                                        </span>
                                        {p.stock_quantity < (p.low_stock_threshold || 5) && <span style={{ fontSize: '10px', color: 'var(--danger)', fontWeight: 'bold' }}>LOW STOCK</span>}
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                        <button
                                            onClick={() => handleSetLowStock(p.id, p.low_stock_threshold)}
                                            className="btn"
                                            style={{ padding: '6px', color: 'var(--warning)', background: 'transparent' }}
                                            title="Set to Low Stock"
                                        >
                                            <ArrowDown size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleStockOut(p.id, p.stock_quantity)}
                                            className="btn"
                                            style={{ padding: '6px', color: p.stock_quantity === 0 ? 'var(--text-muted)' : 'var(--danger)', background: 'transparent', cursor: p.stock_quantity === 0 ? 'not-allowed' : 'pointer' }}
                                            title="Mark Out of Stock"
                                            disabled={p.stock_quantity === 0}
                                        >
                                            <Ban size={18} />
                                        </button>
                                        <button onClick={() => handleEdit(p)} className="btn" style={{ padding: '6px', color: 'var(--accent)', background: 'transparent' }} title="Edit"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(p.id)} className="btn" style={{ padding: '6px', color: 'var(--danger)', background: 'transparent' }} title="Delete"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No seafood products found in inventory.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }}>
                    <div className="card" style={{ width: '550px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px' }}>{editingProduct ? 'Update Listing' : 'New Seafood Listing'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Fish Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Atlantic Salmon" required />
                            </div>

                            <div className="form-group">
                                <label>Detailed Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', minHeight: '100px', resize: 'vertical' }}
                                    placeholder="Tell customers about the source, freshness, and taste..."
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="form-group">
                                    <label>Price ($/kg)</label>
                                    <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" required />
                                </div>
                                <div className="form-group">
                                    <label>Stock Count (kg)</label>
                                    <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} placeholder="0" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Low Stock Warning Threshold (kg)</label>
                                <input type="number" value={formData.low_stock_threshold} onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })} placeholder="Default: 5" />
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Alert when stock drops below this amount.</span>
                            </div>

                            <div className="form-group">
                                <label>Discount (%)</label>
                                <input type="number" min="0" max="100" value={formData.discount_percent || ''} onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })} placeholder="e.g. 10" />
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Applies a percentage discount to the retail price.</span>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="Fresh Fish">Fresh Fish</option>
                                    <option value="Shellfish">Shellfish</option>
                                    <option value="Caviar">Caviar</option>
                                    <option value="Value Packs">Value Packs</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '10px', border: '1px dashed var(--border)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                    <Upload size={18} />
                                    <span>{image ? image.name : 'Upload Product Image'}</span>
                                </label>
                                <input type="file" onChange={(e) => setImage(e.target.files[0])} style={{ display: 'none' }} />
                                {editingProduct && !image && editingProduct.image && (
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                                        Current image exists. Upload new one to replace.
                                    </p>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '14px', marginTop: '12px' }}>
                                {isSubmitting ? 'Processing...' : editingProduct ? 'Save Changes' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
