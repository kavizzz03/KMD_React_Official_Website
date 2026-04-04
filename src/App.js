// App.js
import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaHeart, FaShieldAlt, FaTruck, FaExchangeAlt, FaShoppingBag, FaArrowRight, 
  FaStar, FaWhatsapp, FaTshirt, FaTag, FaCrown, FaGem, FaLeaf, FaRocket, 
  FaAward, FaMedal, FaTools, FaCut, FaRuler, FaPaintBrush, FaShoppingCart, 
  FaUser, FaSearch, FaBars, FaTimes, FaChevronLeft, FaChevronRight, FaChevronDown, 
  FaChevronUp, FaPlus, FaMinus, FaTrash, FaEdit, FaCheck, FaSpinner, FaInfoCircle, 
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";
import { GiClothes, GiNecklace, GiSewingMachine, GiDress } from "react-icons/gi";
import { MdLocalOffer, MdNewReleases, MdFiberManualRecord } from "react-icons/md";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Lazy loaded components
const HomePage = lazy(() => import("./components/HomePage"));
const ProductsPage = lazy(() => import("./components/ProductsPage"));
const ProductDetails = lazy(() => import("./components/ProductDetails"));
const CartPage = lazy(() => import("./components/CartPage"));
const AboutPage = lazy(() => import("./components/AboutUs"));
const ContactPage = lazy(() => import("./components/ContactUs"));
const StoreLocatorPage = lazy(() => import("./components/StoreLocatorPage"));
const LookbookPage = lazy(() => import("./components/LookbookPage"));
const SalePage = lazy(() => import("./components/SalePage"));
const AuthModal = lazy(() => import("./components/AuthModal"));
const NewArrivalsPage = lazy(() => import("./components/NewArrivalsPage"));
const FeaturedPage = lazy(() => import("./components/FeaturedPage"));
const CollectionPage = lazy(() => import("./components/CollectionPage"));
const WishlistPage = lazy(() => import("./components/WishlistPage"));
const GalleryPage = lazy(() => import("./components/GalleryPage"));
const EmployeeSupport = lazy(() => import("./components/EmployeeSupport"));
const GiftVoucher = lazy(() => import("./components/GiftVoucher"));
const KidsCategory = lazy(() => import("./components/KidsCategory"));
const MenCategory = lazy(() => import("./components/MenCategory"));
const WomenCategory = lazy(() => import("./components/WomenCategory"));

// CSS Management System
class CSSManager {
  constructor() {
    this.loadedStyles = new Map();
  }

  loadCSS(pageName) {
    const cssFiles = this.getCSSFilesForPage(pageName);
    
    cssFiles.forEach(cssFile => {
      if (!this.loadedStyles.has(cssFile)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `/css/${cssFile}.css`;
        link.setAttribute('data-page', pageName);
        document.head.appendChild(link);
        this.loadedStyles.set(cssFile, link);
      }
    });
  }

  unloadCSS(pageName) {
    const links = document.querySelectorAll(`link[data-page="${pageName}"]`);
    links.forEach(link => {
      link.remove();
      this.loadedStyles.delete(link.href);
    });
  }

  getCSSFilesForPage(pageName) {
    const cssMap = {
      'home': ['home', 'common'],
      'men': ['category', 'men', 'common'],
      'women': ['category', 'women', 'common'],
      'kids': ['category', 'kids', 'common'],
      'products': ['products', 'common'],
      'product-details': ['product-details', 'common'],
      'cart': ['cart', 'common'],
      'wishlist': ['wishlist', 'common'],
      'about': ['about', 'common'],
      'contact': ['contact', 'common'],
      'stores': ['stores', 'common'],
      'lookbook': ['lookbook', 'common'],
      'sale': ['sale', 'common'],
      'new-arrivals': ['new-arrivals', 'common'],
      'featured': ['featured', 'common'],
      'collection': ['collection', 'common'],
      'gallery': ['gallery', 'common'],
      'gift-voucher': ['gift-voucher', 'common'],
      'employee-support': ['employee-support', 'common']
    };
    
    return cssMap[pageName] || ['common'];
  }
}

const cssManager = new CSSManager();

