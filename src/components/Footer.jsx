import React, { useState } from "react";
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhone,
  FaUtensils,
  FaHeart,
  FaShippingFast,
  FaAward,
  FaLeaf,
  FaStar,
  FaClock,
  FaTruck,
  FaCrown,
  FaGem,
  FaArrowUp
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Form, InputGroup } from "react-bootstrap";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check scroll position for back to top button
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <motion.footer 
        className="footer-premium"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={footerVariants}
      >
        {/* Main Footer Content */}
        <div className="footer-main-premium">
          <div className="container">
            <div className="row g-5">
              {/* Brand Column */}
              <motion.div className="col-xl-4 col-lg-6" variants={itemVariants}>
                <div className="footer-brand-premium">
                  <motion.div 
                    className="brand-logo-premium mb-4"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaUtensils className="brand-icon-premium" />
                    <div className="brand-text-premium">
                      <h3 className="brand-title">KMD Sweet House</h3>
                      <p className="brand-tagline">Traditional Sri Lankan Sweets</p>
                    </div>
                  </motion.div>
                  
                  <p className="footer-description-premium">
                    Crafting authentic Sri Lankan sweets with generations-old family recipes. 
                    Experience the taste of tradition in every bite, made with love and premium ingredients.
                  </p>
                  
                  <div className="quality-features">
                    {[
                      { icon: FaAward, text: "Premium Quality", color: "#FFD700" },
                      { icon: FaLeaf, text: "Natural Ingredients", color: "#28a745" },
                      { icon: FaHeart, text: "Made with Love", color: "#e83e8c" },
                      { icon: FaShippingFast, text: "Fresh Daily", color: "#17a2b8" }
                    ].map((feature, index) => (
                      <motion.div 
                        key={index}
                        className="quality-feature"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, x: 5 }}
                      >
                        <feature.icon style={{ color: feature.color }} />
                        <span>{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div className="col-xl-2 col-lg-3 col-md-6" variants={itemVariants}>
                <h5 className="footer-heading-premium">Explore</h5>
                <div className="footer-links-premium">
                  {[
                    { path: "/", label: "Home", emoji: "🏠" },
                    { path: "/products", label: "Products", emoji: "🍬" },
                    { path: "/about", label: "About Us", emoji: "👨‍🍳" },
                    { path: "/contact", label: "Contact", emoji: "📞" },
                    { path: "/cart", label: "Shopping Cart", emoji: "🛒" },
                    { path: "/track-order", label: "Track Order", emoji: "📦" }
                  ].map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.path}
                      className="footer-link-premium"
                      whileHover={{ x: 10, color: "#FFD700" }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <span className="link-emoji">{link.emoji}</span>
                      <span className="link-text">{link.label}</span>
                      <div className="link-underline"></div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div className="col-xl-3 col-lg-3 col-md-6" variants={itemVariants}>
                <h5 className="footer-heading-premium">Get In Touch</h5>
                <div className="contact-info-premium">
                  {[
                    { 
                      icon: FaMapMarkerAlt, 
                      title: "Visit Our Store", 
                      content: "12/D/2, High Level Road, Thunnana, Hanwella, Sri Lanka",
                      link: "https://maps.app.goo.gl/xZMSKuc7cDdJSH3b9",
                      color: "#FF6B35"
                    },
                    { 
                      icon: FaPhone, 
                      title: "Call Us Now", 
                      content: ["+94 777 189 893", "   +94 112831705"],
                      links: ["tel:+94777189893", "tel:+94112831705"],
                      color: "#28a745"
                    },
                    { 
                      icon: FaEnvelope, 
                      title: "Email Us", 
                      content: "kmdproduction2025@gmail.com",
                      link: "mailto:kmdproduction2025@gmail.com",
                      color: "#dc3545"
                    },
                    { 
                      icon: FaClock, 
                      title: "Business Hours", 
                      content: "8:00 AM - 8:00 PM (Monday - Sunday)",
                      color: "#6f42c1"
                    }
                  ].map((contact, index) => (
                    <motion.div 
                      key={index}
                      className="contact-item-premium"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="contact-icon-wrapper" style={{ backgroundColor: `${contact.color}15` }}>
                        <contact.icon style={{ color: contact.color }} />
                      </div>
                      <div className="contact-details">
                        <h6>{contact.title}</h6>
                        {Array.isArray(contact.content) ? (
                          contact.content.map((item, itemIndex) => (
                            <a 
                              key={itemIndex}
                              href={contact.links[itemIndex]} 
                              className="contact-link"
                            >
                              {item}
                            </a>
                          ))
                        ) : contact.link ? (
                          <a href={contact.link} className="contact-link">
                            {contact.content}
                          </a>
                        ) : (
                          <p>{contact.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Newsletter & Social */}
              <motion.div className="col-xl-3 col-lg-6 col-md-6" variants={itemVariants}>
                <div className="newsletter-social-section">
                  <h5 className="footer-heading-premium">Stay Connected</h5>
                  
                  {/* Newsletter Subscription */}
                  <div className="newsletter-section">
                    <p className="newsletter-text">
                      Subscribe to get updates on new sweets and special offers!
                    </p>
                    
                    <AnimatePresence mode="wait">
                      {isSubscribed ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="subscription-success"
                        >
                          <FaStar className="text-warning me-2" />
                          Thank you for subscribing!
                        </motion.div>
                      ) : (
                        <motion.form 
                          key="form"
                          onSubmit={handleSubscribe}
                          className="newsletter-form"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <InputGroup className="newsletter-input-group">
                            <Form.Control
                              type="email"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="newsletter-input"
                            />
                            <motion.button
                              type="submit"
                              className="newsletter-btn"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaEnvelope />
                            </motion.button>
                          </InputGroup>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Social Links */}
                  <div className="social-section-premium">
                    <h6 className="social-title">Follow Our Journey</h6>
                    <div className="social-links-grid">
                      {[
                        { 
                          icon: FaFacebook, 
                          url: "https://www.facebook.com/share/1Cd3cf2AhS/", 
                          color: "#1877f2", 
                          label: "Facebook",
                          name: "Facebook"
                        },
                        { 
                          icon: FaInstagram, 
                          url: "https://www.instagram.com/kmdsweethouse?igsh=MXhyYTZxaXMzeGtx", 
                          color: "#e4405f", 
                          label: "Instagram",
                          name: "Instagram"
                        },
                        { 
                          icon: FaWhatsapp, 
                          url: "https://wa.me/94777189893", 
                          color: "#25d366", 
                          label: "WhatsApp",
                          name: "WhatsApp"
                        },
                        { 
                          icon: FaEnvelope, 
                          url: "mailto:kmdproduction2025@gmail.com", 
                          color: "#ea4335", 
                          label: "Email",
                          name: "Email"
                        }
                      ].map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link-premium"
                          style={{ 
                            '--social-color': social.color,
                            '--social-color-light': `${social.color}20`
                          }}
                          whileHover={{ 
                            scale: 1.15, 
                            y: -5,
                            boxShadow: `0 8px 25px ${social.color}40`
                          }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={social.label}
                          variants={pulseVariants}
                          animate="pulse"
                        >
                          <social.icon />
                          <span className="social-tooltip">{social.name}</span>
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="trust-badges">
                    <motion.div 
                      className="trust-badge"
                      variants={floatVariants}
                      animate="float"
                    >
                      <FaCrown className="text-warning" />
                      <span>Premium Quality</span>
                    </motion.div>
                    <motion.div 
                      className="trust-badge"
                      variants={floatVariants}
                      animate="float"
                      transition={{ delay: 0.5 }}
                    >
                      <FaGem className="text-info" />
                      <span>Since 2014</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          className="footer-bottom-premium"
          variants={itemVariants}
        >
          <div className="container">
            <div className="footer-bottom-content">
              <div className="footer-copyright">
                <p>
                  &copy; {currentYear} <strong>KMD Sweet House</strong>. All rights reserved.
                </p>
              </div>
              
              <div className="footer-credits">
                <motion.p
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Crafted with 
                  <span className="developer-name">Team Alpha Software Solution</span>
                </motion.p>
              </div>

              <div className="footer-policies">
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
                <a href="/shipping">Shipping Info</a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative Floating Elements */}
        <div className="footer-decoration-premium">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-sweet-element"
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            >
              {['🍬', '🍭', '🍪', '🧁', '🎂', '🍫', '🥮', '🍡'][i]}
            </motion.div>
          ))}
        </div>

        {/* Animated Background */}
        <div className="footer-background">
          <div className="bg-particle"></div>
          <div className="bg-particle"></div>
          <div className="bg-particle"></div>
        </div>
      </motion.footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-to-top-btn"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{ scale: 1.1, y: -2 }}
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