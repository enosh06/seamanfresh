import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { RefreshCw, Wifi, WifiOff, Loader2 } from 'lucide-react';

const ServerStatusBanner = () => {
    const [status, setStatus] = useState('checking'); // checking, online, sleeping, error
    const [isWaking, setIsWaking] = useState(false);

    const checkStatus = async () => {
        try {
            const startTime = Date.now();
            // Use a long timeout for the initial ping to accommodate Render's sleep
            const response = await api.get('/ping', { timeout: 30000 });
            const duration = Date.now() - startTime;

            if (response.status === 200) {
                setStatus('online');
                // If it took a long time, it might have just woken up
                if (duration > 5000) {
                    console.log('Server just woke up (Cold Start)');
                }
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout') || error.message.includes('Network Error')) {
                setStatus('sleeping');
            } else {
                setStatus('error');
            }
            console.error('Server status check failed:', error);
        }
    };

    useEffect(() => {
        checkStatus();
        // Periodically ping to keep alive
        const interval = setInterval(checkStatus, 10 * 60 * 1000); // 10 minutes
        return () => clearInterval(interval);
    }, []);

    const handlePing = async () => {
        setIsWaking(true);
        setStatus('checking');
        try {
            // Force a wakeup with a 60s timeout
            await api.get('/ping', { timeout: 60000 });
            setStatus('online');
        } catch (error) {
            setStatus('sleeping');
        } finally {
            setIsWaking(false);
        }
    };

    if (status === 'online') return null;

    return (
        <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-50 p-4 rounded-xl shadow-2xl border transition-all duration-500 ${status === 'sleeping'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
            <div className="flex items-start gap-3">
                <div className="mt-1">
                    {status === 'checking' ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    ) : status === 'sleeping' ? (
                        <WifiOff className="w-5 h-5 text-blue-600" />
                    ) : (
                        <Wifi className="w-5 h-5 text-amber-600" />
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm">
                        {status === 'sleeping' ? 'Backend is Sleeping 😴' : 'Server Connection Issue'}
                    </h4>
                    <p className="text-xs mt-1 opacity-90 leading-relaxed">
                        {status === 'sleeping'
                            ? 'The server is hosted on a free tier and takes about 60 seconds to wake up after inactivity.'
                            : 'We\'re having trouble connecting to the server. Please check your internet or try again.'}
                    </p>
                    <button
                        onClick={handlePing}
                        disabled={isWaking}
                        className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${status === 'sleeping'
                                ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
                                : 'bg-amber-600 text-white hover:bg-amber-700 disabled:bg-amber-400'
                            }`}
                    >
                        {isWaking ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Waking up (please wait)...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-3 h-3" />
                                Wake up Server
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServerStatusBanner;
