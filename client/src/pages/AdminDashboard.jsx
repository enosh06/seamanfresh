import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, Package, TrendingUp, Clock, ArrowRight, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [analyticsData, setAnalyticsData] = useState([]);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            // Token check is still good for early exit/error
            const token = localStorage.getItem('token');
            if (!token) {
                setError("No authentication token found. Please login.");
                return;
            }
            try {
                // api instance already has baseURL 'http://localhost:5000/api'
                // and interceptor adds Authorization header
                const [oRes, pRes, aRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/products'),
                    api.get('/orders/analytics')
                ]);

                const totalRevenue = oRes.data.reduce((acc, o) => acc + parseFloat(o.total_amount), 0);
                setStats({
                    orders: oRes.data.length,
                    products: pRes.data.length,
                    revenue: totalRevenue.toFixed(2)
                });
                setRecentOrders(oRes.data.slice(0, 5));
                setAnalyticsData(aRes.data);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
                setError(err.response?.data?.message || err.message || "Failed to load dashboard data");
            }
        };
        fetchAdminData();
    }, []);

    return (
        <div className="min-h-screen bg-surface py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-midnight mb-2">
                            Admin <span className="text-ocean">Hub</span>
                        </h1>
                        <p className="text-gray-500">Manage your seafood empire</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                        <Activity className="text-green-600" size={16} />
                        <span className="text-sm font-semibold text-green-700">System Healthy</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={<ShoppingBag size={32} />}
                        label="Total Orders"
                        value={stats.orders}
                        trend="+12% this month"
                        bgColor="bg-ocean"
                    />
                    <StatCard
                        icon={<DollarSign size={32} />}
                        label="Revenue"
                        value={`$${stats.revenue}`}
                        trend="+8% this month"
                        bgColor="bg-green-600"
                    />
                    <StatCard
                        icon={<Package size={32} />}
                        label="Active Products"
                        value={stats.products}
                        trend="In stock"
                        bgColor="bg-midnight"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-display text-midnight">Recent Orders</h3>
                            <Link to="/admin/orders" className="text-ocean hover:text-ocean-dark font-semibold text-sm flex items-center gap-1">
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-surface border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-surface transition-colors text-sm">
                                            <td className="px-6 py-4 font-bold text-midnight">
                                                <Link to={`/admin/orders`} className="hover:text-ocean hover:underline">
                                                    #SF-{order.id}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{order.user_name}</td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.status === 'processing' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            'bg-gray-50 text-gray-700 border-gray-200'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-ocean">${order.total_amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {recentOrders.length === 0 && (
                                <div className="text-center py-12 text-gray-400">
                                    {error ? (
                                        <div className="text-red-500">
                                            <p className="font-bold">Error loading orders:</p>
                                            <p>{error}</p>
                                        </div>
                                    ) : (
                                        "No orders yet"
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-bold font-display text-midnight mb-6">Quick Actions</h3>
                        <div className="space-y-4">
                            <Link
                                to="/admin/products"
                                className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-ocean text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                                        <Package size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-midnight mb-1">Inventory Control</h4>
                                        <p className="text-sm text-gray-500">Manage products</p>
                                    </div>
                                    <ArrowRight className="text-gray-400 group-hover:text-ocean group-hover:translate-x-1 transition-all" size={20} />
                                </div>
                            </Link>

                            <Link
                                to="/admin/orders"
                                className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-600 text-white p-3 rounded-xl group-hover:scale-110 transition-transform">
                                        <Clock size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-midnight mb-1">Order Pipeline</h4>
                                        <p className="text-sm text-gray-500">Track shipments</p>
                                    </div>
                                    <ArrowRight className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" size={20} />
                                </div>
                            </Link>

                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-ocean/10 rounded-lg">
                                        <TrendingUp className="text-ocean" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-midnight">Performance</h4>
                                        <p className="text-xs text-gray-400">Last 7 Days Revenue</p>
                                    </div>
                                </div>
                                <SimpleLineChart data={analyticsData} />
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mt-4">
                                <h4 className="font-bold text-midnight mb-2">Notifications</h4>
                                <p className="text-xs text-gray-500 mb-4">Click to test the alert sound and unblock audio.</p>
                                <button
                                    onClick={() => {
                                        const audio = new Audio('/notification.mp3');
                                        audio.play().catch(e => alert("Audio blocked! Please click the page first."));
                                    }}
                                    className="w-full py-2 bg-ocean/5 text-ocean border border-ocean/20 rounded-xl font-bold text-sm hover:bg-ocean/10 transition-colors"
                                >
                                    Test Alert Sound
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

const SimpleLineChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data available</div>;

    const maxVal = Math.max(...data.map(d => d.revenue), 100); // Min max of 100 to avoid flat line at 0
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.revenue / maxVal) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full">
            <div className="relative h-32 w-full">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-300 pointer-events-none">
                    <div className="border-b border-gray-100 w-full h-0"></div>
                    <div className="border-b border-gray-100 w-full h-0"></div>
                    <div className="border-b border-gray-100 w-full h-0"></div>
                </div>

                {/* The Chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible preserve-3d">
                    {/* Area gradient */}
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-ocean)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--color-ocean)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`M0,100 ${points.split(' ').map(p => 'L' + p).join(' ')} L100,100 Z`}
                        fill="url(#gradient)"
                    />
                    {/* Line */}
                    <polyline
                        fill="none"
                        stroke="var(--color-ocean)"
                        strokeWidth="3"
                        points={points}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-sm"
                    />
                    {/* Dots */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = 100 - (d.revenue / maxVal) * 100;
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="white"
                                stroke="var(--color-ocean)"
                                strokeWidth="2"
                                className="hover:scale-150 transition-transform cursor-pointer"
                            >
                                <title>${d.revenue} - {d.displayDate}</title>
                            </circle>
                        );
                    })}
                </svg>
            </div>
            {/* X Axis Labels */}
            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium">
                {data.map((d, i) => (
                    <span key={i}>{d.displayDate}</span>
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, bgColor }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
            <div className={`${bgColor} text-white p-4 rounded-xl`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-midnight">{value}</h3>
                <p className="text-xs text-green-600 font-semibold mt-1">{trend}</p>
            </div>
        </div>
    </div>
);

export default AdminDashboard;
