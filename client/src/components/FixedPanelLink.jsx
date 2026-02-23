import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, User, Lock, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const FixedPanelLink = () => {
    const { user } = useAuth();

    const getLinkData = () => {
        if (!user) return { to: '/login', icon: <Lock size={24} />, label: 'Login', external: false };
        return { to: '/dashboard', icon: <User size={24} />, label: 'My Panel', external: false };
    };

    const { to, icon, label, external } = getLinkData();

    const commonStyles = {
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        width: '72px',
        height: '72px',
        background: '#0F172A',
        color: '#0EA5E9',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        zIndex: 9999,
        transition: 'all 0.3s ease',
        border: '2px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(5px)',
        textDecoration: 'none'
    };

    // Injecting pulse animation for the button
    const styles = ``;

    const handleMouseOver = (e) => {
        e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
    };

    const handleMouseOut = (e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
    };

    if (external) {
        return (
            <>
                <style>{styles}</style>
                <a
                    href={to}
                    title={label}
                    style={commonStyles}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    {icon}
                </a>
            </>
        );
    }

    return (
        <Link
            to={to}
            title={label}
            style={commonStyles}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            {icon}
        </Link>
    );
};

export default FixedPanelLink;
