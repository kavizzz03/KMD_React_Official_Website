import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaHeart, 
  FaShieldAlt, 
  FaTruck, 
  FaExchangeAlt,
  FaShoppingBag,
  FaArrowRight,
  FaStar,
  FaWhatsapp,
  FaTshirt,
  FaTag,
  FaCrown,
  FaGem,
  FaLeaf,
  FaRocket,
  FaAward,
  FaMedal,
  FaTools,
  FaCut,
  FaRuler,
  FaPaintBrush,
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaMinus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaSpinner,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import { GiClothes, GiNecklace, GiSewingMachine, GiDress } from "react-icons/gi";
import { MdLocalOffer, MdNewReleases, MdFiberManualRecord } from "react-icons/md";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import LoadingSpinner from "./components/LoadingSpinner";

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

// Animation variants
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

// Random fashion quotes
const getRandomFashionQuote = () => {
  const quotes = [
    "Style is a way to say who you are without having to speak.",
    "Fashion is the armor to survive the reality of everyday life.",
    "Elegance is not standing out, but being remembered.",
    "Fashion is about dressing according to what's fashionable.",
    "Style is a reflection of your attitude and your personality.",
    "Beyond Tradition - Redefining Sri Lankan Fashion",
    "18 Branches Islandwide - Bringing Style to Your Doorstep",
    "Dress like you're already famous.",
    "Fashion fades, only style remains the same.",
    "Make your own kind of fashion.",
    "Dress like you're meeting your worst enemy.",
    "Fashion is what you buy, style is what you do with it.",
    "Wear your confidence like a crown.",
    "Every outfit tells a story. Make yours unforgettable.",
    "Fashion is the art of expressing yourself through fabric."
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

// Clothing Brand Loading Animation Component
const ClothingBrandLoader = ({ pageName = "page" }) => {
  const clothingItems = [
    { icon: <FaTshirt />, delay: 0 },
    { icon: <GiDress />, delay: 0.2 },
    { icon: <GiClothes />, delay: 0.4 },
    { icon: <GiNecklace />, delay: 0.6 },
    { icon: <FaCut />, delay: 0.8 },
    { icon: <FaRuler />, delay: 1.0 }
  ];

  return (
    <motion.div 
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Fabric Pattern Background */}
      <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fabricPattern" patternUnits="userSpaceOnUse" width="60" height="60">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              <circle cx="30" cy="30" r="3" fill="rgba(255,255,255,0.1)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fabricPattern)" />
        </svg>
      </div>

      {/* Floating Thread Elements */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '2px',
            height: `${Math.random() * 80 + 40}px`,
            background: `linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transformOrigin: 'top',
          }}
          animate={{
            rotate: [0, 15, -15, 0],
            y: [0, -20, 20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}

      <div className="text-center text-white position-relative" style={{ zIndex: 2 }}>
        {/* Animated Clothing Items Circle */}
        <motion.div
          className="position-relative mb-5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.8 }}
        >
          <div className="position-relative" style={{ width: '180px', height: '180px', margin: '0 auto' }}>
            {/* Rotating Ring */}
            <motion.div
              className="position-absolute w-100 h-100 rounded-circle"
              style={{
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50%'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Secondary Ring */}
            <motion.div
              className="position-absolute w-100 h-100 rounded-circle"
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                top: '10px',
                left: '10px',
                width: '160px',
                height: '160px'
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Center Logo */}
            <div className="position-absolute top-50 start-50 translate-middle">
              <div className="bg-white rounded-circle p-3 shadow-lg" style={{ width: '100px', height: '100px' }}>
                <img 
                  src="/images/asb-logo.png" 
                  alt="ASB Fashion Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%23dc2626"/%3E%3Ctext x="50" y="70" text-anchor="middle" fill="white" font-size="40" font-weight="bold"%3EASB%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
            
            {/* Floating Clothing Icons */}
            {clothingItems.map((item, index) => {
              const angle = (index * 60) * (Math.PI / 180);
              const radius = 110;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={index}
                  className="position-absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: item.delay
                  }}
                >
                  <div className="bg-white rounded-circle p-2 shadow" style={{ width: '40px', height: '40px', color: '#dc2626', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="display-4 fw-bold mb-3"
          style={{ 
            letterSpacing: '2px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          ASB FASHION
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lead mb-3"
        >
          <FaCrown className="me-2" /> Beyond Tradition • Redefining Style <FaCrown className="ms-2" />
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="d-flex justify-content-center gap-3 mb-4 flex-wrap"
        >
          <span className="badge bg-white text-dark px-3 py-2">
            <FaGem className="me-1" /> Premium Quality
          </span>
          <span className="badge bg-white text-dark px-3 py-2">
            <FaLeaf className="me-1" /> Sustainable Fashion
          </span>
          <span className="badge bg-white text-dark px-3 py-2">
            <FaTruck className="me-1" /> Free Delivery
          </span>
        </motion.div>
        
        {/* Stitching Animation */}
        <motion.div
          className="d-flex justify-content-center gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: '30px',
                height: '2px',
                background: 'white',
                borderRadius: '2px'
              }}
              animate={{
                width: ['30px', '40px', '30px']
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-2"
        >
          <p className="text-white-50 fst-italic mb-2">
            {getRandomFashionQuote()}
          </p>
          <p className="text-white-50 small">
            <FaStar className="me-1" /> {pageName} • 18 Branches Islandwide
          </p>
        </motion.div>
        
        {/* Animated Loading Dots */}
        <motion.div 
          className="d-flex justify-content-center gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                background: 'white',
                borderRadius: '50%'
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Page Loader Component
const PageLoader = ({ pageName = "page" }) => <ClothingBrandLoader pageName={pageName} />;

// 404 Page
const NotFoundPage = () => (
  <motion.div
    key="not-found"
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    className="min-vh-100 d-flex align-items-center justify-content-center"
    style={{
      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
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
        <div className="bg-white rounded-circle p-3 d-inline-block mb-3">
          <FaTshirt size={60} color="#dc2626" />
        </div>
        <span className="display-1 fw-bold text-warning d-block">404</span>
      </motion.div>
      
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-3"
      >
        <h2 className="h1 mb-3">Style Not Found!</h2>
        <p className="fs-5 mb-4 opacity-75">
          Oops! This fashion piece seems to be out of our collection.
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
          className="btn btn-warning btn-lg px-4 fw-bold"
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-5"
      >
        <p className="text-white-50 mb-3">Explore our popular collections:</p>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {['Men', 'Women', 'Kids', 'Accessories', 'Sale', 'New Arrivals'].map((item, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.1 }}
              className="badge bg-white text-dark px-3 py-2 cursor-pointer"
              onClick={() => window.location.href = `/${item.toLowerCase().replace(' ', '-')}`}
              style={{ cursor: 'pointer' }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

// Animated Routes
const AnimatedRoutes = () => {
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState('/');

  useEffect(() => {
    setPreviousPath(location.pathname);
  }, [location.pathname]);

  const getAnimationVariant = (currentPath, previousPath) => {
    if (previousPath.includes('/product/') && currentPath.includes('/product/')) {
      return slideInVariants;
    }
    return pageVariants;
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Home */}
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
              <Suspense fallback={<PageLoader pageName="fashion destination" />}>
                <HomePage />
              </Suspense>
            </motion.div>
          }
        />
        <Route path="/gift-voucher" element={<GiftVoucher />} />

        {/* About Us */}
        <Route
          path="/about"
          element={
            <motion.div
              key="about"
              initial="initial"
              animate="in"
              exit="out"
              variants={getAnimationVariant(location.pathname, previousPath)}
            >
              <Suspense fallback={<PageLoader pageName="our story" />}>
                <AboutPage />
              </Suspense>
            </motion.div>
          }
        />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/employee-support" element={<EmployeeSupport />} />
        <Route path="/employee/complaint" element={<EmployeeSupport />} />

        {/* Contact Us */}
        <Route
          path="/contact"
          element={
            <motion.div
              key="contact"
              initial="initial"
              animate="in"
              exit="out"
              variants={getAnimationVariant(location.pathname, previousPath)}
            >
              <Suspense fallback={<PageLoader pageName="contact" />}>
                <ContactPage />
              </Suspense>
            </motion.div>
          }
        />

        {/* Products */}
        <Route
          path="/products"
          element={
            <Suspense fallback={<PageLoader pageName="collection" />}>
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
            <Suspense fallback={<PageLoader pageName="style details" />}>
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

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <Suspense fallback={<PageLoader pageName="shopping bag" />}>
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

        {/* Stores */}
        <Route
          path="/stores"
          element={
            <Suspense fallback={<PageLoader pageName="store locations" />}>
              <motion.div
                key="stores"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <StoreLocatorPage />
              </motion.div>
            </Suspense>
          }
        />

        {/* Lookbook */}
        <Route
          path="/lookbook"
          element={
            <Suspense fallback={<PageLoader pageName="lookbook" />}>
              <motion.div
                key="lookbook"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <LookbookPage />
              </motion.div>
            </Suspense>
          }
        />

        {/* Sale */}
        <Route
          path="/sale"
          element={
            <Suspense fallback={<PageLoader pageName="sale" />}>
              <motion.div
                key="sale"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <SalePage />
              </motion.div>
            </Suspense>
          }
        />

        {/* Category Routes */}
        <Route
          path="/men"
          element={
            <Suspense fallback={<PageLoader pageName="men's collection" />}>
              <motion.div
                key="men"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <ProductsPage category="men" />
              </motion.div>
            </Suspense>
          }
        />

        <Route
          path="/women"
          element={
            <Suspense fallback={<PageLoader pageName="women's collection" />}>
              <motion.div
                key="women"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <ProductsPage category="women" />
              </motion.div>
            </Suspense>
          }
        />

        <Route
          path="/kids"
          element={
            <Suspense fallback={<PageLoader pageName="kids' collection" />}>
              <motion.div
                key="kids"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <ProductsPage category="kids" />
              </motion.div>
            </Suspense>
          }
        />

        <Route
          path="/accessories"
          element={
            <Suspense fallback={<PageLoader pageName="accessories" />}>
              <motion.div
                key="accessories"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <ProductsPage category="accessories" />
              </motion.div>
            </Suspense>
          }
        />

        <Route
          path="/traditional"
          element={
            <Suspense fallback={<PageLoader pageName="traditional wear" />}>
              <motion.div
                key="traditional"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <ProductsPage category="traditional" />
              </motion.div>
            </Suspense>
          }
        />

        {/* Collection */}
        <Route
          path="/collection/:collectionId"
          element={
            <Suspense fallback={<PageLoader pageName="collection" />}>
              <motion.div
                key="collection"
                initial="initial"
                animate="in"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <CollectionPage />
              </motion.div>
            </Suspense>
          }
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={
            <Suspense fallback={<PageLoader pageName="wishlist" />}>
              <motion.div
                key="wishlist"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <WishlistPage />
              </motion.div>
            </Suspense>
          }
        />

        {/* New Arrivals */}
        <Route
          path="/new-arrivals"
          element={
            <Suspense fallback={<PageLoader pageName="new arrivals" />}>
              <motion.div
                key="new-arrivals"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <NewArrivalsPage />
              </motion.div>
            </Suspense>
          }
        />

        {/* Featured */}
        <Route
          path="/featured"
          element={
            <Suspense fallback={<PageLoader pageName="featured" />}>
              <motion.div
                key="featured"
                initial="initial"
                animate="in"
                exit="out"
                variants={getAnimationVariant(location.pathname, previousPath)}
              >
                <FeaturedPage />
              </motion.div>
            </Suspense>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

// App Loader Component (Initial Loading)
const AppLoader = () => <ClothingBrandLoader pageName="fashion experience" />;

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [appLoaded, setAppLoaded] = useState(false);
  const [showQuickHelp, setShowQuickHelp] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [welcomeShown, setWelcomeShown] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if welcome message has been shown before
        const hasSeenWelcome = localStorage.getItem('asb_welcome_shown');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const savedUser = localStorage.getItem('asb_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        
        updateCartCount();
        updateWishlistCount();
        setAppLoaded(true);
        
        // Show welcome message only once per session
        if (!hasSeenWelcome && !savedUser) {
          setTimeout(() => {
            showWelcomeMessage();
            localStorage.setItem('asb_welcome_shown', 'true');
          }, 1000);
        }
        
      } catch (error) {
        console.error('App initialization error:', error);
        setAppLoaded(true);
      }
    };

    initializeApp();

    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('wishlistUpdated', updateWishlistCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
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

  const updateWishlistCount = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistCount(wishlist.length);
    } catch (error) {
      console.error('Error updating wishlist count:', error);
      setWishlistCount(0);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('asb_user', JSON.stringify(userData));
    setShowAuthModal(false);
    
    toast.success(
      <div>
        <strong>Welcome back, {userData.name || 'Style Seeker'}! ✨</strong>
        <br />
        <small>Ready to discover new styles?</small>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        icon: '👋',
        style: {
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          color: 'white',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.2)'
        }
      }
    );
  };

  const handleLogout = () => {
    const userName = user?.name || user?.email || 'Fashion Lover';
    setUser(null);
    localStorage.removeItem('asb_user');
    
    toast.info(
      <div>
        <strong>See you soon, {userName}! 👋</strong>
        <br />
        <small>Come back for more style inspiration</small>
      </div>,
      {
        position: "top-right",
        autoClose: 4000,
        icon: '✨',
        style: {
          background: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)',
          color: 'white',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.2)'
        }
      }
    );
  };

  const handleAuth = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const showWelcomeMessage = () => {
    toast(
      <div className="text-center">
        <div className="bg-white rounded-circle d-inline-flex p-2 mb-2">
          <FaTshirt size={30} color="#dc2626" />
        </div>
        <div>
          <strong className="fs-5">Welcome to ASB Fashion! 🎉</strong>
          <br />
          <small className="opacity-75">Discover our latest collections across 18 branches islandwide</small>
        </div>
        <hr className="my-2" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <div className="d-flex justify-content-center gap-2 mt-2 flex-wrap">
          <span className="badge bg-white text-dark px-2 py-1">New Arrivals</span>
          <span className="badge bg-white text-dark px-2 py-1">Up to 40% Off</span>
          <span className="badge bg-white text-dark px-2 py-1">Free Shipping</span>
          <span className="badge bg-white text-dark px-2 py-1">18 Branches</span>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 8000,
        icon: '🎉',
        style: {
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          color: 'white',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          padding: '16px',
          minWidth: '320px'
        }
      }
    );
  };

  if (!appLoaded) {
    return <AppLoader />;
  }

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<AppLoader />}>
          <ScrollToTop />
          
          <Navbar 
            user={user}
            onAuth={handleAuth}
            onLogout={handleLogout}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
          />
          
          <main className="main-content" style={{ minHeight: '100vh' }}>
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

          {/* Quick Help Button */}
          {showQuickHelp && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="position-fixed bottom-0 start-0 m-4"
              style={{ zIndex: 1040 }}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-danger rounded-circle shadow-lg position-relative"
                style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
                onClick={() => window.open('https://wa.me/94719057057', '_blank')}
              >
                <FaWhatsapp size={28} className="text-white" />
                <motion.span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Help
                </motion.span>
              </motion.button>
            </motion.div>
          )}

          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            style={{ 
              marginTop: '80px',
              zIndex: 9999 
            }}
            toastStyle={{
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              border: '1px solid rgba(220,38,38,0.3)',
              fontSize: '14px',
              padding: '12px 20px',
              backdropFilter: 'blur(10px)'
            }}
          />
        </Suspense>
      </div>
    </Router>
  );
}

export default App;