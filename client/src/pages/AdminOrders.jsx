import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Package, MapPin, Clock, CheckCircle, XCircle, Truck, Trash2 } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = useCallback(async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders();
    }, [fetchOrders]);

    const updateStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrders();
    };

    const handleClearOrders = async () => {
        if (window.confirm('Are you sure you want to delete ALL orders? This cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchOrders();
                alert('All orders have been cleared.');
            } catch (err) {
                console.error(err);
                alert('Failed to clear orders.');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle size={16} />;
            case 'shipped': return <Truck size={16} />;
            case 'processing': return <Package size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;

    return (
        <div className="min-h-screen bg-surface py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-midnight mb-2">
                            Order <span className="text-ocean">Logistics</span>
                        </h1>
                        <p className="text-gray-500">{orders.length} total orders</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleClearOrders}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 border border-red-200 rounded-xl hover:bg-red-200 transition-colors font-semibold"
                        >
                            <Trash2 size={18} />
                            Clear All Orders
                        </button>
                        <div className="flex items-center gap-2 px-4 py-2 bg-ocean/10 border border-ocean/20 rounded-full">
                            <Package className="text-ocean" size={16} />
                            <span className="text-sm font-semibold text-ocean">Active: {activeOrders}</span>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-midnight text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Destination</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-surface transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-midnight">#SF-{order.id}</div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wide">Order Ref</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-midnight">{order.user_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2">{order.delivery_address}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="text-xl font-bold text-ocean">${order.total_amount}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent cursor-pointer transition-all"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.length === 0 && (
                        <div className="text-center py-20">
                            <Package size={64} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-400 text-lg">No orders yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
