import React, { useState } from "react";
import { Card, Button, Badge, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaHeart,
  FaStar,
  FaShoppingBag,
  FaCheckCircle,
  FaShare,
  FaBolt,
  FaTshirt,
  FaFemale,
  FaChild,
  FaGem,
  FaCrown,
  FaRuler,
  FaPalette,
  FaTag,
  FaFire,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({ p, viewMode = "grid", onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showFullImage, setShowFullImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const outOfStock = p.status === "out_of_stock" || p.stock_quantity <= 0;
  const hasDiscount = p.discount_percent > 0;
  const isNew = p.is_new || p.created_at;
  const isTrending = p.is_trending || p.views > 100;
  const isLimited = p.stock_quantity < 5 && p.stock_quantity > 0;

  // Get product images (if multiple images available)
  const productImages = p.images && p.images.length > 0 
    ? p.images 
    : [{ url: p.image_url || "/images/placeholder.jpg" }];

  // Get category icon
  const getCategoryIcon = () => {
    switch(p.category?.toLowerCase()) {
      case 'men': return <FaTshirt />;
      case 'women': return <FaFemale />;
      case 'kids': return <FaChild />;
      case 'accessories': return <FaGem />;
      default: return <FaTag />;
    }
  };

  // Get final price
  const getProductPrice = () => {
    if (p.discounted_price && parseFloat(p.discounted_price) > 0) {
      return parseFloat(p.discounted_price);
    }
    return parseFloat(p.sell_price);
  };

  const displayPrice = getProductPrice();
  const savingsAmount = hasDiscount
    ? (parseFloat(p.sell_price) - displayPrice).toFixed(2)
    : 0;

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(item => item.id === p.id);
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({ ...p, quantity: 1, selectedSize });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      if (onAddToCart) {
        onAddToCart(`${p.name} added to cart`);
      }
    }
  };

  const shareProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: p.name,
        text: p.description,
        url: `${window.location.origin}/product/${p.id}`,
      });
    }
  };

  const openFullImage = (e, index = 0) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
    setShowFullImage(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullImage = () => {
    setShowFullImage(false);
    document.body.style.overflow = 'auto';
  };

  const navigateFullImage = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    }
  };

  const getStockStatus = () => {
    if (outOfStock)
      return { text: "Out of Stock", color: "secondary", icon: FaBolt };
    if (isLimited)
      return {
        text: `Only ${p.stock_quantity} left`,
        color: "warning",
        icon: FaFire,
      };
    return { text: "In Stock", color: "success", icon: FaCheckCircle };
  };

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;

  const sizes = p.sizes || ['S', 'M', 'L', 'XL', 'XXL'];

  const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const imageVariants = {
    hover: { 
      scale: 1.08,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (viewMode === "list") {
    return (
      <>
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <Card className="product-card-list mb-3 border-0 shadow-sm">
            <div className="row g-0">
              <div className="col-md-3">
                <div className="product-image-container position-relative">
                  <div onClick={(e) => openFullImage(e, 0)} style={{ cursor: 'pointer' }}>
                    <Card.Img
                      src={imageError ? "/images/placeholder.jpg" : p.image_url}
                      className={`product-image ${imageLoaded ? "loaded" : ""}`}
                      alt={p.name}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                    />
                  </div>
                  
                  <div className="product-badges">
                    {hasDiscount && (
                      <Badge bg="danger" className="discount-badge">
                        -{p.discount_percent}%
                      </Badge>
                    )}
                    {isNew && (
                      <Badge bg="success" className="new-badge">NEW</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Badge bg="light" text="dark" className="category-badge">
                          {getCategoryIcon()} {p.category || "Fashion"}
                        </Badge>
                        {isTrending && (
                          <Badge bg="warning" text="dark" className="trending-badge">
                            <FaFire className="me-1" /> Trending
                          </Badge>
                        )}
                      </div>
                      
                      <Link to={`/product/${p.id}`} className="text-decoration-none">
                        <h5 className="product-title fw-bold mb-2">{p.name}</h5>
                      </Link>
                      
                      <p className="product-description text-muted small mb-3">
                        {p.description || "Premium quality fashion item from ASB FASHION"}
                      </p>
                      
                      <div className="size-selection mb-3">
                        <small className="fw-bold d-block mb-2">Select Size:</small>
                        <div className="d-flex gap-2 flex-wrap">
                          {sizes.map((size) => (
                            <Button
                              key={size}
                              variant={selectedSize === size ? "danger" : "outline-secondary"}
                              size="sm"
                              className="size-btn"
                              onClick={() => setSelectedSize(size)}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-end">
                      <Button
                        variant="link"
                        className={`favorite-btn ${isFavorite ? "active" : ""}`}
                        onClick={toggleFavorite}
                      >
                        <FaHeart />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <div className="price-section">
                        <span className="current-price h5 fw-bold text-danger me-2">
                          LKR {displayPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="original-price text-muted text-decoration-line-through">
                            LKR {parseFloat(p.sell_price).toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      <div className="stock-status mt-1">
                        <StatusIcon className={`me-1 text-${stockStatus.color}`} />
                        <small className={`text-${stockStatus.color}`}>
                          {stockStatus.text}
                        </small>
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={shareProduct}
                      >
                        <FaShare />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleAddToCart}
                        disabled={outOfStock}
                      >
                        <FaShoppingBag className="me-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Full Screen Image Viewer for List View */}
        <AnimatePresence>
          {showFullImage && (
            <motion.div
              className="fullscreen-image-viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="viewer-overlay" onClick={closeFullImage} />
              <div className="viewer-container">
                <button className="viewer-close-btn" onClick={closeFullImage}>
                  <FaTimes />
                </button>
                
                {productImages.length > 1 && (
                  <>
                    <button 
                      className="viewer-nav-btn viewer-prev"
                      onClick={() => navigateFullImage('prev')}
                    >
                      <FaChevronLeft />
                    </button>
                    <button 
                      className="viewer-nav-btn viewer-next"
                      onClick={() => navigateFullImage('next')}
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
                
                <div className="viewer-content">
                  <motion.img
                    key={currentImageIndex}
                    src={productImages[currentImageIndex]?.url || p.image_url || '/images/placeholder.jpg'}
                    alt={`${p.name} - Full View`}
                    className="viewer-image"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                {productImages.length > 1 && (
                  <div className="viewer-counter">
                    {currentImageIndex + 1} / {productImages.length}
                  </div>
                )}
                
                {productImages.length > 1 && (
                  <div className="viewer-thumbnails">
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className={`viewer-thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={image.url} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="product-card-wrapper"
      >
        <Card className="product-card h-100 border-0 shadow-sm">
          {/* Image Section */}
          <div className="product-image-container position-relative">
            <div className="image-link" onClick={(e) => openFullImage(e, 0)} style={{ cursor: 'pointer' }}>
              {!imageLoaded && !imageError && (
                <div className="image-placeholder">
                  <div className="placeholder-spinner" />
                </div>
              )}
              <motion.img
                src={imageError ? "/images/placeholder.jpg" : p.image_url}
                className={`product-image ${imageLoaded ? "loaded" : ""}`}
                alt={p.name}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                variants={imageVariants}
              />
            </div>

            {/* Badges */}
            <div className="product-badges">
              {hasDiscount && (
                <Badge bg="danger" className="discount-badge">
                  -{p.discount_percent}%
                </Badge>
              )}
              {isNew && (
                <Badge bg="success" className="new-badge">NEW</Badge>
              )}
              {isTrending && (
                <Badge bg="warning" text="dark" className="trending-badge">
                  <FaFire className="me-1" /> Hot
                </Badge>
              )}
              {isLimited && (
                <Badge bg="danger" className="limited-badge">
                  <FaBolt className="me-1" /> Limited
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              className="card-actions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`action-btn ${isFavorite ? "active" : ""}`}
                onClick={toggleFavorite}
              >
                <FaHeart />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="action-btn"
                onClick={shareProduct}
              >
                <FaShare />
              </motion.button>
            </motion.div>

            {/* Quick Actions Overlay */}
            <motion.div
              className="quick-actions-overlay"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="danger"
                size="sm"
                className="quick-view-btn"
                onClick={(e) => openFullImage(e, 0)}
              >
                <FaEye className="me-1" />
                Quick View
              </Button>
            </motion.div>
          </div>

          <Card.Body className="p-3">
            {/* Category & Icon */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Badge bg="light" text="dark" className="category-badge">
                {getCategoryIcon()} {p.category || "Fashion"}
              </Badge>
              {p.rating && (
                <div className="rating">
                  <FaStar className="text-warning me-1" size={12} />
                  <small className="fw-bold">{p.rating}</small>
                  <small className="text-muted ms-1">({p.reviews || 0})</small>
                </div>
              )}
            </div>

            {/* Product Name */}
            <Link to={`/product/${p.id}`} className="text-decoration-none">
              <Card.Title className="product-title fw-bold mb-2">
                {p.name}
              </Card.Title>
            </Link>

            {/* Size Selection */}
            <div className="size-selection mb-3">
              <small className="text-muted d-block mb-2">Size:</small>
              <div className="d-flex gap-1 flex-wrap">
                {sizes.slice(0, 4).map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "danger" : "outline-secondary"}
                    size="sm"
                    className="size-btn-sm"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
                {sizes.length > 4 && (
                  <Badge bg="light" text="dark" className="more-sizes">
                    +{sizes.length - 4}
                  </Badge>
                )}
              </div>
            </div>

            {/* Price and Stock */}
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="current-price fw-bold text-danger">
                  LKR {displayPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="original-price text-muted text-decoration-line-through ms-2 small">
                    LKR {parseFloat(p.sell_price).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="stock-status">
                <StatusIcon className={`text-${stockStatus.color}`} size={14} />
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant={outOfStock ? "secondary" : "danger"}
              className="w-100 mt-3 add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={outOfStock}
            >
              <FaShoppingBag className="me-2" />
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>

            {/* Features */}
            <div className="product-features mt-3 pt-2 border-top">
              <div className="d-flex justify-content-around small">
                <span className="text-muted">
                  <FaRuler className="me-1" /> True to size
                </span>
                <span className="text-muted">
                  <FaPalette className="me-1" /> Multiple colors
                </span>
                <span className="text-muted">
                  <FaCheckCircle className="me-1 text-success" /> Authentic
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Full Screen Image Viewer */}
      <AnimatePresence>
        {showFullImage && (
          <motion.div
            className="fullscreen-image-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="viewer-overlay" onClick={closeFullImage} />
            <div className="viewer-container">
              <button className="viewer-close-btn" onClick={closeFullImage}>
                <FaTimes />
              </button>
              
              {productImages.length > 1 && (
                <>
                  <button 
                    className="viewer-nav-btn viewer-prev"
                    onClick={() => navigateFullImage('prev')}
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    className="viewer-nav-btn viewer-next"
                    onClick={() => navigateFullImage('next')}
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              <div className="viewer-content">
                <motion.img
                  key={currentImageIndex}
                  src={productImages[currentImageIndex]?.url || p.image_url || '/images/placeholder.jpg'}
                  alt={`${p.name} - Full View`}
                  className="viewer-image"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {productImages.length > 1 && (
                <div className="viewer-counter">
                  {currentImageIndex + 1} / {productImages.length}
                </div>
              )}
              
              {productImages.length > 1 && (
                <div className="viewer-thumbnails">
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className={`viewer-thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img src={image.url} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;