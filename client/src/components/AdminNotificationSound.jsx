import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminNotificationSound = () => {
    const { user } = useAuth();
    const [lastOrderId, setLastOrderId] = useState(null);
    const audioRef = useRef(new Audio('/notification.mp3'));

    useEffect(() => {
        if (!user || user.role !== 'admin') return;

        console.log("AdminNotification: Order monitoring active.");
        audioRef.current.load();

        // Initialize lastOrderId on first load
        const initLastOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.length > 0) {
                    setLastOrderId(res.data[0].id);
                } else {
                    setLastOrderId(0);
                }
            } catch (err) {
                console.error("Error initializing orders", err);
            }
        };

        initLastOrder();

        const pollOrders = setInterval(async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data && res.data.length > 0) {
                    const latestId = res.data[0].id;
                    console.log(`Checking orders: Latest ID ${latestId}, Last Seen ${lastOrderId}`);
                    if (lastOrderId !== null && latestId > lastOrderId) {
                        // Play alerting sound
                        console.log(`New order detected (#SF-${latestId})! Playing notification...`);
                        const audio = audioRef.current;
                        audio.currentTime = 0;
                        audio.volume = 0.9;
                        audio.play().catch(e => console.warn("AdminNotification: Playback blocked:", e));

                        setLastOrderId(latestId);

                        if ("Notification" in window && Notification.permission === "granted") {
                            new Notification("New Order Received!", {
                                body: `Order #SF-${latestId} has just been placed.`,
                            });
                        }
                    } else if (lastOrderId === null) {
                        setLastOrderId(latestId);
                    }
                }
            } catch (err) {
                console.error("Error polling orders", err);
            }
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(pollOrders);
    }, [user, lastOrderId]);

    return null;
};

export default AdminNotificationSound;
