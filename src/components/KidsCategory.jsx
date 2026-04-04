// components/KidsCategory.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeart, FaEye, FaStar, FaSortAmountDown, FaShoppingBag,
  FaArrowRight, FaChild, FaFire, FaTag, FaFilter,
  FaShoppingCart, FaRuler, FaPaintBrush, FaGem, FaCrown,
  FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaSpinner,
  FaBaby, FaSmile, FaTshirt, FaMagic, FaGift, FaCloudSun, FaRainbow,
  FaRobot
} from "react-icons/fa";
import { 
  GiBalloons,
  GiUnicorn, 
  GiDinosaurRex
} from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./KidsCategory.css";

const KidsCategory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [likedProducts, setLikedProducts] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);
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
    age: ''
  });

  const [availableSizes, setAvailableSizes] = useState(["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y", "7-8Y"]);
  const [availableColors, setAvailableColors] = useState([
    { name: "Red", code: "#DC2626" }, { name: "Blue", code: "#3B82F6" },
    { name: "Green", code: "#22C55E" }, { name: "Yellow", code: "#EAB308" },
    { name: "Pink", code: "#FF69B4" }, { name: "Purple", code: "#8B5CF6" },
    { name: "Orange", code: "#F97316" }, { name: "Teal", code: "#14B89A" }
  ]);
  const [availableAges] = useState(["2-4 Years", "5-7 Years", "8-10 Years", "11-13 Years"]);

  // Category sections with red theme
  const categories = [
    { id: "all", name: "All Products", icon: FaTshirt, color: "#dc2626" },
    { id: "new", name: "New Arrivals", icon: FaStar, color: "#dc2626" },
    { id: "sale", name: "Sale", icon: FaFire, color: "#dc2626" },
    { id: "bestseller", name: "Bestsellers", icon: FaCrown, color: "#dc2626" },
    { id: "toddler", name: "Toddler", icon: FaBaby, color: "#dc2626" },
    { id: "girls", name: "Girls", icon: FaMagic, color: "#dc2626" },
    { id: "boys", name: "Boys", icon: FaRobot, color: "#dc2626" }
  ];

  const fetchKidsProducts = useCallback(async () => {
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
        age: filters.age,
        category: activeCategory !== 'all' ? activeCategory : ''
      });
      
      const response = await axios.get(`https://whats.asbfashion.com/api/kids/kids-products.php?${params}`);
      
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
          'Red': '#DC2626', 'Blue': '#3B82F6', 'Green': '#22C55E',
          'Yellow': '#EAB308', 'Pink': '#FF69B4', 'Purple': '#8B5CF6',
          'Orange': '#F97316', 'Black': '#000000', 'White': '#FFFFFF',
          'Teal': '#14B89A', 'Lavender': '#E6E6FA', 'Coral': '#FF7F50'
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
      console.error("Error fetching kids' products:", error);
      setError("Unable to connect to server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.current_page, sortBy, filters, activeCategory]);

  useEffect(() => {
    fetchKidsProducts();
  }, [fetchKidsProducts]);

  const handleLike = async (productId) => {
    try {
      const sessionId = localStorage.getItem('session_id') || 'guest_' + Date.now();
      if (!localStorage.getItem('session_id')) {
        localStorage.setItem('session_id', sessionId);
      }
      
      const response = await axios.post('https://whats.asbfashion.com/api/kids/kids-products.php', {
        action: 'like',
        product_id: productId,
        session_id: sessionId
      });
      
      if (response.data.success) {
        setLikedProducts(prev => ({
          ...prev,
          [productId]: response.data.action === 'liked'
        }));
        
        const element = document.getElementById(`like-btn-${productId}`);
        if (element) {
          element.classList.add('like-animation');
          setTimeout(() => element.classList.remove('like-animation'), 500);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setLikedProducts(prev => ({ ...prev, [productId]: !prev[productId] }));
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
      
      const button = document.getElementById(`cart-btn-${product.id}`);
      if (button) {
        button.classList.add('cart-success');
        setTimeout(() => button.classList.remove('cart-success'), 1000);
      }
      
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
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
    setFilters({ minPrice: 0, maxPrice: 100000, size: '', color: '', age: '' });
    setSortBy("newest");
    setActiveCategory("all");
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "LKR 0";
    return `LKR ${Number(price).toLocaleString('en-LK')}`;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const halfStar = (rating || 0) % 1 >= 0.5;
    
    return [...Array(5)].map((_, i) => {
      if (i < fullStars) return <FaStar key={i} className="star filled" />;
      if (i === fullStars && halfStar) return <FaStar key={i} className="star half" />;
      return <FaStar key={i} className="star" />;
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
      <div className="kids-category-loading">
        <div className="loading-content">
          <div className="floating-icons">
            <GiBalloons className="floating-icon balloon" />
            <FaRobot className="floating-icon robot" />
            <GiUnicorn className="floating-icon unicorn" />
            <GiDinosaurRex className="floating-icon dragon" />
          </div>
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring spinner-ring-2"></div>
            <div className="spinner-ring spinner-ring-3"></div>
          </div>
          <h4 className="mt-5 loading-title">ASB FASHION</h4>
          <p className="loading-subtitle">Preparing magical kids' collection...</p>
          <div className="loading-bar">
            <div className="loading-bar-progress"></div>
          </div>
          <div className="loading-tip">
            <FaMagic className="me-2" />
            <span>Dress your little ones in style!</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center py-5 error-container">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <FaExclamationTriangle className="error-icon mb-4" />
          </motion.div>
          <h3 className="error-title mb-3">Oops! Something went wrong</h3>
          <p className="error-message mb-4">{error}</p>
          <Button className="error-btn" onClick={fetchKidsProducts}>
            <FaMagic className="me-2" /> Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <motion.div 
      className="kids-category-page" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section with Red Theme */}
      <section className="kids-hero-section">
        <div className="hero-overlay">
          <Container className="h-100">
            <div className="hero-content text-center text-white">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge bg="danger" className="hero-badge mb-4 px-4 py-2">
                  <FaCrown className="me-2" /> KIDS' COLLECTION
                </Badge>
              </motion.div>
              <motion.h1 
                className="display-3 fw-bold mb-3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                Fun & Fashion for Kids
              </motion.h1>
              <motion.p 
                className="lead mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Dress your little ones in style and comfort
              </motion.p>
              <motion.div 
                className="hero-stats"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="hero-stat"><FaGem /> Premium Quality</span>
                <span className="hero-stat"><FaSmile /> Kid-Friendly</span>
                <span className="hero-stat"><FaTag /> Best Prices</span>
                <span className="hero-stat"><FaGift /> Free Shipping</span>
              </motion.div>
            </div>
          </Container>
        </div>
      </section>

      {/* Stats Section */}
      {stats.total > 0 && (
        <section className="kids-stats">
          <Container>
            <Row className="g-4">
              <Col md={3} sm={6}>
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaShoppingBag className="stat-icon" />
                  <div>
                    <h3>{stats.total}</h3>
                    <p>Products</p>
                  </div>
                </motion.div>
              </Col>
              <Col md={3} sm={6}>
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaTag className="stat-icon" />
                  <div>
                    <h3>{stats.onSale}</h3>
                    <p>On Sale</p>
                  </div>
                </motion.div>
              </Col>
              <Col md={3} sm={6}>
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaFire className="stat-icon" />
                  <div>
                    <h3>{stats.bestsellers}</h3>
                    <p>Bestsellers</p>
                  </div>
                </motion.div>
              </Col>
              <Col md={3} sm={6}>
                <motion.div 
                  className="stat-card"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaStar className="stat-icon" />
                  <div>
                    <h3>{stats.newArrivals}</h3>
                    <p>New Arrivals</p>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Category Navigation */}
      <section className="category-nav-section">
        <Container>
          <div className="category-nav-wrapper">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="category-icon" />
                  <span>{category.name}</span>
                  {activeCategory === category.id && (
                    <motion.div 
                      className="category-active-indicator"
                      layoutId="categoryIndicator"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </Container>
      </section>

      <Container className="py-4">
        {/* Controls Bar */}
        <div className="controls-bar">
          <div className="results-info">
            <h5>
              <span className="highlight-number">{pagination.total_items}</span> 
              <span className="text-muted ms-2">Products Found</span>
            </h5>
            <small className="text-muted">Page {pagination.current_page} of {pagination.total_pages}</small>
          </div>
          <div className="controls-group">
            <motion.button 
              className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFilter className="me-2" /> 
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </motion.button>
            <div className="sort-selector">
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
                <option value="discount">Biggest Discount</option>
                <option value="rating">Top Rated</option>
                <option value="bestseller">Bestsellers</option>
              </Form.Select>
            </div>
          </div>
        </div>

        <Row>
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="col-lg-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="filters-sidebar">
                  <div className="filters-header">
                    <h5><FaFilter className="me-2" /> Filters</h5>
                    <Button variant="link" className="clear-filters-btn" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="filter-section">
                    <h6>Price Range</h6>
                    <div className="price-range-inputs">
                      <Form.Control 
                        type="number" 
                        placeholder="Min" 
                        value={filters.minPrice} 
                        onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                        className="price-input"
                      />
                      <span className="price-separator">-</span>
                      <Form.Control 
                        type="number" 
                        placeholder="Max" 
                        value={filters.maxPrice} 
                        onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                        className="price-input"
                      />
                    </div>
                  </div>

                  {availableSizes.length > 0 && (
                    <div className="filter-section">
                      <h6><FaRuler className="me-2" /> Size (Age)</h6>
                      <div className="size-options">
                        {availableSizes.map(size => (
                          <button 
                            key={size} 
                            className={`size-btn ${filters.size === size ? 'active' : ''}`} 
                            onClick={() => handleFilterChange('size', size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableAges.length > 0 && (
                    <div className="filter-section">
                      <h6><FaChild className="me-2" /> Age Group</h6>
                      <div className="size-options">
                        {availableAges.map(age => (
                          <button 
                            key={age} 
                            className={`size-btn ${filters.age === age ? 'active' : ''}`} 
                            onClick={() => handleFilterChange('age', age)}
                          >
                            {age}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {availableColors.length > 0 && (
                    <div className="filter-section">
                      <h6><FaPaintBrush className="me-2" /> Color</h6>
                      <div className="color-options">
                        {availableColors.map(color => (
                          <button 
                            key={color.name} 
                            className={`color-btn ${filters.color === color.name ? 'active' : ''}`} 
                            style={{ backgroundColor: color.code }} 
                            onClick={() => handleFilterChange('color', color.name)}
                            title={color.name}
                          >
                            <span className="color-tooltip">{color.name}</span>
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
            {products.length === 0 ? (
              <div className="no-products">
                <FaMagic className="no-products-icon" />
                <h4>No products found</h4>
                <p>Try adjusting your filters or browse other categories</p>
                <Button variant="danger" onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <Row xs={2} md={3} lg={showFilters ? 3 : 4} className="g-4">
                  {products.map((product, index) => (
                    <Col key={product.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        <Card className={`product-card ${hoveredProduct === product.id ? 'hovered' : ''}`}>
                          <div className="product-image-wrapper">
                            {product.is_new_arrival && (
                              <Badge bg="danger" className="new-badge">
                                <FaStar className="me-1" /> NEW
                              </Badge>
                            )}
                            {product.is_bestseller && (
                              <Badge bg="warning" text="dark" className="bestseller-badge">
                                <FaFire className="me-1" /> BESTSELLER
                              </Badge>
                            )}
                            {product.discount_percent > 0 && (
                              <Badge bg="danger" className="discount-badge">
                                -{product.discount_percent}%
                              </Badge>
                            )}
                            <Card.Img 
                              variant="top" 
                              src={product.image_url} 
                              alt={product.name} 
                              className="product-image"
                              onClick={() => navigate(`/product/${product.id}`)}
                              style={{ cursor: 'pointer' }}
                            />
                            <div className="product-overlay">
                              <motion.button
                                className="overlay-btn quick-view"
                                onClick={() => setSelectedItem(product)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaEye /> Quick View
                              </motion.button>
                              <motion.button
                                id={`like-btn-${product.id}`}
                                className={`overlay-btn like-btn ${likedProducts[product.id] ? 'active' : ''}`}
                                onClick={() => handleLike(product.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaHeart /> {likedProducts[product.id] ? 'Liked' : 'Like'}
                              </motion.button>
                            </div>
                          </div>
                          <Card.Body>
                            <div className="product-category">
                              <FaChild className="me-1" />
                              <small className="text-muted">{product.brand || 'ASB Kids'}</small>
                            </div>
                            <Card.Title 
                              className="product-title" 
                              onClick={() => navigate(`/product/${product.id}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              {product.name}
                            </Card.Title>
                            <div className="product-rating">
                              <div className="stars">{renderStars(product.rating)}</div>
                              <small className="text-muted ms-2">({product.reviews_count})</small>
                            </div>
                            <div className="product-price">
                              <span className="sale-price text-danger fw-bold">
                                {formatPrice(product.price)}
                              </span>
                              {product.old_price && (
                                <span className="original-price text-muted text-decoration-line-through ms-2">
                                  {formatPrice(product.old_price)}
                                </span>
                              )}
                            </div>
                            <div className="product-stock mt-2">
                              <small className={product.stock_quantity > 20 ? 'text-success' : 'text-warning'}>
                                {product.stock_quantity > 20 ? '✓ In Stock' : `⚠ Only ${product.stock_quantity} left`}
                              </small>
                            </div>
                            <motion.button
                              id={`cart-btn-${product.id}`}
                              className="add-to-cart-btn w-100 mt-3"
                              onClick={() => addToCart(product)}
                              disabled={addingToCart[product.id]}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {addingToCart[product.id] ? (
                                <>
                                  <FaSpinner className="spinning-icon me-2" /> Adding...
                                </>
                              ) : (
                                <>
                                  <FaShoppingCart className="me-2" /> Add to Cart
                                </>
                              )}
                            </motion.button>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="pagination-controls mt-5">
                    <div className="pagination-wrapper">
                      <motion.button
                        className="page-nav-btn"
                        onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                        disabled={pagination.current_page === 1}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaChevronLeft /> Previous
                      </motion.button>
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
                              <motion.button
                                key={i}
                                className={`page-number ${pagination.current_page === i ? 'active' : ''}`}
                                onClick={() => setPagination(prev => ({ ...prev, current_page: i }))}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {i}
                              </motion.button>
                            );
                          }
                          return pages;
                        })()}
                      </div>
                      <motion.button
                        className="page-nav-btn"
                        onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                        disabled={pagination.current_page === pagination.total_pages}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Next <FaChevronRight />
                      </motion.button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>

        {/* Newsletter Section */}
        <section className="newsletter-banner mt-5">
          <Row className="align-items-center">
            <Col lg={8}>
              <h3 className="text-white mb-2">Stay Updated with Kids' Fashion!</h3>
              <p className="text-white-50 mb-3 mb-lg-0">
                Get exclusive offers, new arrivals, and parenting tips
              </p>
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
            <motion.div 
              className="quick-view-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedItem(null)}>×</button>
              <Row className="g-4">
                <Col md={6}>
                  <div className="modal-image-wrapper">
                    <img src={selectedItem.image_url} alt={selectedItem.name} className="modal-image" />
                    {selectedItem.discount_percent > 0 && (
                      <Badge bg="danger" className="modal-discount">-{selectedItem.discount_percent}%</Badge>
                    )}
                  </div>
                  {selectedItem.images && selectedItem.images.length > 1 && (
                    <div className="thumbnail-gallery mt-3 d-flex gap-2">
                      {selectedItem.images.slice(0, 4).map((img, idx) => (
                        <img 
                          key={idx}
                          src={img}
                          alt={`${selectedItem.name} ${idx + 1}`}
                          className="thumbnail-img"
                          style={{ width: '70px', height: '70px', objectFit: 'cover', cursor: 'pointer', borderRadius: '8px' }}
                          onClick={() => {
                            const mainImg = document.querySelector('.quick-view-modal .modal-image');
                            if (mainImg) mainImg.src = img;
                          }}
                        />
                      ))}
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <Badge bg="danger" className="modal-category-badge mb-3 px-3 py-2">
                    {selectedItem.is_new_arrival ? '✨ NEW ARRIVAL' : '👕 KIDS\' FASHION'}
                  </Badge>
                  <h3 className="modal-title fw-bold mb-3">{selectedItem.name}</h3>
                  <div className="modal-rating mb-3">
                    {renderStars(selectedItem.rating)}
                    <span className="ms-2 text-muted">({selectedItem.reviews_count} reviews)</span>
                  </div>
                  <div className="modal-price mb-4">
                    <span className="sale-price h3 text-danger fw-bold">
                      {formatPrice(selectedItem.price)}
                    </span>
                    {selectedItem.old_price && (
                      <span className="original-price ms-3 text-muted text-decoration-line-through">
                        {formatPrice(selectedItem.old_price)}
                      </span>
                    )}
                  </div>
                  <div className="modal-description">
                    <p className="text-muted">{selectedItem.description || 'Perfect for your little ones! Made with premium quality materials for comfort and durability.'}</p>
                  </div>
                  <div className="modal-details">
                    {selectedItem.sizes?.length > 0 && (
                      <div className="detail-item">
                        <FaBaby className="detail-icon text-danger" />
                        <span><strong>Sizes:</strong> {selectedItem.sizes.join(', ')}</span>
                      </div>
                    )}
                    {selectedItem.colors?.length > 0 && (
                      <div className="detail-item">
                        <FaPaintBrush className="detail-icon text-danger" />
                        <span><strong>Colors:</strong> {selectedItem.colors.join(', ')}</span>
                      </div>
                    )}
                    {selectedItem.brand && (
                      <div className="detail-item">
                        <FaTag className="detail-icon text-danger" />
                        <span><strong>Brand:</strong> {selectedItem.brand}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="danger" 
                    size="lg" 
                    className="modal-view-btn w-100 mt-4"
                    onClick={() => { 
                      setSelectedItem(null); 
                      navigate(`/product/${selectedItem.id}`);
                    }}
                  >
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

export default KidsCategory;