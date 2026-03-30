import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Button, Form, Badge,
  Alert, InputGroup, Modal, Table, Spinner
} from "react-bootstrap";
import {
  FaGift, FaQrcode, FaEnvelope, FaUser, FaPhone,
  FaCreditCard, FaUniversity, FaCheckCircle,
  FaArrowLeft, FaShoppingCart, FaTag, FaCalendar,
  FaInfoCircle, FaPercentage, FaDownload, FaPrint,
  FaShare, FaWhatsapp, FaExclamationTriangle
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./GiftVoucher.css";

const GiftVoucher = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    message: "",
    payment_method: "card"
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [noVoucherError, setNoVoucherError] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('https://whats.asbfashion.com/api/gift_voucher/get_categories.php');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Network error. Please refresh the page.');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStep(2);
    setError(null);
    setNoVoucherError(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateFinalPrice = (price, discount) => {
    if (discount > 0) {
      return price - (price * discount / 100);
    }
    return price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNoVoucherError(false);

    try {
      const response = await fetch('https://whats.asbfashion.com/api/gift_voucher/create_voucher.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          category_id: selectedCategory.id
        })
      });

      const data = await response.json();

      if (data.success) {
        setVoucherDetails(data.voucher);
        
        if (formData.payment_method === 'bank_deposit') {
          setShowPaymentModal(true);
        } else {
          setStep(3);
        }
        
        // Reset form
        setFormData({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          message: "",
          payment_method: "card"
        });
      } else {
        // Check if it's the "no vouchers available" error
        if (data.code === 'NO_VOUCHERS_AVAILABLE') {
          setNoVoucherError(true);
          setError('Voucher codes are not available in this category. Please contact customer support.');
        } else {
          setError(data.message || 'Failed to create voucher');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (voucherDetails?.qr_code_url) {
      const link = document.createElement('a');
      link.href = `https://whats.asbfashion.com/api/gift_voucher/download_qr.php?code=${voucherDetails.code}`;
      link.target = '_blank';
      link.download = `ASB-Voucher-${voucherDetails.code}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  const handleShareViaEmail = () => {
    if (voucherDetails?.code) {
      window.location.href = `mailto:?subject=ASB Fashion Gift Voucher&body=Here's your gift voucher code: ${voucherDetails.code}. Download your QR code from: https://whats.asbfashion.com/api/gift_voucher/download_qr.php?code=${voucherDetails.code}`;
    }
  };

  const handleShareViaWhatsApp = () => {
    if (voucherDetails?.code) {
      const text = `Here's your ASB Fashion gift voucher code: ${voucherDetails.code}. You can download the QR code from: https://whats.asbfashion.com/api/gift_voucher/download_qr.php?code=${voucherDetails.code}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedCategory(null);
    setVoucherDetails(null);
    setError(null);
    setNoVoucherError(false);
    setDownloadSuccess(false);
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@asbfashion.com?subject=Gift Voucher Unavailable&body=I tried to purchase a gift voucher for category: ' + selectedCategory?.name;
  };

  if (categoriesLoading) {
    return (
      <div className="gift-voucher-loading">
        <Spinner animation="border" variant="danger" />
        <p>Loading gift vouchers...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="gift-voucher-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <section className="voucher-hero bg-danger text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col className="text-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Badge bg="light" text="dark" className="px-4 py-2 mb-4">
                  <FaGift className="me-2" />
                  Gift Voucher
                </Badge>
                <h1 className="display-4 fw-bold mb-3">Purchase Gift Voucher</h1>
                <p className="lead mb-0">
                  The perfect gift for your loved ones
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Progress Steps */}
      <section className="progress-steps py-4 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="d-flex justify-content-between">
                <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <div className="step-label">Select Category</div>
                </div>
                <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-label">Your Details</div>
                </div>
                <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                  <div className="step-number">3</div>
                  <div className="step-label">Download QR</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {error && !noVoucherError && (
          <Alert variant="danger" className="mb-4">
            <FaInfoCircle className="me-2" />
            {error}
          </Alert>
        )}

        {noVoucherError && (
          <Alert variant="warning" className="mb-4">
            <FaExclamationTriangle className="me-2" size={24} />
            <Alert.Heading>Voucher Codes Not Available</Alert.Heading>
            <p>
              We're sorry, but there are no voucher codes available in the "{selectedCategory?.name}" category at the moment.
            </p>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">
                Please try another category or contact our customer support for assistance.
              </p>
              <div>
                <Button variant="outline-danger" onClick={handleContactSupport} className="me-2">
                  Contact Support
                </Button>
                <Button variant="danger" onClick={() => setStep(1)}>
                  Choose Another Category
                </Button>
              </div>
            </div>
          </Alert>
        )}

        {downloadSuccess && (
          <Alert variant="success" className="mb-4">
            <FaCheckCircle className="me-2" />
            QR Code downloaded successfully!
          </Alert>
        )}

        {/* Step 1: Category Selection */}
        {step === 1 && !noVoucherError && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h2 className="text-center mb-5">Choose Your Voucher Category</h2>
            <Row className="g-4">
              {categories.map((category) => (
                <Col lg={3} md={6} key={category.id}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className="category-card h-100 border-0 shadow-sm"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <Card.Img 
                        variant="top" 
                        src={category.image_url || "https://via.placeholder.com/300x200?text=Gift+Voucher"} 
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <Card.Body className="text-center">
                        <Badge bg="danger" className="mb-3">
                          <FaTag className="me-1" />
                          {category.discount_percent > 0 ? `${category.discount_percent}% OFF` : 'Special'}
                        </Badge>
                        <h4>{category.name}</h4>
                        <p className="text-muted small">{category.description}</p>
                        <div className="price-section">
                          {category.discount_percent > 0 ? (
                            <>
                              <span className="text-muted text-decoration-line-through me-2">
                                LKR {category.price}
                              </span>
                              <span className="text-danger fw-bold fs-4">
                                LKR {calculateFinalPrice(category.price, category.discount_percent)}
                              </span>
                            </>
                          ) : (
                            <span className="text-danger fw-bold fs-4">
                              LKR {category.price}
                            </span>
                          )}
                        </div>
                        <p className="text-muted small mt-2">
                          <FaCalendar className="me-1" />
                          Valid for {category.validity_days} days
                        </p>
                      </Card.Body>
                      <Card.Footer className="bg-white border-0 pb-4 text-center">
                        <Button variant="danger">Select & Continue</Button>
                      </Card.Footer>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}

        {/* Step 2: User Details Form */}
        {step === 2 && selectedCategory && !noVoucherError && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Row className="justify-content-center">
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white py-3">
                    <Button 
                      variant="link" 
                      className="text-decoration-none"
                      onClick={() => setStep(1)}
                    >
                      <FaArrowLeft className="me-2" />
                      Back to Categories
                    </Button>
                    <h3 className="mt-3">Your Details</h3>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Your Name *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text className="bg-white">
                                <FaUser className="text-danger" />
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address *</Form.Label>
                            <InputGroup>
                              <InputGroup.Text className="bg-white">
                                <FaEnvelope className="text-danger" />
                              </InputGroup.Text>
                              <Form.Control
                                type="email"
                                name="customer_email"
                                value={formData.customer_email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-white">
                            <FaPhone className="text-danger" />
                          </InputGroup.Text>
                          <Form.Control
                            type="tel"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Message (Optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Add a personal message for the recipient"
                        />
                      </Form.Group>

                      <h4 className="mb-3">Select Payment Method</h4>
                      <Row className="mb-4">
                        <Col md={6}>
                          <Card 
                            className={`payment-method ${formData.payment_method === 'card' ? 'selected' : ''}`}
                            onClick={() => setFormData({...formData, payment_method: 'card'})}
                          >
                            <Card.Body className="text-center">
                              <FaCreditCard size={40} className="text-danger mb-3" />
                              <h5>Card Payment</h5>
                              <p className="text-muted small">Pay with Credit/Debit Card</p>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6}>
                          <Card 
                            className={`payment-method ${formData.payment_method === 'bank_deposit' ? 'selected' : ''}`}
                            onClick={() => setFormData({...formData, payment_method: 'bank_deposit'})}
                          >
                            <Card.Body className="text-center">
                              <FaUniversity size={40} className="text-danger mb-3" />
                              <h5>Bank Deposit</h5>
                              <p className="text-muted small">Direct Bank Transfer</p>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <div className="order-summary bg-light p-4 rounded mb-4">
                        <h5>Order Summary</h5>
                        <Table borderless size="sm">
                          <tbody>
                            <tr>
                              <td>Category:</td>
                              <td className="text-end fw-bold">{selectedCategory.name}</td>
                            </tr>
                            <tr>
                              <td>Original Price:</td>
                              <td className="text-end">LKR {selectedCategory.price}</td>
                            </tr>
                            {selectedCategory.discount_percent > 0 && (
                              <tr>
                                <td>Discount ({selectedCategory.discount_percent}%):</td>
                                <td className="text-end text-success">
                                  -LKR {(selectedCategory.price * selectedCategory.discount_percent / 100).toFixed(2)}
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td className="fw-bold">Total Amount:</td>
                              <td className="text-end text-danger fw-bold fs-5">
                                LKR {calculateFinalPrice(selectedCategory.price, selectedCategory.discount_percent)}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>

                      <Button 
                        variant="danger" 
                        type="submit" 
                        size="lg" 
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Purchase Voucher <FaShoppingCart className="ms-2" />
                          </>
                        )}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </motion.div>
        )}

        {/* Step 3: Success Page with QR Download */}
        {step === 3 && voucherDetails && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Row className="justify-content-center">
              <Col lg={6}>
                <Card className="border-0 shadow-lg text-center">
                  <Card.Body className="p-5">
                    <div className="success-animation mb-4">
                      <FaCheckCircle size={80} className="text-success" />
                    </div>
                    
                    <h2 className="mb-3">Payment Successful!</h2>
                    <p className="text-muted mb-4">
                      Your gift voucher has been created and sent to {formData.customer_email}
                    </p>

                    <div className="voucher-details bg-light p-4 rounded mb-4">
                      <h5 className="text-muted mb-3">Voucher Details</h5>
                      <div className="voucher-code-display bg-white p-3 rounded mb-3">
                        <small className="text-muted d-block">Voucher Code</small>
                        <strong className="fs-3 text-danger">{voucherDetails.code}</strong>
                      </div>
                      
                      <div className="d-flex justify-content-between mb-2">
                        <span>Amount:</span>
                        <strong className="text-success">LKR {voucherDetails.amount}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Category:</span>
                        <strong>{voucherDetails.category}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <span>Valid Until:</span>
                        <strong>{new Date(voucherDetails.expires_at).toLocaleDateString()}</strong>
                      </div>

                      {/* QR Code Display */}
                      {voucherDetails.qr_code_url && (
                        <div className="qr-code-display bg-white p-3 rounded mt-3">
                          <p className="mb-2 fw-bold">Your QR Code:</p>
                          <img 
                            src={voucherDetails.qr_code_url} 
                            alt="Voucher QR Code"
                            style={{ maxWidth: '150px', border: '2px solid #dc3545', borderRadius: '10px', padding: '5px' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Download and Share Buttons */}
                    <div className="d-grid gap-3">
                      <Button 
                        variant="danger" 
                        size="lg"
                        onClick={handleDownloadQR}
                      >
                        <FaDownload className="me-2" />
                        Download QR Code
                      </Button>
                      
                      <Row className="g-2">
                        <Col>
                          <Button 
                            variant="outline-primary" 
                            className="w-100"
                            onClick={handleShareViaEmail}
                          >
                            <FaEnvelope className="me-2" />
                            Email
                          </Button>
                        </Col>
                        <Col>
                          <Button 
                            variant="outline-success" 
                            className="w-100"
                            onClick={handleShareViaWhatsApp}
                          >
                            <FaWhatsapp className="me-2" />
                            WhatsApp
                          </Button>
                        </Col>
                      </Row>

                      <Button 
                        variant="outline-secondary"
                        onClick={resetForm}
                      >
                        Buy Another Voucher
                      </Button>
                    </div>

                    <p className="small text-muted mt-3">
                      QR code has also been sent to your email
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </motion.div>
        )}

        {/* Bank Deposit Modal */}
        <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>Bank Deposit Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Alert variant="info">
              <FaInfoCircle className="me-2" />
              Please make the payment within 24 hours
            </Alert>
            
            <Card className="border-0 bg-light">
              <Card.Body>
                <h5 className="mb-3">Bank Account Details</h5>
                <Table borderless size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Bank:</strong></td>
                      <td>Bank of Ceylon</td>
                    </tr>
                    <tr>
                      <td><strong>Account Name:</strong></td>
                      <td>ASB FASHION (PVT) LTD</td>
                    </tr>
                    <tr>
                      <td><strong>Account No:</strong></td>
                      <td className="text-danger fw-bold">1234567890</td>
                    </tr>
                    <tr>
                      <td><strong>Branch:</strong></td>
                      <td>Wadduwa</td>
                    </tr>
                    <tr>
                      <td><strong>Amount:</strong></td>
                      <td className="fw-bold text-success">
                        LKR {selectedCategory && calculateFinalPrice(
                          selectedCategory.price, 
                          selectedCategory.discount_percent
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Reference:</strong></td>
                      <td className="text-danger fw-bold">{voucherDetails?.code}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            <p className="small text-muted mt-3">
              Your voucher and QR code will be sent via email within 2-4 hours after payment verification.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={() => {
              setShowPaymentModal(false);
              setStep(3);
            }}>
              I've Made the Payment
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </motion.div>
  );
};

export default GiftVoucher;