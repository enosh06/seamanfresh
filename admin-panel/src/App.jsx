import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
// Pages - Lazy Loading
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Products = React.lazy(() => import('./pages/Products'));
const Orders = React.lazy(() => import('./pages/Orders'));
import Navbar from './components/Navbar';
import NotificationSound from './components/NotificationSound';
import FixedPanelLink from './components/FixedPanelLink';
import ServerStatusBanner from './components/ServerStatusBanner';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <>
      <Navbar />
      <NotificationSound />
      <main className="container" style={{ paddingTop: '40px' }}>
        {children}
      </main>
    </>
  );
};

// Page Transition Component
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ width: '100%' }}
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
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/" element={<PrivateRoute><PageTransition><Dashboard /></PageTransition></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><PageTransition><Products /></PageTransition></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><PageTransition><Orders /></PageTransition></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#666' }}>Loading...</div>}>
          <AnimatedRoutes />
          <FixedPanelLink />
          <ServerStatusBanner />
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
