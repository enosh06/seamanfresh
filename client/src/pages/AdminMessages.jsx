import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Trash2, Calendar, User, Search } from 'lucide-react';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    }) + ' • ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/messages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(messages.filter(msg => msg.id !== id));
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading messages...</div>;

    return (
        <div className="bg-gray-50/50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-midnight mb-2">Messages</h1>
                        <p className="text-gray-500">View and manage customer inquiries</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl text-ocean font-medium shadow-sm">
                        Total: {messages.length}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/20 outline-none transition-all"
                    />
                </div>

                {filteredMessages.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Messages Found</h3>
                        <p className="text-gray-400">Your inbox is empty.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredMessages.map((msg) => (
                            <div key={msg.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg text-midnight">{msg.subject || 'No Subject'}</h3>
                                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-mono">
                                                #{msg.id}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <User size={14} />
                                                <span className="font-medium text-gray-700">{msg.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={14} />
                                                <a href={`mailto:${msg.email}`} className="hover:text-ocean transition-colors">
                                                    {msg.email}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                <span>{formatDate(msg.created_at)}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">
                                            {msg.message}
                                        </p>
                                    </div>

                                    <div className="flex md:flex-col justify-end gap-2">
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Message"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your Inquiry'}`}
                                            className="p-2 text-gray-400 hover:text-ocean hover:bg-ocean/10 rounded-lg transition-colors flex items-center justify-center"
                                            title="Reply via Email"
                                        >
                                            <Mail size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessages;
