import React, { useState } from "react";
import { Card, Button, Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEye,
  FaHeart,
  FaStar,
  FaLeaf,
  FaAward,
  FaFire,
  FaClock,
  FaCheckCircle,
  FaShare,
  FaBolt,
  FaShoppingCart,
  FaCrown,
  FaGem
} from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({ p }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const outOfStock = p.status === "out_of_stock" || p.stock_quantity <= 0;
  const hasDiscount = p.discount_percent > 0;
  const isBestSeller = p.is_best_seller;
  const isNew = p.is_new || p.created_at;
  const isPremium = p.category === "premium" || p.sell_price > 1000;

  // ✅ Get final price (handles discounts)
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

  const shareProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: p.name,
        text: p.description,
        url: `${window.location.origin}/product/${p.id}`,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/product/${p.id}`);
      // You can add a toast notification here
    }
  };

  const getStockStatus = () => {
    if (outOfStock)
      return { text: "Out of Stock", color: "danger", icon: FaClock };
    if (p.stock_quantity < 5)
      return {
        text: `Only ${p.stock_quantity} left`,
        color: "warning",
        icon: FaBolt,
      };
    return { text: "In Stock", color: "success", icon: FaCheckCircle };
  };

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;

  const cardVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9, 
      y: 30,
      rotateY: -15 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateY: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -15,
      scale: 1.02,
      rotateY: 5,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const badgeVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        delay: 0.2, 
        type: "spring", 
        stiffness: 200 
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="product-card-wrapper"
    >
      <Card className="product-card h-100">
        
        {/* Premium Crown Badge */}
        {isPremium && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="premium-crown"
          >
            <FaCrown className="crown-icon" />
            <span>Premium</span>
          </motion.div>
        )}

        {/* Image Section */}
        <div className="product-image-container position-relative">
          <Link to={`/product/${p.id}`} className="image-link">
            {!imageLoaded && !imageError && (
              <div className="image-placeholder">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="placeholder-content"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <FaGem size={32} className="text-warning" />
                  </motion.div>
                  <motion.span 
                    className="loading-text mt-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Preparing Sweet...
                  </motion.span>
                </motion.div>
              </div>
            )}
            <motion.img
              src={
                imageError
                  ? "/api/placeholder/300/300"
                  : `https://kmd.cpsharetxt.com/${p.image_url}`
              }
              className={`product-image ${imageLoaded ? "loaded" : ""}`}
              alt={p.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              variants={imageVariants}
            />
          </Link>

          {/* Floating Sweet Particles */}
          {isHovered && (
            <>
              <motion.div
                className="sweet-particle"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [-20, 100],
                  y: [0, -50]
                }}
                transition={{ 
                  duration: 2,
                  delay: 0.1
                }}
              />
              <motion.div
                className="sweet-particle"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [50, -30],
                  y: [20, -80]
                }}
                transition={{ 
                  duration: 2.5,
                  delay: 0.3
                }}
              />
            </>
          )}

          {/* Badges */}
          <div className="product-badges">
            {hasDiscount && (
              <motion.div variants={badgeVariants}>
                <Badge bg="danger" className="discount-badge pulse">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {p.discount_percent}% OFF
                  </motion.span>
                </Badge>
              </motion.div>
            )}
            {isBestSeller && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.25, type: "spring" }}
              >
                <Badge bg="warning" className="best-seller-badge">
                  <FaFire className="me-1" />
                  <motion.span
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Best Seller
                  </motion.span>
                </Badge>
              </motion.div>
            )}
            {isNew && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Badge bg="success" className="new-badge">
                  <motion.span
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    NEW
                  </motion.span>
                </Badge>
              </motion.div>
            )}
            {outOfStock && (
              <Badge bg="secondary" className="stock-badge">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <motion.div
            className="card-actions"
            initial={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: "#dc3545",
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.9 }}
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={toggleFavorite}
            >
              <motion.div
                animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <FaHeart />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: "#007bff",
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.9 }}
              className="share-btn"
              onClick={shareProduct}
            >
              <FaShare />
            </motion.button>
          </motion.div>

          {/* Quick Actions Overlay */}
          <motion.div
            className="quick-actions-overlay"
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            <div className="quick-actions-content">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="warning"
                  className="quick-view-btn"
                  as={Link}
                  to={`/product/${p.id}`}
                >
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FaEye className="me-1" />
                    Quick View
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <Card.Body className="d-flex flex-column p-4">
          {/* Category & Supplier */}
          <div className="product-meta mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge bg="light" text="dark" className="category-badge">
                  {p.category || "Traditional Sweet"}
                </Badge>
              </motion.div>
              {p.supplier_name && (
                <motion.small 
                  className="supplier-name text-muted"
                  whileHover={{ scale: 1.05 }}
                >
                  by {p.supplier_name}
                </motion.small>
              )}
            </div>
          </div>

          {/* Product Name */}
          <Card.Title className="product-name h5 mb-2">
            <Link
              to={`/product/${p.id}`}
              className="text-decoration-none text-dark"
            >
              <motion.span
                whileHover={{ color: "#FF8C00" }}
                transition={{ duration: 0.3 }}
              >
                {p.name}
              </motion.span>
            </Link>
          </Card.Title>

          {/* Rating */}
          <div className="product-rating mb-2">
            <div className="stars d-flex align-items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaStar
                    className={`${star <= 4 ? "text-warning" : "text-muted"} me-1`}
                    size={16}
                  />
                </motion.div>
              ))}
              <motion.small 
                className="rating-count text-muted ms-2"
                whileHover={{ scale: 1.1 }}
              >
                (42)
              </motion.small>
            </div>
          </div>

          {/* Description */}
          <div className="product-description-preview mb-3">
            <motion.small 
              className="text-muted"
              whileHover={{ color: "#D2691E" }}
            >
              {p.description && p.description.length > 60
                ? `${p.description.substring(0, 60)}...`
                : p.description ||
                  "Authentic Sri Lankan sweet made with traditional recipes"}
            </motion.small>
          </div>

          {/* Price */}
          <div className="price-section mb-3">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <motion.span
                className="current-price fw-bold text-warning h4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
              >
                LKR {displayPrice.toFixed(2)}
              </motion.span>

              {hasDiscount && p.sell_price && (
                <motion.span 
                  className="original-price text-muted text-decoration-line-through h6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  LKR {parseFloat(p.sell_price).toFixed(2)}
                </motion.span>
              )}
            </div>

            {hasDiscount && (
              <motion.div
                className="savings-badge mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge bg="success" className="savings-text">
                  <FaShoppingCart className="me-1" />
                  Save LKR {savingsAmount}
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Stock Status */}
          <div className="stock-status mb-3">
            <div className="d-flex align-items-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <StatusIcon
                  size={16}
                  className={`text-${stockStatus.color} me-2`}
                />
              </motion.div>
              <small className={`text-${stockStatus.color} fw-semibold`}>
                {stockStatus.text}
              </small>
            </div>
          </div>

          {/* Action Button */}
          <div className="action-buttons mt-auto">
            <div className="d-flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-grow-1"
              >
                <Link
                  to={`/product/${p.id}`}
                  className="btn btn-outline-primary view-details-btn w-100"
                >
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaEye className="me-2" />
                    View Details
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Features */}
          <div className="product-features mt-3 pt-3 border-top">
            <div className="d-flex justify-content-around text-center">
              <motion.div 
                className="feature" 
                whileHover={{ 
                  scale: 1.2,
                  y: -5,
                  transition: { type: "spring", stiffness: 400 }
                }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaLeaf size={18} className="text-success mb-1" />
                </motion.div>
                <small className="d-block feature-label">Natural</small>
              </motion.div>
              <motion.div 
                className="feature"
                whileHover={{ 
                  scale: 1.2,
                  y: -5,
                  transition: { type: "spring", stiffness: 400 }
                }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <FaAward size={18} className="text-warning mb-1" />
                </motion.div>
                <small className="d-block feature-label">Premium</small>
              </motion.div>
              <motion.div 
                className="feature"
                whileHover={{ 
                  scale: 1.2,
                  y: -5,
                  transition: { type: "spring", stiffness: 400 }
                }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FaFire size={18} className="text-danger mb-1" />
                </motion.div>
                <small className="d-block feature-label">Fresh</small>
              </motion.div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default ProductCard;