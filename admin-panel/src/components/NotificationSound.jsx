import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bell, AlertCircle } from 'lucide-react';
import API_URL from '../config';

const NotificationSound = () => {
    const { user } = useAuth();
    const lastOrderIdRef = useRef(null);
    const audioRef = useRef(new Audio('/notification.mp3'));

    // UI State
    const [toast, setToast] = useState(null); // { id: 123 }

    useEffect(() => {
        if (!user) return;

        console.log("AdminPanelNotification: Service active.");

        // Initial Fetch to set baseline
        const init = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const res = await axios.get(`${API_URL}/api/orders?_t=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.length > 0) {
                    lastOrderIdRef.current = Number(res.data[0].id);
                    console.log("AdminPanelNotification: Initialized with Order ID:", lastOrderIdRef.current);
                } else {
                    lastOrderIdRef.current = 0;
                }
            } catch (err) {
                console.error("AdminPanelNotification: Init failed", err);
            }
        };
        init();

        // Polling Interval
        const poll = setInterval(async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const res = await axios.get(`${API_URL}/api/orders?limit=1&_t=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data && res.data.length > 0) {
                    const latestId = Number(res.data[0].id);
                    const currentId = Number(lastOrderIdRef.current);

                    // Only trigger if we have a valid baseline AND a STRICTLY NEWER order
                    if (currentId > 0 && latestId > currentId) {
                        console.log(`🔔 NEW ORDER: ${latestId} (Last: ${currentId})`);

                        lastOrderIdRef.current = latestId;

                        // 1. Play Sound
                        const audio = audioRef.current;
                        audio.currentTime = 0;
                        audio.play().catch(e => console.warn("Audio autoplay blocked:", e));

                        // 2. Dispatch Event
                        window.dispatchEvent(new Event('orderUpdated'));

                        // 3. Show Visual Toast
                        setToast({ id: latestId });
                        setTimeout(() => setToast(null), 8000);

                        // 4. Browser Notification
                        if ("Notification" in window && Notification.permission === "granted") {
                            new Notification("New Order Received!", {
                                body: `Order #SF-${latestId} placed successfully.`,
                                icon: '/favicon.ico'
                            });
                        }
                    } else if (currentId === 0) {
                        // First sync
                        lastOrderIdRef.current = latestId;
                    }
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(poll);
    }, [user]);

    // Render Visual Toast
    if (!toast) return null;

    return (
        <div style={{
            position: 'fixed', bottom: '32px', right: '32px',
            background: 'white', color: '#10b981', padding: '16px 24px',
            borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            zIndex: 9999, display: 'flex', alignItems: 'center', gap: '16px',
            border: '1px solid #e5e7eb', borderLeft: '6px solid #10b981',
            animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            minWidth: '320px'
        }}>
            <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '50%' }}>
                <Bell size={28} color="#059669" />
            </div>
            <div>
                <div style={{ fontWeight: '800', fontSize: '16px', color: '#111827' }}>New Order Received!</div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px' }}>Order <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#SF-{toast.id}</span> placed just now.</div>
            </div>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%) scale(0.9); opacity: 0; }
                    to { transform: translateX(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default NotificationSound;
