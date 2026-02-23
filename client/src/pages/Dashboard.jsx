import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, Clock, CheckCircle, Truck, XCircle, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my-orders');
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to load orders", error);
            }
        };
        fetchOrders();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} color="orange" />;
            case 'processing': return <Package size={16} color="blue" />;
            case 'shipped': return <Truck size={16} color="purple" />;
            case 'delivered': return <CheckCircle size={16} color="green" />;
            case 'cancelled': return <XCircle size={16} color="red" />;
            default: return null;
        }
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
            case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'processing': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-surface py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Profile Header */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
                    <div className="bg-ocean h-32 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center p-1">
                                <div className="w-full h-full bg-surface rounded-xl flex items-center justify-center text-ocean text-3xl font-bold">
                                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-midnight">
                                Hello, {user?.name || 'Valued Member'}
                            </h1>
                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                {user?.email}
                            </p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <Link to="/settings" className="flex-1 md:flex-none px-6 py-2.5 bg-surface text-midnight font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                Settings
                            </Link>
                            <button onClick={handleLogout} className="flex-1 md:flex-none px-6 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-ocean/10 p-4 rounded-xl text-ocean">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <h3 className="text-2xl font-bold text-midnight">{orders.length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-green-50 p-4 rounded-xl text-green-600">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Delivered</p>
                            <h3 className="text-2xl font-bold text-midnight">
                                {orders.filter(o => o.status === 'delivered').length}
                            </h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-amber-50 p-4 rounded-xl text-amber-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending Sync</p>
                            <h3 className="text-2xl font-bold text-midnight">
                                {orders.filter(o => ['pending', 'processing'].includes(o.status)).length}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-display font-bold text-midnight">Recent Orders</h2>
                    {expandedOrder && (
                        <button
                            onClick={() => setExpandedOrder(null)}
                            className="text-ocean font-bold text-sm hover:underline"
                        >
                            Back to List
                        </button>
                    )}
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-ocean/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={40} className="text-ocean" />
                        </div>
                        <h3 className="text-xl font-bold text-midnight mb-2">Your collection is empty</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Experience the freshest catch delivered straight to your door.
                        </p>
                        <Link to="/products" className="inline-flex px-8 py-3 bg-ocean hover:bg-ocean-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-ocean/20">
                            Start Shopping
                        </Link>
                    </div>
                ) : expandedOrder ? (
                    /* Detailed Order View */
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-start">
                            <div>
                                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusTheme(expandedOrder.status)} mb-4`}>
                                    {getStatusIcon(expandedOrder.status)}
                                    {expandedOrder.status}
                                </span>
                                <h1 className="text-3xl font-bold text-midnight">Order #SF-{expandedOrder.id}</h1>
                                <p className="text-gray-500 mt-1">Placed on {new Date(expandedOrder.created_at).toLocaleDateString()} at {new Date(expandedOrder.created_at).toLocaleTimeString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                                <p className="text-4xl font-bold text-ocean">${expandedOrder.total_amount}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Items List */}
                            <div className="p-8 border-r border-gray-50">
                                <h3 className="text-lg font-bold text-midnight mb-6 flex items-center gap-2">
                                    <Package size={20} className="text-ocean" />
                                    Items In Dispatch
                                </h3>
                                <div className="space-y-4">
                                    {expandedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-surface/50 p-4 rounded-2xl border border-gray-50">
                                            <div>
                                                <p className="font-bold text-midnight uppercase tracking-tight">{item.product_name || 'Premium Catch'}</p>
                                                <p className="text-xs text-gray-400 font-medium">{item.quantity} KG @ ${item.price_at_purchase}/KG</p>
                                            </div>
                                            <p className="font-bold text-ocean">${(item.quantity * item.price_at_purchase).toFixed(2)}</p>
                                        </div>
                                    ))}
                                    {(!expandedOrder.items || expandedOrder.items.length === 0) && (
                                        <p className="text-gray-400 italic text-sm">Item details were summarized for this legacy order.</p>
                                    )}
                                </div>
                            </div>

                            {/* Logistics Tracking */}
                            <div className="p-8">
                                <h3 className="text-lg font-bold text-midnight mb-6 flex items-center gap-2">
                                    <Truck size={20} className="text-ocean" />
                                    Logistics Update
                                </h3>

                                <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 ml-2">
                                    <div className="relative pl-10">
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${expandedOrder.status === 'delivered' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                        <div>
                                            <p className={`font-bold text-sm uppercase tracking-tight ${expandedOrder.status === 'delivered' ? 'text-midnight' : 'text-gray-400'}`}>Dispatch Delivered</p>
                                            <p className="text-xs text-gray-400">Premium catch safely reached destination.</p>
                                        </div>
                                    </div>
                                    <div className="relative pl-10">
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${['shipped', 'delivered'].includes(expandedOrder.status) ? 'bg-ocean' : 'bg-gray-200'}`}></div>
                                        <div>
                                            <p className={`font-bold text-sm uppercase tracking-tight ${['shipped', 'delivered'].includes(expandedOrder.status) ? 'text-midnight' : 'text-gray-400'}`}>Transit In Progress</p>
                                            <p className="text-xs text-gray-400">Cold-chain logistics actively maintaining freshness.</p>
                                        </div>
                                    </div>
                                    <div className="relative pl-10">
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${['processing', 'shipped', 'delivered'].includes(expandedOrder.status) ? 'bg-amber-500' : 'bg-gray-200'}`}></div>
                                        <div>
                                            <p className={`font-bold text-sm uppercase tracking-tight ${['processing', 'shipped', 'delivered'].includes(expandedOrder.status) ? 'text-midnight' : 'text-gray-400'}`}>Dispatch Preparing</p>
                                            <p className="text-xs text-gray-400">Quality inspectors verifying the harvest.</p>
                                        </div>
                                    </div>
                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center bg-emerald-500"></div>
                                        <div>
                                            <p className="font-bold text-sm uppercase tracking-tight text-midnight">Order Confirmed</p>
                                            <p className="text-xs text-gray-400">Digital signature verified and secured.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 p-4 bg-ocean/5 rounded-2xl border border-ocean/10">
                                    <p className="text-[10px] font-black text-ocean uppercase tracking-widest mb-1">Ship-to Coordinates</p>
                                    <p className="text-sm text-midnight leading-relaxed">{expandedOrder.delivery_address || 'Registered Address'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Simple List View */
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Order Ref</th>
                                        <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.map(order => (
                                        <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-ocean">#SF-{order.id}</div>
                                                <div className="text-xs text-gray-400 max-w-[200px] truncate">{order.delivery_address || 'Standard Delivery'}</div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="text-sm font-semibold text-midnight">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-lg font-bold text-midnight">${order.total_amount}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusTheme(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => setExpandedOrder(order)}
                                                    className="px-4 py-2 bg-ocean/10 text-ocean text-xs font-black uppercase tracking-widest rounded-xl hover:bg-ocean hover:text-white transition-all shadow-sm"
                                                >
                                                    Track Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
