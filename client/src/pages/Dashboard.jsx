import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, Clock, CheckCircle, Truck, XCircle, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
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

    return (
        <div className="min-h-screen bg-surface py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Profile Header */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
                    <div className="bg-ocean h-32 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center p-1">
                                <div className="w-full h-full bg-surface rounded-xl flex items-center justify-center text-ocean text-3xl font-bold">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-midnight">
                                Hello, {user?.name}
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
                        <div className="bg-purple-50 p-4 rounded-xl text-purple-600">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Account Status</p>
                            <h3 className="text-2xl font-bold text-midnight">Verified</h3>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-display font-bold text-midnight mb-6">Recent Orders</h2>

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
                ) : (
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Order Ref</th>
                                        <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
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
                                                <div className="text-[10px] text-gray-400">
                                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-lg font-bold text-midnight">${order.total_amount}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            order.status === 'processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                'bg-gray-50 text-gray-700 border-gray-200'
                                                        }`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                </div>
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
