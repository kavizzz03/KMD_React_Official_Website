import "./Navbar.css";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar as BSNavbar, Container, Nav, Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { getCartCount, getWishlistCount } from "../utils/cartUtils";
import { 
  FaShoppingBag, 
  FaHome, 
  FaBox, 
  FaHeart, 
  FaSearch,
  FaBars,
  FaTimes,
  FaTshirt,
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
  FaStore,
  FaFire,
  FaTag,
  FaCrown,
  FaTruck,
  FaInstagram,
  FaFacebook,
  FaYoutube
} from "react-icons/fa";
import { MdNewReleases } from "react-icons/md";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(getCartCount());
  const [wishlistCount, setWishlistCount] = useState(getWishlistCount());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    const updateCounts = () => {
      setCartCount(getCartCount());
      setWishlistCount(getWishlistCount());
    };
    
    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: "/", label: "Home", icon: FaHome },
    { path: "/men", label: "Men", icon: FaTshirt },
    { path: "/women", label: "Women", icon: FaTshirt },
    { path: "/kids", label: "Kids", icon: FaTshirt },
    { path: "/collections", label: "Collections", icon: FaStar, badge: "New" },
    { path: "/lookbook", label: "Lookbook", icon: MdNewReleases },
    { path: "/stores", label: "Stores", icon: FaStore }
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
      x: "100%",
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
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
        {/* Top Bar */}
        <div className="navbar-top-bar-red">
          <Container>
            <div className="top-bar-content-red">
              <div className="top-bar-left-red">
                <motion.div 
                  className="location-badge-red"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaMapMarkerAlt className="me-1" />
                  <span>17 Branches Islandwide</span>
                </motion.div>
                <span className="divider-red">|</span>
                <motion.div 
                  className="hotline-red"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaPhone className="me-1" />
                  <span>071 905 7057</span>
                </motion.div>
                <span className="divider-red">|</span>
                <motion.div 
                  className="delivery-red"
                  whileHover={{ scale: 1.05 }}
                >
                  <FaTruck className="me-1" />
                  <span>Free Delivery Over LKR 5000</span>
                </motion.div>
              </div>
              <div className="top-bar-right-red">
                <Link to="/track-order">Track Order</Link>
                <Link to="/stores">Store Locator</Link>
                <Link to="/contact">Help Center</Link>
                <div className="social-icons-top">
                  <FaInstagram />
                  <FaFacebook />
                  <FaYoutube />
                </div>
              </div>
            </div>
          </Container>
        </div>

        <Container>
          <div className="navbar-content-red">
            {/* Brand Logo */}
            <motion.div
              className="navbar-brand-wrapper-red"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BSNavbar.Brand as={Link} to="/" className="navbar-brand-red">
                <motion.div
                  className="brand-logo-red"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FaTshirt className="brand-icon-red" />
                </motion.div>
                <div className="brand-text-red">
                  <span className="brand-main-red">ASB<span className="brand-highlight-red">FASHION</span></span>
                  <span className="brand-tagline-red">Beyond Tradition</span>
                </div>
              </BSNavbar.Brand>
            </motion.div>

            {/* Search Bar - Desktop */}
            <div className="navbar-search-desktop d-none d-lg-block">
              <motion.form 
                onSubmit={handleSearch} 
                className="search-form-red"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  placeholder="Search for fashion, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-red"
                />
                <motion.button 
                  type="submit" 
                  className="search-button-red"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSearch />
                </motion.button>
              </motion.form>
            </div>

            {/* Right Side Actions */}
            <div className="navbar-actions-red">
              {/* Wishlist Button */}
              <motion.div
                className="nav-action-wrapper-red"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Nav.Link as={Link} to="/wishlist" className="nav-action-btn-red">
                  <FaHeart className="action-icon-red" />
                  <AnimatePresence mode="wait">
                    {wishlistCount > 0 && (
                      <motion.span
                        className="action-badge-red"
                        variants={cartBadgeVariants}
                        initial="initial"
                        animate="animate"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="action-text-red d-none d-md-inline">Wishlist</span>
                </Nav.Link>
              </motion.div>

              {/* Cart Button */}
              <motion.div
                className="nav-action-wrapper-red"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Nav.Link as={Link} to="/cart" className="nav-action-btn-red cart-btn-red">
                  <FaShoppingBag className="action-icon-red" />
                  <AnimatePresence mode="wait">
                    {cartCount > 0 && (
                      <motion.span
                        className="action-badge-red cart-badge-red"
                        variants={cartBadgeVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="pulse"
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="action-text-red d-none d-md-inline">Cart</span>
                </Nav.Link>
              </motion.div>

              {/* Mobile Menu Toggle */}
              <motion.button
                className="mobile-menu-toggle-red d-lg-none"
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

          {/* Desktop Navigation Menu */}
          <div className="navbar-menu-desktop d-none d-lg-block">
            <Nav className="desktop-nav-red">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.path}
                    className="nav-item-container-red"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Nav.Link
                      as={Link}
                      to={item.path}
                      className={`desktop-nav-link-red ${isActivePath(item.path) ? 'active' : ''}`}
                    >
                      <IconComponent className="nav-icon-red" />
                      <span className="nav-label-red">{item.label}</span>
                      {item.badge && (
                        <Badge bg="danger" className="nav-badge-red ms-2">{item.badge}</Badge>
                      )}
                      {isActivePath(item.path) && (
                        <motion.div
                          className="nav-active-indicator-red"
                          layoutId="desktopActiveIndicator"
                        />
                      )}
                    </Nav.Link>
                  </motion.div>
                );
              })}
              
              {/* Sale Link - Special */}
              <motion.div
                className="nav-item-container-red"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
              >
                <Nav.Link
                  as={Link}
                  to="/sale"
                  className={`desktop-nav-link-red sale-link-red ${isActivePath('/sale') ? 'active' : ''}`}
                >
                  <FaFire className="nav-icon-red" />
                  <span className="nav-label-red">SALE</span>
                  <FaTag className="sale-tag-icon ms-2" />
                  {isActivePath('/sale') && (
                    <motion.div
                      className="nav-active-indicator-red"
                      layoutId="desktopActiveIndicator"
                    />
                  )}
                </Nav.Link>
              </motion.div>
            </Nav>
          </div>
        </Container>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className="mobile-menu-overlay-red"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              <motion.div
                className="mobile-menu-panel-red"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="mobile-menu-header-red">
                  <div className="mobile-brand-red">
                    <FaTshirt className="mobile-brand-icon-red" />
                    <div>
                      <h3>ASB FASHION</h3>
                      <p>Beyond Tradition</p>
                    </div>
                  </div>
                  <button 
                    className="mobile-menu-close-red"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="mobile-menu-search-red">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">
                      <FaSearch />
                    </button>
                  </form>
                </div>

                <div className="mobile-menu-content-red">
                  {/* Main Navigation */}
                  <div className="mobile-nav-section-red">
                    <h4 className="mobile-section-title-red">Menu</h4>
                    {navItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`mobile-nav-link-red ${isActivePath(item.path) ? 'active' : ''}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <IconComponent className="mobile-nav-icon-red" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <Badge bg="danger" className="ms-auto">{item.badge}</Badge>
                          )}
                        </Link>
                      );
                    })}
                    <Link
                      to="/sale"
                      className={`mobile-nav-link-red sale-link-red ${isActivePath('/sale') ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaFire className="mobile-nav-icon-red" />
                      <span>Sale</span>
                      <FaTag className="sale-tag ms-auto" />
                    </Link>
                  </div>

                  {/* Store Info */}
                  <div className="mobile-nav-section-red">
                    <h4 className="mobile-section-title-red">Need Help?</h4>
                    <div className="mobile-store-info-red">
                      <div className="info-item-red">
                        <FaStore className="info-icon-red" />
                        <span>17 Branches Islandwide</span>
                      </div>
                      <div className="info-item-red">
                        <FaPhone className="info-icon-red" />
                        <span>071 905 7057</span>
                      </div>
                      <div className="info-item-red">
                        <FaMapMarkerAlt className="info-icon-red" />
                        <span>Head Office: Wadduwa</span>
                      </div>
                      <div className="info-item-red">
                        <FaTruck className="info-icon-red" />
                        <span>Free Delivery Over LKR 5000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Spacer */}
      <div className="navbar-spacer-red" />
    </>
  );
};

export default Navbar;