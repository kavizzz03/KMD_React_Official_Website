import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, Row, Col, Card, Button, Badge, Spinner, Carousel, 
  Form, InputGroup, Modal
} from "react-bootstrap";
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaInstagram, 
  FaFacebook, FaWhatsapp, FaTwitter, FaSearch,
  FaShoppingBag, FaUser, FaHeart, FaStar,
  FaTruck, FaExchangeAlt, FaShieldAlt, FaGift,
  FaArrowRight, FaChevronLeft, FaChevronRight, FaClock,
  FaCheckCircle, FaAward, FaLeaf, FaUsers, FaStore,
  FaCreditCard, FaUndo, FaFire, FaTag, FaEye,
  FaTshirt, FaFemale, FaChild, FaGem, FaCrown,
  FaInfoCircle, FaEnvelopeOpen, FaHeadset,
  FaQrcode, FaDownload, FaPercentage, FaCalendarAlt, FaImage,
  FaCamera, FaPlay, FaImages, FaChalkboardTeacher, FaHandsHelping, FaGlassCheers
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import "./HomePage.css";

const API_BASE = "https://whats.asbfashion.com/api";

// Featured Event Card Component - Shows Single Featured Event
const FeaturedEventCard = ({ event, navigate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto-slide effect for multiple images
  useEffect(() => {
    if (!event.images || event.images.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentImageIndex((prev) => 
          prev + 1 >= event.images.length ? 0 : prev + 1
        );
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [event.images?.length, isHovered]);
  
  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? event.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      (prev + 1) >= event.images.length ? 0 : prev + 1
    );
  };
  
  const handleEventClick = () => {
    navigate("/gallery");
  };
  
  const getEventStatus = (eventDate) => {
    if (!eventDate) return "upcoming";
    const event = new Date(eventDate);
    const now = new Date();
    
    if (event > now) return "upcoming";
    if (event.toDateString() === now.toDateString()) return "ongoing";
    return "completed";
  };
  
  const status = getEventStatus(event.event_date);
  const statusConfig = {
    upcoming: { color: "#f59e0b", text: "Upcoming", icon: <FaClock /> },
    ongoing: { color: "#10b981", text: "Live Now", icon: <FaPlay /> },
    completed: { color: "#6b7280", text: "Completed", icon: <FaCheckCircle /> }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5 }}
      className="featured-event-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEventClick}
    >
      <Card className="featured-event-card border-0 overflow-hidden">
        <Row className="g-0">
          {/* Image Section - Takes 50% */}
          <Col lg={6} className="featured-event-image-col">
            <div className="featured-event-image-container">
              {event.images && event.images.length > 0 ? (
                <>
                  <div className="image-slideshow">
                    <img 
                      src={event.images[currentImageIndex]?.image_url || "/images/event-placeholder.jpg"} 
                      alt={event.title}
                      className="featured-event-image"
                    />
                    
                    {/* Image Counter */}
                    {event.images.length > 1 && (
                      <div className="image-counter-badge">
                        <FaImage className="me-1" />
                        {currentImageIndex + 1} / {event.images.length}
                      </div>
                    )}
                    
                    {/* Navigation Arrows */}
                    {event.images.length > 1 && (
                      <>
                        <button 
                          className="slideshow-nav-btn prev"
                          onClick={handlePrevImage}
                        >
                          <FaChevronLeft />
                        </button>
                        <button 
                          className="slideshow-nav-btn next"
                          onClick={handleNextImage}
                        >
                          <FaChevronRight />
                        </button>
                      </>
                    )}
                    
                    {/* Image Indicators */}
                    {event.images.length > 1 && (
                      <div className="image-indicators">
                        {event.images.map((_, idx) => (
                          <span 
                            key={idx}
                            className={`indicator-dot ${currentImageIndex === idx ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(idx);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Play Icon Overlay */}
                  <div className="play-icon-overlay">
                    <FaPlay />
                  </div>
                </>
              ) : (
                <img 
                  src="/images/event-placeholder.jpg" 
                  alt={event.title}
                  className="featured-event-image"
                />
              )}
              
              {/* Status Badge */}
              <div className="event-status-badge" style={{ background: statusConfig[status].color }}>
                {statusConfig[status].icon}
                <span>{statusConfig[status].text}</span>
              </div>
            </div>
          </Col>
          
          {/* Content Section - Takes 50% */}
          <Col lg={6}>
            <Card.Body className="featured-event-content h-100">
              <div className="event-category-badge">
                <FaCalendarAlt className="me-2" />
                Featured Event
              </div>
              
              <h2 className="featured-event-title">
                {event.title}
              </h2>
              
              <div className="event-meta-info">
                <div className="meta-item">
                  <FaCalendarAlt className="meta-icon" />
                  <span>
                    {new Date(event.event_date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                {event.location && (
                  <div className="meta-item">
                    <FaMapMarkerAlt className="meta-icon" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="meta-item">
                  <FaImages className="meta-icon" />
                  <span>{event.images?.length || 0} Memorable Moments</span>
                </div>
              </div>
              
              <p className="featured-event-description">
                {event.description || "Join us for an exciting fashion event filled with style, elegance, and unforgettable moments. Experience the best of ASB Fashion."}
              </p>
              
              <Button 
                variant="danger" 
                size="lg"
                className="explore-gallery-btn"
                onClick={handleEventClick}
              >
                <FaCamera className="me-2" />
                Explore Full Gallery
                <FaArrowRight className="ms-2" />
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </motion.div>
  );
};

const HomePage = () => {
  const [slides, setSlides] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingNow, setTrendingNow] = useState([]);
  const [giftCategories, setGiftCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [giftLoading, setGiftLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  
  // Branch state - from database
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  
  // Sale state
  const [sale, setSale] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [saleLoading, setSaleLoading] = useState(true);
  
  const navigate = useNavigate();

  const categories = [
    { id: "men", name: "Men's Fashion", icon: FaTshirt, color: "#2563eb", image: "/images/categories/men.jpg" },
    { id: "women", name: "Women's Fashion", icon: FaFemale, color: "#dc2626", image: "/images/categories/women.jpg" },
    { id: "kids", name: "Kids Collection", icon: FaChild, color: "#f59e0b", image: "/images/categories/kids.jpg" },
    { id: "accessories", name: "Accessories", icon: FaGem, color: "#8b5cf6", image: "/images/categories/accessories.jpg" },
    { id: "traditional", name: "Traditional Wear", icon: FaCrown, color: "#059669", image: "/images/categories/traditional.jpg" }
  ];

  // Fetch branches from database
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        const response = await axios.get(`${API_BASE}/get_home_branches.php`);
        if (response.data.success) {
          setBranches(response.data.branches);
        } else {
          console.error("Failed to fetch branches:", response.data.message);
          setBranches([]);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        setBranches([]);
      } finally {
        setBranchesLoading(false);
      }
    };
    
    fetchBranches();
  }, []);

  // Newsletter submit handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterError("");

    if (newsletterEmail) {
      try {
        const response = await fetch("https://whats.asbfashion.com/api/subscribe.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: newsletterEmail }),
        });

        const result = await response.json();

        if (result.status === "success") {
          setNewsletterSuccess(true);
          setNewsletterEmail("");
          setTimeout(() => setNewsletterSuccess(false), 4000);
        } else {
          setNewsletterError(result.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("Error subscribing:", error);
        setNewsletterError("Failed to connect to the server.");
      }
    }
  };

  // Fetch featured event
  useEffect(() => {
    const fetchFeaturedEvent = async () => {
      try {
        setEventsLoading(true);
        const response = await axios.get(`${API_BASE}/get_home_events.php`);
        if (response.data.success && response.data.events.length > 0) {
          setFeaturedEvent(response.data.events[0]);
        } else {
          setFeaturedEvent({
            id: 1,
            title: "ASB Fashion Week 2024",
            description: "Experience the biggest fashion event of the year! Join us for an unforgettable showcase of the latest collections, designer meet-and-greets, and exclusive shopping opportunities. Be part of Sri Lanka's premier fashion celebration where tradition meets contemporary style.",
            event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Colombo, Sri Lanka",
            images: [
              { image_url: "/images/events/fashion-week-1.jpg" },
              { image_url: "/images/events/fashion-week-2.jpg" },
              { image_url: "/images/events/fashion-week-3.jpg" }
            ]
          });
        }
      } catch (error) {
        console.error("Error fetching featured event:", error);
        setFeaturedEvent({
          id: 1,
          title: "ASB Fashion Week 2024",
          description: "Experience the biggest fashion event of the year! Join us for an unforgettable showcase of the latest collections, designer meet-and-greets, and exclusive shopping opportunities.",
          event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Colombo, Sri Lanka",
          images: [
            { image_url: "/images/events/fashion-week-1.jpg" },
            { image_url: "/images/events/fashion-week-2.jpg" },
            { image_url: "/images/events/fashion-week-3.jpg" }
          ]
        });
      } finally {
        setEventsLoading(false);
      }
    };
    
    fetchFeaturedEvent();
  }, []);

  // Fetch main data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [slidesRes, featuredRes, newRes, trendingRes] = await Promise.all([
          axios.get(`${API_BASE}/get_slides.php`),
          axios.get(`${API_BASE}/get_products.php`, { params: { type: "featured", limit: 8 } }),
          axios.get(`${API_BASE}/get_products.php`, { params: { type: "new", limit: 8 } }),
          axios.get(`${API_BASE}/get_products.php`, { params: { type: "trending", limit: 8 } })
        ]);
        
        setSlides(Array.isArray(slidesRes.data) ? slidesRes.data : 
                  (slidesRes.data?.data && Array.isArray(slidesRes.data.data) ? slidesRes.data.data : []));
        
        let featuredData = [];
        if (Array.isArray(featuredRes.data)) {
          featuredData = featuredRes.data;
        } else if (featuredRes.data?.data && Array.isArray(featuredRes.data.data)) {
          featuredData = featuredRes.data.data;
        } else if (featuredRes.data?.products && Array.isArray(featuredRes.data.products)) {
          featuredData = featuredRes.data.products;
        } else if (featuredRes.data?.success && Array.isArray(featuredRes.data.products)) {
          featuredData = featuredRes.data.products;
        }
        setFeaturedProducts(featuredData);
        
        let newData = [];
        if (Array.isArray(newRes.data)) {
          newData = newRes.data;
        } else if (newRes.data?.data && Array.isArray(newRes.data.data)) {
          newData = newRes.data.data;
        } else if (newRes.data?.products && Array.isArray(newRes.data.products)) {
          newData = newRes.data.products;
        } else if (newRes.data?.success && Array.isArray(newRes.data.products)) {
          newData = newRes.data.products;
        }
        setNewArrivals(newData);
        
        let trendingData = [];
        if (Array.isArray(trendingRes.data)) {
          trendingData = trendingRes.data;
        } else if (trendingRes.data?.data && Array.isArray(trendingRes.data.data)) {
          trendingData = trendingRes.data.data;
        } else if (trendingRes.data?.products && Array.isArray(trendingRes.data.products)) {
          trendingData = trendingRes.data.products;
        } else if (trendingRes.data?.success && Array.isArray(trendingRes.data.products)) {
          trendingData = trendingRes.data.products;
        }
        setTrendingNow(trendingData);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setSlides([
          {
            id: 1,
            title: "ASB Fashion - Beyond Tradition",
            description: "Redefining Sri Lankan fashion with contemporary elegance and timeless style",
            image_url: "/images/hero-fashion.jpg"
          },
          {
            id: 2,
            title: "New Collection 2024",
            description: "Discover the latest trends in men's and women's fashion",
            image_url: "/images/hero-collection.jpg"
          }
        ]);
        setFeaturedProducts([]);
        setNewArrivals([]);
        setTrendingNow([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch gift voucher categories
  useEffect(() => {
    const fetchGiftCategories = async () => {
      try {
        setGiftLoading(true);
        const response = await axios.get(`${API_BASE}/gift_voucher/get_categories.php`);
        if (response.data.success) {
          setGiftCategories(response.data.categories);
        }
      } catch (err) {
        console.error("Error fetching gift categories:", err);
        setGiftCategories([
          { id: 1, name: "Birthday Special", price: 1000, discount_percent: 0, validity_days: 365, image_url: "/images/gift/birthday.jpg", description: "Perfect birthday gift" },
          { id: 2, name: "Anniversary Gift", price: 2500, discount_percent: 10, validity_days: 365, image_url: "/images/gift/anniversary.jpg", description: "Celebrate special moments" },
          { id: 3, name: "Festival Offer", price: 5000, discount_percent: 15, validity_days: 180, image_url: "/images/gift/festival.jpg", description: "Festival special" },
          { id: 4, name: "Premium Package", price: 10000, discount_percent: 20, validity_days: 365, image_url: "/images/gift/premium.jpg", description: "Ultimate experience" }
        ]);
      } finally {
        setGiftLoading(false);
      }
    };
    
    fetchGiftCategories();
  }, []);

  // Fetch active sale
  useEffect(() => {
    const fetchSale = async () => {
      try {
        setSaleLoading(true);
        const response = await axios.get(`${API_BASE}/get_home_sale.php`);
        
        if (response.data.status === 'active' || response.data.status === 'upcoming') {
          setSale(response.data);
        } else {
          setSale(null);
        }
      } catch (err) {
        console.error("Error fetching sale data:", err);
        setSale(null);
      } finally {
        setSaleLoading(false);
      }
    };
    
    fetchSale();
    const interval = setInterval(fetchSale, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Countdown Logic
  useEffect(() => {
    if (!sale || sale.status !== 'active') return;

    const timer = setInterval(() => {
      const target = new Date(sale.end_time).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);
        setSale(null);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sale]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleImageError = (e) => {
    e.target.src = "/images/placeholder.jpg";
  };

  const calculateFinalPrice = (price, discount) => {
    if (discount > 0) {
      return price - (price * discount / 100);
    }
    return price;
  };

  if (loading) {
    return (
      <div className="asb-loading-screen">
        <div className="loading-content">
          <Spinner animation="border" variant="danger" className="mb-3" />
          <h4>ASB FASHION</h4>
          <p>Loading the latest styles...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="asb-homepage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Carousel */}
      <section className="asb-hero">
        <Carousel fade controls indicators interval={5000} className="hero-carousel">
          {slides.map((slide, index) => (
            <Carousel.Item key={slide.id || index}>
              <div 
                className="hero-slide"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url(${slide.image_url ? `https://whats.asbfashion.com/${slide.image_url}` : '/images/hero-bg.jpg'})`,
                }}
              >
                <Container>
                  <Row>
                    <Col lg={7}>
                      <motion.div 
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Badge bg="danger" className="hero-badge">ASB FASHION</Badge>
                        <h1 className="display-4 fw-bold">{slide.title || "Beyond Tradition"}</h1>
                        <p className="lead">{slide.description || "Discover the perfect blend of traditional elegance and modern fashion"}</p>
                        <div className="hero-buttons">
                          <Button variant="danger" size="lg" onClick={() => navigate("/products")}>
                            Shop Now <FaArrowRight className="ms-2" />
                          </Button>
                          <Button variant="outline-light" size="lg" onClick={() => navigate("/collections")}>
                            View Collections
                          </Button>
                        </div>
                      </motion.div>
                    </Col>
                  </Row>
                </Container>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Quick Links */}
      <section className="quick-links py-3">
        <Container>
          <Row className="justify-content-center">
            <Col md={2} sm={4} xs={6}>
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="link" 
                  className="quick-link-btn w-100"
                  onClick={() => navigate("/about")}
                >
                  <FaInfoCircle className="me-2" />
                  About Us
                </Button>
              </motion.div>
            </Col>
            <Col md={2} sm={4} xs={6}>
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="link" 
                  className="quick-link-btn w-100"
                  onClick={() => navigate("/contact")}
                >
                  <FaEnvelopeOpen className="me-2" />
                  Contact Us
                </Button>
              </motion.div>
            </Col>
            <Col md={2} sm={4} xs={6}>
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="link" 
                  className="quick-link-btn w-100 gift-link"
                  onClick={() => navigate("/gift-voucher")}
                >
                  <FaGift className="me-2" />
                  Gift Voucher
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Gift Voucher Banner */}
      <section className="gift-voucher-banner py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gift-banner-content"
          >
            <Row className="align-items-center g-4">
              <Col lg={6}>
                <div className="gift-banner-text">
                  <Badge bg="warning" text="dark" className="px-4 py-2 mb-3">
                    <FaGift className="me-2" />
                    Special Gift Cards
                  </Badge>
                  <h2 className="display-5 fw-bold mb-3">
                    Give the Gift of <span className="text-danger">Fashion</span>
                  </h2>
                  <p className="lead text-muted mb-4">
                    Perfect for any occasion - Birthdays, Anniversaries, Festivals, or just because!
                  </p>
                  <div className="gift-features mb-4">
                    <div className="gift-feature">
                      <FaQrcode className="text-danger" />
                      <span>QR Code Generated</span>
                    </div>
                    <div className="gift-feature">
                      <FaDownload className="text-danger" />
                      <span>Download & Share</span>
                    </div>
                    <div className="gift-feature">
                      <FaEnvelope className="text-danger" />
                      <span>Email Delivery</span>
                    </div>
                    <div className="gift-feature">
                      <FaPercentage className="text-danger" />
                      <span>Up to 20% Off</span>
                    </div>
                  </div>
                  <Button 
                    variant="danger" 
                    size="lg" 
                    className="px-5 py-3"
                    onClick={() => navigate("/gift-voucher")}
                  >
                    <FaGift className="me-2" />
                    Buy a Gift Voucher
                    <FaArrowRight className="ms-2" />
                  </Button>
                </div>
              </Col>
              <Col lg={6}>
                <Row className="g-3">
                  {giftLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" variant="danger" />
                    </div>
                  ) : (
                    giftCategories.slice(0, 4).map((category, index) => (
                      <Col md={6} key={category.id}>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -10, scale: 1.02 }}
                          onClick={() => navigate("/gift-voucher")}
                        >
                          <Card className="gift-category-card border-0 shadow-sm h-100">
                            <Card.Body className="text-center p-4">
                              <div className="gift-icon-wrapper mb-3">
                                <FaGift size={40} className="text-danger" />
                              </div>
                              <h5 className="fw-bold mb-2">{category.name}</h5>
                              <p className="small text-muted mb-3">{category.description}</p>
                              <div className="gift-price mb-2">
                                {category.discount_percent > 0 ? (
                                  <>
                                    <span className="text-decoration-line-through text-muted me-2">
                                      LKR {category.price}
                                    </span>
                                    <span className="text-danger fw-bold">
                                      LKR {calculateFinalPrice(category.price, category.discount_percent)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-danger fw-bold">LKR {category.price}</span>
                                )}
                              </div>
                              {category.discount_percent > 0 && (
                                <Badge bg="success" className="mb-2">
                                  {category.discount_percent}% OFF
                                </Badge>
                              )}
                              <p className="small text-muted mb-0">
                                <FaCalendarAlt className="me-1" />
                                Valid {category.validity_days} days
                              </p>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      </Col>
                    ))
                  )}
                </Row>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

      {/* Floating Gift Voucher Button */}
      <motion.div 
        className="floating-gift-button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          variant="danger" 
          className="rounded-circle p-0 shadow-lg"
          onClick={() => navigate("/gift-voucher")}
          style={{ width: '60px', height: '60px' }}
        >
          <FaGift size={24} />
        </Button>
        <span className="gift-tooltip">Gift Vouchers</span>
      </motion.div>

      {/* Mobile Search */}
      <section className="asb-mobile-search d-lg-none py-3">
        <Container>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search for fashion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Button variant="danger" type="submit">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>
        </Container>
      </section>

      {/* Features Strip */}
      <section className="asb-features py-4">
        <Container>
          <Row className="g-3">
            <Col md={3} sm={6}>
              <motion.div className="feature-card" whileHover={{ y: -5 }}>
                <FaTruck className="feature-icon" />
                <div>
                  <h6>Free Shipping</h6>
                  <p>On orders over LKR 5000</p>
                </div>
              </motion.div>
            </Col>
            <Col md={3} sm={6}>
              <motion.div className="feature-card" whileHover={{ y: -5 }}>
                <FaExchangeAlt className="feature-icon" />
                <div>
                  <h6>Easy Returns</h6>
                  <p>7-day return policy</p>
                </div>
              </motion.div>
            </Col>
            <Col md={3} sm={6}>
              <motion.div className="feature-card" whileHover={{ y: -5 }}>
                <FaShieldAlt className="feature-icon" />
                <div>
                  <h6>100% Authentic</h6>
                  <p>Genuine products</p>
                </div>
              </motion.div>
            </Col>
            <Col md={3} sm={6}>
              <motion.div className="feature-card" whileHover={{ y: -5 }}>
                <FaCreditCard className="feature-icon" />
                <div>
                  <h6>Secure Payment</h6>
                  <p>100% secure checkout</p>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Grid */}
      <section className="asb-categories py-5">
        <Container>
          <motion.div 
            className="section-header text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge bg="danger" className="mb-3 px-3 py-2">Shop by Category</Badge>
            <h2 className="display-6 fw-bold">Explore Our Collections</h2>
            <p className="text-muted">Discover the perfect style for every occasion</p>
          </motion.div>

          <Row className="g-4">
            {categories.map((category, index) => (
              <Col lg={4} md={6} key={category.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="category-card border-0 overflow-hidden">
                    <div className="category-image">
                      <Card.Img 
                        src={category.image} 
                        alt={category.name}
                        onError={handleImageError}
                      />
                      <div className="category-overlay">
                        <div className="category-icon-wrapper">
                          <category.icon />
                        </div>
                        <h4>{category.name}</h4>
                        <Button 
                          variant="outline-light" 
                          size="sm"
                          onClick={() => navigate(`/category/${category.id}`)}
                        >
                          Shop Now <FaArrowRight className="ms-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="asb-products py-5 bg-light">
        <Container>
          <motion.div 
            className="section-header d-flex justify-content-between align-items-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <Badge bg="danger" className="mb-2">Featured</Badge>
              <h3 className="fw-bold">Featured Products</h3>
            </div>
            <Button variant="link" className="text-danger" onClick={() => navigate("/featured")}>
              View All <FaArrowRight />
            </Button>
          </motion.div>

          <Row xs={2} md={4} className="g-4">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <Col key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="product-card h-100 border-0">
                    <div className="product-image-wrapper">
                      <Card.Img 
                        variant="top" 
                        src={product.image_url || "/images/product-placeholder.jpg"} 
                        className="product-image"
                        onError={handleImageError}
                      />
                      <Badge bg="danger" className="product-badge">Featured</Badge>
                      <div className="product-actions">
                        <Button variant="light" size="sm" className="action-btn">
                          <FaEye />
                        </Button>
                        <Button variant="light" size="sm" className="action-btn">
                          <FaHeart />
                        </Button>
                      </div>
                    </div>
                    <Card.Body className="text-center">
                      <Card.Title className="product-title">{product.name || "Product Name"}</Card.Title>
                      <div className="product-price">
                        <span className="current-price">LKR {product.price || "2,500"}</span>
                        {product.oldPrice && <span className="old-price">LKR {product.oldPrice}</span>}
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="mt-2 w-100"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <FaShoppingBag className="me-2" />
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Sale Banner */}
      {sale && sale.status === 'active' && !saleLoading && (
        <section 
          className="asb-sale-banner py-5" 
          style={{
            background: `linear-gradient(90deg, rgba(220,38,38,0.95) 0%, rgba(0,0,0,0.7) 100%), url(${sale.bg_image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <Container>
            <Row className="align-items-center">
              <Col lg={7} className="text-white">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="sale-content"
                >
                  <Badge bg="light" text="dark" className="sale-badge mb-4 px-4 py-2">
                    <FaTag className="me-2" />
                    Limited Time Offer
                  </Badge>
                  <h2 className="display-4 fw-bold mb-3">{sale.title}</h2>
                  <p className="lead mb-4 fs-4">{sale.subtitle}</p>
                  
                  <div className="sale-timer mb-4">
                    <div className="timer-item bg-white bg-opacity-10">
                      <span className="days text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="text-white-50">Days</span>
                    </div>
                    <div className="timer-item bg-white bg-opacity-10">
                      <span className="hours text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-white-50">Hours</span>
                    </div>
                    <div className="timer-item bg-white bg-opacity-10">
                      <span className="minutes text-white">{String(timeLeft.mins).padStart(2, '0')}</span>
                      <span className="text-white-50">Mins</span>
                    </div>
                    <div className="timer-item bg-white bg-opacity-10">
                      <span className="seconds text-white">{String(timeLeft.secs).padStart(2, '0')}</span>
                      <span className="text-white-50">Secs</span>
                    </div>
                  </div>

                  <Button 
                    variant="light" 
                    size="lg" 
                    onClick={() => navigate("/sale")}
                    className="px-5 fw-bold text-danger"
                  >
                    Shop the Sale <FaArrowRight className="ms-2" />
                  </Button>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Trending Now */}
      <section className="asb-trending py-5">
        <Container>
          <motion.div 
            className="section-header d-flex justify-content-between align-items-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <Badge bg="danger" className="mb-2">
                <FaFire className="me-1" /> Trending
              </Badge>
              <h3 className="fw-bold">Trending Now</h3>
            </div>
            <Button variant="link" className="text-danger" onClick={() => navigate("/trending")}>
              View All <FaArrowRight />
            </Button>
          </motion.div>

          <Row xs={2} md={4} className="g-4">
            {trendingNow.slice(0, 4).map((product, index) => (
              <Col key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="product-card h-100 border-0">
                    <div className="product-image-wrapper">
                      <Card.Img 
                        variant="top" 
                        src={product.image_url || "/images/product-placeholder.jpg"} 
                        className="product-image"
                        onError={handleImageError}
                      />
                      <Badge bg="warning" text="dark" className="product-badge">
                        <FaFire className="me-1" /> Hot
                      </Badge>
                    </div>
                    <Card.Body className="text-center">
                      <Card.Title className="product-title">{product.name || "Trending Item"}</Card.Title>
                      <div className="product-price">
                        <span className="current-price">LKR {product.price || "3,200"}</span>
                      </div>
                      <div className="product-rating mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-warning small" />
                        ))}
                        <span className="ms-2 small">(24)</span>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Store Network */}
      <section className="asb-stores py-5 bg-light">
        <Container>
          <motion.div 
            className="section-header text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge bg="danger" className="mb-3 px-3 py-2">Store Network</Badge>
            <h2 className="display-6 fw-bold">
              {branchesLoading ? 'Loading Branches...' : `${branches.length} Branches Islandwide`}
            </h2>
            <p className="text-muted">Find an ASB Fashion store near you</p>
          </motion.div>

          <Row className="g-4">
            <Col lg={5}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="store-card border-0 shadow-sm">
                  <Card.Body>
                    <div className="store-stats mb-4">
                      <div className="stat-item">
                        <h3>{branchesLoading ? '...' : branches.length}+</h3>
                        <p>Branches</p>
                      </div>
                      <div className="stat-item">
                        <h3>{branchesLoading ? '...' : new Set(branches.map(b => b.district).filter(d => d)).size}+</h3>
                        <p>Districts</p>
                      </div>
                      <div className="stat-item">
                        <h3>
                          {branchesLoading ? '...' : 
                            branches.reduce((sum, b) => sum + (b.customer_count || 0), 0).toLocaleString()}+
                        </h3>
                        <p>Happy Customers</p>
                      </div>
                    </div>

                    <h5 className="fw-bold mb-3">Store Locations</h5>
                    <div className="branch-list mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {branchesLoading ? (
                        <div className="text-center py-4">
                          <Spinner animation="border" variant="danger" size="sm" />
                          <p className="mt-2 text-muted">Loading branches...</p>
                        </div>
                      ) : (
                        branches.slice(0, 12).map((branch, idx) => (
                          <motion.div 
                            key={branch.id || idx} 
                            className="branch-item"
                            whileHover={{ x: 5, color: "#dc2626" }}
                            onClick={() => {
                              setSelectedStore(branch);
                              setShowStoreModal(true);
                            }}
                          >
                            <FaStore className="text-danger me-2" />
                            <span>{branch.city}</span>
                            {branch.is_head && (
                              <Badge bg="danger" className="ms-2" style={{ fontSize: '10px' }}>
                                Head Office
                              </Badge>
                            )}
                            <Badge bg="light" text="dark" className="ms-auto">{branch.phone}</Badge>
                          </motion.div>
                        ))
                      )}
                    </div>

                    <div className="d-grid gap-2">
                      <Button variant="danger" onClick={() => navigate("/stores")}>
                        View All Locations <FaArrowRight className="ms-2" />
                      </Button>
                      <Button variant="outline-danger" onClick={() => navigate("/about")}>
                        Learn About Us <FaInfoCircle className="ms-2" />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col lg={7}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="store-map"
              >
                <div className="map-placeholder rounded-4 shadow bg-white p-4 text-center">
                  {branchesLoading ? (
                    <div className="py-5">
                      <Spinner animation="border" variant="danger" />
                      <p className="mt-3 text-muted">Loading store locations...</p>
                    </div>
                  ) : (
                    <>
                      <div className="map-visualization mb-4">
                        <img 
                          src="/images/sri-lanka-map.jpg" 
                          alt="Sri Lanka Store Locations" 
                          className="img-fluid rounded-4"
                          onError={handleImageError}
                          style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="map-overlay-info">
                        <div className="branch-coverage">
                          <h6 className="fw-bold mb-3">Store Coverage by District</h6>
                          <div className="district-tags">
                            {[...new Set(branches.map(b => b.district).filter(d => d))].slice(0, 8).map(district => (
                              <Badge key={district} bg="light" text="dark" className="me-2 mb-2 p-2">
                                {district}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-muted mt-3 mb-0 small">
                          <FaStore className="me-1" /> 
                          {branches.length} locations across Sri Lanka. Click on any location to view details.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* New Arrivals */}
      <section className="asb-new-arrivals py-5">
        <Container>
          <motion.div 
            className="section-header d-flex justify-content-between align-items-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <Badge bg="danger" className="mb-2">New</Badge>
              <h3 className="fw-bold">New Arrivals</h3>
            </div>
            <Button variant="link" className="text-danger" onClick={() => navigate("/new-arrivals")}>
              View All <FaArrowRight />
            </Button>
          </motion.div>

          <Row xs={2} md={4} className="g-4">
            {newArrivals.slice(0, 4).map((product, index) => (
              <Col key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="product-card h-100 border-0">
                    <div className="product-image-wrapper">
                      <Card.Img 
                        variant="top" 
                        src={product.image_url || "/images/product-placeholder.jpg"} 
                        className="product-image"
                        onError={handleImageError}
                      />
                      <Badge bg="success" className="product-badge">New</Badge>
                    </div>
                    <Card.Body className="text-center">
                      <Card.Title className="product-title">{product.name || "New Arrival"}</Card.Title>
                      <div className="product-price">
                        <span className="current-price">LKR {product.price || "2,800"}</span>
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="mt-2 w-100"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        Quick View
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Events Section - Single Event Only */}
      <section className="asb-featured-event py-5">
        <Container>
          {/* Animated Background Elements */}
          <div className="event-background-elements">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
            <div className="glow-effect"></div>
          </div>

          {/* Enhanced Section Header */}
          <motion.div 
            className="section-header text-center mb-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Badge with Pulse Animation */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
            >
              <Badge bg="danger" className="featured-badge mb-3 px-4 py-2">
                <FaCalendarAlt className="me-2" /> 
                <span>Featured Event</span>
                <div className="badge-pulse"></div>
              </Badge>
            </motion.div>
            
            {/* Animated Title */}
            <motion.h2 
              className="display-6 fw-bold gradient-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Celebrating Our Journey Together
            </motion.h2>
            
            {/* Animated Description */}
            <motion.p 
              className="text-muted event-description"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Join us in celebrating CSR initiatives, festive gatherings, and memorable moments that define our company culture
            </motion.p>
          </motion.div>

          {/* Event Card with Enhanced Design */}
          {eventsLoading ? (
            <motion.div 
              className="text-center py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="premium-loader">
                <div className="loader-ring"></div>
                <div className="loader-text">Loading amazing moments...</div>
              </div>
            </motion.div>
          ) : featuredEvent ? (
            <FeaturedEventCard event={featuredEvent} navigate={navigate} />
          ) : (
            <motion.div 
              className="empty-event-state text-center py-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="empty-state-icon">
                <FaCalendarAlt size={60} />
              </div>
              <h4 className="mt-4">No featured event at the moment</h4>
              <p className="text-muted mb-4">Check back soon for exciting events and celebrations!</p>
              <Button 
                variant="danger" 
                onClick={() => navigate("/gallery")}
                className="explore-btn"
              >
                <FaImages className="me-2" />
                Explore Event Gallery
                <FaArrowRight className="ms-2" />
              </Button>
            </motion.div>
          )}
        </Container>
      </section>

      {/* Newsletter */}
      <section className="asb-newsletter py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Badge bg="danger" className="mb-3 px-3 py-2">Stay Updated</Badge>
                <h2 className="display-6 fw-bold mb-3">Join Our Newsletter</h2>
                <p className="lead text-muted mb-4">
                  Subscribe to get updates on new arrivals, exclusive sales, and fashion tips
                </p>

                {/* SUCCESS MESSAGE */}
                {newsletterSuccess ? (
                  <motion.div 
                    className="alert alert-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <FaCheckCircle className="me-2" />
                    Thank you for subscribing!
                  </motion.div>
                ) : (
                  <Form onSubmit={handleNewsletterSubmit}>
                    {/* ERROR MESSAGE */}
                    {newsletterError && (
                      <motion.div 
                        className="alert alert-warning mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {newsletterError}
                      </motion.div>
                    )}

                    <InputGroup className="newsletter-input-group">
                      <Form.Control 
                        type="email" 
                        placeholder="Enter your email address"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        required
                        className="py-3"
                      />
                      <Button variant="danger" type="submit" className="px-5">
                        Subscribe
                      </Button>
                    </InputGroup>
                  </Form>
                )}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="asb-testimonials py-5">
        <Container>
          <motion.div 
            className="section-header text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge bg="danger" className="mb-3 px-3 py-2">Customer Love</Badge>
            <h2 className="display-6 fw-bold">What Our Customers Say</h2>
          </motion.div>

          <Row className="g-4">
            {[1, 2, 3].map((item) => (
              <Col md={4} key={item}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item * 0.1 }}
                >
                  <Card className="testimonial-card border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="testimonial-rating mb-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-warning" />
                        ))}
                      </div>
                      <p className="testimonial-text mb-4">
                        "Great quality clothes and excellent service! The staff at ASB Fashion 
                        helped me find the perfect outfit for my special occasion."
                      </p>
                      <div className="testimonial-author d-flex align-items-center">
                        <div className="author-avatar me-3">
                          <img 
                            src={`/images/testimonials/avatar-${item}.jpg`} 
                            alt="Customer"
                            onError={handleImageError}
                          />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">Customer Name</h6>
                          <small className="text-muted">Colombo</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Instagram Feed */}
      <section className="asb-instagram py-5 bg-light">
        <Container>
          <motion.div 
            className="section-header text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge bg="danger" className="mb-3 px-3 py-2">
              <FaInstagram className="me-2" /> Instagram
            </Badge>
            <h2 className="display-6 fw-bold">Follow Us @asbfashion</h2>
          </motion.div>

          <Row className="g-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Col md={2} sm={4} xs={4} key={item}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="instagram-post"
                >
                  <img 
                    src={`/images/instagram/post-${item}.jpg`} 
                    alt="Instagram"
                    onError={handleImageError}
                  />
                  <div className="instagram-overlay">
                    <FaInstagram />
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Store Modal */}
      <Modal show={showStoreModal} onHide={() => setShowStoreModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <div className="d-flex align-items-center">
              <FaStore className="text-danger me-2" />
              <span className="text-danger">{selectedStore?.city}</span>
              {selectedStore?.is_head && (
                <Badge bg="danger" className="ms-3">Head Office</Badge>
              )}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStore && (
            <Row>
              <Col md={5}>
                <div className="store-image-wrapper mb-3">
                  <img 
                    src={selectedStore.image_url || "/images/stores/default-store.jpg"} 
                    alt={selectedStore.city}
                    className="img-fluid rounded-4 w-100"
                    style={{ objectFit: 'cover', height: '200px' }}
                    onError={handleImageError}
                  />
                </div>
                
                {selectedStore.rating && (
                  <div className="store-rating mb-3 text-center">
                    <div className="stars mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(selectedStore.rating) ? "text-warning" : "text-muted"} 
                        />
                      ))}
                      <span className="ms-2 fw-bold">{selectedStore.rating}</span>
                    </div>
                    <small className="text-muted">
                      {selectedStore.customer_count?.toLocaleString() || 0}+ customers served
                    </small>
                  </div>
                )}
              </Col>
              <Col md={7}>
                <h6 className="fw-bold mb-3 text-danger">Store Details</h6>
                
                <div className="store-info-item mb-3">
                  <FaMapMarkerAlt className="text-danger me-2" />
                  <strong>Address:</strong>
                  <p className="mb-0 mt-1">{selectedStore.address}</p>
                  {selectedStore.landmark && (
                    <small className="text-muted">Landmark: {selectedStore.landmark}</small>
                  )}
                </div>
                
                <div className="store-info-item mb-3">
                  <FaPhone className="text-danger me-2" />
                  <strong>Contact:</strong>
                  <p className="mb-0">{selectedStore.phone}</p>
                  {selectedStore.mobile && (
                    <small className="text-muted">Mobile: {selectedStore.mobile}</small>
                  )}
                </div>
                
                {selectedStore.email && (
                  <div className="store-info-item mb-3">
                    <FaEnvelope className="text-danger me-2" />
                    <strong>Email:</strong>
                    <p className="mb-0">{selectedStore.email}</p>
                  </div>
                )}
                
                <div className="store-info-item mb-3">
                  <FaClock className="text-danger me-2" />
                  <strong>Business Hours:</strong>
                  <p className="mb-0">{selectedStore.hours || '9:00 AM - 8:00 PM'}</p>
                </div>
                
                {selectedStore.manager && (
                  <div className="store-info-item mb-3">
                    <FaUser className="text-danger me-2" />
                    <strong>Store Manager:</strong>
                    <p className="mb-0">{selectedStore.manager}</p>
                  </div>
                )}
                
                {selectedStore.employees > 0 && (
                  <div className="store-info-item mb-3">
                    <FaUsers className="text-danger me-2" />
                    <strong>Staff Strength:</strong>
                    <p className="mb-0">{selectedStore.employees} dedicated professionals</p>
                  </div>
                )}
                
                {selectedStore.opening_year && (
                  <div className="store-info-item mb-3">
                    <FaCalendarAlt className="text-danger me-2" />
                    <strong>Established:</strong>
                    <p className="mb-0">{selectedStore.opening_year}</p>
                  </div>
                )}
                
                {selectedStore.features && selectedStore.features.length > 0 && (
                  <div className="store-info-item mb-3">
                    <FaAward className="text-danger me-2" />
                    <strong>Features:</strong>
                    <div className="mt-1">
                      {selectedStore.features.map((feature, idx) => (
                        <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedStore.services && selectedStore.services.length > 0 && (
                  <div className="store-info-item mb-3">
                    <FaHandsHelping className="text-danger me-2" />
                    <strong>Services:</strong>
                    <div className="mt-1">
                      {selectedStore.services.map((service, idx) => (
                        <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="danger" 
                    className="w-100"
                    href={selectedStore.map_link || `https://maps.google.com/?q=${encodeURIComponent(selectedStore.address)}`}
                    target="_blank"
                  >
                    <FaMapMarkerAlt className="me-2" />
                    Get Directions
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default HomePage;