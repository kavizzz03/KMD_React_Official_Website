import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Card, Button, Form, Badge,
  Alert, InputGroup, Spinner
} from "react-bootstrap";
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock,
  FaInstagram, FaFacebook, FaWhatsapp, FaTwitter,
  FaLinkedin, FaArrowRight, FaUser, FaComment,
  FaPaperPlane, FaCheckCircle, FaHeadset, FaStore,
  FaBuilding, FaUserTie, FaUserSecret, FaLock, FaShieldAlt
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./ContactUs.css";

const ContactUs = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [branchesError, setBranchesError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch branches from database on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoadingBranches(true);
    try {
      const response = await fetch('https://whats.asbfashion.com/api/get-contact-branches.php');
      const data = await response.json();
      
      if (data.success) {
        setBranches(data.branches);
      } else {
        setBranchesError('Failed to load branches');
      }
    } catch (err) {
      setBranchesError('Network error. Please refresh the page.');
      console.error('Error fetching branches:', err);
    } finally {
      setLoadingBranches(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = 'https://whats.asbfashion.com/api/contact.php';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        setSuccessMessage(data.message);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        
        setTimeout(() => {
          setSubmitted(false);
          setSuccessMessage("");
        }, 5000);
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="asb-contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="contact-hero">
        <Container>
          <Row className="align-items-center" style={{ minHeight: '300px' }}>
            <Col className="text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge bg="light" text="dark" className="hero-badge mb-4 px-4 py-2">
                  <FaHeadset className="me-2" />
                  Get in Touch
                </Badge>
                <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
                <p className="lead mb-0">
                  We're here to help with any questions or concerns
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Employee Complaint Page Direction - NEW SECTION */}
      <section className="employee-direction-section py-4">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="employee-direction-card border-0 shadow-sm overflow-hidden">
                  <Row className="g-0 align-items-center">
                    <Col md={8}>
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="direction-icon bg-danger bg-opacity-10 p-3 rounded-3 me-3">
                            <FaUserSecret className="text-danger" size={28} />
                          </div>
                          <div>
                            <Badge bg="danger" className="mb-2">For Employees Only</Badge>
                            <h4 className="fw-bold mb-0">Employee Complaint / Feedback Portal</h4>
                          </div>
                        </div>
                        
                        <p className="text-muted mb-3">
                          Need to report a concern, give feedback, or share suggestions anonymously? 
                          Use our secure employee complaint portal. Your identity stays confidential.
                        </p>
                        
                        <div className="d-flex gap-3 mb-3 flex-wrap">
                          <div className="d-flex align-items-center">
                            <FaShieldAlt className="text-success me-2" size={16} />
                            <small>100% Anonymous</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <FaLock className="text-success me-2" size={16} />
                            <small>Secure & Encrypted</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <FaClock className="text-success me-2" size={16} />
                            <small>24/7 Available</small>
                          </div>
                        </div>
                        
                        <Button 
                          variant="danger" 
                          onClick={() => navigate("/employee-support")}
                          className="px-4 py-2 fw-semibold d-inline-flex align-items-center"
                          style={{ 
                            borderRadius: '50px',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateX(5px)';
                            e.target.style.boxShadow = '0 10px 20px rgba(220, 53, 69, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateX(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          Go to Complaint Portal <FaArrowRight className="ms-2" />
                        </Button>
                      </Card.Body>
                    </Col>
                    <Col md={4} className="d-none d-md-block">
                      <div 
                        className="direction-bg h-100 w-100 d-flex align-items-center justify-content-center"
                        style={{
                          background: 'linear-gradient(135deg, #dc3545 0%, #b22234 100%)',
                          minHeight: '200px'
                        }}
                      >
                        <FaUserSecret 
                          size={80} 
                          className="text-white opacity-50"
                          style={{
                            transform: 'rotate(-5deg)'
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Information Cards */}
      <section className="contact-info py-5">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="contact-card text-center p-4 border-0 shadow-sm">
                  <div className="contact-icon bg-danger text-white">
                    <FaPhone />
                  </div>
                  <h4 className="fw-bold mb-3">Call Us</h4>
                  <p className="mb-2">Head Office: 071 9057057</p>
                  <p className="mb-2">Customer Care: 011 2345678</p>
                  <p>WhatsApp: 071 9057057</p>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="contact-card text-center p-4 border-0 shadow-sm">
                  <div className="contact-icon bg-danger text-white">
                    <FaEnvelope />
                  </div>
                  <h4 className="fw-bold mb-3">Email Us</h4>
                  <p className="mb-2">General: info@asbfashion.com</p>
                  <p className="mb-2">Sales: sales@asbfashion.com</p>
                  <p>Support: support@asbfashion.com</p>
                </Card>
              </motion.div>
            </Col>
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Card className="contact-card text-center p-4 border-0 shadow-sm">
                  <div className="contact-icon bg-danger text-white">
                    <FaClock />
                  </div>
                  <h4 className="fw-bold mb-3">Working Hours</h4>
                  <p className="mb-2">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                  <p className="mb-2">Sunday: 10:00 AM - 6:00 PM</p>
                  <p>Public Holidays: 10:00 AM - 4:00 PM</p>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form & Branch Directions */}
      <section className="contact-form-section py-5 bg-light">
        <Container>
          <Row className="g-5">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="fw-bold mb-4">Send Us a Message</h2>
                <p className="text-muted mb-4">
                  Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
                </p>

                {submitted && (
                  <Alert variant="success" className="mb-4">
                    <FaCheckCircle className="me-2" />
                    {successMessage || "Thank you for your message! We'll contact you soon."}
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

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
                            name="name"
                            value={formData.name}
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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <InputGroup>
                          <InputGroup.Text className="bg-white">
                            <FaPhone className="text-danger" />
                          </InputGroup.Text>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Subject *</Form.Label>
                        <Form.Select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Sales Question">Sales Question</option>
                          <option value="Customer Support">Customer Support</option>
                          <option value="Feedback">Feedback</option>
                          <option value="Complaint">Complaint</option>
                          <option value="Employee Related">Employee Related</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Message *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white">
                        <FaComment className="text-danger" />
                      </InputGroup.Text>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Type your message here..."
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button 
                    variant="danger" 
                    type="submit" 
                    size="lg"
                    className="px-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <FaPaperPlane className="ms-2" />
                      </>
                    )}
                  </Button>
                </Form>
              </motion.div>
            </Col>
            
            {/* Branch Directions Section */}
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="fw-bold mb-4">
                  <FaMapMarkerAlt className="text-danger me-2" />
                  Branch Locations & Directions
                </h2>
                <p className="text-muted mb-4">
                  Find your nearest ASB Fashion store. We have {branches.length}+ locations across Sri Lanka.
                </p>

                {loadingBranches ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="danger" />
                    <p className="mt-3">Loading branch locations...</p>
                  </div>
                ) : branchesError ? (
                  <Alert variant="danger">{branchesError}</Alert>
                ) : (
                  <>
                    <div className="branch-list mb-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      {branches.map((branch) => (
                        <Card key={branch.id} className="branch-card mb-3 border-0 shadow-sm">
                          <Card.Body>
                            <div className="d-flex">
                              <div className="branch-icon me-3">
                                <FaStore className="text-danger" size={24} />
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h5 className="fw-bold mb-0">
                                    {branch.city}
                                    {branch.is_head && (
                                      <Badge bg="danger" className="ms-2">Head Office</Badge>
                                    )}
                                  </h5>
                                  {branch.district && (
                                    <small className="text-muted">{branch.district}</small>
                                  )}
                                </div>
                                
                                <p className="mb-2">
                                  <FaMapMarkerAlt className="text-danger me-2 small" />
                                  {branch.address}
                                </p>
                                
                                <div className="row mb-2">
                                  <div className="col-6">
                                    <FaPhone className="text-danger me-2 small" />
                                    {branch.phone}
                                  </div>
                                  {branch.mobile && (
                                    <div className="col-6">
                                      <FaPhone className="text-danger me-2 small" />
                                      {branch.mobile}
                                    </div>
                                  )}
                                </div>
                                
                                {branch.email && (
                                  <p className="mb-2">
                                    <FaEnvelope className="text-danger me-2 small" />
                                    {branch.email}
                                  </p>
                                )}
                                
                                <p className="mb-2">
                                  <FaClock className="text-danger me-2 small" />
                                  {branch.hours || '9:00 AM - 8:00 PM'}
                                </p>
                                
                                {branch.landmark && (
                                  <p className="mb-2 text-muted small">
                                    <strong>Landmark:</strong> {branch.landmark}
                                  </p>
                                )}
                                
                                {branch.map_link && (
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    href={branch.map_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2"
                                  >
                                    <FaMapMarkerAlt className="me-1" />
                                    Get Directions
                                    <FaArrowRight className="ms-1 small" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>

                    <Button 
                      variant="danger" 
                      size="lg" 
                      className="w-100"
                      onClick={() => {
                        window.open('https://www.google.com/maps/search/ASB+Fashion+Sri+Lanka', '_blank');
                      }}
                    >
                      <FaMapMarkerAlt className="me-2" />
                      View All Branches on Map
                      <FaArrowRight className="ms-2" />
                    </Button>
                  </>
                )}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="map-section py-5">
        <Container fluid>
          <Row>
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-center fw-bold mb-4">Find Us on Map</h2>
                <div className="map-container">
                  <iframe
                    title="ASB Fashion Head Office"
                    src="https://www.google.com/maps?q=6.6240149,79.947309&z=17&output=embed"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Social Media Section */}
      <section className="social-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="fw-bold mb-3">Connect With Us</h2>
                <p className="lead text-muted mb-4">
                  Follow us on social media for the latest updates, offers, and fashion inspiration
                </p>
                <div className="social-icons">
                  <a 
                    href="https://facebook.com/asbfashion" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon facebook"
                  >
                    <FaFacebook />
                  </a>
                  <a 
                    href="https://instagram.com/asbfashion" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon instagram"
                  >
                    <FaInstagram />
                  </a>
                  <a 
                    href="https://wa.me/94719057057" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon whatsapp"
                  >
                    <FaWhatsapp />
                  </a>
                  <a 
                    href="https://twitter.com/asbfashion" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon twitter"
                  >
                    <FaTwitter />
                  </a>
                  <a 
                    href="https://linkedin.com/company/asbfashion" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon linkedin"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .employee-direction-card {
          border-radius: 20px !important;
          transition: all 0.3s ease;
        }
        
        .employee-direction-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(220, 53, 69, 0.15) !important;
        }
        
        .direction-icon {
          transition: all 0.3s ease;
        }
        
        .employee-direction-card:hover .direction-icon {
          transform: scale(1.1);
        }
        
        .branch-list::-webkit-scrollbar {
          width: 5px;
        }
        
        .branch-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .branch-list::-webkit-scrollbar-thumb {
          background: #dc3545;
          border-radius: 10px;
        }
        
        .branch-list::-webkit-scrollbar-thumb:hover {
          background: #b22234;
        }
        
        .branch-icon {
          width: 40px;
          height: 40px;
          background: rgba(220, 53, 69, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </motion.div>
  );
};

export default ContactUs;