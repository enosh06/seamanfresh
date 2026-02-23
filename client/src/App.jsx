import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FixedPanelLink from './components/FixedPanelLink';
import SeamanAssistant from './components/SeamanAssistant';

import LoadingSpinner from './components/LoadingSpinner';
import ServerStatusBanner from './components/ServerStatusBanner';

// Pages - Lazy Loading
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const UserSettings = React.lazy(() => import('./pages/UserSettings'));
const Contact = React.lazy(() => import('./pages/Contact'));
const AdminMessages = React.lazy(() => import('./pages/AdminMessages'));

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

import AdminNotificationSound from './components/AdminNotificationSound';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return (
    <>
      <AdminNotificationSound />
      {children}
    </>
  );
};

// Page Transition Component
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

        {/* User Private Routes */}
        <Route path="/checkout" element={<ProtectedRoute><PageTransition><Checkout /></PageTransition></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageTransition><UserSettings /></PageTransition></ProtectedRoute>} />

        {/* Admin Private Routes */}
        <Route path="/admin/messages" element={<AdminRoute><PageTransition><AdminMessages /></PageTransition></AdminRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

import ScrollToTop from './components/ScrollToTop';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-grow pt-24 lg:pt-32">
              <React.Suspense fallback={
                <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                  <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decoding Freshness...</span>
                </div>
              }>
                <AnimatedRoutes />
              </React.Suspense>
            </main>
            <Footer />
            <FixedPanelLink />
            <SeamanAssistant />
            <ServerStatusBanner />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
