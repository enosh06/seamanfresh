import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Fish } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        borderRadius: '8px',
        transition: 'all 0.2s',
        color: isActive(path) ? 'var(--accent)' : 'var(--text-muted)',
        background: isActive(path) ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
        fontWeight: isActive(path) ? '600' : '500',
        textDecoration: 'none'
    });

    return (
        <nav style={{
            background: 'white',
            borderBottom: '1px solid var(--border)',
            padding: '16px 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
                        padding: '10px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        <Fish size={24} color="white" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary)', letterSpacing: '-0.5px' }}>Seaman Fresh</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Admin Portal</span>
                    </div>
                </Link>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '6px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <Link to="/" style={navLinkStyle('/')}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/products" style={navLinkStyle('/products')}>
                        <Package size={18} /> Products
                    </Link>
                    <Link to="/orders" style={navLinkStyle('/orders')}>
                        <ShoppingCart size={18} /> Orders
                    </Link>
                </div>

                <button onClick={handleLogout} className="btn" style={{
                    color: 'var(--danger)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '10px 16px',
                }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
