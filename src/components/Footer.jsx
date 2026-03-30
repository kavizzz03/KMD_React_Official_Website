import React, { useState } from "react";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhone,
  FaStore,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaMobile,
  FaCrown,
  FaHeadset,
  FaCheckCircle,
  FaRegPaperPlane,
  FaRegEnvelope,
  FaRegClock,
  FaRegBuilding,
  FaRegHeart,
  FaTimesCircle,
  FaExclamationTriangle,
  FaArrowUp
} from "react-icons/fa";
import { SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Form, InputGroup, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.css";

// Import company logo
import asbLogo from "../assets/images/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle subscribe with proper error handling
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setSuccess(null);
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("https://whats.asbfashion.com/api/subscribe.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: email }),
      });
      
      const result = await response.json();
      
      console.log("Subscription response:", result); // For debugging
      
      if (result.status === "success") {
        // Success - email subscribed successfully
        setSuccess("Successfully subscribed! Check your inbox for updates.");
        setEmail("");
        setIsSubscribed(true);
        
        // Auto hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(null);
          setIsSubscribed(false);
        }, 5000);
      } 
      else if (result.status === "exists" || result.message?.toLowerCase().includes("already")) {
        // Email already exists
        setError("This email is already subscribed to our newsletter!");
        
        // Auto hide error after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
      else if (result.status === "error") {
        // Other errors
        setError(result.message || "Something went wrong. Please try again.");
        
        // Auto hide error after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
      else {
        // Unknown response
        setError("Unable to subscribe. Please try again later.");
        
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setError("Network error. Please check your connection and try again.");
      
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick links data
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Men's Collection", path: "/men" },
    { name: "Women's Collection", path: "/women" },
    { name: "Kids Collection", path: "/kids" },
    { name: "Lookbook", path: "/lookbook" },
    { name: "Store Locator", path: "/stores" }
  ];

  // Social media data
  const socialMedia = [
    { icon: <FaFacebookF />, url: "https://facebook.com/asbfashion", name: "Facebook" },
    { icon: <FaInstagram />, url: "https://instagram.com/asbfashion", name: "Instagram" },
    { icon: <FaTwitter />, url: "https://twitter.com/asbfashion", name: "Twitter" },
    { icon: <FaYoutube />, url: "https://youtube.com/asbfashion", name: "YouTube" },
    { icon: <FaLinkedinIn />, url: "https://linkedin.com/company/asbfashion", name: "LinkedIn" },
    { icon: <FaWhatsapp />, url: "https://wa.me/94719057057", name: "WhatsApp" }
  ];

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
      <motion.footer 
        className="asb-footer-pro"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={footerVariants}
      >
        <div className="footer-bg-elements">
          <div className="bg-grid"></div>
          <div className="bg-glow glow-1"></div>
          <div className="bg-glow glow-2"></div>
        </div>

        <div className="footer-main">
          <div className="container">
            <div className="footer-grid">
              {/* Brand Column */}
              <motion.div className="footer-col brand-col" variants={itemVariants}>
                <div className="brand-container">
                  <div className="logo-container">
                    <img src={asbLogo} alt="ASB Fashion" className="footer-logo" />
                  </div>
                  <div className="brand-meta">
                    <FaCrown className="brand-crown" />
                    <span>Since 1992</span>
                  </div>
                  <p className="brand-description">
                    Sri Lanka's premier fashion destination with 17 branches islandwide, 
                    delivering exceptional style and quality since 1992.
                  </p>
                  <div className="brand-stats">
                    <div className="stat-item">
                      <FaStore className="stat-icon" />
                      <div className="stat-info">
                        <span className="stat-value">17+</span>
                        <span className="stat-label">Branches</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <FaRegHeart className="stat-icon" />
                      <div className="stat-info">
                        <span className="stat-value">50K+</span>
                        <span className="stat-label">Customers</span>
                      </div>
                    </div>
                  </div>
                  <div className="trust-indicators">
                    <div className="trust-item"><FaShieldAlt /> <span>100% Authentic</span></div>
                    <div className="trust-item"><FaTruck /> <span>Free Shipping</span></div>
                    <div className="trust-item"><FaUndo /> <span>Easy Returns</span></div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Links Column */}
              <motion.div className="footer-col" variants={itemVariants}>
                <h4 className="footer-title">
                  <span className="title-text">Quick Links</span>
                  <span className="title-underline"></span>
                </h4>
                <ul className="footer-links">
                  {quickLinks.map((link, index) => (
                    <motion.li 
                      key={index}
                      onHoverStart={() => setActiveLink(index)}
                      onHoverEnd={() => setActiveLink(null)}
                    >
                      <Link to={link.path}>
                        <span className="link-name">{link.name}</span>
                        <motion.span 
                          className="link-indicator"
                          animate={{ width: activeLink === index ? '100%' : '0%' }}
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact Column */}
              <motion.div className="footer-col" variants={itemVariants}>
                <h4 className="footer-title">
                  <span className="title-text">Contact</span>
                  <span className="title-underline"></span>
                </h4>
                <div className="contact-list">
                  <div className="contact-row">
                    <FaRegBuilding className="contact-icon" />
                    <div className="contact-content">
                      <span className="contact-label">Head Office</span>
                      <p>266/2, Sri Rathanajothi Mawatha, Kuda Waskaduwa, Waskaduwa.</p>
                    </div>
                  </div>
                  <div className="contact-row">
                    <FaPhone className="contact-icon" />
                    <div className="contact-content">
                      <span className="contact-label">Hotline</span>
                      <p>071 905 7057 | 011 283 1705</p>
                    </div>
                  </div>
                  <div className="contact-row">
                    <FaRegEnvelope className="contact-icon" />
                    <div className="contact-content">
                      <span className="contact-label">Email</span>
                      <p>info@asbfashion.com</p>
                    </div>
                  </div>
                  <div className="contact-row">
                    <FaRegClock className="contact-icon" />
                    <div className="contact-content">
                      <span className="contact-label">Hours</span>
                      <p>9:00 AM - 8:00 PM (Mon-Sun)</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Newsletter Column */}
              <motion.div className="footer-col" variants={itemVariants}>
                <h4 className="footer-title">
                  <span className="title-text">Newsletter</span>
                  <span className="title-underline"></span>
                </h4>
                <div className="newsletter-container">
                  <p className="newsletter-description">Subscribe to receive exclusive updates and offers</p>
                  
                  {/* Error Message Display */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="newsletter-error-message"
                      >
                        <FaExclamationTriangle className="error-icon" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Success Message Display */}
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="newsletter-success-message"
                      >
                        <FaCheckCircle className="success-icon" />
                        <span>{success}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Subscription Form */}
                  <AnimatePresence mode="wait">
                    {!isSubscribed && !success ? (
                      <motion.form
                        key="form"
                        onSubmit={handleSubscribe}
                        className="newsletter-form"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="input-container">
                          <InputGroup>
                            <Form.Control
                              type="email"
                              placeholder="Your email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              disabled={isLoading}
                              className={`newsletter-input ${error ? 'error-input' : ''}`}
                            />
                            <Button 
                              type="submit" 
                              className="newsletter-submit"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                <FaRegPaperPlane />
                              )}
                            </Button>
                          </InputGroup>
                        </div>
                        <p className="privacy-note">
                          <FaShieldAlt /> Your data is protected. We never share your information.
                        </p>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="subscribe-confirmation"
                      >
                        <FaCheckCircle className="confirmation-icon" />
                        <div className="confirmation-text">
                          <strong>Welcome to ASB Family!</strong>
                          <span>You'll receive our latest updates soon</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="social-section">
                    <span className="social-label">Connect with us</span>
                    <div className="social-grid">
                      {socialMedia.map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          title={social.name}
                        >
                          {social.icon}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div className="footer-bottom" variants={itemVariants}>
          <div className="container">
            <div className="bottom-bar">
              <div className="copyright-info">
                <p>
                  © {currentYear} <strong>ASB FASHION</strong>. All rights reserved.
                  <Link to="/privacy">Privacy</Link>
                  <Link to="/terms">Terms</Link>
                  <Link to="/shipping">Shipping</Link>
                </p>
              </div>
              <motion.div className="developer-credit" whileHover={{ scale: 1.02 }}>
                <span className="credit-prefix">Powered by</span>
                <a href="https://vexelit.com" target="_blank" rel="noopener noreferrer" className="company-credit">VEXEL IT</a>
                <span className="developer-credit-name">Kavizz</span>
                <div className="method-indicator"><FaMobile /> Memoth Method</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-top-btn"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;