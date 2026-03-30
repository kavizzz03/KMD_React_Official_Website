import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeart, 
  FaShoppingBag, 
  FaTrash, 
  FaEye,
  FaStar,
  FaShare,
  FaShoppingCart,
  FaCheckCircle,
  FaTimes,
  FaTshirt,
  FaFemale,
  FaChild,
  FaGem,
  FaFire,
  FaTag,
  FaStore
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { 
  getWishlistCount, 
  removeFromWishlist, 
  addToCart,
  getWishlist,
  clearWishlist
} from "../utils/cartUtils";
import "./WishlistPage.css";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddToCartToast, setShowAddToCartToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showClearModal, setShowClearModal] = useState(false);
  const [showMoveAllModal, setShowMoveAllModal] = useState(false);

  // Load wishlist from localStorage
  const loadWishlist = () => {
    try {
      const savedWishlist = getWishlist();
      setWishlist(savedWishlist);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  // Listen for wishlist updates
  useEffect(() => {
    loadWishlist();
    
    const handleWishlistUpdate = () => {
      loadWishlist();
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowAddToCartToast(true);
    setTimeout(() => setShowAddToCartToast(false), 3000);
  };

  const handleRemoveFromWishlist = (item) => {
    setSelectedItem(item);
    setShowRemoveModal(true);
  };

  const confirmRemove = () => {
    if (selectedItem) {
      const removed = removeFromWishlist(selectedItem.id);
      if (removed) {
        loadWishlist();
        showToast(`${selectedItem.name} removed from wishlist`);
      } else {
        showToast("Failed to remove item", "error");
      }
      setShowRemoveModal(false);
      setSelectedItem(null);
    }
  };

  const handleAddToCart = (item) => {
    const added = addToCart(item);
    if (added) {
      showToast(`${item.name} added to cart successfully!`, "success");
    } else {
      showToast(`Failed to add ${item.name} to cart`, "error");
    }
  };

  const handleMoveAllToCart = () => {
    const inStockItems = wishlist.filter(item => item.inStock !== false);
    let successCount = 0;
    let failCount = 0;
    
    inStockItems.forEach(item => {
      const added = addToCart(item);
      if (added) {
        successCount++;
      } else {
        failCount++;
      }
    });
    
    if (successCount > 0) {
      showToast(`${successCount} item(s) moved to cart successfully!`, "success");
    }
    if (failCount > 0) {
      showToast(`${failCount} item(s) failed to add to cart`, "warning");
    }
    setShowMoveAllModal(false);
  };

  const handleClearWishlist = () => {
    const cleared = clearWishlist();
    if (cleared) {
      loadWishlist();
      showToast("Wishlist cleared successfully", "success");
    } else {
      showToast("Failed to clear wishlist", "error");
    }
    setShowClearModal(false);
  };

  const formatPrice = (price) => {
    if (!price) return "LKR 0";
    return `LKR ${price.toLocaleString()}`;
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'men': return <FaTshirt />;
      case 'women': return <FaFemale />;
      case 'kids': return <FaChild />;
      default: return <FaGem />;
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} year(s) ago`;
  };

  const inStockCount = wishlist.filter(item => item.inStock !== false).length;
  const totalValue = wishlist.reduce((sum, item) => sum + (item.price || 0), 0);
  const maxDiscount = Math.max(...wishlist.map(i => i.discount || 0), 0);

  if (loading) {
    return (
      <div className="asb-wishlist-loading">
        <div className="loading-content">
          <FaHeart className="loading-icon" />
          <h4>ASB FASHION</h4>
          <p>Loading your wishlist...</p>
          <div className="loading-bar" />
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Container className="py-5 min-vh-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-5"
        >
          <div className="empty-wishlist-icon mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaHeart size={100} className="text-danger opacity-25" />
            </motion.div>
          </div>
          <h2 className="display-5 fw-bold text-dark mb-3">Your Wishlist is Empty</h2>
          <p className="lead text-muted mb-4">
            Save your favorite items and come back to them later.
          </p>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <Button 
              variant="danger" 
              size="lg"
              onClick={() => navigate("/products")}
              className="px-5 py-3 fw-bold"
            >
              <FaShoppingBag className="me-2" />
              Start Shopping
            </Button>
            <Button 
              variant="outline-danger" 
              size="lg"
              onClick={() => navigate("/collections")}
              className="px-5 py-3"
            >
              <FaStore className="me-2" />
              Browse Collections
            </Button>
          </div>
          
          {/* Quick links */}
          <div className="mt-5">
            <p className="text-muted mb-3">Popular Categories:</p>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {['Men', 'Women', 'Kids', 'New Arrivals', 'Sale'].map((cat, idx) => (
                <Button 
                  key={idx}
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => navigate(`/${cat.toLowerCase().replace(' ', '-')}`)}
                  className="rounded-pill"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    );
  }

  return (
    <motion.div 
      className="asb-wishlist-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="wishlist-hero">
        <div className="hero-overlay">
          <Container>
            <motion.div 
              className="hero-content text-center text-white"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge bg="danger" className="hero-badge mb-3">
                <FaHeart className="me-2" />
                YOUR WISHLIST
              </Badge>
              <h1 className="display-3 fw-bold mb-3">Saved for Later</h1>
              <p className="lead mb-4">Keep track of items you love and never miss a deal</p>
            </motion.div>
          </Container>
        </div>
      </section>

      {/* Stats Section */}
      <section className="wishlist-stats">
        <Container>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaHeart className="stat-icon" />
                <div>
                  <h3>{wishlist.length}</h3>
                  <p>Saved Items</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaCheckCircle className="stat-icon" />
                <div>
                  <h3>{inStockCount}</h3>
                  <p>In Stock</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaTag className="stat-icon" />
                <div>
                  <h3>{formatPrice(totalValue)}</h3>
                  <p>Total Value</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaFire className="stat-icon" />
                <div>
                  <h3>{maxDiscount}%</h3>
                  <p>Max Discount</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-4">
        {/* Actions Bar */}
        <div className="actions-bar mb-4">
          <Row className="align-items-center">
            <Col>
              <p className="text-muted mb-0">
                Showing <strong>{wishlist.length}</strong> items in your wishlist
              </p>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                {inStockCount > 0 && (
                  <Button 
                    variant="danger" 
                    onClick={() => setShowMoveAllModal(true)}
                  >
                    <FaShoppingCart className="me-2" />
                    Move All to Cart ({inStockCount})
                  </Button>
                )}
                <Button 
                  variant="outline-danger" 
                  onClick={() => setShowClearModal(true)}
                >
                  <FaTrash className="me-2" />
                  Clear All
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Wishlist Grid */}
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          <AnimatePresence>
            {wishlist.map((item, index) => (
              <Col key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="wishlist-product-card">
                    <div className="product-image-wrapper">
                      {item.discount > 0 && (
                        <Badge bg="danger" className="discount-badge">
                          -{item.discount}%
                        </Badge>
                      )}
                      {item.inStock === false && (
                        <Badge bg="secondary" className="out-of-stock-badge">
                          Out of Stock
                        </Badge>
                      )}
                      <Card.Img 
                        variant="top" 
                        src={item.image_url || item.image || "/images/placeholder.jpg"} 
                        alt={item.name}
                        className="product-image"
                        onError={(e) => e.target.src = "/images/placeholder.jpg"}
                      />
                      <div className="product-overlay">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="overlay-btn"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          <FaEye /> View Details
                        </Button>
                      </div>
                      {item.addedDate && (
                        <div className="added-date">
                          <small>Added {getTimeAgo(item.addedDate)}</small>
                        </div>
                      )}
                    </div>
                    <Card.Body>
                      <div className="product-category">
                        {getCategoryIcon(item.category)}
                        <small className="ms-1">{item.category || 'General'}</small>
                      </div>
                      <Card.Title className="product-title">{item.name}</Card.Title>
                      {item.rating && (
                        <div className="product-rating mb-2">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < Math.floor(item.rating) ? 'text-warning' : 'text-secondary'} 
                              />
                            ))}
                          </div>
                          <small className="text-muted ms-2">({item.reviews || 0})</small>
                        </div>
                      )}
                      <div className="product-price">
                        <span className="sale-price">{formatPrice(item.price)}</span>
                        {item.originalPrice && (
                          <span className="original-price">{formatPrice(item.originalPrice)}</span>
                        )}
                      </div>
                      <div className="product-actions mt-3">
                        <Button 
                          variant={item.inStock !== false ? "danger" : "secondary"}
                          className="w-100 mb-2"
                          onClick={() => handleAddToCart(item)}
                          disabled={item.inStock === false}
                        >
                          <FaShoppingBag className="me-2" />
                          {item.inStock !== false ? "Add to Cart" : "Out of Stock"}
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          className="w-100"
                          onClick={() => handleRemoveFromWishlist(item)}
                        >
                          <FaTrash className="me-2" />
                          Remove
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </AnimatePresence>
        </Row>

        {/* Share Wishlist Banner */}
        <section className="share-banner mt-5">
          <Card className="share-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={8}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="share-icon">
                      <FaShare />
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1">Share Your Wishlist</h4>
                      <p className="text-muted mb-0">
                        Let your friends and family know what you're wishing for
                      </p>
                    </div>
                  </div>
                </Col>
                <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
                  <Button 
                    variant="danger" 
                    size="lg" 
                    className="px-5"
                    onClick={() => {
                      const shareText = `Check out my wishlist at ASB Fashion! I've saved ${wishlist.length} items worth ${formatPrice(totalValue)}.`;
                      if (navigator.share) {
                        navigator.share({
                          title: 'My ASB Fashion Wishlist',
                          text: shareText,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(shareText);
                        showToast("Wishlist link copied to clipboard!", "success");
                      }
                    }}
                  >
                    <FaShare className="me-2" />
                    Share Wishlist
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </section>

        {/* Recommended Items */}
        <section className="recommended-section mt-5">
          <h3 className="section-title mb-4">You Might Also Like</h3>
          <Row xs={2} md={4} className="g-4">
            {[1, 2, 3, 4].map((item) => (
              <Col key={item}>
                <Card className="recommended-card" onClick={() => navigate("/product/1")}>
                  <Card.Img 
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop" 
                    className="recommended-image"
                    onError={(e) => e.target.src = "/images/placeholder.jpg"}
                  />
                  <Card.Body>
                    <h6 className="fw-bold mb-1">Classic Shirt</h6>
                    <p className="text-danger fw-bold mb-0">LKR 3,500</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>

      {/* Remove Confirmation Modal */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger">Remove Item</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <FaTrash size={50} className="text-danger mb-3" />
          <h5 className="fw-bold mb-2">Remove from Wishlist?</h5>
          <p className="text-muted">
            Are you sure you want to remove <strong>{selectedItem?.name}</strong> from your wishlist?
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowRemoveModal(false)} className="px-4">
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemove} className="px-4">
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Clear Wishlist Confirmation Modal */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger">Clear Wishlist</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <FaTrash size={50} className="text-danger mb-3" />
          <h5 className="fw-bold mb-2">Clear Your Entire Wishlist?</h5>
          <p className="text-muted">
            This action cannot be undone. All {wishlist.length} items will be removed from your wishlist.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowClearModal(false)} className="px-4">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearWishlist} className="px-4">
            Yes, Clear All
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Move All to Cart Confirmation Modal */}
      <Modal show={showMoveAllModal} onHide={() => setShowMoveAllModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-success">Move to Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <FaShoppingCart size={50} className="text-success mb-3" />
          <h5 className="fw-bold mb-2">Move All Items to Cart?</h5>
          <p className="text-muted">
            You are about to move all {inStockCount} in-stock items from your wishlist to your shopping cart.
          </p>
          {wishlist.length > inStockCount && (
            <p className="text-warning small mt-2">
              Note: {wishlist.length - inStockCount} out-of-stock items will remain in your wishlist.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowMoveAllModal(false)} className="px-4">
            Cancel
          </Button>
          <Button variant="success" onClick={handleMoveAllToCart} className="px-4">
            Move All to Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Toast */}
      <AnimatePresence>
        {showAddToCartToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className={`asb-success-toast asb-${toastType}-toast`}
          >
            {toastType === "success" && <FaCheckCircle className="text-success me-3 fs-4" />}
            {toastType === "error" && <FaTimes className="text-danger me-3 fs-4" />}
            {toastType === "warning" && <FaFire className="text-warning me-3 fs-4" />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WishlistPage;