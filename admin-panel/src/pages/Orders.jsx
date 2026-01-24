import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Truck, Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import API_URL from '../config';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.get(`${API_URL}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        const handleOrderUpdate = () => {
            console.log("Orders: New order event received. Refreshing...");
            fetchOrders();
        };
        window.addEventListener('orderUpdated', handleOrderUpdate);

        return () => window.removeEventListener('orderUpdated', handleOrderUpdate);
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('admin_token');
            await axios.put(`${API_URL}/api/orders/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders();
        } catch {
            alert('Failed to update status');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return { bg: '#fff3e0', color: '#ef6c00', icon: <Clock size={14} /> };
            case 'processing': return { bg: '#e3f2fd', color: '#1976d2', icon: <Package size={14} /> };
            case 'shipped': return { bg: '#f3e5f5', color: '#7b1fa2', icon: <Truck size={14} /> };
            case 'delivered': return { bg: '#e8f5e9', color: '#2e7d32', icon: <CheckCircle size={14} /> };
            case 'cancelled': return { bg: '#ffebee', color: '#c62828', icon: <XCircle size={14} /> };
            default: return { bg: '#eee', color: '#333', icon: null };
        }
    };

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!loading && orders.length > 0) {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.style.backgroundColor = '#fff8e1'; // Highlight
                    setTimeout(() => {
                        element.style.transition = 'background-color 2s';
                        element.style.backgroundColor = 'transparent';
                    }, 2000);
                }
            }
        }
    }, [loading, orders]);

    if (loading) return <div>Loading orders...</div>;

    const viewOrderDetails = async (id) => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.get(`${API_URL}/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedOrder(res.data);
            setShowModal(true);
        } catch (err) {
            console.error(err);
            alert('Failed to load order details');
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '30px' }}>Order Fulfillment</h1>

            <div className="card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                            <th style={{ padding: '20px', textAlign: 'left' }}>Order ID</th>
                            <th style={{ padding: '20px', textAlign: 'left' }}>Customer Details</th>
                            <th style={{ padding: '20px', textAlign: 'right' }}>Order Total</th>
                            <th style={{ padding: '20px', textAlign: 'center' }}>Fulfillment Status</th>
                            <th style={{ padding: '20px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(orders) && orders.map(o => {
                            const styles = getStatusStyles(o.status);
                            return (
                                <tr key={o.id} id={`order-${o.id}`} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '20px', fontWeight: 'bold' }}>#SF-{o.id}</td>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: '600' }}>{o.user_name}</div>
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', maxWidth: '250px' }}>{o.delivery_address}</div>
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>${o.total_amount}</td>
                                    <td style={{ padding: '20px', textAlign: 'center' }}>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            textTransform: 'capitalize', padding: '6px 14px', borderRadius: '25px', fontSize: '12px',
                                            fontWeight: '600', background: styles.bg, color: styles.color
                                        }}>
                                            {styles.icon} {o.status}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => viewOrderDetails(o.id)}
                                                className="btn"
                                                style={{ background: 'transparent', color: 'var(--accent)', border: '1px solid var(--border)' }}
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <select
                                                value={o.status}
                                                onChange={(e) => updateStatus(o.id, e.target.value)}
                                                style={{
                                                    padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc',
                                                    background: 'white', cursor: 'pointer', outline: 'none'
                                                }}
                                            >
                                                <option value="pending">Mark Pending</option>
                                                <option value="processing">Start Processing</option>
                                                <option value="shipped">Mark Shipped</option>
                                                <option value="delivered">Mark Delivered</option>
                                                <option value="cancelled">Cancel Order</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {orders.length === 0 && (
                            <tr><td colSpan="5" style={{ padding: '100px', textAlign: 'center', color: '#999' }}>
                                <div style={{ marginBottom: '10px' }}><Package size={48} /></div>
                                No orders have been placed yet.
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="card" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                            <h2>Order #{selectedOrder.id}</h2>
                            <button onClick={() => setShowModal(false)} className="btn" style={{ background: 'transparent', color: '#666' }}>
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>Customer:</strong> {selectedOrder.user_name || 'N/A'}</p>
                            <p><strong>Address:</strong> {selectedOrder.delivery_address}</p>
                            <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                            <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedOrder.status}</span></p>
                        </div>

                        <h3 style={{ marginBottom: '12px' }}>Items</h3>
                        <table style={{ width: '100%', marginBottom: '20px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '8px' }}>Product</th>
                                    <th style={{ padding: '8px', textAlign: 'center' }}>Qty</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Price</th>
                                    <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={`${API_URL}${item.image_url}`} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                            {item.name}
                                        </td>
                                        <td style={{ padding: '8px', textAlign: 'center' }}>{item.quantity} kg</td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>${item.price_at_purchase}</td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>${(item.quantity * item.price_at_purchase).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Grand Total:</td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>${selectedOrder.total_amount}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setShowModal(false)} className="btn" style={{ background: '#eee', color: '#333' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
