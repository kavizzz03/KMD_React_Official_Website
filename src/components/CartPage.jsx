import React, { useState, useEffect } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Badge,
  Alert,
  Modal
} from "react-bootstrap";
import { 
  motion, 
  AnimatePresence 
} from "framer-motion";
import { 
  FaShoppingCart, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaShoppingBag,
  FaArrowLeft,
  FaCreditCard,
  FaShippingFast,
  FaShieldAlt,
  FaUndo
} from "react-icons/fa";
import { getCart, removeFromCart, updateCartQuantity, clearCart } from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDevNotice, setShowDevNotice] = useState(false); // ✅ new modal state
  const navigate = useNavigate();

  const loadCart = () => {
    const cartData = getCart();
    setCart(cartData);
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const item = cart.find(item => item.id === id);
    if (item && newQuantity > item.maxStock) {
      return;
    }
    
    updateCartQuantity(id, newQuantity);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    const subtotal = getSubtotal();
    return subtotal > 2000 ? 0 : 250;
  };

  const getGrandTotal = () => {
    return getSubtotal() + getShippingCost();
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => { 
    loadCart(); 
  }, []);

  if (cart.length === 0) {
    return (
      <Container className="py-5 min-vh-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-5"
        >
          <div className="empty-cart-icon mb-4">
            <FaShoppingBag size={80} className="text-muted" />
          </div>
          <h2 className="display-5 fw-bold text-dark mb-3">Your Cart is Empty</h2>
          <p className="lead text-muted mb-4">
            Looks like you haven't added any sweet treats to your cart yet.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="warning" 
              size="lg"
              onClick={() => navigate("/products")}
              className="px-4 py-2"
            >
              <FaShoppingBag className="me-2" />
              Continue Shopping
            </Button>
            <Button 
              variant="outline-secondary" 
              size="lg"
              onClick={() => navigate("/")}
              className="px-4 py-2"
            >
              <FaArrowLeft className="me-2" />
              Back to Home
            </Button>
          </div>
        </motion.div>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="cart-page"
    >
      <Container className="py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cart-header mb-4"
        >
          <Row className="align-items-center">
            <Col>
              <h1 className="display-4 fw-bold text-dark mb-2">
                Shopping Cart
              </h1>
              <div className="d-flex align-items-center gap-3">
                <Badge bg="warning" className="fs-6">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </Badge>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => setShowClearModal(true)}
                >
                  <FaTrash className="me-1" />
                  Clear Cart
                </Button>
              </div>
            </Col>
            <Col xs="auto">
              <Button 
                variant="outline-secondary"
                onClick={() => navigate("/products")}
              >
                <FaArrowLeft className="me-2" />
                Continue Shopping
              </Button>
            </Col>
          </Row>
        </motion.div>

        <Row className="g-4">
          {/* Cart Items */}
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="cart-items-card">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="cart-table mb-0">
                      <thead>
                        <tr>
                          <th className="product-col">Product</th>
                          <th className="price-col">Price</th>
                          <th className="quantity-col">Quantity</th>
                          <th className="total-col">Total</th>
                          <th className="action-col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {cart.map((item, index) => (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.1 }}
                              className="cart-item-row"
                            >
                              <td className="product-cell">
                                <div className="d-flex align-items-center gap-3">
                                  <div className="product-image-wrapper">
                                    <img
                                      src={`https://kmd.cpsharetxt.com/${item.image_url}`}
                                      alt={item.name}
                                      className="product-image"
                                      onError={(e) => {
                                        e.target.src = '/api/placeholder/80/80';
                                      }}
                                    />
                                  </div>
                                  <div className="product-info">
                                    <h6 className="product-name mb-1">{item.name}</h6>
                                    <div className="product-meta">
                                      {item.hasDiscount && (
                                        <Badge bg="danger" className="me-2">
                                          SALE
                                        </Badge>
                                      )}
                                      <small className="text-muted">
                                        Stock: {item.maxStock}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="price-cell">
                                <div className="price-wrapper">
                                  <span className="current-price fw-bold text-warning">
                                    LKR {Number(item.price).toFixed(2)}
                                  </span>
                                  {item.hasDiscount && item.originalPrice && (
                                    <span className="original-price text-muted text-decoration-line-through small">
                                      LKR {Number(item.originalPrice).toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="quantity-cell">
                                <div className="quantity-controls">
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <FaMinus size={12} />
                                  </Button>
                                  <span className="quantity-display mx-2 fw-bold">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="quantity-btn"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.maxStock}
                                  >
                                    <FaPlus size={12} />
                                  </Button>
                                </div>
                              </td>
                              <td className="total-cell">
                                <span className="item-total fw-bold text-dark">
                                  LKR {getItemTotal(item)}
                                </span>
                              </td>
                              <td className="action-cell">
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="remove-btn"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  <FaTrash />
                                </Button>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="order-summary-card sticky-top">
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0 fw-bold">
                    <FaCreditCard className="me-2" />
                    Order Summary
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="summary-details">
                    <div className="summary-row d-flex justify-content-between mb-2">
                      <span>Subtotal ({getTotalItems()} items):</span>
                      <span className="fw-semibold">LKR {getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span className={getShippingCost() === 0 ? "text-success fw-semibold" : "fw-semibold"}>
                        {getShippingCost() === 0 ? "FREE" : `LKR ${getShippingCost().toFixed(2)}`}
                      </span>
                    </div>
                    {getShippingCost() === 0 && (
                      <Alert variant="success" className="py-2 small mb-3">
                        <FaShippingFast className="me-1" />
                        Free shipping on orders over LKR 2,000
                      </Alert>
                    )}
                    <hr />
                    <div className="summary-total d-flex justify-content-between mb-4">
                      <strong className="fs-5">Grand Total:</strong>
                      <strong className="fs-5 text-warning">LKR {getGrandTotal().toFixed(2)}</strong>
                    </div>

                    <div className="checkout-actions">
                      {/* 🚧 Checkout under development */}
                      <Button 
                        variant="warning" 
                        size="lg" 
                        className="w-100 mb-3 checkout-btn"
                        onClick={() => setShowDevNotice(true)}
                      >
                        <FaCreditCard className="me-2" />
                        Proceed to Checkout
                      </Button>
                      
                      <Button 
                        variant="outline-primary" 
                        className="w-100"
                        onClick={() => navigate("/products")}
                      >
                        <FaShoppingBag className="me-2" />
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Features Card */}
              <Card className="features-card mt-4">
                <Card.Body>
                  <Row className="g-3 text-center">
                    <Col xs={4}>
                      <FaShippingFast className="text-primary mb-2 fs-4" />
                      <div className="small fw-semibold">Free Shipping</div>
                    </Col>
                    <Col xs={4}>
                      <FaShieldAlt className="text-success mb-2 fs-4" />
                      <div className="small fw-semibold">Quality Guarantee</div>
                    </Col>
                    <Col xs={4}>
                      <FaUndo className="text-info mb-2 fs-4" />
                      <div className="small fw-semibold">Easy Returns</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* 🗑️ Clear Cart Modal */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clear Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <FaTrash size={40} className="text-danger mb-3" />
            <h5>Are you sure you want to clear your cart?</h5>
            <p className="text-muted">
              This will remove all {getTotalItems()} items from your cart.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 💳 Development Notice Modal */}
      <Modal show={showDevNotice} onHide={() => setShowDevNotice(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Checkout Under Development</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <FaCreditCard size={50} className="text-warning mb-3" />
          <h5 className="fw-bold">Online Purchase Feature Coming Soon!</h5>
          <p className="text-muted">
            We're currently setting up secure payment and order processing.
            Please check back soon to complete online purchases.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDevNotice(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default CartPage;
