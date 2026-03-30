import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Card, Button, Table, 
  Badge, Alert, Modal, Form, InputGroup, ProgressBar 
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaShoppingBag, FaTrash, FaPlus, FaMinus, FaArrowLeft,
  FaCreditCard, FaShippingFast, FaCheckCircle, FaLock, 
  FaTag, FaHeart, FaStore, FaWhatsapp, FaTruck 
} from "react-icons/fa";
import { 
  getCart, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart,
  getCartCount,
  getWishlistCount
} from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDevNotice, setShowDevNotice] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false);
  const navigate = useNavigate();

  // Available coupons
  const availableCoupons = [
    { code: "ASB10", discount: 10, description: "10% off on all items", minAmount: 1000 },
    { code: "WELCOME20", discount: 20, description: "20% off for new customers", minAmount: 2000 },
    { code: "FREESHIP", discount: 0, description: "Free shipping", minAmount: 3000, freeShipping: true },
    { code: "SUMMER15", discount: 15, description: "Summer Sale 15% off", minAmount: 1500 }
  ];

  const loadCart = () => {
    const cartData = getCart();
    setCart(cartData);
  };

  // Listen for cart updates from other components
  useEffect(() => {
    loadCart();
    
    const handleCartUpdate = () => {
      loadCart();
      setCartUpdated(prev => !prev);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
    loadCart();
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;
    updateCartQuantity(id, newQuantity);
    loadCart();
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
    loadCart();
  };

  const handlePromoApply = () => {
    const coupon = availableCoupons.find(c => c.code === promoCode.toUpperCase());
    
    if (coupon) {
      const subtotal = getSubtotal();
      
      if (coupon.minAmount && subtotal < coupon.minAmount) {
        alert(`This coupon requires minimum purchase of LKR ${coupon.minAmount.toLocaleString()}`);
        return;
      }
      
      if (coupon.freeShipping) {
        setPromoApplied(true);
        setPromoDiscount(0);
        alert("Free shipping applied!");
      } else if (coupon.discount > 0) {
        setPromoApplied(true);
        setPromoDiscount(coupon.discount);
        alert(`${coupon.discount}% discount applied!`);
      }
    } else {
      alert("Invalid promo code. Try: ASB10, WELCOME20, FREESHIP, or SUMMER15");
    }
  };

  const removePromo = () => {
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode("");
  };

  const handleSizeChange = (item, newSize) => {
    const updatedCart = cart.map(cartItem => 
      cartItem.id === item.id ? { ...cartItem, selectedSize: newSize } : cartItem
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCart();
    setShowSizeModal(false);
  };

  // Calculate totals
  const getSubtotal = () => cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  const getDiscountAmount = () => (getSubtotal() * promoDiscount) / 100;
  const getShippingCost = () => {
    const total = getSubtotal() - getDiscountAmount();
    if (total === 0) return 0;
    
    // Check if free shipping coupon is applied
    if (promoApplied && promoCode.toUpperCase() === "FREESHIP") return 0;
    
    // Free shipping for orders over 5000
    if (total > 5000) return 0;
    
    // Standard shipping rates
    if (total > 2000) return 150;
    return 350;
  };
  
  const getGrandTotal = () => getSubtotal() - getDiscountAmount() + getShippingCost();
  const getTotalItems = () => getCartCount();
  const getFreeShippingProgress = () => {
    const subtotal = getSubtotal();
    const minForFree = 5000;
    const progress = (subtotal / minForFree) * 100;
    return Math.min(progress, 100);
  };

  const getSizeGuide = (category) => {
    const sizes = {
      men: ['S', 'M', 'L', 'XL', 'XXL'],
      women: ['XS', 'S', 'M', 'L', 'XL'],
      kids: ['2-3Y', '3-4Y', '4-5Y', '5-6Y'],
      accessories: ['One Size']
    };
    return sizes[category?.toLowerCase()] || ['S', 'M', 'L', 'XL'];
  };

  // Recommended products (you can fetch from API or use static)
  const recommendedProducts = [
    { id: 1, name: "Casual Shirt", price: 2500, image: "/images/products/shirt.jpg" },
    { id: 2, name: "Denim Jeans", price: 3500, image: "/images/products/jeans.jpg" },
    { id: 3, name: "Summer Dress", price: 4200, image: "/images/products/dress.jpg" }
  ];

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center min-vh-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaShoppingBag size={80} className="text-muted mb-4 opacity-50" />
          <h2 className="fw-bold">Your Cart is Empty</h2>
          <p className="text-muted mb-4">Add some items to start shopping!</p>
          <Button variant="danger" onClick={() => navigate("/products")} className="px-5 py-3 rounded-pill">
            Explore Products
          </Button>
          
          {/* Recommended Products */}
      
        </motion.div>
      </Container>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="cart-page py-4"
    >
      <Container>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-0">
              Shopping Cart 
              <Badge bg="danger" className="ms-2">{getTotalItems()}</Badge>
            </h1>
            <p className="text-muted mt-2">Review your items before checkout</p>
          </div>
          <Button 
            variant="outline-dark" 
            onClick={() => navigate("/products")}
            className="rounded-pill px-4"
          >
            <FaArrowLeft className="me-2" /> Continue Shopping
          </Button>
        </div>

        {/* Free Shipping Progress */}
        {getSubtotal() < 5000 && (
          <Card className="border-0 shadow-sm mb-4 p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <FaTruck className="text-danger me-2" />
                <span>Add LKR {(5000 - getSubtotal()).toLocaleString()} more for FREE Shipping!</span>
              </div>
              <span className="fw-bold text-danger">
                {getSubtotal() >= 5000 ? "Free Shipping Unlocked!" : `${Math.round(getFreeShippingProgress())}%`}
              </span>
            </div>
            <ProgressBar 
              now={getFreeShippingProgress()} 
              variant="danger" 
              style={{ height: '8px', borderRadius: '4px' }}
            />
          </Card>
        )}

        <Row>
          {/* Cart Items */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center border-0">
                <h5 className="mb-0 fw-bold">Items in Cart ({getTotalItems()})</h5>
                {cart.length > 0 && (
                  <Button 
                    variant="link" 
                    className="text-danger p-0" 
                    onClick={() => setShowClearModal(true)}
                  >
                    <FaTrash className="me-1" /> Clear All
                  </Button>
                )}
              </Card.Header>
              <div className="table-responsive">
                <Table className="align-middle mb-0">
                  <thead className="bg-light">
                    <tr className="text-muted">
                      <th style={{ width: '40%' }}>Product</th>
                      <th style={{ width: '15%' }}>Price</th>
                      <th style={{ width: '15%' }}>Quantity</th>
                      <th style={{ width: '20%' }}>Total</th>
                      <th style={{ width: '10%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.tr 
                          key={item.id} 
                          layout 
                          exit={{ opacity: 0, x: -20 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img 
                                src={item.image || item.image_url || "/images/placeholder.jpg"} 
                                alt={item.name}
                                style={{ width: '70px', height: '70px', objectFit: 'cover' }} 
                                className="rounded"
                                onError={(e) => e.target.src = "/images/placeholder.jpg"}
                              />
                              <div>
                                <h6 className="mb-1 fw-bold">{item.name}</h6>
                                <small 
                                  className="text-muted cursor-pointer" 
                                  style={{ cursor: 'pointer' }} 
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setAvailableSizes(getSizeGuide(item.category));
                                    setShowSizeModal(true);
                                  }}
                                >
                                  Size: {item.selectedSize || 'Select'} <FaPlus size={10} className="ms-1" />
                                </small>
                                {item.selectedColor && (
                                  <div className="mt-1">
                                    <small className="text-muted">Color: {item.selectedColor}</small>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="fw-bold">LKR {item.price?.toLocaleString() || 0}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                className="rounded-circle p-0"
                                style={{ width: '30px', height: '30px' }}
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                <FaMinus size={12} />
                              </Button>
                              <span className="fw-bold mx-2" style={{ minWidth: '30px', textAlign: 'center' }}>
                                {item.quantity || 1}
                              </span>
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                className="rounded-circle p-0"
                                style={{ width: '30px', height: '30px' }}
                                onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                              >
                                <FaPlus size={12} />
                              </Button>
                            </div>
                          </td>
                          <td className="fw-bold text-danger">
                            LKR {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                          </td>
                          <td>
                            <Button 
                              variant="link" 
                              className="text-danger p-0"
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
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Order Summary</h5>
                
                {/* Promo Code */}
                {!promoApplied ? (
                  <div className="mb-4">
                    <label className="small text-muted mb-2">Have a promo code?</label>
                    <InputGroup>
                      <Form.Control 
                        placeholder="Enter code" 
                        value={promoCode} 
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="border-end-0"
                      />
                      <Button 
                        variant="outline-danger" 
                        onClick={handlePromoApply}
                        className="border-start-0"
                      >
                        Apply
                      </Button>
                    </InputGroup>
                    <small className="text-muted mt-2 d-block">
                      <FaTag className="me-1" /> Try: ASB10, WELCOME20, FREESHIP
                    </small>
                  </div>
                ) : (
                  <Alert variant="success" className="mb-4 py-2 d-flex justify-content-between align-items-center">
                    <span>
                      <FaCheckCircle className="me-2" />
                      {promoDiscount > 0 ? `${promoDiscount}% OFF` : 'Free Shipping'} Applied!
                    </span>
                    <Button variant="link" className="text-danger p-0" onClick={removePromo}>Remove</Button>
                  </Alert>
                )}
                
                {/* Totals */}
                <div className="summary-items">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>LKR {getSubtotal().toLocaleString()}</span>
                  </div>
                  {promoApplied && promoDiscount > 0 && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Discount ({promoDiscount}%)</span>
                      <span>-LKR {getDiscountAmount().toLocaleString()}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Shipping</span>
                    <span className={getShippingCost() === 0 ? "text-success" : ""}>
                      {getShippingCost() === 0 ? "FREE" : `LKR ${getShippingCost().toLocaleString()}`}
                    </span>
                  </div>
                  <hr className="my-3" />
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold fs-5">Total</span>
                    <span className="text-danger fw-bold fs-5">LKR {getGrandTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Checkout Buttons */}
                <Button 
                  variant="danger" 
                  size="lg" 
                  className="w-100 mb-3 py-3 fw-bold"
                  onClick={() => setShowDevNotice(true)}
                >
                  <FaCreditCard className="me-2" /> Proceed to Checkout
                </Button>
                
                <div className="text-center">
                  <small className="text-muted d-block">
                    <FaLock className="me-1" /> Secure Payment
                  </small>
                  <small className="text-muted d-block mt-2">
                    <FaShippingFast className="me-1" /> Free returns within 7 days
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Clear Cart Modal */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <FaShoppingBag size={50} className="text-danger mb-3" />
          <h5 className="fw-bold">Clear Shopping Cart?</h5>
          <p className="text-muted">This action cannot be undone. All items will be removed.</p>
          <div className="mt-4 d-flex gap-2 justify-content-center">
            <Button variant="secondary" onClick={() => setShowClearModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearCart}>
              Yes, Clear All
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Checkout Notice Modal */}
      <Modal show={showDevNotice} onHide={() => setShowDevNotice(false)} centered>
        <Modal.Body className="text-center py-4">
          <FaWhatsapp size={50} className="text-success mb-3" />
          <h5 className="fw-bold">Complete Your Order</h5>
          <p className="text-muted mb-3">
            Online payment gateway is coming soon! For now, please place your order via WhatsApp.
          </p>
          <div className="order-details mb-3 text-start bg-light p-3 rounded">
            <small className="text-muted">Order Summary:</small>
            <div className="d-flex justify-content-between">
              <span>Total Items:</span>
              <strong>{getTotalItems()}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span>Grand Total:</span>
              <strong className="text-danger">LKR {getGrandTotal().toLocaleString()}</strong>
            </div>
          </div>
          <Button 
            variant="success" 
            className="w-100 mb-2"
            href={`https://wa.me/94719057057?text=${encodeURIComponent(
              `Hi! I'd like to place an order:\n\nTotal: LKR ${getGrandTotal().toLocaleString()}\nItems: ${getTotalItems()}\n\nPlease help me complete my purchase.`
            )}`}
            target="_blank"
          >
            <FaWhatsapp className="me-2" /> Order via WhatsApp
          </Button>
          <Button 
            variant="outline-secondary" 
            className="w-100"
            onClick={() => setShowDevNotice(false)}
          >
            Continue Shopping
          </Button>
        </Modal.Body>
      </Modal>

      {/* Size Selection Modal */}
      <Modal show={showSizeModal} onHide={() => setShowSizeModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>Select Size</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <h6 className="mb-3">{selectedItem?.name}</h6>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {availableSizes.map(size => (
              <Button
                key={size}
                variant={selectedItem?.selectedSize === size ? "danger" : "outline-danger"}
                onClick={() => handleSizeChange(selectedItem, size)}
                className="rounded-pill px-4"
              >
                {size}
              </Button>
            ))}
          </div>
          <small className="text-muted d-block mt-3">
            <FaStore className="me-1" /> Size guide available in store
          </small>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default CartPage;