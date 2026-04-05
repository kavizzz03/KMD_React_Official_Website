import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spinner,
  Button,
  Badge,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingCart,
  FaHeart,
  FaShare,
  FaStar,
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTruck,
  FaShieldAlt,
  FaRecycle,
  FaCheckCircle,
  FaUtensils,
  FaWhatsapp,
  FaClock,
  FaLeaf,
  FaAward,
  FaShippingFast,
  FaPlus,
  FaMinus,
  FaEye,
} from "react-icons/fa";
import "./ProductDetails.css";

const API_BASE = "https://kmd.cpsharetxt.com/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [imageZoom, setImageZoom] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE}/get_product.php`, { 
          params: { id } 
        });
        
        if (response.data) {
          setProduct({
            ...response.data,
            additional_images: [
              response.data.image_url,
              response.data.image_url,
              response.data.image_url,
            ],
            features: [
              "Traditional Recipe",
              "Fresh Daily",
              "Natural Ingredients",
              "Quality Guaranteed"
            ],
            nutrition: {
              calories: "180-220",
              serving: "100g",
              preservatives: "No"
            }
          });
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const outOfStock = !product || product.status === "out_of_stock" || product.stock_quantity <= 0;

  // ✅ FIXED: Correct price calculation for cart
  const getProductPrice = () => {
    if (!product) return 0;
    
    // Use discounted_price if available and valid, otherwise use sell_price
    if (product.discounted_price && product.discounted_price > 0) {
      return parseFloat(product.discounted_price);
    }
    return parseFloat(product.sell_price);
  };

  // ✅ FIXED: Add to Cart Function with correct price handling
  const handleAddToCart = () => {
    if (!product) return;

    const productPrice = getProductPrice();
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
      // Update existing item
      cart[existingItemIndex].quantity += quantity;
      cart[existingItemIndex].totalPrice = cart[existingItemIndex].quantity * productPrice;
    } else {
      // Add new item
      cart.push({
        id: product.id,
        name: product.name,
        image_url: product.image_url,
        price: productPrice, // ✅ Fixed: Using calculated price
        quantity: quantity,
        totalPrice: productPrice * quantity, // ✅ Fixed: Calculate total price
        maxStock: product.stock_quantity,
        hasDiscount: product.discount_percent > 0,
        originalPrice: product.sell_price ? parseFloat(product.sell_price) : productPrice
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate("/cart"), 500);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const shareProduct = async () => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Product link copied to clipboard!");
      }
    } catch (err) {
      console.log("Error sharing:", err);
    }
  };

  const handleCallSupplier = () => {
    window.open(`tel:${product.contact_phone || "+94777189893"}`);
  };

  const handleWhatsApp = () => {
    const productPrice = getProductPrice();
    const message = `Hi! I'm interested in ${product.name} - LKR ${productPrice.toFixed(2)}`;
    window.open(`https://wa.me/94777189893?text=${encodeURIComponent(message)}`);
  };

  // ✅ FIXED: Display price correctly in UI
  const displayPrice = getProductPrice();

  if (loading) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center min-vh-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FaUtensils size={60} className="text-warning mb-3" />
          </motion.div>
          <p className="h5 text-muted mt-3">Preparing sweet details...</p>
        </motion.div>
      </div>
    );
  }

  if (!product || product.status === "error") {
    return (
      <Container className="py-5 min-vh-100 d-flex align-items-center justify-content-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FaUtensils size={80} className="text-muted mb-4" />
          <h2 className="display-5 fw-bold text-dark mb-3">Sweet Not Found</h2>
          <p className="lead text-muted mb-4">
            The delicious treat you're looking for isn't available right now.
          </p>
          <Button 
            variant="warning" 
            size="lg" 
            onClick={() => navigate("/products")}
            className="px-4 py-2"
          >
            Explore Our Sweets Collection
          </Button>
        </motion.div>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="product-details-page"
    >
      {/* Back Navigation */}
      <Container>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="py-4"
        >
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(-1)}
            className="back-btn px-4 py-2"
          >
            <FaArrowLeft className="me-2" />
            Back to Products
          </Button>
        </motion.div>
      </Container>

      {/* Main Product Section */}
      <Container>
        <Row className="g-5 align-items-start">
          {/* Product Images */}
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="image-section"
            >
              <div className="main-image-container position-relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="image-wrapper"
                  onClick={() => setImageZoom(!imageZoom)}
                >
                  <img
                    src={`https://kmd.cpsharetxt.com/${product.additional_images?.[selectedImage]}`}
                    alt={product.name}
                    className={`main-product-image ${imageZoom ? 'zoomed' : ''}`}
                  />
                  <div className="zoom-indicator">
                    <FaEye size={20} />
                  </div>
                </motion.div>

                {/* Product Badges */}
                <div className="product-badges">
                  {product.discount_percent > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Badge bg="danger" className="discount-badge">
                        {product.discount_percent}% OFF
                      </Badge>
                    </motion.div>
                  )}
                  {product.is_best_seller && (
                    <Badge bg="warning" className="best-seller-badge">
                      <FaStar className="me-1" />
                      Best Seller
                    </Badge>
                  )}
                  {outOfStock ? (
                    <Badge bg="secondary" className="stock-badge">
                      Out of Stock
                    </Badge>
                  ) : (
                    <Badge bg="success" className="stock-badge">
                      In Stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="thumbnail-gallery mt-4">
                <Row className="g-3">
                  {product.additional_images.map((img, index) => (
                    <Col xs={4} key={index}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="thumbnail-wrapper"
                      >
                        <img
                          src={`https://kmd.cpsharetxt.com/${img}`}
                          alt={`${product.name} view ${index + 1}`}
                          className={`thumbnail-image ${selectedImage === index ? 'active' : ''}`}
                          onClick={() => setSelectedImage(index)}
                        />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </div>
            </motion.div>
          </Col>

          {/* Product Information */}
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="product-info-section"
            >
              {/* Category & Brand */}
              <div className="category-brand mb-3">
                <Badge bg="light" text="dark" className="category-badge">
                  {product.category || "Traditional Sweets"}
                </Badge>
                <span className="brand-text text-muted ms-2">
                  by {product.supplier_name || "KMD Sweet House"}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="product-title display-4 fw-bold text-dark mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="rating-section mb-4">
                <div className="stars d-flex align-items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`${star <= 4 ? "text-warning" : "text-light"} me-1`}
                      size={18}
                    />
                  ))}
                  <span className="rating-text text-muted ms-2">
                    (4.2 • 42 reviews)
                  </span>
                </div>
              </div>

              {/* Price Section - ✅ FIXED: Using displayPrice */}
              <div className="price-section mb-4">
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="current-price display-3 fw-bold text-warning"
                  >
                    LKR {displayPrice.toFixed(2)}
                  </motion.span>
                  
                  {product.discount_percent > 0 && product.sell_price && (
                    <>
                      <span className="original-price text-muted text-decoration-line-through h3">
                        LKR {parseFloat(product.sell_price).toFixed(2)}
                      </span>
                      <Badge bg="danger" className="savings-badge fs-6">
                        Save {product.discount_percent}%
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="stock-status mb-4">
                <Alert 
                  variant={outOfStock ? "warning" : "success"} 
                  className="d-inline-flex align-items-center py-2 px-3"
                >
                  <FaCheckCircle className="me-2" />
                  {outOfStock ? "Temporarily out of stock" : `In stock (${product.stock_quantity} available)`}
                </Alert>
              </div>

              {/* Description */}
              <p className="product-description lead text-muted mb-4">
                {product.description}
              </p>

              {/* Quantity Selector */}
              {!outOfStock && (
                <div className="quantity-section mb-4">
                  <label className="form-label fw-semibold mb-3">Quantity:</label>
                  <div className="quantity-controls d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <FaMinus />
                    </Button>
                    <span className="quantity-display mx-3 fw-bold fs-4">
                      {quantity}
                    </span>
                    <Button
                      variant="outline-secondary"
                      className="quantity-btn"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.stock_quantity}
                    >
                      <FaPlus />
                    </Button>
                    <span className="stock-text text-muted ms-3">
                      Max: {product.stock_quantity}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons mb-4">
                <Row className="g-3">
                  <Col md={6}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="warning"
                        size="lg"
                        className="w-100 add-to-cart-btn py-3"
                        disabled={outOfStock}
                        onClick={handleAddToCart}
                      >
                        <FaShoppingCart className="me-2" />
                        Add to Cart
                      </Button>
                    </motion.div>
                  </Col>
                  <Col md={6}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-100 buy-now-btn py-3"
                        disabled={outOfStock}
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </Button>
                    </motion.div>
                  </Col>
                </Row>

                {/* Secondary Actions */}
                <Row className="g-2 mt-3">
                  <Col>
                    <Button
                      variant="outline-secondary"
                      className="w-100 action-secondary-btn"
                      onClick={toggleFavorite}
                    >
                      <FaHeart className={isFavorite ? "text-danger me-2" : "me-2"} />
                      {isFavorite ? "Favorited" : "Add to Favorites"}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-secondary"
                      className="w-100 action-secondary-btn"
                      onClick={shareProduct}
                    >
                      <FaShare className="me-2" />
                      Share
                    </Button>
                  </Col>
                </Row>
              </div>

              {/* Features Highlights */}
              <Card className="features-highlight mb-4">
                <Card.Body>
                  <Row className="g-4 text-center">
                    <Col xs={6} md={3}>
                      <div className="feature-item">
                        <FaLeaf className="text-success mb-2 fs-3" />
                        <div className="small fw-semibold">Natural</div>
                      </div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="feature-item">
                        <FaShippingFast className="text-primary mb-2 fs-3" />
                        <div className="small fw-semibold">Fast Delivery</div>
                      </div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="feature-item">
                        <FaShieldAlt className="text-warning mb-2 fs-3" />
                        <div className="small fw-semibold">Quality</div>
                      </div>
                    </Col>
                    <Col xs={6} md={3}>
                      <div className="feature-item">
                        <FaAward className="text-info mb-2 fs-3" />
                        <div className="small fw-semibold">Traditional</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="product-tabs-section mt-5"
        >
          <Card className="details-card">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="details-tabs"
                fill
              >
                <Tab eventKey="description" title="Description">
                  <div className="tab-content p-4">
                    <h4 className="mb-3">About This Sweet</h4>
                    <p className="lead">{product.description}</p>
                    <Row className="mt-4">
                      <Col md={6}>
                        <h5>Features</h5>
                        <ul className="features-list">
                          {product.features?.map((feature, index) => (
                            <li key={index} className="d-flex align-items-center mb-2">
                              <FaCheckCircle className="text-success me-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h5>Nutrition Info</h5>
                        <div className="nutrition-info">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Calories:</span>
                            <strong>{product.nutrition?.calories}</strong>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Serving Size:</span>
                            <strong>{product.nutrition?.serving}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Preservatives:</span>
                            <strong className="text-success">{product.nutrition?.preservatives}</strong>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="supplier" title="Supplier Info">
                  <div className="tab-content p-4">
                    <Row>
                      <Col md={6}>
                        <h4 className="mb-4">{product.supplier_name || "KMD Sweet House"}</h4>
                        <div className="supplier-details">
                          <p className="d-flex align-items-center mb-3">
                            <FaPhone className="text-muted me-3 fs-5" />
                            <a href={`tel:${product.contact_phone || "+94777189893"}`} className="text-decoration-none">
                              {product.contact_phone || "+94 777189893"}
                            </a>
                          </p>
                          {product.contact_email && (
                            <p className="d-flex align-items-center mb-3">
                              <FaEnvelope className="text-muted me-3 fs-5" />
                              <a href={`mailto:${product.contact_email}`} className="text-decoration-none">
                                {product.contact_email}
                              </a>
                            </p>
                          )}
                          {product.address && (
                            <p className="d-flex align-items-center mb-3">
                              <FaMapMarkerAlt className="text-muted me-3 fs-5" />
                              {product.address}
                            </p>
                          )}
                          <p className="d-flex align-items-center mb-0">
                            <FaClock className="text-muted me-3 fs-5" />
                            Open: 7:00 AM - 8:00 PM
                          </p>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="supplier-actions text-center">
                          <h5 className="mb-4">Contact Supplier</h5>
                          <div className="d-flex flex-column gap-3">
                            <Button 
                              variant="primary" 
                              size="lg"
                              onClick={handleCallSupplier}
                              className="px-4"
                            >
                              <FaPhone className="me-2" />
                              Call Now
                            </Button>
                            <Button 
                              variant="success" 
                              size="lg"
                              onClick={handleWhatsApp}
                              className="px-4"
                            >
                              <FaWhatsapp className="me-2" />
                              WhatsApp
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </motion.section>
      </Container>

      {/* Success Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="success-toast"
          >
            <div className="toast-content d-flex align-items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaCheckCircle className="text-success me-3 fs-2" />
              </motion.div>
              <div>
                <strong className="d-block">Added to Cart Successfully!</strong>
                <span className="small">
                  {quantity} × {product.name} - LKR {(displayPrice * quantity).toFixed(2)}
                </span>
              </div>
            </div>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => navigate("/cart")}
              className="ms-4"
            >
              View Cart
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetails;