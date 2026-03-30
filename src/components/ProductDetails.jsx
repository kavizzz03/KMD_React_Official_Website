import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container, Row, Col, Button, Badge, Spinner,
  Modal, Table, Alert, Card, Form, Pagination
} from "react-bootstrap";
import {
  FaHeart, FaHeartBroken, FaShoppingBag, FaStar,
  FaShare, FaFacebook, FaWhatsapp, FaTwitter,
  FaEnvelope, FaCheckCircle, FaTruck, FaExchangeAlt,
  FaShieldAlt, FaUndo, FaArrowLeft, FaMinus, FaPlus,
  FaRuler, FaTag, FaFire, FaClock, FaUser, FaCalendar,
  FaStarHalfAlt, FaImage,
  FaChevronLeft, FaChevronRight, FaExpand, FaInfoCircle,
  FaShoppingCart, FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { 
  addToCart, 
  addToWishlist, 
  removeFromWishlist, 
  isInWishlist,
  getItemQuantity,
  updateCartQuantity
} from "../utils/cartUtils";
import "./ProductDetails.css";

const API_BASE = "https://whats.asbfashion.com/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [cartAlertMessage, setCartAlertMessage] = useState("");
  const [cartAlertType, setCartAlertType] = useState("success");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [itemInCart, setItemInCart] = useState(false);
  const [cartItemQuantity, setCartItemQuantity] = useState(0);
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewUserName, setReviewUserName] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  
  // Stats
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  });

  useEffect(() => {
    if (id) {
      fetchProductDetails();
      fetchProductReviews();
      checkUserLikeStatus();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      checkWishlistStatus();
      checkCartStatus();
    }
  }, [product]);

  useEffect(() => {
    if (product?.category_id) {
      fetchRelatedProducts();
    }
  }, [product]);

  useEffect(() => {
    calculateReviewStats();
  }, [reviews]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/get_product_details.php?id=${id}`);
      
      if (response.data.success) {
        setProduct(response.data.product);
        setLikeCount(response.data.product.like_count || 0);
        
        if (response.data.product.sizes?.length > 0) {
          setSelectedSize(response.data.product.sizes[0]);
        }
        if (response.data.product.colors?.length > 0) {
          setSelectedColor(response.data.product.colors[0]?.name || '');
        }
      } else {
        setError("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await axios.get(`${API_BASE}/get_product_reviews.php`, {
        params: { product_id: id }
      });
      
      if (response.data.success) {
        setReviews(response.data.reviews || []);
        setTotalReviews(response.data.total || 0);
        if (response.data.average_rating) {
          setAverageRating(response.data.average_rating);
        }
        if (response.data.rating_distribution) {
          setRatingDistribution(response.data.rating_distribution);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchRelatedProducts = async () => {
    if (!product?.category_id) return;
    
    try {
      setLoadingRelated(true);
      const response = await axios.get(`${API_BASE}/get_products.php`, {
        params: { 
          category: product.category_id,
          limit: 4,
          exclude: id
        }
      });
      
      let relatedData = [];
      if (Array.isArray(response.data)) {
        relatedData = response.data;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        relatedData = response.data.products;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        relatedData = response.data.data;
      }
      
      setRelatedProducts(relatedData.filter(p => p.id.toString() !== id));
    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const checkUserLikeStatus = async () => {
    try {
      const sessionId = localStorage.getItem('session_id') || generateSessionId();
      const response = await axios.get(`${API_BASE}/check_product_like.php`, {
        params: { product_id: id, session_id: sessionId }
      });
      if (response.data.success) {
        setUserLiked(response.data.liked);
      }
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const generateSessionId = () => {
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('session_id', sessionId);
    return sessionId;
  };

  const checkWishlistStatus = () => {
    if (product?.id) {
      const inWishlist = isInWishlist(product.id);
      setIsWishlisted(inWishlist);
    }
  };

  const checkCartStatus = () => {
    if (product?.id) {
      const quantityInCart = getItemQuantity(product.id);
      setCartItemQuantity(quantityInCart);
      setItemInCart(quantityInCart > 0);
    }
  };

  const showAlert = (message, type = "success") => {
    setCartAlertMessage(message);
    setCartAlertType(type);
    setShowCartAlert(true);
    setTimeout(() => setShowCartAlert(false), 3000);
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      old_price: product.old_price,
      image: product.images?.[0]?.url || product.image_url,
      category: product.category_name,
      rating: product.rating,
      discount: product.discount_percent
    };
    
    if (isWishlisted) {
      const removed = removeFromWishlist(product.id);
      if (removed) {
        setIsWishlisted(false);
        showAlert(`${product.name} removed from wishlist`, "info");
      }
    } else {
      const added = addToWishlist(productData);
      if (added) {
        setIsWishlisted(true);
        showAlert(`${product.name} added to wishlist!`, "success");
      }
    }
  };

  const handleProductLike = async () => {
    try {
      const sessionId = localStorage.getItem('session_id') || generateSessionId();
      const response = await axios.post(`${API_BASE}/like_product.php`, {
        product_id: id,
        session_id: sessionId,
        action: userLiked ? 'unlike' : 'like'
      });
      
      if (response.data.success) {
        setUserLiked(!userLiked);
        setLikeCount(response.data.like_count);
        showAlert(userLiked ? "Removed like" : "Liked this product!", "success");
      }
    } catch (error) {
      console.error("Error liking product:", error);
      showAlert("Failed to process like", "error");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      showAlert("Please write a review", "warning");
      return;
    }
    
    if (!reviewUserName.trim()) {
      showAlert("Please enter your name", "warning");
      return;
    }
    
    try {
      setSubmittingReview(true);
      const sessionId = localStorage.getItem('session_id') || generateSessionId();
      
      const reviewData = {
        product_id: id,
        user_name: reviewUserName,
        rating: reviewRating,
        review: reviewText,
        session_id: sessionId
      };
      
      const response = await axios.post(`${API_BASE}/submit_review.php`, reviewData);
      
      if (response.data.success) {
        showAlert("Thank you for your review!", "success");
        setShowReviewModal(false);
        setReviewText("");
        setReviewUserName("");
        setReviewRating(5);
        fetchProductReviews();
      } else {
        showAlert(response.data.message || "Failed to submit review", "error");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showAlert("Failed to submit review. Please try again.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const calculateReviewStats = () => {
    if (reviews.length === 0) return;
    
    const total = reviews.length;
    const avg = reviews.reduce((sum, rev) => sum + rev.rating, 0) / total;
    setAverageRating(avg);
    setTotalReviews(total);
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (distribution[review.rating] !== undefined) {
        distribution[review.rating]++;
      }
    });
    setRatingDistribution(distribution);
  };

  const getFilteredReviews = () => {
    if (reviewFilter === "all") return reviews;
    return reviews.filter(review => review.rating === parseInt(reviewFilter));
  };

  const getPaginatedReviews = () => {
    const filtered = getFilteredReviews();
    const startIndex = (currentReviewPage - 1) * reviewsPerPage;
    return filtered.slice(startIndex, startIndex + reviewsPerPage);
  };

  const getTotalPages = () => {
    const filtered = getFilteredReviews();
    return Math.ceil(filtered.length / reviewsPerPage);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes?.length > 0 && !selectedSize) {
      showAlert("Please select a size", "warning");
      return;
    }
    
    if (product.colors?.length > 0 && !selectedColor) {
      showAlert("Please select a color", "warning");
      return;
    }
    
    if (quantity > (product.stock_quantity || 999)) {
      showAlert(`Only ${product.stock_quantity} items available in stock`, "warning");
      return;
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
      image: product.images?.[0]?.url || product.image_url || '/images/placeholder.jpg',
      maxQuantity: product.stock_quantity,
      category: product.category_name
    };
    
    const added = addToCart(cartItem);
    
    if (added) {
      checkCartStatus();
      showAlert(`${product.name} added to cart!`, "success");
    } else {
      showAlert("Failed to add to cart", "error");
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/cart'), 500);
  };

  const handleUpdateCartQuantity = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > (product.stock_quantity || 999)) {
      showAlert(`Only ${product.stock_quantity} items available`, "warning");
      return;
    }
    
    const updated = updateCartQuantity(product.id, newQuantity);
    if (updated) {
      setQuantity(newQuantity);
      checkCartStatus();
      showAlert(`Quantity updated to ${newQuantity}`, "success");
    }
  };

  const calculateDiscount = () => {
    if (product?.old_price && product?.old_price > product?.price) {
      return Math.round(((product.old_price - product.price) / product.old_price) * 100);
    }
    return 0;
  };

  const getStockStatus = () => {
    if (!product) return 'out';
    if (product.stock_quantity > 10) return 'high';
    if (product.stock_quantity > 0) return 'low';
    return 'out';
  };

  const handleImageNavigation = (direction) => {
    if (!product?.images?.length) return;
    
    if (direction === 'next') {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    } else {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const openFullImage = (index) => {
    setCurrentImageIndex(index);
    setShowFullImage(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullImage = () => {
    setShowFullImage(false);
    document.body.style.overflow = 'auto';
  };

  const navigateFullImage = (direction) => {
    if (!product?.images?.length) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const renderStars = (rating, size = "sm") => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className={`text-warning ${size === "lg" ? "fs-5" : "fs-6"}`} />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-warning" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} className="text-muted" />
        ))}
      </>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showFullImage) {
        if (e.key === 'ArrowLeft') {
          navigateFullImage('prev');
        } else if (e.key === 'ArrowRight') {
          navigateFullImage('next');
        } else if (e.key === 'Escape') {
          closeFullImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullImage, currentImageIndex]);

  if (loading) {
    return (
      <div className="product-loading">
        <Spinner animation="border" variant="danger" />
        <p className="mt-3">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5 text-center">
        <div className="error-container py-5">
          <h3>{error || "Product not found"}</h3>
          <p className="text-muted mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button variant="danger" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </Container>
    );
  }

  const discount = calculateDiscount();
  const stockStatus = getStockStatus();
  const isOutOfStock = stockStatus === 'out';
  const paginatedReviews = getPaginatedReviews();
  const totalPages = getTotalPages();

  return (
    <>
      {/* Cart Alert */}
      <AnimatePresence>
        {showCartAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="cart-alert-wrapper"
          >
            <Alert variant={cartAlertType === "success" ? "success" : cartAlertType === "warning" ? "warning" : "danger"} className="cart-alert">
              {cartAlertType === "success" && <FaCheckCircle className="me-2" />}
              {cartAlertType === "warning" && <FaInfoCircle className="me-2" />}
              {cartAlertType === "error" && <FaHeartBroken className="me-2" />}
              {cartAlertMessage}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="product-details-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container className="py-4">
          {/* Breadcrumb */}
          <div className="breadcrumb-nav mb-4">
            <Button variant="link" onClick={() => navigate(-1)} className="back-btn">
              <FaArrowLeft className="me-2" /> Back
            </Button>
            <span className="mx-2 text-muted">/</span>
            <span className="text-muted">{product.category_name || 'Category'}</span>
            <span className="mx-2 text-muted">/</span>
            <span className="fw-bold text-truncate" style={{ maxWidth: '300px' }}>
              {product.name}
            </span>
          </div>

          <Row className="g-5">
            {/* Product Images Column */}
            <Col lg={6}>
              <div className="product-gallery">
                <div className="main-image-container mb-3">
                  {product.images?.length > 0 ? (
                    <>
                      <motion.img
                        key={selectedImage}
                        src={product.images[selectedImage]?.url || product.image_url || '/images/placeholder.jpg'}
                        alt={product.name}
                        className="main-product-image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => openFullImage(selectedImage)}
                        style={{ cursor: 'pointer' }}
                      />
                      
                      {product.images.length > 1 && (
                        <>
                          <button 
                            className="image-nav-btn prev-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageNavigation('prev');
                            }}
                          >
                            <FaChevronLeft />
                          </button>
                          <button 
                            className="image-nav-btn next-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageNavigation('next');
                            }}
                          >
                            <FaChevronRight />
                          </button>
                        </>
                      )}

                      <button 
                        className="expand-btn"
                        onClick={() => openFullImage(selectedImage)}
                      >
                        <FaExpand />
                      </button>
                    </>
                  ) : (
                    <div className="no-image-placeholder" onClick={() => openFullImage(0)}>
                      <FaImage className="placeholder-icon" />
                      <p>No Image Available</p>
                    </div>
                  )}
                  
                  {discount > 0 && (
                    <Badge bg="danger" className="discount-badge">
                      -{discount}% OFF
                    </Badge>
                  )}
                  
                  {product.is_new_arrival && (
                    <Badge bg="success" className="new-badge">
                      New Arrival
                    </Badge>
                  )}
                  
                  {product.is_trending && (
                    <Badge bg="warning" text="dark" className="trending-badge">
                      <FaFire /> Trending
                    </Badge>
                  )}

                  {stockStatus === 'low' && (
                    <Badge bg="warning" text="dark" className="stock-badge low-stock">
                      Only {product.stock_quantity} left
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <Badge bg="secondary" className="stock-badge out-of-stock">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {product.images?.length > 1 && (
                  <div className="thumbnail-carousel">
                    <Row className="g-2">
                      {product.images.map((image, index) => (
                        <Col xs={3} key={index}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                            onClick={() => setSelectedImage(index)}
                          >
                            <img 
                              src={image.url} 
                              alt={`${product.name} ${index + 1}`}
                              onError={(e) => {
                                e.target.src = '/images/placeholder.jpg';
                              }}
                            />
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {product.images?.length > 1 && (
                  <div className="image-counter">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}
              </div>
            </Col>

            {/* Product Info Column */}
            <Col lg={6}>
              <div className="product-info">
                <div className="product-meta mb-3">
                  {product.brand && (
                    <Badge bg="light" text="dark" className="me-2 py-2 px-3">
                      <FaTag className="me-1" /> {product.brand}
                    </Badge>
                  )}
                  {product.category_name && (
                    <Badge bg="light" text="dark" className="py-2 px-3">
                      {product.category_name}
                    </Badge>
                  )}
                </div>

                <h1 className="product-title fw-bold mb-3">
                  {product.name}
                </h1>

                <div className="product-rating mb-3">
                  <div className="stars">
                    {renderStars(averageRating || product.rating || 0, "lg")}
                  </div>
                  <span className="rating-count ms-2">
                    ({totalReviews || product.review_count || 0} reviews)
                  </span>
                  <Button 
                    variant="link" 
                    className="like-button ms-3 p-0"
                    onClick={handleProductLike}
                  >
                    {userLiked ? (
                      <FaHeart className="text-danger me-1" />
                    ) : (
                      <FaHeartBroken className="text-muted me-1" />
                    )}
                    <span>{likeCount}</span>
                  </Button>
                </div>

                <div className="product-price mb-4">
                  {product.old_price ? (
                    <>
                      <span className="current-price display-5 fw-bold text-danger">
                        LKR {product.price?.toLocaleString()}
                      </span>
                      <span className="old-price ms-3 text-muted text-decoration-line-through">
                        LKR {product.old_price?.toLocaleString()}
                      </span>
                      <Badge bg="success" className="ms-3 save-badge">
                        Save LKR {(product.old_price - product.price).toLocaleString()}
                      </Badge>
                    </>
                  ) : (
                    <span className="current-price display-5 fw-bold">
                      LKR {product.price?.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                {product.description && (
                  <div className="product-description mb-4">
                    <h6 className="fw-bold mb-2">Description</h6>
                    <p className="text-muted">
                      {product.description.length > 200 
                        ? `${product.description.substring(0, 200)}...` 
                        : product.description}
                    </p>
                  </div>
                )}

                {/* Size Selection */}
                {product.sizes?.length > 0 && (
                  <div className="size-selection mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">Select Size <span className="text-danger">*</span></h6>
                      <Button 
                        variant="link" 
                        className="size-guide-link p-0"
                        onClick={() => setShowSizeGuide(true)}
                      >
                        <FaRuler className="me-1" /> Size Guide
                      </Button>
                    </div>
                    <div className="size-options">
                      {product.sizes.map((size) => (
                        <motion.button
                          key={size}
                          className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                          onClick={() => setSelectedSize(size)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isOutOfStock}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors?.length > 0 && (
                  <div className="color-selection mb-4">
                    <h6 className="fw-bold mb-2">Select Color <span className="text-danger">*</span></h6>
                    <div className="color-options">
                      {product.colors.map((color, index) => (
                        <motion.button
                          key={index}
                          className={`color-btn ${selectedColor === color.name ? 'active' : ''}`}
                          style={{ backgroundColor: color.code || '#ccc' }}
                          onClick={() => setSelectedColor(color.name)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title={color.name}
                          disabled={isOutOfStock}
                        />
                      ))}
                    </div>
                    {selectedColor && (
                      <span className="selected-color-name ms-2 text-muted">
                        Selected: {selectedColor}
                      </span>
                    )}
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="quantity-selection mb-4">
                  <h6 className="fw-bold mb-2">Quantity</h6>
                  {itemInCart ? (
                    <div className="cart-quantity-controls">
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          onClick={() => handleUpdateCartQuantity(cartItemQuantity - 1)}
                          disabled={cartItemQuantity <= 1}
                          className="quantity-btn"
                        >
                          <FaMinus />
                        </Button>
                        <span className="quantity-display mx-3 fw-bold">
                          {cartItemQuantity} in cart
                        </span>
                        <Button
                          variant="outline-secondary"
                          onClick={() => handleUpdateCartQuantity(cartItemQuantity + 1)}
                          disabled={cartItemQuantity >= (product.stock_quantity || 999) || isOutOfStock}
                          className="quantity-btn"
                        >
                          <FaPlus />
                        </Button>
                      </div>
                      <Button 
                        variant="link" 
                        className="view-cart-link mt-2"
                        onClick={() => navigate('/cart')}
                      >
                        View Cart <FaArrowLeft className="rotate-180 ms-1" />
                      </Button>
                    </div>
                  ) : (
                    <div className="quantity-controls d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || isOutOfStock}
                        className="quantity-btn"
                      >
                        <FaMinus />
                      </Button>
                      <span className="quantity-display mx-3 fw-bold">{quantity}</span>
                      <Button
                        variant="outline-secondary"
                        onClick={() => setQuantity(Math.min(quantity + 1, product.stock_quantity || 999))}
                        disabled={quantity >= (product.stock_quantity || 999) || isOutOfStock}
                        className="quantity-btn"
                      >
                        <FaPlus />
                      </Button>
                      <span className="stock-status ms-3">
                        {stockStatus === 'high' && (
                          <><FaCheckCircle className="text-success me-1" /> In Stock</>
                        )}
                        {stockStatus === 'low' && (
                          <><FaClock className="text-warning me-1" /> Only {product.stock_quantity} left</>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="action-buttons mb-4">
                  <Row className="g-2">
                    <Col md={7}>
                      <Button
                        variant="danger"
                        size="lg"
                        className="w-100 add-to-cart-btn"
                        onClick={itemInCart ? () => navigate('/cart') : handleAddToCart}
                        disabled={isOutOfStock}
                      >
                        {itemInCart ? (
                          <><FaShoppingCart className="me-2" /> View in Cart</>
                        ) : (
                          <><FaShoppingBag className="me-2" /> Add to Cart</>
                        )}
                      </Button>
                    </Col>
                    <Col md={5}>
                      <Button
                        variant="outline-danger"
                        size="lg"
                        className="w-100 buy-now-btn"
                        onClick={handleBuyNow}
                        disabled={isOutOfStock}
                      >
                        Buy Now
                      </Button>
                    </Col>
                  </Row>
                </div>

                {/* Wishlist Button */}
                <div className="wishlist-section mb-4">
                  <Button
                    variant={isWishlisted ? "danger" : "outline-secondary"}
                    className="w-100 wishlist-btn"
                    onClick={handleWishlistToggle}
                  >
                    {isWishlisted ? (
                      <><FaHeart className="me-2" /> Added to Wishlist</>
                    ) : (
                      <><FaHeartBroken className="me-2" /> Add to Wishlist</>
                    )}
                  </Button>
                </div>

                {/* Product Features */}
                <div className="product-features mb-4">
                  <Row className="g-2">
                    <Col sm={6}>
                      <div className="feature-item">
                        <FaTruck className="feature-icon" />
                        <div>
                          <h6>Free Shipping</h6>
                          <small>On orders over LKR 5000</small>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="feature-item">
                        <FaExchangeAlt className="feature-icon" />
                        <div>
                          <h6>Easy Returns</h6>
                          <small>7-day return policy</small>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="feature-item">
                        <FaShieldAlt className="feature-icon" />
                        <div>
                          <h6>Secure Payment</h6>
                          <small>100% secure checkout</small>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="feature-item">
                        <FaUndo className="feature-icon" />
                        <div>
                          <h6>Size Exchange</h6>
                          <small>Within 7 days</small>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Share Button */}
                <div className="share-section">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowShareModal(true)}
                    className="w-100"
                  >
                    <FaShare className="me-2" /> Share this product
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Product Details Tabs */}
          <Row className="mt-5">
            <Col xs={12}>
              <div className="product-tabs">
                <div className="tabs-header">
                  <button
                    className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
                    onClick={() => setActiveTab("description")}
                  >
                    Description
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
                    onClick={() => setActiveTab("details")}
                  >
                    Product Details
                  </button>
                  <button
                    className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    Reviews ({totalReviews})
                  </button>
                </div>
                <div className="tab-content">
                  {activeTab === "description" && (
                    <div className="description-content">
                      <p>{product.description || "No description available."}</p>
                    </div>
                  )}
                  {activeTab === "details" && (
                    <div className="details-content">
                      <Table bordered>
                        <tbody>
                          <tr>
                            <td className="fw-bold">Product Name</td>
                            <td>{product.name}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Category</td>
                            <td>{product.category_name || "N/A"}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Brand</td>
                            <td>{product.brand || "N/A"}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Price</td>
                            <td>LKR {product.price?.toLocaleString()}</td>
                          </tr>
                          {product.old_price && (
                            <tr>
                              <td className="fw-bold">Original Price</td>
                              <td className="text-decoration-line-through">LKR {product.old_price?.toLocaleString()}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="fw-bold">Availability</td>
                            <td>
                              {isOutOfStock ? (
                                <span className="text-danger">Out of Stock</span>
                              ) : (
                                <span className="text-success">In Stock ({product.stock_quantity} items)</span>
                              )}
                            </td>
                          </tr>
                          {product.sizes?.length > 0 && (
                            <tr>
                              <td className="fw-bold">Available Sizes</td>
                              <td>{product.sizes.join(", ")}</td>
                            </tr>
                          )}
                          {product.colors?.length > 0 && (
                            <tr>
                              <td className="fw-bold">Available Colors</td>
                              <td>{product.colors.map(c => c.name).join(", ")}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="fw-bold">SKU</td>
                            <td>{product.sku || "N/A"}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  )}
                  {activeTab === "reviews" && (
                    <div className="reviews-content">
                      {/* Rating Summary */}
                      <div className="rating-summary mb-4">
                        <Row>
                          <Col md={4} className="text-center">
                            <div className="average-rating">
                              <span className="display-4 fw-bold">{averageRating.toFixed(1)}</span>
                              <div className="stars mt-2">
                                {renderStars(averageRating, "lg")}
                              </div>
                              <span className="text-muted">Based on {totalReviews} reviews</span>
                            </div>
                          </Col>
                          <Col md={8}>
                            <div className="rating-distribution">
                              {[5, 4, 3, 2, 1].map(rating => (
                                <div key={rating} className="rating-bar-item mb-2">
                                  <span className="rating-label me-2">{rating} ★</span>
                                  <div className="progress flex-grow-1">
                                    <div 
                                      className="progress-bar bg-warning" 
                                      style={{ 
                                        width: `${totalReviews > 0 ? (ratingDistribution[rating] / totalReviews) * 100 : 0}%` 
                                      }}
                                    />
                                  </div>
                                  <span className="rating-count ms-2">{ratingDistribution[rating]}</span>
                                </div>
                              ))}
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {/* Write Review Button */}
                      <div className="write-review-section mb-4">
                        <Button 
                          variant="danger" 
                          onClick={() => setShowReviewModal(true)}
                          className="write-review-btn"
                        >
                          Write a Review
                        </Button>
                      </div>

                      {/* Review Filters */}
                      <div className="review-filters mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="filter-buttons">
                            <Button 
                              variant={reviewFilter === "all" ? "danger" : "outline-secondary"}
                              size="sm"
                              onClick={() => {
                                setReviewFilter("all");
                                setCurrentReviewPage(1);
                              }}
                              className="me-2"
                            >
                              All ({totalReviews})
                            </Button>
                            {[5, 4, 3, 2, 1].map(rating => (
                              <Button 
                                key={rating}
                                variant={reviewFilter === rating.toString() ? "danger" : "outline-secondary"}
                                size="sm"
                                onClick={() => {
                                  setReviewFilter(rating.toString());
                                  setCurrentReviewPage(1);
                                }}
                                className="me-2"
                              >
                                {rating} ★ ({ratingDistribution[rating]})
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Reviews List */}
                      {loadingReviews ? (
                        <div className="text-center py-5">
                          <Spinner animation="border" variant="danger" />
                        </div>
                      ) : paginatedReviews.length > 0 ? (
                        <>
                          {paginatedReviews.map((review, index) => (
                            <motion.div
                              key={review.id || index}
                              className="review-card mb-3 p-3 border rounded"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="reviewer-info">
                                  <div className="d-flex align-items-center">
                                    <FaUser className="text-muted me-2" />
                                    <strong className="reviewer-name">{review.user_name || "Anonymous"}</strong>
                                    {review.is_verified_purchase && (
                                      <Badge bg="success" className="ms-2 verified-badge">
                                        <FaCheckCircle className="me-1" /> Verified Purchase
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="stars mt-1">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                                <div className="review-date text-muted small">
                                  <FaCalendar className="me-1" />
                                  {formatDate(review.created_at)}
                                </div>
                              </div>
                              <p className="review-text mt-2 mb-0">
                                {review.review}
                              </p>
                            </motion.div>
                          ))}

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="pagination-wrapper mt-4">
                              <Pagination>
                                <Pagination.Prev 
                                  onClick={() => setCurrentReviewPage(prev => Math.max(1, prev - 1))}
                                  disabled={currentReviewPage === 1}
                                />
                                {[...Array(totalPages)].map((_, i) => (
                                  <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentReviewPage}
                                    onClick={() => setCurrentReviewPage(i + 1)}
                                  >
                                    {i + 1}
                                  </Pagination.Item>
                                ))}
                                <Pagination.Next 
                                  onClick={() => setCurrentReviewPage(prev => Math.min(totalPages, prev + 1))}
                                  disabled={currentReviewPage === totalPages}
                                />
                              </Pagination>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-5">
                          <p className="text-muted">No reviews yet. Be the first to review this product!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <Row className="mt-5">
              <Col xs={12}>
                <h3 className="fw-bold mb-4">You May Also Like</h3>
                <Row className="g-4">
                  {relatedProducts.map((relatedProduct) => (
                    <Col key={relatedProduct.id} xs={6} md={3}>
                      <Card className="related-product-card h-100" onClick={() => navigate(`/product/${relatedProduct.id}`)}>
                        <div className="related-product-image">
                          <Card.Img 
                            variant="top" 
                            src={relatedProduct.images?.[0]?.url || relatedProduct.image_url || '/images/placeholder.jpg'} 
                            alt={relatedProduct.name}
                          />
                        </div>
                        <Card.Body>
                          <Card.Title className="h6 text-truncate">{relatedProduct.name}</Card.Title>
                          <div className="product-price">
                            <span className="fw-bold text-danger">LKR {relatedProduct.price?.toLocaleString()}</span>
                            {relatedProduct.old_price && (
                              <span className="text-muted text-decoration-line-through ms-2 small">
                                LKR {relatedProduct.old_price?.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="product-rating small mt-1">
                            {renderStars(relatedProduct.rating || 0)}
                            <span className="text-muted ms-1">({relatedProduct.review_count || 0})</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          )}
        </Container>
      </motion.div>

      {/* Full Screen Image Viewer Modal */}
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
              
              {product?.images?.length > 1 && (
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
                <div className="viewer-image-container">
                  <motion.img
                    key={currentImageIndex}
                    src={product?.images?.[currentImageIndex]?.url || product?.image_url || '/images/placeholder.jpg'}
                    alt={`${product.name} - Full View`}
                    className="viewer-image-full"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    draggable={false}
                  />
                </div>
              </div>
              
              {product?.images?.length > 1 && (
                <>
                  <div className="viewer-counter">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                  <div className="viewer-thumbnails">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className={`viewer-thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={image.url} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Your Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={reviewUserName}
                onChange={(e) => setReviewUserName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rating <span className="text-danger">*</span></Form.Label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`rating-star ${star <= reviewRating ? 'text-warning' : 'text-muted'}`}
                    onClick={() => setReviewRating(star)}
                    style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '0.5rem' }}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Review <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </Form.Group>

            <div className="text-muted small mb-3">
              <FaInfoCircle className="me-1" />
              Your review will be visible to other customers. Please be honest and helpful.
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleSubmitReview}
            disabled={submittingReview}
          >
            {submittingReview ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Share Modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Share this product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="share-options">
            <Button 
              variant="outline-primary" 
              className="w-100 mb-2"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className="me-2" /> Share on Facebook
            </Button>
            <Button 
              variant="outline-success" 
              className="w-100 mb-2"
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(product.name + ' - ' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="me-2" /> Share on WhatsApp
            </Button>
            <Button 
              variant="outline-info" 
              className="w-100 mb-2"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.name)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="me-2" /> Share on Twitter
            </Button>
            <Button 
              variant="outline-secondary" 
              className="w-100"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showAlert("Link copied to clipboard!", "success");
              }}
            >
              <FaEnvelope className="me-2" /> Copy Link
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Size Guide Modal */}
      <Modal show={showSizeGuide} onHide={() => setShowSizeGuide(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Size Guide</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img 
            src="/images/size-guide.jpg" 
            alt="Size Guide" 
            className="img-fluid mb-4"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
            }}
          />
          <Table bordered className="size-guide-table">
            <thead className="table-light">
              <tr>
                <th>Size</th>
                <th>Chest (inches)</th>
                <th>Waist (inches)</th>
                <th>Hip (inches)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>XS</strong></td>
                <td>32-34</td>
                <td>26-28</td>
                <td>34-36</td>
              </tr>
              <tr>
                <td><strong>S</strong></td>
                <td>34-36</td>
                <td>28-30</td>
                <td>36-38</td>
              </tr>
              <tr>
                <td><strong>M</strong></td>
                <td>36-38</td>
                <td>30-32</td>
                <td>38-40</td>
              </tr>
              <tr>
                <td><strong>L</strong></td>
                <td>38-40</td>
                <td>32-34</td>
                <td>40-42</td>
              </tr>
              <tr>
                <td><strong>XL</strong></td>
                <td>40-42</td>
                <td>34-36</td>
                <td>42-44</td>
              </tr>
              <tr>
                <td><strong>XXL</strong></td>
                <td>42-44</td>
                <td>36-38</td>
                <td>44-46</td>
              </tr>
            </tbody>
          </Table>
          <p className="text-muted small mt-3">
            <FaInfoCircle className="me-1" /> 
            Measurements may vary slightly between different styles and fabrics.
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductDetails;