import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    ShoppingBag,
    DollarSign,
    Package,
    TrendingUp,
    Clock,
    ArrowRight,
    Activity,
    Users,
    AlertCircle,
    CheckCircle,
    Truck,
    XCircle
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0, customers: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("No authentication token found. Please login.");
                setLoading(false);
                return;
            }
            try {
                const [oRes, pRes, aRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/products'),
                    api.get('/orders/analytics')
                ]);

                const totalRevenue = oRes.data.reduce((acc, o) => acc + parseFloat(o.total_amount), 0);
                // Mock unique customers count if not available
                const uniqueCustomers = new Set(oRes.data.map(o => o.user_id)).size;

                setStats({
                    orders: oRes.data.length,
                    products: pRes.data.length,
                    revenue: totalRevenue.toFixed(2),
                    customers: uniqueCustomers
                });

                // Sort orders by date descending if not already
                const sortedOrders = oRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setRecentOrders(sortedOrders.slice(0, 5));
                setAnalyticsData(aRes.data);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
                setError(err.response?.data?.message || err.message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 fade-in">
                    <div>
                        <h1 className="text-3xl font-bold text-midnight mb-1">
                            {greeting}, <span className="text-ocean">{user?.name || 'Admin'}</span>
                        </h1>
                        <p className="text-gray-500 text-sm">Here's what's happening with your store today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right mr-2">
                            <div className="text-sm font-bold text-midnight">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <div className="text-xs text-gray-400">System Status: Optimal</div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-green-100 shadow-sm rounded-full">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-medium text-green-700">Live</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.revenue}`}
                        icon={<DollarSign className="text-white" size={24} />}
                        trend="+12.5%"
                        trendUp={true}
                        gradient="from-blue-600 to-blue-400"
                        delay={0}
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats.orders}
                        icon={<ShoppingBag className="text-white" size={24} />}
                        trend="+5.2%"
                        trendUp={true}
                        gradient="from-purple-600 to-purple-400"
                        delay={100}
                    />
                    <StatCard
                        title="Products"
                        value={stats.products}
                        icon={<Package className="text-white" size={24} />}
                        trend="Inventory Status"
                        trendUp={true}
                        gradient="from-orange-500 to-pink-500"
                        delay={200}
                    />
                    <StatCard
                        title="Customers"
                        value={stats.customers}
                        icon={<Users className="text-white" size={24} />}
                        trend="+8 New"
                        trendUp={true}
                        gradient="from-teal-500 to-emerald-400"
                        delay={300}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area: Chart & Orders */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Analytics Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-midnight">Revenue Analytics</h3>
                                    <p className="text-xs text-gray-400">Revenue trends over the last period</p>
                                </div>
                                <select className="text-sm border-gray-200 rounded-lg p-2 bg-gray-50 font-medium text-gray-600 focus:ring-ocean focus:border-ocean">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                </select>
                            </div>
                            <div className="h-64 w-full">
                                <SmoothLineChart data={analyticsData} />
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-midnight">Recent Orders</h3>
                                <Link to="/admin/orders" className="text-ocean hover:text-ocean-dark text-sm font-semibold flex items-center gap-1 transition-colors">
                                    View All <ArrowRight size={16} />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-midnight group-hover:text-ocean transition-colors">#SF-{order.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-ocean/10 flex items-center justify-center text-ocean font-bold text-xs">
                                                            {order.user_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">{order.user_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <OrderStatusBadge status={order.status} />
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-gray-800">
                                                    ${order.total_amount}
                                                </td>
                                            </tr>
                                        ))}
                                        {recentOrders.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                                    No recent orders found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: Quick Actions & Notifications */}
                    <div className="space-y-6">
                        {/* Quick Actions Panel */}
                        <div className="bg-gradient-to-br from-midnight to-gray-900 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="text-xl font-bold mb-1">Quick Actions</h3>
                            <p className="text-gray-400 text-sm mb-6">Manage your store efficiently</p>

                            <div className="space-y-3">
                                <Link to="/admin/products" className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer border border-white/5">
                                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Manage Products</div>
                                        <div className="text-xs text-gray-400">Add or edit inventory</div>
                                    </div>
                                </Link>

                                <Link to="/admin/orders" className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer border border-white/5">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Process Orders</div>
                                        <div className="text-xs text-gray-400">View pending shipments</div>
                                    </div>
                                </Link>

                                <Link to="/admin/settings" className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer border border-white/5">
                                    <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Sales Report</div>
                                        <div className="text-xs text-gray-400">Download monthly report</div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* System Health / Notifications */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h4 className="font-bold text-midnight mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-ocean" /> System Status
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Database</span>
                                    <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle size={14} /> Connected</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Payment Gateway</span>
                                    <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Last Backup</span>
                                    <span className="text-gray-700 font-medium">2 hours ago</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h4 className="font-bold text-midnight mb-2 text-sm">Test Audio</h4>
                                <button
                                    onClick={() => {
                                        const audio = new Audio('/notification.mp3');
                                        audio.play().catch(() => alert("Audio blocked! Please interact with the page first."));
                                    }}
                                    className="w-full py-2.5 bg-ocean/5 text-ocean border border-ocean/20 rounded-xl font-bold text-xs hover:bg-ocean/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    <AlertCircle size={14} /> Test Alert Sound
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Components

const StatCard = ({ title, value, icon, trend, trendUp, gradient, delay }) => (
    <div
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-midnight tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 z-10 relative">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {trend}
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
        </div>
        {/* Decorative background blob */}
        <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-5 bg-gradient-to-br ${gradient} blur-xl group-hover:opacity-10 transition-opacity`}></div>
    </div>
);

