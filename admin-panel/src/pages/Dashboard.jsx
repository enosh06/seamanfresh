import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingBag, DollarSign, ArrowRight, RefreshCw, Bell, Users, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_URL, { STORE_URL } from '../config';

const Dashboard = () => {
    const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0, users: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const [oRes, pRes, uRes] = await Promise.all([
                axios.get(`${API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/api/products`),
                axios.get(`${API_URL}/api/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const ordersData = Array.isArray(oRes.data) ? oRes.data : [];
            const productsData = Array.isArray(pRes.data) ? pRes.data : [];
            const usersData = Array.isArray(uRes.data) ? uRes.data : [];

            const totalRevenue = ordersData.reduce((acc, o) => acc + parseFloat(o.total_amount || 0), 0);

            // Filter low stock
            const lowStock = productsData.filter(p => p.stock_quantity < (p.low_stock_threshold || 5));

            setStats({
                orders: ordersData.length,
                products: productsData.length,
                revenue: totalRevenue.toFixed(2),
                users: usersData.length
            });
            setRecentOrders(ordersData.slice(0, 5));
            setLowStockProducts(lowStock);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Auto-refresh every 10s

        const handleOrderUpdate = () => {
            console.log("Dashboard: New order event received. Refreshing...");
            fetchData();
        };
        window.addEventListener('orderUpdated', handleOrderUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener('orderUpdated', handleOrderUpdate);
        };
    }, []);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading dashboard...</div>;

    const StatCard = ({ title, value, icon: Icon, color, bg, to }) => {
        const Content = (
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px', borderLeft: `4px solid ${color}`, height: '100%', transition: 'transform 0.2s', cursor: to ? 'pointer' : 'default' }}>
                <div style={{
                    background: bg,
                    padding: '16px',
                    borderRadius: '16px',
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={32} strokeWidth={1.5} />
                </div>
                <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{title}</p>
                    <h2 style={{ fontSize: '32px', margin: 0, color: 'var(--primary)' }}>{value}</h2>
                </div>
            </div>
        );

        return to ? <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>{Content}</Link> : Content;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1>Overview</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Welcome back, Admin</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--text-main)', textDecoration: 'none' }}>
                        <ExternalLink size={16} /> Open Storefront
                    </a>
                    <button
                        onClick={fetchData}
                        className="btn"
                        style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                    >
                        <RefreshCw size={16} /> Refresh Data
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    icon={ShoppingBag}
                    color="var(--accent)"
                    bg="rgba(14, 165, 233, 0.1)"
                    to="/orders"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.revenue}`}
                    icon={DollarSign}
                    color="var(--success)"
                    bg="rgba(16, 185, 129, 0.1)"
                    to="/orders"
                />
                <StatCard
                    title="Fish Products"
                    value={stats.products}
                    icon={Package}
                    color="var(--warning)"
                    bg="rgba(245, 158, 11, 0.1)"
                    to="/products"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.users}
                    icon={Users}
                    color="#8b5cf6"
                    bg="rgba(139, 92, 246, 0.1)"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* Recent Sales Table */}
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Recent Sales</h3>
                            <Link to="/orders" style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ margin: 0 }}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th style={{ textAlign: 'right' }}>Amount</th>
                                        <th style={{ textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map(order => (
                                            <tr key={order.id}>
                                                <td>
                                                    <Link to={`/orders#order-${order.id}`} style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>
                                                        #SF-{order.id}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: '500' }}>{order.user_name}</div>
                                                </td>
                                                <td style={{ textAlign: 'right', fontWeight: '600' }}>${order.total_amount}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span style={{
                                                        textTransform: 'capitalize',
                                                        padding: '6px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        background: order.status === 'delivered' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                        color: order.status === 'delivered' ? 'var(--success)' : 'var(--warning)'
                                                    }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                No recent orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    {lowStockProducts.length > 0 && (
                        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <AlertTriangle size={20} color="var(--danger)" />
                                <h3 style={{ margin: 0, color: 'var(--danger)' }}>Low Stock Alerts</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {lowStockProducts.map(p => (
                                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fff1f2', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ fontWeight: '600' }}>{p.name}</div>
                                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: #{p.id}</span>
                                        </div>
                                        <div style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Only {p.stock_quantity} kg left</div>
                                    </div>
                                ))}
                                <Link to="/products" style={{ fontSize: '14px', color: 'var(--danger)', fontWeight: '600', marginTop: '8px', textDecoration: 'none' }}>
                                    Manage Inventory &rarr;
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: '20px' }}>Quick Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/products" state={{ openAddModal: true }} className="btn btn-primary" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                                <Package size={18} /> Add New Product
                            </Link>
                            <Link to="/orders" className="btn" style={{ justifyContent: 'center', background: 'white', border: '1px solid var(--border)', color: 'var(--text-main)', textDecoration: 'none' }}>
                                <ShoppingBag size={18} /> Process Orders
                            </Link>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <Bell size={20} color="var(--accent)" />
                            <h3 style={{ margin: 0 }}>System Sounds</h3>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                            Click below to ensure browser audio is enabled for order alerts.
                        </p>
                        <button
                            onClick={() => {
                                const audio = new Audio('/notification.mp3');
                                audio.play().catch(e => alert("Audio blocked! Please interact with the page first."));
                            }}
                            className="btn"
                            style={{ width: '100%', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent)' }}
                        >
                            Test Alert Sound
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
