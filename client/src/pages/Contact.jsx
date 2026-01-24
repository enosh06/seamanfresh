import React, { useState } from 'react';
import axios from 'axios';
import { Send, Mail, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post('http://localhost:5000/api/messages', {
                ...formData,
                userId: user?.id
            });
            setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
            setFormData({ ...formData, subject: '', message: '' });
        } catch {
            setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-display text-midnight mb-4">Contact Us</h1>
                    <p className="text-gray-600">Have a question or feedback? We'd love to hear from you.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-10 h-10 bg-ocean/10 rounded-full flex items-center justify-center text-ocean mb-4">
                                <Phone size={20} />
                            </div>
                            <h3 className="font-bold text-midnight mb-1">Phone</h3>
                            <p className="text-gray-600 text-sm mb-2">Mon-Fri 9am to 6pm</p>
                            <p className="font-medium text-ocean">+1 (555) 123-4567</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-10 h-10 bg-ocean/10 rounded-full flex items-center justify-center text-ocean mb-4">
                                <Mail size={20} />
                            </div>
                            <h3 className="font-bold text-midnight mb-1">Email</h3>
                            <p className="text-gray-600 text-sm mb-2">Online support</p>
                            <p className="font-medium text-ocean">support@seamanfresh.com</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-10 h-10 bg-ocean/10 rounded-full flex items-center justify-center text-ocean mb-4">
                                <MapPin size={20} />
                            </div>
                            <h3 className="font-bold text-midnight mb-1">Office</h3>
                            <p className="text-gray-600 text-sm">
                                123 Ocean Drive<br />
                                Fisher's Wharf, CA 90210
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-midnight mb-6 flex items-center gap-2">
                                <MessageSquare className="text-ocean" />
                                Send us a message
                            </h2>

                            {status.message && (
                                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                                    }`}>
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/20 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/20 outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/20 outline-none transition-all"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/20 outline-none transition-all resize-none"
                                        placeholder="Write your message here..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-ocean hover:bg-ocean-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-ocean/30 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Sending...' : (
                                        <>
                                            Send Message <Send size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
