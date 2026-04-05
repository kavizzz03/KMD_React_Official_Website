import "./Navbar.css";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar as BSNavbar, Container, Nav, Badge, Dropdown } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { getCartCount } from "../utils/cartUtils";
import { 
  FaShoppingCart, 
  FaHome, 
  FaBox, 
  FaUser, 
  FaHeart, 
  FaSearch,
  FaBars,
  FaTimes,
  FaUtensils,
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";

const Navbar = ({ user, onAuth, onLogout }) => {
  const [cartCount, setCartCount] = useState(getCartCount());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateCart = () => setCartCount(getCartCount());
    window.addEventListener("cartUpdated", updateCart);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/products", label: "Products", icon: FaBox },
    { path: "/about", label: "About", icon: FaStar },
    { path: "/contact", label: "Contact", icon: FaPhone }
  ];

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const cartBadgeVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring", stiffness: 300 }
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.4 }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: -50 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      <motion.div
        className={`navbar-premium ${isScrolled ? 'navbar-scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Container>
          <div className="navbar-content">
            {/* Brand Logo */}
            <motion.div
              className="navbar-brand-wrapper"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BSNavbar.Brand as={Link} to="/" className="navbar-brand-premium">
                <motion.div
                  className="brand-logo"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FaUtensils className="brand-icon" />
                </motion.div>
                <div className="brand-text">
                  <span className="brand-main">KMD Sweet House</span>
                  <span className="brand-tagline">Traditional Sweets</span>
                </div>
              </BSNavbar.Brand>
            </motion.div>

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="navbar-desktop d-none d-lg-flex">
              <Nav className="navbar-nav-premium">
                {navItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      className="nav-item-wrapper"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Nav.Link
                        as={Link}
                        to={item.path}
                        className={`nav-link-premium ${isActivePath(item.path) ? 'nav-link-active' : ''}`}
                      >
                        <IconComponent className="nav-icon" />
                        <span className="nav-text">{item.label}</span>
                        {isActivePath(item.path) && (
                          <motion.div
                            className="nav-active-indicator"
                            layoutId="activeIndicator"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Nav.Link>
                    </motion.div>
                  );
                })}
              </Nav>
            </div>

            {/* Right Side Actions */}
            <div className="navbar-actions">
              {/* Search Button - Hidden on Mobile */}
              <motion.button
                className="nav-action-btn search-btn d-none d-md-flex"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Search"
              >
                <FaSearch />
              </motion.button>

              {/* Wishlist Button - Hidden on Mobile */}
              <motion.button
                className="nav-action-btn wishlist-btn d-none d-md-flex"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Wishlist"
              >
                <FaHeart />
                <Badge bg="danger" className="wishlist-badge">0</Badge>
              </motion.button>

              {/* Cart Button */}
              <motion.div
                className="nav-cart-wrapper"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Nav.Link as={Link} to="/cart" className="nav-cart-btn">
                  <FaShoppingCart className="cart-icon" />
                  <AnimatePresence mode="wait">
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        className="cart-badge-premium"
                        variants={cartBadgeVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="pulse"
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="cart-text d-none d-md-inline">Cart</span>
                </Nav.Link>
              </motion.div>

              {/* User Account - Hidden on Mobile */}
              {user ? (
                <Dropdown align="end" className="d-none d-lg-block">
                  <Dropdown.Toggle as={motion.div} className="user-dropdown-toggle">
                    <motion.div
                      className="user-avatar"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaUser />
                    </motion.div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-dropdown-menu">
                    <Dropdown.Item as={Link} to="/profile" className="dropdown-item-premium">
                      <FaUser className="me-2" />
                      My Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/orders" className="dropdown-item-premium">
                      <FaBox className="me-2" />
                      My Orders
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      onClick={onLogout} 
                      className="dropdown-item-premium text-danger"
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <motion.div
                  className="auth-buttons d-none d-lg-flex"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    className="btn-login"
                    onClick={() => onAuth('login')}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSignInAlt className="me-2" />
                    Login
                  </motion.button>
                  <motion.button
                    className="btn-register"
                    onClick={() => onAuth('register')}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaUserPlus className="me-2" />
                    Register
                  </motion.button>
                </motion.div>
              )}

              {/* Mobile Menu Toggle - Visible only on Mobile */}
              <motion.button
                className="mobile-menu-toggle d-lg-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <FaTimes />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <FaBars />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </Container>

        {/* Full Screen Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className="mobile-menu-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              <motion.div
                className="mobile-menu-fullscreen"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {/* Mobile Menu Header */}
                <div className="mobile-menu-header">
                  <div className="mobile-brand">
                    <motion.div
                      className="mobile-brand-logo"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <FaUtensils />
                    </motion.div>
                    <div className="mobile-brand-text">
                      <h3>KMD Sweet House</h3>
                      <p>Traditional Sri Lankan Sweets</p>
                    </div>
                    <motion.button
                      className="mobile-menu-close"
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTimes />
                    </motion.button>
                  </div>
                </div>

                {/* Mobile Menu Content - Scrollable */}
                <div className="mobile-menu-content-scrollable">
                  {/* Navigation Links */}
                  <div className="mobile-nav-section">
                    <h4 className="mobile-section-title">Navigation</h4>
                    <div className="mobile-nav-links">
                      {navItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <motion.div
                            key={item.path}
                            variants={mobileItemVariants}
                            initial="closed"
                            animate="open"
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link
                              to={item.path}
                              className={`mobile-nav-link-full ${isActivePath(item.path) ? 'mobile-nav-link-active' : ''}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <IconComponent className="mobile-nav-icon" />
                              <span className="mobile-nav-text">{item.label}</span>
                              <motion.div
                                className="mobile-nav-active-indicator"
                                layoutId="mobileActiveIndicator"
                              />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* User Section */}
                  <div className="mobile-user-section">
                    <h4 className="mobile-section-title">
                      {user ? `Welcome, ${user.name || 'User'}` : 'Account'}
                    </h4>
                    
                    {user ? (
                      <div className="mobile-user-actions">
                        <motion.div
                          variants={mobileItemVariants}
                          initial="closed"
                          animate="open"
                          transition={{ delay: 0.5 }}
                        >
                          <Link to="/profile" className="mobile-user-action">
                            <FaUser className="me-3" />
                            <span>My Profile</span>
                          </Link>
                        </motion.div>
                        <motion.div
                          variants={mobileItemVariants}
                          initial="closed"
                          animate="open"
                          transition={{ delay: 0.6 }}
                        >
                          <Link to="/orders" className="mobile-user-action">
                            <FaBox className="me-3" />
                            <span>My Orders</span>
                          </Link>
                        </motion.div>
                        <motion.div
                          variants={mobileItemVariants}
                          initial="closed"
                          animate="open"
                          transition={{ delay: 0.7 }}
                        >
                          <button 
                            onClick={() => {
                              onLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="mobile-user-action text-danger"
                          >
                            <FaSignInAlt className="me-3" />
                            <span>Logout</span>
                          </button>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="mobile-auth-actions">
                        <motion.div
                          variants={mobileItemVariants}
                          initial="closed"
                          animate="open"
                          transition={{ delay: 0.5 }}
                        >
                          <button 
                            className="btn-mobile-login-full"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              onAuth('login');
                            }}
                          >
                            <FaSignInAlt className="me-3" />
                            <span>Login</span>
                          </button>
                        </motion.div>
                        <motion.div
                          variants={mobileItemVariants}
                          initial="closed"
                          animate="open"
                          transition={{ delay: 0.6 }}
                        >
                          <button 
                            className="btn-mobile-register-full"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              onAuth('register');
                            }}
                          >
                            <FaUserPlus className="me-3" />
                            <span>Create Account</span>
                          </button>
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="mobile-contact-section">
                    <h4 className="mobile-section-title">Contact Us</h4>
                    <div className="mobile-contact-info">
                      <motion.div
                        variants={mobileItemVariants}
                        initial="closed"
                        animate="open"
                        transition={{ delay: 0.8 }}
                        className="mobile-contact-item"
                      >
                        <FaPhone className="contact-icon" />
                        <div>
                          <div>+94 777 189 893</div>
                          <div>+94 112831705</div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        variants={mobileItemVariants}
                        initial="closed"
                        animate="open"
                        transition={{ delay: 0.9 }}
                        className="mobile-contact-item"
                      >
                        <FaEnvelope className="contact-icon" />
                        <div>kmdproduction2025@gmail.com</div>
                      </motion.div>
                      
                      <motion.div
                        variants={mobileItemVariants}
                        initial="closed"
                        animate="open"
                        transition={{ delay: 1.0 }}
                        className="mobile-contact-item"
                      >
                        <FaMapMarkerAlt className="contact-icon" />
                        <div>Hanwella, Sri Lanka</div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="mobile-hours-section">
                    <h4 className="mobile-section-title">Business Hours</h4>
                    <motion.div
                      variants={mobileItemVariants}
                      initial="closed"
                      animate="open"
                      transition={{ delay: 1.1 }}
                      className="mobile-hours-info"
                    >
                      <p>Monday - Sunday: 8:00 AM - 8:00 PM</p>
                      <small>Fresh batches throughout the day</small>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="navbar-spacer" />
    </>
  );
};

export default Navbar;