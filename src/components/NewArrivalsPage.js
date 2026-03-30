import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeart, FaEye, FaStar, FaSortAmountDown, FaShoppingBag,
  FaArrowRight, FaClock, FaFire, FaTshirt, FaFemale, FaChild, FaGem,
  FaNewspaper, FaRocket, FaTag, FaCalendar, FaExclamationTriangle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewArrivalsPage.css";

const API_BASE = "https://whats.asbfashion.com/api/newArrivals";

const NewArrivalsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, activeCategory, sortBy]);

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching products from:", `${API_BASE}/get_new_arrivals.php`);
      const response = await axios.get(`${API_BASE}/get_new_arrivals.php`, {
        params: { limit: 50 },
        timeout: 15000
      });
      
      console.log("API Response:", response.data);
      
      if (response.data.success) {
        const productsData = response.data.products || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Extract unique categories from actual products
        const uniqueCategories = [...new Set(productsData.map(p => p.category_name).filter(Boolean))];
        setCategories(uniqueCategories.map(cat => ({ id: cat, name: cat })));
        
        if (productsData.length === 0) {
          setError("No new arrivals found. Check back soon!");
        }
      } else {
        setError(response.data.message || "Failed to load new arrivals");
      }
    } catch (error) {
      console.error("Error details:", error);
      setError(error.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    if (activeCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category_name?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    filtered.sort((a, b) => {
      switch(sortBy) {
        case "newest":
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "discount":
          return (b.discount_percent || 0) - (a.discount_percent || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
    
    setFilteredProducts(filtered);
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "LKR 0";
    return `LKR ${Number(price).toLocaleString()}`;
  };

  const getCategoryIcon = (category) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes('men') || cat.includes('male')) return <FaTshirt />;
    if (cat.includes('women') || cat.includes('female')) return <FaFemale />;
    if (cat.includes('kid') || cat.includes('child')) return <FaChild />;
    return <FaGem />;
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "New";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= roundedRating ? 'text-warning' : 'text-light'} 
          style={{ fontSize: '0.9rem' }}
        />
      );
    }
    return stars;
  };

  const stats = {
    total: products.length,
    categories: categories.length,
    maxDiscount: Math.max(...products.map(p => p.discount_percent || 0), 0)
  };

  if (loading) {
    return (
      <div className="asb-newarrivals-loading">
        <div className="loading-content">
          <FaRocket className="loading-icon" />
          <h4>ASB FASHION</h4>
          <p>Discovering new arrivals...</p>
          <div className="loading-bar" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <FaExclamationTriangle className="text-danger mb-3" style={{ fontSize: "3rem" }} />
          <h3 className="text-danger mb-3">Unable to Load Products</h3>
          <p className="text-muted mb-4">{error}</p>
          <Button variant="danger" onClick={fetchNewArrivals}>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  if (products.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <FaShoppingBag className="empty-icon mb-3" style={{ fontSize: "4rem", color: "#dc3545", opacity: 0.5 }} />
          <h3>No New Arrivals</h3>
          <p className="text-muted mb-4">Check back soon for fresh styles!</p>
          <Button variant="danger" onClick={fetchNewArrivals}>
            Refresh
          </Button>
        </div>
      </Container>
    );
  }

  const categoriesList = [
    { id: "all", name: "All" },
    ...categories.map(cat => ({ id: cat.name, name: cat.name }))
  ];

  return (
    <motion.div className="asb-newarrivals-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero Section */}
      <section className="newarrivals-hero">
        <div className="hero-overlay">
          <Container>
            <div className="hero-content text-center text-white">
              <Badge bg="danger" className="hero-badge mb-3">
                <FaRocket className="me-2" /> FRESH ARRIVALS
              </Badge>
              <h1 className="display-3 fw-bold mb-3">New In</h1>
              <p className="lead mb-4">Discover the latest styles fresh off the runway</p>
            </div>
          </Container>
        </div>
      </section>

      {/* Stats Section */}
      <section className="arrival-stats">
        <Container>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaNewspaper className="stat-icon" />
                <div><h3>{stats.total}+</h3><p>New Items</p></div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaCalendar className="stat-icon" />
                <div><h3>Recent</h3><p>Added</p></div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaFire className="stat-icon" />
                <div><h3>Trending</h3><p>Now</p></div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaTag className="stat-icon" />
                <div><h3>Up to {stats.maxDiscount}%</h3><p>Discount</p></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-4">
        {/* Filters */}
        <Row className="mb-4">
          <Col lg={7}>
            <div className="category-filters">
              {categoriesList.map((category) => (
                <button
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </Col>
          <Col lg={5}>
            <div className="sort-filter">
              <FaSortAmountDown className="me-2 text-danger" />
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="rating">Top Rated</option>
              </Form.Select>
            </div>
          </Col>
        </Row>

        <div className="results-info mb-4">
          <p className="text-muted">Showing <strong>{filteredProducts.length}</strong> new arrivals</p>
        </div>

        {/* Products Grid */}
        <Row xs={2} md={3} lg={4} className="g-4">
          {filteredProducts.map((item) => (
            <Col key={item.id}>
              <Card className="arrival-product-card">
                <div className="product-image-wrapper">
                  <Badge bg="danger" className="new-badge">NEW</Badge>
                  {item.is_limited && <Badge bg="warning" text="dark" className="limited-badge">Limited</Badge>}
                  {item.discount_percent > 0 && (
                    <Badge bg="danger" className="discount-badge">-{item.discount_percent}%</Badge>
                  )}
                  <Card.Img 
                    variant="top" 
                    src={item.image_url || '/images/placeholder.jpg'} 
                    alt={item.name}
                    className="product-image"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />
                  <div className="product-overlay">
                    <Button variant="light" size="sm" className="overlay-btn" onClick={() => setSelectedItem(item)}>
                      <FaEye /> Quick View
                    </Button>
                  </div>
                  <div className="arrival-time">
                    <FaClock className="me-1" /> {getTimeAgo(item.created_at)}
                  </div>
                </div>
                <Card.Body>
                  <div className="product-category">
                    {getCategoryIcon(item.category_name)}
                    <small className="ms-1">{item.category_name || 'Uncategorized'}</small>
                  </div>
                  <Card.Title className="product-title">{item.name}</Card.Title>
                  <div className="product-rating mb-2">
                    <div className="stars">{renderStars(item.rating)}</div>
                    <small className="text-muted ms-2">({item.review_count || 0})</small>
                  </div>
                  <div className="product-price">
                    <span className="sale-price">{formatPrice(item.price)}</span>
                    {item.old_price && <span className="original-price">{formatPrice(item.old_price)}</span>}
                  </div>
                  <Button variant="outline-danger" className="w-100 mt-3" onClick={() => navigate(`/product/${item.id}`)}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Newsletter Banner */}
        <section className="newsletter-banner mt-5">
          <Row className="align-items-center">
            <Col lg={8}>
              <h3 className="text-white mb-2">Never Miss New Arrivals</h3>
              <p className="text-white-50 mb-3 mb-lg-0">Subscribe to get notified when new items drop</p>
            </Col>
            <Col lg={4}>
              <InputGroup className="newsletter-input">
                <Form.Control placeholder="Your email address" />
                <Button variant="light">Subscribe</Button>
              </InputGroup>
            </Col>
          </Row>
        </section>
      </Container>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
            <motion.div className="quick-view-modal" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedItem(null)}>×</button>
              <Row className="g-4">
                <Col md={6}>
                  <img src={selectedItem.image_url || '/images/placeholder.jpg'} alt={selectedItem.name} className="img-fluid rounded" style={{ width: '100%', height: 'auto' }} />
                </Col>
                <Col md={6}>
                  <Badge bg="danger" className="mb-3">NEW ARRIVAL</Badge>
                  <h3 className="fw-bold mb-3">{selectedItem.name}</h3>
                  <div className="rating mb-3">
                    {renderStars(selectedItem.rating)}
                    <span className="ms-2 text-muted">({selectedItem.review_count || 0} reviews)</span>
                  </div>
                  <div className="price-section mb-4">
                    <span className="sale-price h3 text-danger">{formatPrice(selectedItem.price)}</span>
                    {selectedItem.old_price && <span className="original-price ms-3 text-muted text-decoration-line-through">{formatPrice(selectedItem.old_price)}</span>}
                  </div>
                  <p className="text-muted mb-4">{selectedItem.description || "No description available."}</p>
                  <Button variant="danger" size="lg" className="w-100" onClick={() => { setSelectedItem(null); navigate(`/product/${selectedItem.id}`); }}>
                    View Full Details <FaArrowRight className="ms-2" />
                  </Button>
                </Col>
              </Row>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewArrivalsPage;