import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeart, 
  FaEye, 
  FaStar,
  FaSortAmountDown,
  FaShoppingBag,
  FaArrowRight,
  FaCrown,
  FaTshirt,
  FaFemale,
  FaChild,
  FaGem,
  FaFire,
  FaAward,
  FaMedal,
  FaExclamationTriangle,
  FaRocket
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FeaturedPage.css";

const API_BASE = "https://whats.asbfashion.com/api/featured";

const FeaturedPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFeaturedType, setActiveFeaturedType] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    editor_picks: 0,
    trending: 0,
    luxury: 0,
    bestsellers: 0
  });

  const featuredTypes = [
    { value: "all", label: "All Featured", icon: <FaAward /> },
    { value: "editor's pick", label: "Editor's Pick", icon: <FaMedal /> },
    { value: "trending", label: "Trending Now", icon: <FaFire /> },
    { value: "luxury", label: "Luxury Collection", icon: <FaGem /> },
    { value: "bestseller", label: "Best Sellers", icon: <FaCrown /> }
  ];

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, activeCategory, activeFeaturedType, sortBy]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching featured products from:", `${API_BASE}/get_featured_products.php`);
      const response = await axios.get(`${API_BASE}/get_featured_products.php`, {
        params: { 
          limit: 50,
          category: activeCategory !== 'all' ? activeCategory : 'all',
          featured_type: activeFeaturedType
        },
        timeout: 15000
      });
      
      console.log("API Response:", response.data);
      
      if (response.data.success) {
        const productsData = response.data.products || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Update stats
        if (response.data.stats) {
          setStats(response.data.stats);
        }
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(productsData.map(p => p.category_name).filter(Boolean))];
        setCategories(uniqueCategories.map(cat => ({ id: cat.toLowerCase(), name: cat, slug: cat.toLowerCase() })));
        
        if (productsData.length === 0) {
          setError("No featured products found. Check back soon!");
        }
      } else {
        setError(response.data.message || "Failed to load featured products");
      }
    } catch (error) {
      console.error("Error details:", error);
      setError(error.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://whats.asbfashion.com/api/get_categories.php");
      if (response.data.success) {
        const apiCategories = response.data.categories || [];
        setCategories(prev => {
          const allCategories = [...prev, ...apiCategories.map(c => ({ id: c.slug, name: c.name, slug: c.slug }))];
          return allCategories.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category_slug?.toLowerCase() === activeCategory.toLowerCase() ||
        product.category_name?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Filter by featured type
    if (activeFeaturedType !== "all") {
      if (activeFeaturedType === "bestseller") {
        filtered = filtered.filter(product => product.is_bestseller === true);
      } else {
        filtered = filtered.filter(product => product.featured_type === activeFeaturedType);
      }
    }
    
    // Sort products
    filtered.sort((a, b) => {
      switch(sortBy) {
        case "featured":
          return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0) || 
                 (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) ||
                 (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0);
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

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
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

  const getFeaturedIcon = (type) => {
    switch(type) {
      case "editor's pick": return <FaMedal />;
      case "trending": return <FaFire />;
      case "luxury": return <FaGem />;
      case "bestseller": return <FaCrown />;
      default: return <FaAward />;
    }
  };

  const getFeaturedColor = (type) => {
    switch(type) {
      case "editor's pick": return "danger";
      case "trending": return "warning";
      case "luxury": return "info";
      case "bestseller": return "success";
      default: return "secondary";
    }
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

  if (loading) {
    return (
      <div className="asb-featured-loading">
        <div className="loading-content">
          <FaCrown className="loading-icon" />
          <h4>ASB FASHION</h4>
          <p>Curating featured items...</p>
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
          <h3 className="text-danger mb-3">Unable to Load Featured Products</h3>
          <p className="text-muted mb-4">{error}</p>
          <Button variant="danger" onClick={fetchFeaturedProducts}>
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
          <h3>No Featured Products</h3>
          <p className="text-muted mb-4">Check back soon for curated collections!</p>
          <Button variant="danger" onClick={fetchFeaturedProducts}>
            Refresh
          </Button>
        </div>
      </Container>
    );
  }

  const categoriesList = [
    { id: "all", name: "All" },
    ...categories.map(cat => ({ id: cat.id, name: cat.name }))
  ];

  return (
    <motion.div 
      className="asb-featured-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="featured-hero">
        <div className="hero-overlay">
          <Container>
            <motion.div 
              className="hero-content text-center text-white"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge bg="danger" className="hero-badge mb-3">
                <FaCrown className="me-2" />
                FEATURED COLLECTION
              </Badge>
              <h1 className="display-3 fw-bold mb-3">Curated for You</h1>
              <p className="lead mb-4">Discover our handpicked selection of premium fashion</p>
            </motion.div>
          </Container>
        </div>
      </section>

      {/* Stats Section */}
      <section className="featured-stats">
        <Container>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaMedal className="stat-icon" />
                <div>
                  <h3>{stats.editor_picks}+</h3>
                  <p>Editor's Pick</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaFire className="stat-icon" />
                <div>
                  <h3>{stats.trending}+</h3>
                  <p>Trending</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaGem className="stat-icon" />
                <div>
                  <h3>{stats.luxury}+</h3>
                  <p>Luxury</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaCrown className="stat-icon" />
                <div>
                  <h3>{stats.bestsellers}+</h3>
                  <p>Best Sellers</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-4">
        {/* Featured Type Filters */}
        <div className="featured-type-filters mb-4">
          {featuredTypes.map((type) => (
            <motion.button
              key={type.value}
              className={`type-btn ${activeFeaturedType === type.value ? 'active' : ''}`}
              onClick={() => setActiveFeaturedType(type.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="me-2">{type.icon}</span>
              {type.label}
            </motion.button>
          ))}
        </div>

        {/* Category and Sort Filters */}
        <Row className="mb-4 align-items-center">
          <Col lg={7}>
            <div className="category-filters">
              {categoriesList.map((category) => (
                <motion.button
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </Col>
          <Col lg={5}>
            <div className="sort-filter">
              <FaSortAmountDown className="me-2 text-danger" />
              <Form.Select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="rating">Top Rated</option>
              </Form.Select>
            </div>
          </Col>
        </Row>

        {/* Results Info */}
        <div className="results-info mb-4">
          <p className="text-muted">
            Showing <strong>{filteredProducts.length}</strong> featured items
          </p>
        </div>

        {/* Products Grid */}
        <Row xs={2} md={3} lg={4} className="g-4">
          <AnimatePresence>
            {filteredProducts.map((item, index) => (
              <Col key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="featured-product-card">
                    <div className="product-image-wrapper">
                      <Badge bg={getFeaturedColor(item.featured_type)} className="featured-badge">
                        {getFeaturedIcon(item.featured_type)} {item.featured_type === "editor's pick" ? "Editor's Pick" : 
                          item.featured_type === "trending" ? "Trending" :
                          item.featured_type === "luxury" ? "Luxury" : "Featured"}
                      </Badge>
                      {item.is_bestseller && (
                        <Badge bg="warning" text="dark" className="bestseller-badge">
                          <FaCrown /> Best Seller
                        </Badge>
                      )}
                      {item.discount_percent > 0 && (
                        <Badge bg="danger" className="discount-badge">
                          -{item.discount_percent}%
                        </Badge>
                      )}
                      <Card.Img 
                        variant="top" 
                        src={item.image_url || '/images/placeholder.jpg'} 
                        alt={item.name}
                        className="product-image"
                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                      />
                      <div className="product-overlay">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="overlay-btn"
                          onClick={() => handleItemClick(item)}
                        >
                          <FaEye /> Quick View
                        </Button>
                      </div>
                    </div>
                    <Card.Body>
                      <div className="product-category">
                        {getCategoryIcon(item.category_name)}
                        <small className="ms-1">{item.category_name || 'Uncategorized'}</small>
                      </div>
                      <Card.Title className="product-title">{item.name}</Card.Title>
                      <div className="product-rating mb-2">
                        <div className="stars">
                          {renderStars(item.rating)}
                        </div>
                        <small className="text-muted ms-2">({item.review_count || 0})</small>
                      </div>
                      <div className="product-price">
                        <span className="sale-price">{formatPrice(item.price)}</span>
                        {item.old_price && (
                          <span className="original-price">{formatPrice(item.old_price)}</span>
                        )}
                      </div>
                      <Button 
                        variant="outline-danger" 
                        className="w-100 mt-3 view-btn"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </AnimatePresence>
        </Row>

        {/* VIP Banner */}
  
      </Container>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showModal && selectedItem && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div 
              className="quick-view-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
              <Row className="g-4">
                <Col md={6}>
                  <img 
                    src={selectedItem.image_url || '/images/placeholder.jpg'} 
                    alt={selectedItem.name}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: 'auto' }}
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />
                </Col>
                <Col md={6}>
                  <Badge bg={getFeaturedColor(selectedItem.featured_type)} className="mb-3">
                    {getFeaturedIcon(selectedItem.featured_type)} {selectedItem.featured_type === "editor's pick" ? "EDITOR'S PICK" : 
                      selectedItem.featured_type === "trending" ? "TRENDING" :
                      selectedItem.featured_type === "luxury" ? "LUXURY" : "FEATURED"}
                  </Badge>
                  <h3 className="fw-bold mb-3">{selectedItem.name}</h3>
                  <div className="rating mb-3">
                    {renderStars(selectedItem.rating)}
                    <span className="ms-2 text-muted">({selectedItem.review_count || 0} reviews)</span>
                  </div>
                  <div className="price-section mb-4">
                    <span className="sale-price h3 text-danger">{formatPrice(selectedItem.price)}</span>
                    {selectedItem.old_price && (
                      <>
                        <span className="original-price ms-3 text-muted text-decoration-line-through">
                          {formatPrice(selectedItem.old_price)}
                        </span>
                        <Badge bg="success" className="ms-3">
                          Save {Math.round(((selectedItem.old_price - selectedItem.price) / selectedItem.old_price) * 100)}%
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-muted mb-4">
                    {selectedItem.description || "No description available."}
                  </p>
                  <div className="feature-tags mb-4">
                    {selectedItem.is_bestseller && (
                      <Badge bg="warning" text="dark" className="me-2">
                        <FaCrown /> Best Seller
                      </Badge>
                    )}
                    {selectedItem.is_trending && (
                      <Badge bg="danger" className="me-2">
                        <FaFire /> Trending
                      </Badge>
                    )}
                    {selectedItem.is_new_arrival && (
                      <Badge bg="success">
                        <FaRocket /> New Arrival
                      </Badge>
                    )}
                  </div>
                  <div className="d-flex gap-3">
                    <Button 
                      variant="danger" 
                      size="lg" 
                      className="flex-fill"
                      onClick={() => {
                        setShowModal(false);
                        navigate(`/product/${selectedItem.id}`);
                      }}
                    >
                      View Full Details <FaArrowRight className="ms-2" />
                    </Button>
                    <Button variant="outline-danger" size="lg">
                      <FaHeart />
                    </Button>
                  </div>
                </Col>
              </Row>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FeaturedPage;