// Enhanced Loading Component with Responsive Design
const ModernLoader = ({ pageName = "fashion experience" }) => {
  const [loadingText, setLoadingText] = useState("Loading");
  const [dotCount, setDotCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 400);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const getLoadingMessage = () => {
    const messages = [
      "Curating the latest trends",
      "Styling your experience",
      "Preparing fashion magic",
      "Getting ready for you",
      "Unveiling elegance",
      "Crafting style stories"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const dots = ".".repeat(dotCount);
  const loaderSize = isMobile ? 80 : 120;
  const iconSize = isMobile ? 16 : 20;

  return (
    <motion.div 
      className="modern-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Pattern */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}>
        <defs>
          <pattern id="fashion-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20,0 L20,40 M0,20 L40,20" stroke="#dc2626" strokeWidth="0.5"/>
            <circle cx="20" cy="20" r="3" fill="#dc2626" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fashion-pattern)" />
      </svg>

      <div className="loader-container" style={{ 
        textAlign: 'center', 
        position: 'relative', 
        zIndex: 1,
        padding: '20px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Main Logo Animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: `${loaderSize}px`,
            height: `${loaderSize}px`,
            margin: '0 auto',
            position: 'relative'
          }}
        >
          <svg width={loaderSize} height={loaderSize} viewBox="0 0 100 100">
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeDasharray="4 4"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <circle cx="50" cy="50" r="45" fill="url(#gradient)" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            <text
              x="50"
              y="68"
              textAnchor="middle"
              fill="white"
              fontSize={isMobile ? "28" : "32"}
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
            >
              ASB
            </text>
            <motion.path
              d="M30 35 L70 35 L65 65 L35 65 Z"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="5 5"
              animate={{
                strokeDashoffset: [0, 20],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </svg>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: '20px' }}
        >
          <h2 style={{ 
            fontSize: isMobile ? '20px' : '28px', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            ASB FASHION
          </h2>
          <p style={{ color: '#666', fontSize: isMobile ? '10px' : '14px', letterSpacing: '2px' }}>
            Beyond Tradition
          </p>
        </motion.div>

        {/* Loading Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: '30px' }}
        >
          <p style={{ 
            fontSize: isMobile ? '12px' : '14px', 
            color: '#dc2626', 
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            {getLoadingMessage()}
          </p>
          <div style={{ marginTop: '15px' }}>
            <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#999' }}>
              {loadingText}{dots}
            </span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: isMobile ? '150px' : '200px', opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: '30px',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: isMobile ? '150px' : '200px'
          }}
        >
          <div style={{
            height: '2px',
            background: '#f0f0f0',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity
              }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #dc2626, #b91c1c)',
                borderRadius: '2px'
              }}
            />
          </div>
        </motion.div>

        {/* Fashion Icons Animation - Hidden on mobile for performance */}
        {!isMobile && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            pointerEvents: 'none'
          }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.3, 0],
                  x: Math.cos(i * Math.PI * 2 / 8) * 150,
                  y: Math.sin(i * Math.PI * 2 / 8) * 150,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: '-10px',
                  marginTop: '-10px'
                }}
              >
                {i % 2 === 0 ? (
                  <FaTshirt size={iconSize} color="#dc2626" />
                ) : (
                  <FaStar size={iconSize - 4} color="#dc2626" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .modern-loader {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .modern-loader {
            background: linear-gradient(135deg, #fff 0%, #fff5f5 100%);
          }
        }
      `}</style>
    </motion.div>
  );
};

// Page Loader Component
const PageLoader = ({ pageName = "page" }) => <ModernLoader pageName={pageName} />;

// Enhanced 404 Page with Responsive Design
const NotFoundPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #fff 100%)',
        padding: isMobile ? '20px' : '40px'
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2
          }}
          style={{ marginBottom: '30px' }}
        >
          <div style={{
            width: isMobile ? '80px' : '120px',
            height: isMobile ? '80px' : '120px',
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)'
          }}>
            <FaTshirt size={isMobile ? 40 : 60} color="white" />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{ fontSize: isMobile ? '48px' : '72px', fontWeight: 'bold', color: '#dc2626', marginBottom: '20px' }}
        >
          404
        </motion.h1>
        
        <h2 style={{ fontSize: isMobile ? '20px' : '24px', color: '#333', marginBottom: '15px' }}>
          Style Not Found
        </h2>
        
        <p style={{ color: '#666', marginBottom: '30px', fontSize: isMobile ? '14px' : '16px', padding: '0 20px' }}>
          Oops! This fashion piece seems to be missing from our collection.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          padding: '0 20px'
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            style={{
              padding: isMobile ? '10px 20px' : '12px 30px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '14px' : '16px'
            }}
          >
            Go Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            style={{
              padding: isMobile ? '10px 20px' : '12px 30px',
              background: 'transparent',
              color: '#dc2626',
              border: '2px solid #dc2626',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '14px' : '16px'
            }}
          >
            Home Page
          </motion.button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '40px' }}
        >
          <p style={{ color: '#999', marginBottom: '15px', fontSize: isMobile ? '12px' : '14px' }}>
            Explore our collections:
          </p>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            padding: '0 10px'
          }}>
            {['Men', 'Women', 'Kids', 'Accessories', 'Sale'].map((item) => (
              <motion.span
                key={item}
                whileHover={{ scale: 1.05 }}
                onClick={() => window.location.href = `/${item.toLowerCase()}`}
                style={{
                  padding: isMobile ? '4px 12px' : '6px 16px',
                  background: '#f5f5f5',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '12px' : '14px',
                  color: '#666',
                  transition: 'all 0.3s'
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Page Wrapper for CSS Management
const PageWrapper = ({ children, pageName }) => {
  const location = useLocation();

  useEffect(() => {
    // Load page-specific CSS
    cssManager.loadCSS(pageName);
    
    // Scroll to top on page change
    window.scrollTo(0, 0);
    
    // Cleanup function to remove CSS when leaving page
    return () => {
      cssManager.unloadCSS(pageName);
    };
  }, [pageName, location.pathname]);

  return children;
};

// Animated Routes Component with CSS Management
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageWrapper pageName="home">
            <Suspense fallback={<PageLoader pageName="home" />}>
              <HomePage />
            </Suspense>
          </PageWrapper>
        } />

        {/* Category Routes - Lazy loaded with Suspense */}
        <Route path="/men" element={
          <PageWrapper pageName="men">
            <Suspense fallback={<PageLoader pageName="men" />}>
              <MenCategory />
            </Suspense>
          </PageWrapper>
        } />
        
        <Route path="/women" element={
          <PageWrapper pageName="women">
            <Suspense fallback={<PageLoader pageName="women" />}>
              <WomenCategory />
            </Suspense>
          </PageWrapper>
        } />
        
        <Route path="/kids" element={
          <PageWrapper pageName="kids">
            <Suspense fallback={<PageLoader pageName="kids" />}>
              <KidsCategory />
            </Suspense>
          </PageWrapper>
        } />

        {/* Product Routes */}
        <Route path="/products" element={
          <PageWrapper pageName="products">
            <Suspense fallback={<PageLoader pageName="products" />}>
              <ProductsPage />
            </Suspense>
          </PageWrapper>
        } />

        <Route path="/product/:id" element={
          <PageWrapper pageName="product-details">
            <Suspense fallback={<PageLoader pageName="product details" />}>
              <ProductDetails />
            </Suspense>
          </PageWrapper>
        } />

        {/* Collection Route */}
        <Route path="/collection/:collectionId" element={
          <PageWrapper pageName="collection">
            <Suspense fallback={<PageLoader pageName="collection" />}>
              <CollectionPage />
            </Suspense>
          </PageWrapper>
        } />

        {/* Cart & Wishlist */}
        <Route path="/cart" element={
          <PageWrapper pageName="cart">
            <Suspense fallback={<PageLoader pageName="cart" />}>
              <CartPage />
            </Suspense>
          </PageWrapper>
        } />

        <Route path="/wishlist" element={
          <PageWrapper pageName="wishlist">
            <Suspense fallback={<PageLoader pageName="wishlist" />}>
              <WishlistPage />
            </Suspense>
          </PageWrapper>
        } />

        {/* Information Pages */}
        <Route path="/about" element={
          <PageWrapper pageName="about">
            <Suspense fallback={<PageLoader pageName="about us" />}>
              <AboutPage />
            </Suspense>
          </PageWrapper>
        } />

        <Route path="/contact" element={
          <PageWrapper pageName="contact">
            <Suspense fallback={<PageLoader pageName="contact" />}>
              <ContactPage />
            </Suspense>
          </PageWrapper>
        } />

        <Route path="/stores" element={
          <PageWrapper pageName="stores">
            <Suspense fallback={<PageLoader pageName="store locations" />}>
              <StoreLocatorPage />
            </Suspense>
          </PageWrapper>
        } />

        <Route path="/lookbook" element={
          <PageWrapper pageName="lookbook">
            <Suspense fallback={<PageLoader pageName="lookbook" />}>
              <LookbookPage />
            </Suspense>
          </PageWrapper>
        } />

        {/* Shopping Routes */}
        <Route path="/sale" element={
          <PageWrapper pageName="sale">
            <Suspense fallback={<PageLoader pageName="sale" />}>
              <SalePage />
            </Suspense>
          </PageWrapper>
        } />

        <Route path="/new-arrivals" element={
          <PageWrapper pageName="new-arrivals">
            <Suspense fallback={<PageLoader pageName="new arrivals" />}>
              <NewArrivalsPage />
            </Suspense>
          </PageWrapper>
        } />

        <Route path="/featured" element={
          <PageWrapper pageName="featured">
            <Suspense fallback={<PageLoader pageName="featured" />}>
              <FeaturedPage />
            </Suspense>
          </PageWrapper>
        } />

        <Route path="/gallery" element={
          <PageWrapper pageName="gallery">
            <Suspense fallback={<PageLoader pageName="gallery" />}>
              <GalleryPage />
            </Suspense>
          </PageWrapper>
        } />

        <Route path="/gift-voucher" element={
          <PageWrapper pageName="gift-voucher">
            <Suspense fallback={<PageLoader pageName="gift voucher" />}>
              <GiftVoucher />
            </Suspense>
          </PageWrapper>
        } />

        <Route path="/employee-support" element={
          <PageWrapper pageName="employee-support">
            <Suspense fallback={<PageLoader pageName="employee support" />}>
              <EmployeeSupport />
            </Suspense>
          </PageWrapper>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [appLoaded, setAppLoaded] = useState(false);
  const [showQuickHelp, setShowQuickHelp] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const initializeApp = async () => {
      try {
        // Load common CSS first
        cssManager.loadCSS('common');
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const savedUser = localStorage.getItem('asb_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        
        setAppLoaded(true);
        
        const hasSeenWelcome = localStorage.getItem('asb_welcome_shown');
        if (!hasSeenWelcome && !savedUser) {
          setTimeout(() => {
            showWelcomeMessage();
            localStorage.setItem('asb_welcome_shown', 'true');
          }, 500);
        }
      } catch (error) {
        console.error('App initialization error:', error);
        setAppLoaded(true);
      }
    };

    initializeApp();
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('asb_user', JSON.stringify(userData));
    setShowAuthModal(false);
    
    toast.success(`Welcome back, ${userData.name || 'Fashion Lover'}! ✨`, {
      position: "top-right",
      autoClose: 3000,
      icon: '👋'
    });
  };

  const handleLogout = () => {
    const userName = user?.name || 'Fashion Lover';
    setUser(null);
    localStorage.removeItem('asb_user');
    
    toast.info(`See you soon, ${userName}! 👋`, {
      position: "top-right",
      autoClose: 3000,
      icon: '✨'
    });
  };

  const handleAuth = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const showWelcomeMessage = () => {
    toast(
      <div>
        <strong>Welcome to ASB Fashion! 🎉</strong>
        <br />
        <small>Discover our latest collections</small>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        icon: '🎉'
      }
    );
  };

  if (!appLoaded) {
    return <ModernLoader pageName="fashion experience" />;
  }

  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        
        <Navbar 
          user={user}
          onAuth={handleAuth}
          onLogout={handleLogout}
        />
        
        <main style={{ 
          minHeight: '100vh',
          paddingTop: isMobile ? '60px' : '80px' // Adjust based on navbar height
        }}>
          <AnimatedRoutes />
        </main>

        <Footer />

        {/* Auth Modal */}
        {showAuthModal && (
          <Suspense fallback={null}>
            <AuthModal 
              mode={authMode}
              onClose={() => setShowAuthModal(false)}
              onLogin={handleLogin}
              onSwitchMode={setAuthMode}
            />
          </Suspense>
        )}

        {/* Quick Help Button - Responsive */}
        {showQuickHelp && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: isMobile ? '15px' : '20px',
              left: isMobile ? '15px' : '20px',
              zIndex: 1000
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.open('https://wa.me/94719057057', '_blank')}
              style={{
                width: isMobile ? '40px' : '50px',
                height: isMobile ? '40px' : '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <FaWhatsapp size={isMobile ? 20 : 24} color="white" />
            </motion.button>
          </motion.div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;