import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminNotificationSound = () => {
    const { user } = useAuth();
    const lastOrderIdRef = useRef(null);
    const audioRef = useRef(new Audio(`${import.meta.env.BASE_URL}notification.mp3`));

    useEffect(() => {
        if (!user || user.role !== 'admin') return;

        console.log("AdminNotification: Order monitoring active.");
        audioRef.current.load();

        // Initialize lastOrderId on first load
        const initLastOrder = async () => {
            try {
                const res = await api.get('/orders');
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    lastOrderIdRef.current = Math.max(...res.data.map(o => o.id));
                } else {
                    lastOrderIdRef.current = 0;
                }
            } catch (err) {
                console.error("Error initializing orders", err);
            }
        };

        initLastOrder();

        const pollOrders = setInterval(async () => {
            try {
                const res = await api.get('/orders');

                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    const maxId = Math.max(...res.data.map(o => o.id));
                    const currentId = lastOrderIdRef.current;

                    if (currentId !== null && maxId > currentId) {
                        // Play alerting sound
                        console.log(`New order detected (#SF-${maxId})! Playing notification...`);
                        const audio = audioRef.current;
                        audio.currentTime = 0;
                        audio.volume = 0.9;
                        audio.play().catch(e => console.warn("AdminNotification: Playback blocked:", e));

                        lastOrderIdRef.current = maxId;

                        if ("Notification" in window && Notification.permission === "granted") {
                            new Notification("New Order Received!", {
                                body: `Order #SF-${maxId} has just been placed.`,
                            });
                        }
                    } else if (currentId === null) {
                        lastOrderIdRef.current = maxId;
                    }
                }
            } catch (err) {
                console.error("Error polling orders", err);
            }
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(pollOrders);
    }, [user]);

    return null;
};

export default AdminNotificationSound;