const OrderStatusBadge = ({ status }) => {
    const styles = {
        delivered: 'bg-green-100 text-green-700 border-green-200',
        processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        shipped: 'bg-blue-100 text-blue-700 border-blue-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
        pending: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    const icons = {
        delivered: <CheckCircle size={12} />,
        processing: <Clock size={12} />,
        shipped: <Truck size={12} />,
        cancelled: <XCircle size={12} />,
        pending: <AlertCircle size={12} />
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[status] || styles.pending}`}>
            {icons[status] || icons.pending}
            {status}
        </span>
    );
};

const SmoothLineChart = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400 text-sm">No data available</div>;

    // Normalize data
    const maxVal = Math.max(...data.map(d => Number(d.revenue)), 100) * 1.1;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (Number(d.revenue) / maxVal) * 100;
        return { x, y, val: d.revenue, label: d.displayDate };
    });

    // Generate Bezier Path
    const svgPath = (points) => {
        const d = points.reduce((acc, point, i, a) => {
            if (i === 0) return `M ${point.x},${point.y}`;
            const cps = controlPoint(a[i - 1], a[i - 2], point);
            const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
            return `${acc} C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`;
        }, '');
        return d;
    };

    // Simple control point calculation for smooth curve
    const controlPoint = (current, previous, next, reverse) => {
        const p = previous || current;
        const n = next || current;
        const smoothing = 0.2;
        const x = current.x + (n.x - p.x) * smoothing * (reverse ? -1 : 1);
        const y = current.y + (n.y - p.y) * smoothing * (reverse ? -1 : 1);
        return { x, y };
    };

    const pathD = svgPath(points);

    return (
        <div className="w-full h-full relative" onMouseLeave={() => setActiveIndex(null)}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Horizontal Grid Lines */}
                {[0, 25, 50, 75, 100].map(p => (
                    <line key={p} x1="0" y1={p} x2="100" y2={p} stroke="#f3f4f6" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}

                {/* Area Fill */}
                <path d={`${pathD} L 100,100 L 0,100 Z`} fill="url(#chartGradient)" />

                {/* Stroke Line */}
                <path d={pathD} fill="none" stroke="#0EA5E9" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />

                {/* Interactive Points */}
                {points.map((p, i) => (
                    <g key={i} onMouseEnter={() => setActiveIndex(i)}>
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="4" // constant radius
                            fill={activeIndex === i ? "#fff" : "transparent"}
                            stroke={activeIndex === i ? "#0EA5E9" : "transparent"}
                            strokeWidth="2"
                            className="transition-all duration-200 cursor-pointer"
                            vectorEffect="non-scaling-stroke"
                        />
                        {/* Invisible hover target area for easier interaction */}
                        <rect x={p.x - 2} y="0" width="4" height="100" fill="transparent" className="cursor-crosshair" />
                    </g>
                ))}
            </svg>

            {/* Tooltip */}
            {activeIndex !== null && (
                <div
                    className="absolute bg-midnight text-white text-xs rounded-lg py-1 px-2 pointer-events-none transform -translate-x-1/2 -translate-y-full shadow-xl z-20"
                    style={{ left: `${points[activeIndex].x}%`, top: `${points[activeIndex].y}%`, marginTop: '-10px' }}
                >
                    <div className="font-bold">${points[activeIndex].val}</div>
                    <div className="text-[10px] text-gray-400">{points[activeIndex].label}</div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-midnight"></div>
                </div>
            )}

            {/* X Axis Labels */}
            <div className="flex justify-between mt-2 px-2 text-[10px] text-gray-400 font-medium w-full absolute bottom-[-20px]">
                {data.map((d, i) => (
                    i % Math.ceil(data.length / 5) === 0 ? <span key={i}>{d.displayDate}</span> : null
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
