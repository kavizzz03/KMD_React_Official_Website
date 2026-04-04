// components/WomenCategory.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeart, FaEye, FaStar, FaSortAmountDown, FaShoppingBag,
  FaArrowRight, FaFemale, FaFire, FaTag, FaFilter,
  FaShoppingCart, FaCheck, FaRuler, FaPaintBrush, FaGem, FaCrown,
  FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaSpinner
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WomenCategory.css";

const WomenCategory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [likedProducts, setLikedProducts] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0
  });
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100000,
    size: '',
    color: ''
  });

  const [availableSizes, setAvailableSizes] = useState(["XS", "S", "M", "L", "XL"]);
  const [availableColors, setAvailableColors] = useState([
    { name: "Black", code: "#000000" },
    { name: "White", code: "#FFFFFF" },
    { name: "Red", code: "#DC2626" },
    { name: "Pink", code: "#FF69B4" },
    { name: "Purple", code: "#8B5CF6" },
    { name: "Blue", code: "#3B82F6" }
  ]);

  useEffect(() => {
    fetchWomenProducts();
  }, [filters, sortBy, pagination.current_page]);

  const fetchWomenProducts = async () => {
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
        color: filters.color
      });
      
      const response = await axios.get(`https://whats.asbfashion.com/api/women/women-products.php?${params}`);
      
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
          'Pink': '#FF69B4', 'Purple': '#8B5CF6', 'Blue': '#3B82F6',
          'Green': '#22C55E', 'Yellow': '#EAB308', 'Orange': '#F97316'
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
      console.error("Error fetching women's products:", error);
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
      
      const response = await axios.post('https://whats.asbfashion.com/api/women/women-products.php', {
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
    setFilters({ minPrice: 0, maxPrice: 100000, size: '', color: '' });
    setSortBy("newest");
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
      <div className="women-category-loading">
        <div className="loading-content">
          <div className="loading-spinner"><FaSpinner className="spinning-icon" /></div>
          <h4 className="mt-4">ASB FASHION</h4>
          <p className="text-muted">Loading women's collection...</p>
          <div className="loading-bar"><div className="loading-bar-progress"></div></div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <FaExclamationTriangle className="text-danger mb-3" style={{ fontSize: "3rem", opacity: 0.5 }} />
          <h3 className="text-danger mb-3">Unable to Load Products</h3>
          <p className="text-muted mb-4">{error}</p>
          <Button variant="danger" onClick={fetchWomenProducts}>Try Again</Button>
        </div>
      </Container>
    );
  }

  return (
    <motion.div className="women-category-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero Section */}
      <section className="women-hero-section">
        <div className="hero-overlay">
          <Container className="h-100">
            <div className="hero-content text-center text-white">
              <Badge bg="danger" className="hero-badge mb-3 px-3 py-2">
                <FaCrown className="me-2" /> WOMEN'S COLLECTION
              </Badge>
              <h1 className="display-3 fw-bold mb-3">Embrace Your Elegance</h1>
              <p className="lead mb-4">Discover the latest trends in women's fashion</p>
              <div className="hero-stats">
                <span className="hero-stat"><FaGem /> Premium Quality</span>
                <span className="hero-stat"><FaFire /> Latest Trends</span>
                <span className="hero-stat"><FaTag /> Best Prices</span>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Stats Section */}
      {stats.total > 0 && (
        <section className="women-stats">
          <Container>
            <Row className="g-4">
              <Col md={3} sm={6}><div className="stat-card"><FaShoppingBag className="stat-icon" /><div><h3>{stats.total}</h3><p>Products</p></div></div></Col>
              <Col md={3} sm={6}><div className="stat-card"><FaTag className="stat-icon" /><div><h3>{stats.onSale}</h3><p>On Sale</p></div></div></Col>
              <Col md={3} sm={6}><div className="stat-card"><FaFire className="stat-icon" /><div><h3>{stats.bestsellers}</h3><p>Bestsellers</p></div></div></Col>
              <Col md={3} sm={6}><div className="stat-card"><FaStar className="stat-icon" /><div><h3>{stats.newArrivals}</h3><p>New Arrivals</p></div></div></Col>
            </Row>
          </Container>
        </section>
      )}

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div><h5><span className="text-danger">{pagination.total_items}</span> Products Found</h5><small>Page {pagination.current_page} of {pagination.total_pages}</small></div>
          <div className="d-flex gap-3">
            <Button variant="outline-danger" onClick={() => setShowFilters(!showFilters)}><FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}</Button>
            <div className="sort-filter"><FaSortAmountDown className="me-2 text-danger" />
              <Form.Select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPagination(prev => ({ ...prev, current_page: 1 })); }}>
                <option value="newest">Newest First</option><option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option><option value="discount">Biggest Discount</option>
                <option value="rating">Top Rated</option><option value="bestseller">Bestsellers</option>
              </Form.Select>
            </div>
          </div>
        </div>

        <Row>
          <AnimatePresence>
            {showFilters && (
              <motion.div className="col-lg-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="filters-sidebar">
                  <div className="filters-header"><h5>Filters</h5><Button variant="link" className="p-0 text-danger" onClick={clearFilters}>Clear All</Button></div>
                  <div className="filter-section"><h6>Price Range</h6>
                    <div className="price-range-inputs">
                      <Form.Control type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))} />
                      <span>-</span>
                      <Form.Control type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))} />
                    </div>
                  </div>
                  {availableSizes.length > 0 && <div className="filter-section"><h6>Size</h6><div className="size-options">{availableSizes.map(size => (<button key={size} className={`size-btn ${filters.size === size ? 'active' : ''}`} onClick={() => handleFilterChange('size', size)}>{size}</button>))}</div></div>}
                  {availableColors.length > 0 && <div className="filter-section"><h6>Color</h6><div className="color-options">{availableColors.map(color => (<button key={color.name} className={`color-btn ${filters.color === color.name ? 'active' : ''}`} style={{ backgroundColor: color.code }} onClick={() => handleFilterChange('color', color.name)} title={color.name} />))}</div></div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Col lg={showFilters ? 9 : 12}>
            <Row xs={2} md={3} lg={showFilters ? 3 : 4} className="g-4">
              {products.map((product, index) => (
                <Col key={product.id}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <Card className="product-card">
                      <div className="product-image-wrapper">
                        {product.is_new_arrival && <Badge bg="danger" className="new-badge">NEW</Badge>}
                        {product.is_bestseller && <Badge bg="warning" text="dark" className="bestseller-badge"><FaFire /> BESTSELLER</Badge>}
                        {product.discount_percent > 0 && <Badge bg="danger" className="discount-badge">-{product.discount_percent}%</Badge>}
                        <Card.Img variant="top" src={product.image_url} alt={product.name} className="product-image" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }} />
                        <div className="product-overlay">
                          <Button variant="light" size="sm" className="overlay-btn" onClick={() => setSelectedItem(product)}><FaEye /> Quick View</Button>
                          <Button variant="light" size="sm" className={`overlay-btn like-btn ${likedProducts[product.id] ? 'active' : ''}`} onClick={() => handleLike(product.id)}><FaHeart /> {likedProducts[product.id] ? 'Liked' : 'Like'}</Button>
                        </div>
                      </div>
                      <Card.Body>
                        <div className="product-category"><FaFemale className="me-1" /><small>{product.brand || 'ASB Fashion'}</small></div>
                        <Card.Title className="product-title" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</Card.Title>
                        <div className="product-rating"><div className="stars">{renderStars(product.rating)}</div><small className="text-muted ms-2">({product.reviews_count})</small></div>
                        <div className="product-price"><span className="sale-price text-danger fw-bold">{formatPrice(product.price)}</span>{product.old_price && <span className="original-price ms-2">{formatPrice(product.old_price)}</span>}</div>
                        <div className="product-stock mt-2"><small className={product.stock_quantity > 20 ? 'text-success' : 'text-warning'}>{product.stock_quantity > 20 ? 'In Stock' : `Only ${product.stock_quantity} left`}</small></div>
                        <Button id={`cart-btn-${product.id}`} variant="danger" className="w-100 mt-3 add-to-cart-btn" onClick={() => addToCart(product)} disabled={addingToCart[product.id]}>
                          {addingToCart[product.id] ? <><FaSpinner className="spinning-icon me-2" /> Adding...</> : <><FaShoppingCart className="me-2" /> Add to Cart</>}
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {pagination.total_pages > 1 && (
              <div className="pagination-controls mt-5">
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <Button variant="outline-danger" onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))} disabled={pagination.current_page === 1}><FaChevronLeft /> Previous</Button>
                  {[...Array(Math.min(5, pagination.total_pages))].map((_, i) => {
                    let pageNum = i + 1;
                    if (pagination.total_pages > 5 && pagination.current_page > 3) {
                      pageNum = pagination.current_page - 2 + i;
                      if (pageNum > pagination.total_pages) return null;
                    }
                    return <Button key={pageNum} variant={pagination.current_page === pageNum ? "danger" : "outline-danger"} onClick={() => setPagination(prev => ({ ...prev, current_page: pageNum }))}>{pageNum}</Button>;
                  })}
                  <Button variant="outline-danger" onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))} disabled={pagination.current_page === pagination.total_pages}>Next <FaChevronRight /></Button>
                </div>
              </div>
            )}
          </Col>
        </Row>

        <section className="newsletter-banner mt-5">
          <Row className="align-items-center">
            <Col lg={8}><h3 className="text-white mb-2">Stay Updated</h3><p className="text-white-50">Get the latest women's fashion updates and exclusive offers</p></Col>
            <Col lg={4}><InputGroup className="newsletter-input"><Form.Control placeholder="Your email address" /><Button variant="light">Subscribe</Button></InputGroup></Col>
          </Row>
        </section>
      </Container>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
            <motion.div className="quick-view-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedItem(null)}>×</button>
              <Row className="g-4">
                <Col md={6}><img src={selectedItem.image_url} alt={selectedItem.name} className="img-fluid rounded" /></Col>
                <Col md={6}>
                  <Badge bg="danger" className="mb-3 px-3 py-2">{selectedItem.is_new_arrival ? 'NEW ARRIVAL' : 'WOMEN\'S FASHION'}</Badge>
                  <h3 className="fw-bold mb-3">{selectedItem.name}</h3>
                  <div className="rating mb-3">{renderStars(selectedItem.rating)}<span className="ms-2 text-muted">({selectedItem.reviews_count} reviews)</span></div>
                  <div className="price-section mb-4"><span className="sale-price h3 text-danger fw-bold">{formatPrice(selectedItem.price)}</span>{selectedItem.old_price && <span className="original-price ms-3 text-muted text-decoration-line-through">{formatPrice(selectedItem.old_price)}</span>}</div>
                  <div className="product-details mb-4">
                    <p className="text-muted">{selectedItem.description || 'No description available.'}</p>
                    <div className="details-list">
                      {selectedItem.sizes?.length > 0 && <div className="detail-item"><FaRuler className="me-2 text-danger" /> Sizes: {selectedItem.sizes.join(', ')}</div>}
                      {selectedItem.colors?.length > 0 && <div className="detail-item"><FaPaintBrush className="me-2 text-danger" /> Colors: {selectedItem.colors.join(', ')}</div>}
                      {selectedItem.brand && <div className="detail-item"><FaTag className="me-2 text-danger" /> Brand: {selectedItem.brand}</div>}
                    </div>
                  </div>
                  <Button variant="danger" size="lg" className="w-100" onClick={() => { setSelectedItem(null); navigate(`/product/${selectedItem.id}`); }}>View Full Details <FaArrowRight className="ms-2" /></Button>
                </Col>
              </Row>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WomenCategory;