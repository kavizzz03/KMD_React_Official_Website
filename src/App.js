import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHeart, FaCookieBite } from "react-icons/fa";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";

// Lazy loaded components - only loaded when needed
const HomePage = lazy(() => import("./components/HomePage"));
const ProductsPage = lazy(() => import("./components/ProductsPage"));
const ProductDetails = lazy(() => import("./components/ProductDetails"));
const CartPage = lazy(() => import("./components/CartPage"));
const AboutPage = lazy(() => import("./components/AboutPage"));
const ContactPage = lazy(() => import("./components/Contact"));

// Enhanced animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  out: {
    opacity: 0,
    y: -30,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: [0.55, 0.085, 0.68, 0.53]
    }
  }
};

const slideInVariants = {
  initial: {
    opacity: 0,
    x: -100
  },
  in: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  },
  out: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.5,
      ease: "easeIn"
    }
  }
};

// Enhanced loading component with sweet-themed design
const PageLoader = ({ pageName = "page" }) => (
  <motion.div 
    className="page-loader min-vh-100 d-flex align-items-center justify-content-center"
    style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-center text-white">
      <motion.div
        initial={{ scale: 0.5, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 15,
          duration: 0.8 
        }}
        className="mb-4"
      >
        <FaCookieBite size={60} className="text-warning" />
      </motion.div>
      <LoadingSpinner 
        text={`Preparing ${pageName}...`} 
        spinnerVariant="light"
        textClass="text-white fs-5"
      />
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 text-warning fst-italic"
      >
        Good things come to those who wait...
      </motion.p>
    </div>
  </motion.div>
);

// Enhanced 404 page with sweet theme
const NotFoundPage = () => (
  <motion.div
    key="not-found"
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    className="min-vh-100 d-flex align-items-center justify-content-center"
    style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}
  >
    <div className="text-center p-4 text-white">
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 200,
          delay: 0.2 
        }}
        className="mb-4"
      >
        <span className="display-1 fw-bold text-warning">404</span>
      </motion.div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-3"
      >
        <FaCookieBite size={40} className="text-warning mb-3" />
        <h2 className="h1 mb-3">Sweet Page Missing!</h2>
        <p className="fs-5 mb-4 opacity-75">
          Oops! This treat seems to have disappeared from our menu.
        </p>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="d-flex flex-wrap gap-3 justify-content-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-warning btn-lg px-4"
          onClick={() => window.history.back()}
        >
          Go Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-outline-light btn-lg px-4"
          onClick={() => window.location.href = '/'}
        >
          Home Page
        </motion.button>
      </motion.div>
    </div>
  </motion.div>
);

// AnimatedRoutes component to handle page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState('/');

  useEffect(() => {
    setPreviousPath(location.pathname);
  }, [location.pathname]);

  const getAnimationVariant = (currentPath, previousPath) => {
    // Use slide animation for product navigation, fade for others
    if (previousPath.includes('/product/') && currentPath.includes('/product/')) {
      return slideInVariants;
    }
    return pageVariants;
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <motion.div
              key="home"
              initial="initial"
              animate="in"
              exit="out"
              variants={getAnimationVariant(location.pathname, previousPath)}
            >
              <Suspense fallback={<PageLoader pageName="sweet delights" />}>
                <HomePage />
              </Suspense>
            </motion.div>
          }
        />

        {/* Products Page */}
        <Route
          path="/products"
          element={
            <Suspense fallback={<PageLoader pageName="products" />}>
              <motion.div
                key="products"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <ProductsPage />
              </motion.div>
            </Suspense>
          }
        />

        {/* Product Details */}
        <Route
          path="/product/:id"
          element={
            <Suspense fallback={<PageLoader pageName="product details" />}>
              <motion.div
                key={`product-${location.pathname}`}
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <ProductDetails />
              </motion.div>
            </Suspense>
          }
        />

        {/* Cart Page */}
        <Route
          path="/cart"
          element={
            <Suspense fallback={<PageLoader pageName="cart" />}>
              <motion.div
                key="cart"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <CartPage />
              </motion.div>
            </Suspense>
          }
        />

        {/* About Page */}
        <Route
          path="/about"
          element={
            <Suspense fallback={<PageLoader pageName="about us" />}>
              <motion.div
                key="about"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <AboutPage />
              </motion.div>
            </Suspense>
          }
        />

        {/* Contact Page */}
        <Route
          path="/contact"
          element={
            <Suspense fallback={<PageLoader pageName="contact" />}>
              <motion.div
                key="contact"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <ContactPage />
              </motion.div>
            </Suspense>
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </AnimatePresence>
  );
};

// Enhanced App Loading Component
const AppLoader = () => (
  <motion.div 
    className="min-vh-100 d-flex align-items-center justify-content-center app-loading"
    style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center text-white">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 15,
          duration: 1 
        }}
        className="mb-4"
      >
        <div className="sweet-logo mb-3">
          <FaCookieBite size={80} className="text-warning" />
        </div>
      </motion.div>
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="h2 mb-3 fw-bold"
      >
        KMD Sweet House
      </motion.h1>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <LoadingSpinner 
          size="lg" 
          text="Loading sweet delights..." 
          spinnerVariant="light"
          textClass="text-white fs-5"
        />
      </motion.div>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 text-warning fst-italic"
      >
        Crafting happiness, one sweet at a time...
      </motion.p>
    </div>
  </motion.div>
);

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [appLoaded, setAppLoaded] = useState(false);

  // Check for existing user session and cart on app load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate some initial loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const savedUser = localStorage.getItem('kmd_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        updateCartCount();
        setAppLoaded(true);
        
      } catch (error) {
        console.error('App initialization error:', error);
        setAppLoaded(true);
      }
    };

    initializeApp();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error('Error updating cart count:', error);
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    const userName = user?.name || user?.email || 'Sweet Customer';
    setUser(null);
    localStorage.removeItem('kmd_user');
    
    toast.success(`See you soon, ${userName}! 🍪`, {
      position: "top-right",
      autoClose: 4000,
      icon: '👋',
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }
    });
  };

  // Show app loader until everything is ready
  if (!appLoaded) {
    return <AppLoader />;
  }

  return (
    <Router>
      <div className="App">
        {/* Global Suspense boundary */}
        <Suspense fallback={<AppLoader />}>
          {/* Scroll to top component */}
          <ScrollToTop />
          
          {/* Enhanced Navbar */}
          <Navbar 
            user={user}
            onLogout={handleLogout}
            cartCount={cartCount}
          />
          
          {/* Main Content with smooth transitions */}
          <main className="main-content">
            <AnimatedRoutes />
          </main>

          {/* Enhanced Footer */}
          <Footer />

          {/* Custom Styled Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ 
              marginTop: '80px',
              zIndex: 9999 
            }}
            toastStyle={{
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              border: '1px solid rgba(255,193,7,0.2)',
              fontSize: '14px'
            }}
          />

          {/* Floating Love Message */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="position-fixed bottom-0 end-0 m-3"
            style={{ zIndex: 1030 }}
          >
            <div className="bg-warning text-dark px-3 py-2 rounded-pill shadow-sm d-flex align-items-center">
              <FaHeart className="text-danger me-2" size={14} />
              <small className="fw-bold">Made with Love</small>
            </div>
          </motion.div>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;