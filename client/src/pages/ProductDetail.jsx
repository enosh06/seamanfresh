import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUserType } from '../context/UserTypeContext';
import { useCurrency } from '../context/CurrencyContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { isWholesale, formatPrice: userTypeFormatPrice } = useUserType();
    const { formatPrice } = useCurrency();
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProduct(res.data);

            // Auto-set quantity to MOQ for wholesale users
            if (isWholesale && res.data.wholesale_moq > 0) {
                setQuantity(res.data.wholesale_moq);
            }
        };
        fetchProduct();
    }, [id, isWholesale]);

    const handleAddToCart = () => {
        addToCart(product, quantity);

        setError('');
        if (isWholesale && product.wholesale_moq > 0 && quantity < product.wholesale_moq) {
            // Informational message only
            setError(`Note: You need ${product.wholesale_moq}kg to unlock wholesale pricing. Added at retail price.`);
            // Clear message after 3 seconds
            setTimeout(() => setError(''), 4000);
        } else {
            // Success feedback
            setError('Added to cart!');
            setTimeout(() => setError(''), 2000);
        }
    };

    if (!product) return <div className="container" style={{ padding: '40px' }}>Loading...</div>;

    return (
        <div style={{ padding: '60px 0' }}>
            <div className="container">
                <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', marginBottom: '30px', color: '#666' }}>
                    <ArrowLeft size={20} /> Back to products
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px', alignItems: 'start' }}>
                    <div className="card">
                        <img src={product.image_url ? `http://localhost:5000${product.image_url}` : 'https://placehold.co/600x450?text=Fish'}
                            alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
                    </div>

                    <div>
                        <h1 style={{ fontSize: '40px', marginBottom: '10px' }}>{product.name}</h1>
                        {/* Price Display */}
                        <div style={{ marginBottom: '20px' }}>
                            {isWholesale && product.wholesale_price ? (
                                <div>
                                    <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '28px', marginBottom: '5px' }}>
                                        ${formatPrice(product.wholesale_price).replace('$', '')} <span style={{ fontSize: '18px', color: '#666' }}>/ kg</span>
                                    </p>
                                    <p style={{ color: '#005f91', fontSize: '14px', fontWeight: '600' }}>Wholesale Rate Applied</p>
                                    {product.wholesale_moq > 0 && (
                                        <p style={{ color: '#666', fontSize: '14px' }}>Minimum Order Quantity: {product.wholesale_moq} kg</p>
                                    )}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '28px', marginBottom: '20px' }}>
                                    ${product.price} / kg
                                    {isWholesale && <span style={{ display: 'block', fontSize: '14px', color: 'green' }}>20% Wholesale Discount Applied</span>}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h4 style={{ marginBottom: '10px' }}>Description</h4>
                            <p style={{ color: '#555', lineHeight: '1.8' }}>{product.description}</p>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <p><strong>Availability:</strong> {product.stock_quantity > 0 ? `${product.stock_quantity} kg in stock` : 'Out of Stock'}</p>
                            <p><strong>Category:</strong> {product.category}</p>
                        </div>

                        {product.stock_quantity > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <span>Quantity:</span>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px' }}>
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '10px', background: '#f5f5f5' }}><Minus size={16} /></button>
                                        <span style={{ padding: '0 20px', fontWeight: '600' }}>{quantity}</span>
                                        <button onClick={() => setQuantity(q => q + 1)} style={{ padding: '10px', background: '#f5f5f5' }}><Plus size={16} /></button>
                                    </div>
                                    <span>kg</span>
                                </div>

                                {error && (
                                    <p className={`font-medium text-sm animate-pulse ${error.startsWith('Note') ? 'text-orange-500' : 'text-green-600'}`}>
                                        {error.startsWith('Note') ? 'ℹ️' : '✅'} {error}
                                    </p>
                                )}

                                <button
                                    onClick={handleAddToCart}
                                    className="btn btn-accent"
                                    style={{ padding: '15px 40px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', width: 'fit-content' }}
                                >
                                    <ShoppingCart size={24} /> Add to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
