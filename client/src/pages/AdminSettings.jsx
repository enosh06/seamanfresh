import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Lock, Key, CheckCircle, AlertCircle, User, Mail } from 'lucide-react';

const AdminSettings = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/auth/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to change password'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold font-display text-midnight mb-2">
                        Admin <span className="text-ocean">Settings</span>
                    </h1>
                    <p className="text-gray-500">Manage your account preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-midnight mb-6">Profile Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                                    <User className="text-ocean" size={20} />
                                    <div>
                                        <div className="text-xs text-gray-500">Name</div>
                                        <div className="font-semibold text-midnight">{user?.name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                                    <Mail className="text-ocean" size={20} />
                                    <div>
                                        <div className="text-xs text-gray-500">Email</div>
                                        <div className="font-semibold text-midnight">{user?.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-ocean/10 rounded-xl border border-ocean/20">
                                    <Key className="text-ocean" size={20} />
                                    <div>
                                        <div className="text-xs text-ocean">Role</div>
                                        <div className="font-bold text-ocean uppercase">{user?.role}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-ocean text-white p-3 rounded-xl">
                                    <Lock size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-midnight">Change Password</h3>
                                    <p className="text-sm text-gray-500">Update your account password</p>
                                </div>
                            </div>

                            {message.text && (
                                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                                        ? 'bg-green-50 border border-green-200 text-green-700'
                                        : 'bg-red-50 border border-red-200 text-red-700'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    <span className="font-semibold">{message.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            required
                                            minLength="6"
                                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all"
                                            placeholder="Enter new password (min 6 characters)"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent transition-all"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-6 py-3.5 bg-ocean hover:bg-ocean-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-ocean/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            setMessage({ type: '', text: '' });
                                        }}
                                        className="px-6 py-3.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition-all"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
