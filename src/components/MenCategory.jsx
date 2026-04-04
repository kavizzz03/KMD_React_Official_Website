import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeart, FaEye, FaStar, FaSortAmountDown, FaShoppingBag,
  FaArrowRight, FaTshirt, FaFire, FaTag, FaFilter,
  FaShoppingCart, FaCheck, FaRuler, FaPaintBrush, FaGem, FaCrown,
  FaTimes, FaChevronLeft, FaChevronRight, FaExclamationTriangle,
  FaSpinner, FaRegClock, FaTruck, FaShieldAlt, FaGift, FaRegHeart,
  FaExchangeAlt, FaWhatsapp, FaShareAlt, FaExpand, FaMinus, FaPlus,
  FaUserTie, FaAward, FaMedal, FaChartLine, FaBolt, FaLeaf,
  FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaArrowUp
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MenCategory.css";

const MenCategory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [likedProducts, setLikedProducts] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0
  });
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100000,
    size: '',
    color: '',
    category: ''
  });

  const [availableSizes, setAvailableSizes] = useState(["S", "M", "L", "XL", "XXL"]);
  const [availableColors, setAvailableColors] = useState([
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" },
    { name: "Red", code: "#DC2626" },
    { name: "Blue", code: "#3B82F6" },
    { name: "Gray", code: "#6B7280" },
    { name: "Navy", code: "#1E3A8A" }
  ]);

  useEffect(() => {
    fetchMenProducts();
  }, [filters, sortBy, pagination.current_page]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchMenProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pagination.current_page,
        limit: 12,
        sort: sortBy === 'newest' ? 'newest' : 
              sortBy === 'price-low' ? 'price_low' :
              sortBy === 'price-high' ? 'price_high' :
              sortBy === 'rating' ? 'rating' :
              sortBy === 'bestseller' ? 'bestseller' : 'newest',
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        size: filters.size,
        color: filters.color,
        category: filters.category
      });
      
      const response = await axios.get(`https://whats.asbfashion.com/api/mens/mens-products.php?${params}`);
      
      if (response.data.success) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination);
        
        const allSizes = new Set();
        const allColors = new Set();
        response.data.products.forEach(product => {
          product.sizes?.forEach(size => allSizes.add(size));
          product.colors?.forEach(color => allColors.add(color));
        });
        
        if (allSizes.size > 0) setAvailableSizes(Array.from(allSizes).sort());
        
        const colorMap = {
          'Black': '#000000', 'White': '#FFFFFF', 'Red': '#DC2626',
          'Blue': '#3B82F6', 'Gray': '#6B7280', 'Navy': '#1E3A8A',
          'Brown': '#8B4513', 'Green': '#22C55E', 'Yellow': '#EAB308'
        };
        const colorsArray = Array.from(allColors).map(color => ({
          name: color,
          code: colorMap[color] || '#CCCCCC'
        }));
        if (colorsArray.length > 0) setAvailableColors(colorsArray);
      } else {
        setError(response.data.message || "Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching men's products:", error);
      setError("Unable to connect to server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (productId) => {
    try {
      const sessionId = localStorage.getItem('session_id') || 'guest_' + Date.now();
      if (!localStorage.getItem('session_id')) {
        localStorage.setItem('session_id', sessionId);
      }
      
      const response = await axios.post('https://whats.asbfashion.com/api/mens/men-products.php', {
        action: 'like',
        product_id: productId,
        session_id: sessionId
      });
      
      if (response.data.success) {
        setLikedProducts(prev => ({
          ...prev,
          [productId]: response.data.action === 'liked'
        }));
      }
    } catch (error) {
      setLikedProducts(prev => ({
        ...prev,
        [productId]: !prev[productId]
      }));
    }
  };

  const addToCart = (product) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ 
          ...product, 
          quantity: 1,
          selectedSize: product.sizes?.[0] || 'Standard',
          selectedColor: product.colors?.[0] || 'Standard'
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
      
      setTimeout(() => {
        const btn = document.getElementById(`cart-btn-${product.id}`);
        if (btn) {
          const originalHtml = btn.innerHTML;
          btn.innerHTML = '<span><FaCheck className="me-2" /> Added!</span>';
          setTimeout(() => {
            btn.innerHTML = originalHtml;
          }, 2000);
        }
      }, 100);
    }, 500);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value === prev[type] ? '' : value
    }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 100000,
      size: '',
      color: '',
      category: ''
    });
    setSortBy("newest");
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "LKR 0";
    return `LKR ${Number(price).toLocaleString('en-LK')}`;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const halfStar = (rating || 0) % 1 >= 0.5;
    
    return [...Array(5)].map((_, i) => {
      if (i < fullStars) {
        return <FaStar key={i} className="star filled" />;
      } else if (i === fullStars && halfStar) {
        return <FaStar key={i} className="star half" />;
      } else {
        return <FaStar key={i} className="star" />;
      }
    });
  };

  const stats = {
    total: pagination.total_items,
    onSale: products.filter(p => p.discount_percent > 0).length,
    bestsellers: products.filter(p => p.is_bestseller).length,
    newArrivals: products.filter(p => p.is_new_arrival).length
  };

  if (loading) {
    return (
      <div className="men-category-loading">
        <div className="loading-content">
          <div className="loading-animation">
            <div className="loading-ring"></div>
            <div className="loading-ring-inner"></div>
          </div>
          <h4 className="mt-4">ASB FASHION</h4>
          <p className="text-muted">Curating the finest collection for you...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <Container className="py-5">
        <div className="error-container text-center py-5">
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>
          <h3 className="text-danger mb-3">Unable to Load Products</h3>
          <p className="text-muted mb-4">{error}</p>
          <Button variant="danger" onClick={fetchMenProducts} className="error-btn">
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <Container className="py-5">
        <div className="empty-container text-center py-5">
          <div className="empty-icon">
            <FaShoppingBag />
          </div>
          <h3>No Products Available</h3>
          <p className="text-muted mb-4">Check back soon for new arrivals in men's collection!</p>
          <Button variant="danger" onClick={fetchMenProducts}>
            Refresh
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <motion.div 
      className="men-category-page" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Premium Header */}
      <header className="premium-header">
        <Container fluid className="px-4">
          <div className="header-content">
            <div className="header-logo">
              <motion.div 
                className="logo-icon"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FaCrown />
              </motion.div>
              <div className="logo-text">
                <span className="logo-main">ASB</span>
                <span className="logo-sub">FASHION</span>
              </div>
            </div>
            <div className="header-categories">
              <button 
                className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              <button 
                className={`category-chip ${activeCategory === 'new' ? 'active' : ''}`}
                onClick={() => setActiveCategory('new')}
              >
                <FaFire /> New Arrivals
              </button>
              <button 
                className={`category-chip ${activeCategory === 'bestseller' ? 'active' : ''}`}
                onClick={() => setActiveCategory('bestseller')}
              >
                <FaMedal /> Bestsellers
              </button>
              <button 
                className={`category-chip ${activeCategory === 'sale' ? 'active' : ''}`}
                onClick={() => setActiveCategory('sale')}
              >
                <FaTag /> On Sale
              </button>
            </div>
            <div className="header-actions">
              <button className="header-action-btn">
                <FaHeart />
              </button>
              <button className="header-action-btn">
                <FaShoppingBag />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Hero Section with Parallax Effect */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{ '--i': i, '--delay': `${i * 0.5}s` }}></div>
          ))}
        </div>
        <Container className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-badge">
              <FaBolt /> PREMIUM MEN'S COLLECTION
            </div>
            <h1 className="hero-title">
              Elevate Your<br />
              <span className="hero-gradient">Style Game</span>
            </h1>
            <p className="hero-description">
              Discover the finest collection crafted for the modern gentleman. 
              Premium quality, timeless designs, and unmatched comfort.
            </p>
            <div className="hero-features">
              <div className="hero-feature">
                <FaGem />
                <span>Premium Quality</span>
              </div>
              <div className="hero-feature">
                <FaTruck />
                <span>Free Shipping</span>
              </div>
              <div className="hero-feature">
                <FaShieldAlt />
                <span>Secure Payment</span>
              </div>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">{stats.total}+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">{stats.bestsellers}+</span>
                <span className="stat-label">Bestsellers</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Authentic</span>
              </div>
            </div>
          </motion.div>
        </Container>
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      <Container className="main-container">
        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-bar-left">
            <button 
              className={`filter-trigger ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            <div className="active-filters-preview">
              {(filters.size || filters.color || filters.category) && (
                <>
                  <span className="filter-label">Active:</span>
                  {filters.size && <Badge bg="danger" className="filter-badge">Size: {filters.size}</Badge>}
                  {filters.color && <Badge bg="danger" className="filter-badge">Color: {filters.color}</Badge>}
                  {filters.category && <Badge bg="danger" className="filter-badge">Category: {filters.category}</Badge>}
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="filter-bar-right">
            <div className="results-count">
              <span className="count-number">{pagination.total_items}</span>
              <span className="count-text">Products Found</span>
            </div>
            <div className="sort-dropdown">
              <FaSortAmountDown className="sort-icon" />
              <Form.Select 
                value={sortBy} 
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPagination(prev => ({ ...prev, current_page: 1 }));
                }} 
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="bestseller">Bestsellers</option>
              </Form.Select>
            </div>
          </div>
        </div>

        <Row className="g-4">
          {/* Premium Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="col-lg-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
              >
                <div className="filters-panel">
                  <div className="filters-panel-header">
                    <h5>Filter Collection</h5>
                    <button className="reset-filters" onClick={clearFilters}>
                      <FaTimes />
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="filter-group">
                    <h6>Categories</h6>
                    <div className="category-list">
                      {["All", "T-Shirts", "Shirts", "Pants", "Jackets", "Suits"].map(cat => (
                        <button
                          key={cat}
                          className={`category-filter ${filters.category === cat ? 'active' : ''}`}
                          onClick={() => handleFilterChange('category', cat === 'All' ? '' : cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="filter-group">
                    <h6>Price Range</h6>
                    <div className="price-slider">
                      <div className="price-inputs">
                        <div className="price-input">
                          <span>Min</span>
                          <Form.Control 
                            type="number" 
                            value={filters.minPrice}
                            onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                          />
                        </div>
                        <span className="price-separator">-</span>
                        <div className="price-input">
                          <span>Max</span>
                          <Form.Control 
                            type="number" 
                            value={filters.maxPrice}
                            onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sizes */}
                  {availableSizes.length > 0 && (
                    <div className="filter-group">
                      <h6>Sizes</h6>
                      <div className="size-grid">
                        {availableSizes.map(size => (
                          <button
                            key={size}
                            className={`size-option ${filters.size === size ? 'active' : ''}`}
                            onClick={() => handleFilterChange('size', size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {availableColors.length > 0 && (
                    <div className="filter-group">
                      <h6>Colors</h6>
                      <div className="color-grid">
                        {availableColors.map(color => (
                          <button
                            key={color.name}
                            className={`color-option ${filters.color === color.name ? 'active' : ''}`}
                            style={{ backgroundColor: color.code }}
                            onClick={() => handleFilterChange('color', color.name)}
                            title={color.name}
                          >
                            {filters.color === color.name && <FaCheck />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <Col lg={showFilters ? 9 : 12}>
            <Row xs={2} md={3} lg={showFilters ? 3 : 4} className="g-4">
              {products.map((product, index) => (
                <Col key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="product-card-premium">
                      <div className="product-media">
                        {product.is_new_arrival && (
                          <div className="product-badge new">
                            <FaFire /> NEW
                          </div>
                        )}
                        {product.is_bestseller && (
                          <div className="product-badge bestseller">
                            <FaMedal /> BESTSELLER
                          </div>
                        )}
                        {product.discount_percent > 0 && (
                          <div className="product-badge discount">
                            -{product.discount_percent}%
                          </div>
                        )}
                        <div className="product-image-container">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="product-image"
                            onClick={() => navigate(`/product/${product.id}`)}
                          />
                          <div className="product-actions">
                            <button 
                              className="action-btn"
                              onClick={() => handleLike(product.id)}
                            >
                              {likedProducts[product.id] ? <FaHeart /> : <FaRegHeart />}
                            </button>
                            <button 
                              className="action-btn"
                              onClick={() => setSelectedItem(product)}
                            >
                              <FaEye />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="product-info">
                        <div className="product-category-tag">
                          {product.brand || 'ASB Fashion'}
                        </div>
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-rating">
                          <div className="stars">{renderStars(product.rating)}</div>
                          <span className="review-count">({product.reviews_count})</span>
                        </div>
                        <div className="product-pricing">
                          <span className="current-price">{formatPrice(product.price)}</span>
                          {product.old_price && (
                            <span className="old-price">{formatPrice(product.old_price)}</span>
                          )}
                        </div>
                        <button 
                          className="add-to-cart-premium"
                          onClick={() => addToCart(product)}
                          disabled={addingToCart[product.id]}
                        >
                          {addingToCart[product.id] ? (
                            <><FaSpinner className="spinning" /> Adding...</>
                          ) : (
                            <><FaShoppingCart /> Add to Cart</>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {/* Premium Pagination */}
            {pagination.total_pages > 1 && (
              <div className="pagination-premium">
                <button
                  className="page-nav"
                  onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                  disabled={pagination.current_page === 1}
                >
                  <FaChevronLeft />
                </button>
                <div className="page-numbers">
                  {(() => {
                    const pages = [];
                    const maxVisible = 5;
                    let startPage = Math.max(1, pagination.current_page - Math.floor(maxVisible / 2));
                    let endPage = Math.min(pagination.total_pages, startPage + maxVisible - 1);
                    
                    if (endPage - startPage + 1 < maxVisible) {
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          className={`page-number ${pagination.current_page === i ? 'active' : ''}`}
                          onClick={() => setPagination(prev => ({ ...prev, current_page: i }))}
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}
                </div>
                <button
                  className="page-nav"
                  onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                  disabled={pagination.current_page === pagination.total_pages}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </Col>
        </Row>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <FaTruck className="trust-icon" />
            <div className="trust-info">
              <h6>Free Shipping</h6>
              <p>On orders over LKR 10,000</p>
            </div>
          </div>
          <div className="trust-item">
            <FaShieldAlt className="trust-icon" />
            <div className="trust-info">
              <h6>Secure Payment</h6>
              <p>100% secure transactions</p>
            </div>
          </div>
          <div className="trust-item">
            <FaExchangeAlt className="trust-icon" />
            <div className="trust-info">
              <h6>Easy Returns</h6>
              <p>30-day return policy</p>
            </div>
          </div>
          <div className="trust-item">
            <FaLeaf className="trust-icon" />
            <div className="trust-info">
              <h6>Sustainable</h6>
              <p>Eco-friendly materials</p>
            </div>
          </div>
        </div>
      </Container>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="back-to-top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Premium Quick View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="modal-overlay-premium" onClick={() => setSelectedItem(null)}>
            <motion.div 
              className="quick-view-premium"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-premium" onClick={() => setSelectedItem(null)}>
                <FaTimes />
              </button>
              <Row className="g-0">
                <Col md={6}>
                  <div className="modal-gallery">
                    <img 
                      src={selectedItem.image_url} 
                      alt={selectedItem.name} 
                      className="modal-main-image"
                    />
                    {selectedItem.images && selectedItem.images.length > 1 && (
                      <div className="modal-thumbnails">
                        {selectedItem.images.slice(0, 4).map((img, idx) => (
                          <img 
                            key={idx}
                            src={img}
                            alt={`${selectedItem.name} ${idx + 1}`}
                            className="modal-thumbnail"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="modal-details">
                    <div className="modal-badges">
                      {selectedItem.is_new_arrival && <Badge bg="danger">NEW ARRIVAL</Badge>}
                      {selectedItem.is_bestseller && <Badge bg="warning" text="dark">BESTSELLER</Badge>}
                    </div>
                    <h2 className="modal-title">{selectedItem.name}</h2>
                    <div className="modal-rating">
                      {renderStars(selectedItem.rating)}
                      <span className="review-count">{selectedItem.reviews_count} Reviews</span>
                    </div>
                    <div className="modal-price">
                      <span className="current-price">{formatPrice(selectedItem.price)}</span>
                      {selectedItem.old_price && (
                        <span className="old-price">{formatPrice(selectedItem.old_price)}</span>
                      )}
                    </div>
                    <p className="modal-description">
                      {selectedItem.description || 'Premium quality men\'s fashion product designed for comfort and style.'}
                    </p>
                    <div className="modal-specs">
                      {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                        <div className="spec-item">
                          <FaRuler />
                          <span>Available Sizes: {selectedItem.sizes.join(', ')}</span>
                        </div>
                      )}
                      {selectedItem.colors && selectedItem.colors.length > 0 && (
                        <div className="spec-item">
                          <FaPaintBrush />
                          <span>Colors: {selectedItem.colors.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    <button 
                      className="modal-add-to-cart"
                      onClick={() => {
                        addToCart(selectedItem);
                        setSelectedItem(null);
                      }}
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
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

export default MenCategory;