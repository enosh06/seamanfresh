import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Bell, AlertCircle } from 'lucide-react';

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
                const res = await api.get(`/orders?_t=${Date.now()}`);
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    lastOrderIdRef.current = Math.max(...res.data.map(o => Number(o.id)));
                    console.log("AdminPanelNotification: Initialized with Max Order ID:", lastOrderIdRef.current);
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
                const res = await api.get(`/orders?_t=${Date.now()}`); // Fetch current list (backend likely ignores limit or sorts variably)

                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    // Robustly find the true latest ID regardless of sort order
                    const maxId = Math.max(...res.data.map(o => Number(o.id)));
                    const currentId = Number(lastOrderIdRef.current);

                    // Only trigger if we have a valid baseline AND a STRICTLY NEWER order
                    if (currentId > 0 && maxId > currentId) {
                        console.log(`🔔 NEW ORDER DETECTED: ${maxId} (Previous Max: ${currentId})`);

                        lastOrderIdRef.current = maxId;

                        // 1. Play Sound
                        const audio = audioRef.current;
                        audio.currentTime = 0;
                        audio.play().catch(e => console.warn("Audio autoplay blocked:", e));

                        // 2. Dispatch Event
                        window.dispatchEvent(new Event('orderUpdated'));

                        // 3. Show Visual Toast
                        setToast({ id: maxId });
                        setTimeout(() => setToast(null), 8000);

                        // 4. Browser Notification
                        if ("Notification" in window && Notification.permission === "granted") {
                            new Notification("New Order Received!", {
                                body: `Order #SF-${maxId} placed successfully.`,
                                icon: '/favicon.ico'
                            });
                        }
                    } else if (currentId === 0) {
                        // First sync
                        lastOrderIdRef.current = maxId;
                    }
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 2000); // Check every 2 seconds

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
