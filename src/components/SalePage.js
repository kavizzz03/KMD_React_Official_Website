import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaFire, FaClock, FaTag, FaShoppingBag, FaPercent, FaGift,
  FaArrowRight, FaStar, FaHeart, FaEye, FaShare, FaBolt,
  FaCrown, FaGem, FaLeaf, FaAward, FaRocket, FaBell,
  FaCheckCircle, FaRegClock, FaRegHeart, FaRegEye, FaImage
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./SalePage.css";

const SalePage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://whats.asbfashion.com/api/get_sale.php');
        const data = await response.json();
        
        if (data.success) {
          setSalesData(data.sales);
        } else {
          setError("Failed to load sales data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  // Mock products for demonstration - replace with actual data from your products table
  const mockProducts = [
    
  ];

  if (loading) {
    return (
      <div className="sale-loading-container">
        <div className="loading-content">
          <Spinner animation="border" variant="danger" className="loading-spinner" />
          <h4>ASB FASHION</h4>
          <p>Loading amazing deals...</p>
          <div className="loading-progress">
            <div className="loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="error-state">
          <FaImage className="error-icon" />
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <Button variant="danger" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <motion.div 
      className="asb-sale-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Banner */}
      <section className="sale-hero">
        <div className="hero-overlay">
          <Container>
            <motion.div 
              className="hero-content text-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="hero-badge">
                <FaFire className="me-2" />
                LIMITED TIME OFFER
              </Badge>
              
              <h1 className="hero-title">
                MEGA <span className="hero-highlight">SALE</span>
              </h1>
              
              <p className="hero-subtitle">
                The fashion event of the season
              </p>
            </motion.div>
          </Container>
        </div>
      </section>

      {salesData.length > 0 ? (
        salesData.map((sale, index) => (
          <SaleSection 
            key={sale.info.id} 
            sale={sale} 
            products={mockProducts} 
            index={index}
            navigate={navigate}
          />
        ))
      ) : (
        <Container className="py-5">
          <div className="empty-state">
            <FaTag className="empty-icon" />
            <h3>No Active Sales Right Now</h3>
            <p>Check back soon for amazing offers!</p>
            <Button 
              variant="danger" 
              onClick={() => navigate("/products")}
              className="mt-3"
            >
              Browse Products
            </Button>
          </div>
        </Container>
      )}

     
    </motion.div>
  );
};

const SaleSection = ({ sale, products, index, navigate }) => {
  const { info } = sale;
  const [status, setStatus] = useState(""); 
  const [timeLeft, setTimeLeft] = useState({ days: 0, hrs: 0, mins: 0, secs: 0 });
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [likedProducts, setLikedProducts] = useState({});
  const [bgImageLoaded, setBgImageLoaded] = useState(false);
  const [bgImageError, setBgImageError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(info.start_time).getTime();
      const end = new Date(info.end_time).getTime();
      
      let target;
      if (now < start) {
        setStatus("UPCOMING");
        target = start;
      } else if (now < end) {
        setStatus("ONGOING");
        target = end;
      } else {
        setStatus("ENDED");
        clearInterval(timer);
        return;
      }

      const diff = target - now;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [info]);

  const handleLike = (productId) => {
    setLikedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString()}`;
  };

  if (status === "ENDED") return null;

  // Construct background style with API image
  const bannerStyle = {
    backgroundColor: info.bg_color || '#1e293b',
    backgroundImage: info.bg_image_url && !bgImageError 
      ? `linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url(${info.bg_image_url})`
      : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <motion.div 
      className="sale-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
    >
      {/* Banner Area with API Background Image */}
      <div className="sale-banner" style={bannerStyle}>
        {/* Hidden image preloader */}
        {info.bg_image_url && (
          <img 
            src={info.bg_image_url} 
            alt=""
            style={{ display: 'none' }}
            onLoad={() => setBgImageLoaded(true)}
            onError={() => setBgImageError(true)}
          />
        )}
        
        <div className="banner-overlay">
          <Container>
            <div className="banner-content">
              <Badge className={`status-badge ${status === "ONGOING" ? 'ongoing' : 'upcoming'}`}>
                {status === "ONGOING" ? (
                  <><FaFire className="me-2" /> SALE LIVE NOW</>
                ) : (
                  <><FaRegClock className="me-2" /> COMING SOON</>
                )}
              </Badge>
              
              <h2 className="banner-title">{info.title}</h2>
              <p className="banner-subtitle">{info.subtitle}</p>

              <div className="timer-container">
                <div className="timer-grid">
                  {Object.entries(timeLeft).map(([label, value]) => (
                    <div key={label} className="timer-item">
                      <div className="timer-value">{String(value).padStart(2, '0')}</div>
                      <div className="timer-label">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="timer-message">
                  {status === "ONGOING" ? (
                    <><FaClock className="me-2" /> Offer ends in</>
                  ) : (
                    <><FaRocket className="me-2" /> Sale starts in</>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Products Grid */}
      
    </motion.div>
  );
};

export default SalePage;