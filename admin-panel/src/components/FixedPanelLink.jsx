import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { STORE_URL } from '../config';

const FixedPanelLink = () => {
    return (
        <a
            href={STORE_URL}
            title="Go to Store"
            style={{
                position: 'fixed',
                bottom: '30px',
                bottom: '30px',
                left: '30px',
                width: '60px',
                height: '60px',
                background: '#0B0B0B',
                color: 'white',
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
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
            }}
        >
            <ShoppingBag size={24} />
        </a>
    );
};

export default FixedPanelLink;
