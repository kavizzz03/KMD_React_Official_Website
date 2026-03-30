// src/pages/EmployeeSupport.js
import React, { useState, useEffect, useRef } from "react";
import { 
  Container, Row, Col, Card, Form, Button, Badge,
  Alert, Spinner, Image
} from "react-bootstrap";
import { 
  FaShieldAlt, FaLock, FaPaperPlane, FaCheckCircle,
  FaExclamationTriangle, FaBuilding, FaComment,
  FaHeadset, FaUserSecret, FaClock, FaHeart,
  FaQuoteRight, FaHandsHelping, FaEye, FaEyeSlash,
  FaArrowRight, FaRegSmile, FaRegFrown, FaRegMeh,
  FaGavel, FaUsers, FaHandHoldingHeart, FaLockOpen,
  FaFeather, FaFeatherAlt, FaImage, FaTrash, FaUpload,
  FaFileImage, FaCheck
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./EmployeeSupport.css";

const EmployeeSupport = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    branch_id: "",
    complaint_type: "Complaint",
    message: ""
  });
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [complaintNumber, setComplaintNumber] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://whats.asbfashion.com/api/employee-complaint-api.php?action=get_branches');
      const data = await response.json();
      
      if (data.success) {
        setBranches(data.branches);
      } else {
        setError('Failed to load branches');
      }
    } catch (err) {
      setError('Network error. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'message') {
      setCharCount(value.length);
    }
    
    if (error) setError(null);
  };

  // Validate and handle image upload
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    const newImages = [];
    const errors = [];

    files.forEach(file => {
      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds 5MB limit`);
        return;
      }
      
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported image format`);
        return;
      }
      
      // Check total images limit (max 5 images)
      if (images.length + newImages.length >= 5) {
        errors.push('Maximum 5 images allowed');
        return;
      }
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      newImages.push({
        file,
        preview: previewUrl,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploading: true,
        progress: 0
      });
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
      setTimeout(() => setError(null), 5000);
    }

    if (newImages.length > 0) {
      setImages([...images, ...newImages]);
      // Simulate upload progress for each image
      newImages.forEach(image => {
        simulateUpload(image.id);
      });
    }
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Simulate upload progress (replace with actual upload to server)
  const simulateUpload = (imageId) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({
        ...prev,
        [imageId]: progress
      }));
      
      if (progress >= 100) {
        clearInterval(interval);
        setImages(prev => prev.map(img => 
          img.id === imageId ? { ...img, uploading: false } : img
        ));
      }
    }, 200);
  };

  // Remove image
  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    // Clean up preview URL to avoid memory leaks
    const imageToRemove = images.find(img => img.id === imageId);
    if (imageToRemove && imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
  };

  // Convert image to base64 for API submission
  const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.branch_id) {
      setError('Please select a branch');
      return;
    }
    
    if (formData.message.trim().length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Prepare images data
      const imagesData = [];
      for (const image of images) {
        if (!image.uploading && image.file) {
          const base64 = await imageToBase64(image.file);
          imagesData.push({
            name: image.name,
            type: image.type,
            size: image.size,
            data: base64
          });
        }
      }
      
      const payload = {
        ...formData,
        images: imagesData
      };
      
      const response = await fetch('https://whats.asbfashion.com/api/employee-complaint-api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message);
        setComplaintNumber(data.complaint_number);
        setFormData({
          branch_id: "",
          complaint_type: "Complaint",
          message: ""
        });
        
        // Clean up image previews
        images.forEach(img => {
          if (img.preview) URL.revokeObjectURL(img.preview);
        });
        setImages([]);
        setCharCount(0);
        setShowImageUpload(false);
        
        setTimeout(() => {
          setSuccess(null);
          setComplaintNumber(null);
        }, 10000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const complaintTypes = [
    { value: 'Complaint', icon: <FaRegFrown />, color: '#dc3545' },
    { value: 'Suggestion', icon: <FaRegSmile />, color: '#28a745' },
    { value: 'Feedback', icon: <FaRegMeh />, color: '#ffc107' },
    { value: 'Report', icon: <FaGavel />, color: '#17a2b8' },
    { value: 'Other', icon: <FaFeather />, color: '#6c757d' }
  ];

  // Testimonials
  const testimonials = [
    {
      text: "I never thought I could speak up anonymously. This platform gave me the courage to share my concerns.",
      author: "Anonymous Employee",
      role: "Store Associate"
    },
    {
      text: "Management actually listened and took action. Thank you for creating this safe space.",
      author: "Team Member",
      role: "5+ Years"
    }
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="employee-support-page"
    >
      {/* Hero Section - Redesigned */}
      <section className="support-hero">
        <div className="hero-pattern"></div>
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6} className="text-white">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="hero-badge mb-4">
                  <FaHeart className="me-2" />
                  Your Voice Matters
                </Badge>
                <h1 className="display-3 fw-bold mb-3">
                  Speak Up,<br />
                  <span className="text-warning">Stay Anonymous</span>
                </h1>
                <p className="lead mb-4">
                  A secure, confidential space where you can share your concerns, 
                  suggestions, or feedback without revealing your identity.
                </p>
                <div className="hero-stats d-flex gap-4">
                  <div>
                    <h3 className="h2 fw-bold text-warning mb-0">100%</h3>
                    <small>Anonymous</small>
                  </div>
                  <div>
                    <h3 className="h2 fw-bold text-warning mb-0">24/7</h3>
                    <small>Available</small>
                  </div>
                  <div>
                    <h3 className="h2 fw-bold text-warning mb-0">🔒</h3>
                    <small>Encrypted</small>
                  </div>
                </div>
              </motion.div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="hero-illustration"
              >
                <div className="floating-elements">
                  <FaUserSecret className="floating-icon main-icon" />
                  <FaLock className="floating-icon icon-1" />
                  <FaHandHoldingHeart className="floating-icon icon-2" />
                  <FaUsers className="floating-icon icon-3" />
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Form Section - Redesigned */}
      <section className="complaint-form-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="main-form-card border-0">
                  <Card.Body className="p-0">
                    <Row className="g-0">
                      {/* Left Panel - Form */}
                      <Col lg={7} className="form-panel">
                        <div className="p-4 p-lg-5">
                          {/* Security Badges - Enhanced */}
                          <div className="security-badges-wrapper mb-4">
                            <div className="security-badge">
                              <div className="badge-icon">
                                <FaShieldAlt />
                              </div>
                              <div className="badge-text">
                                <small>End-to-End</small>
                                <strong>Encrypted</strong>
                              </div>
                            </div>
                            <div className="security-badge">
                              <div className="badge-icon">
                                <FaUserSecret />
                              </div>
                              <div className="badge-text">
                                <small>No Personal</small>
                                <strong>Data Stored</strong>
                              </div>
                            </div>
                            <div className="security-badge">
                              <div className="badge-icon">
                                <FaClock />
                              </div>
                              <div className="badge-text">
                                <small>Sri Lanka</small>
                                <strong>Local Time</strong>
                              </div>
                            </div>
                          </div>

                          {/* Success Message - Enhanced */}
                          <AnimatePresence>
                            {success && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                              >
                                <Alert variant="success" className="success-alert">
                                  <div className="d-flex align-items-center">
                                    <div className="success-icon me-3">
                                      <FaCheckCircle size={32} />
                                    </div>
                                    <div>
                                      <h6 className="fw-bold mb-1">Message Received!</h6>
                                      <p className="mb-0 small">{success}</p>
                                      {complaintNumber && (
                                        <div className="complaint-ref mt-2">
                                          <Badge bg="light" text="dark" className="p-2">
                                            Ref: {complaintNumber}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Alert>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Error Message */}
                          <AnimatePresence>
                            {error && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                              >
                                <Alert variant="danger" className="error-alert">
                                  <FaExclamationTriangle className="me-2" />
                                  {error}
                                </Alert>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Form Title */}
                          <div className="form-header mb-4">
                            <h2 className="fw-bold mb-2">Share Your Thoughts</h2>
                            <p className="text-muted">
                              Your identity remains completely anonymous. No names, no emails, no tracking.
                            </p>
                          </div>

                          {/* Loading Branches */}
                          {loading && (
                            <div className="text-center py-5">
                              <Spinner animation="border" variant="danger" />
                              <p className="mt-3">Loading branches...</p>
                            </div>
                          )}

                          {/* Complaint Form */}
                          {!loading && (
                            <Form onSubmit={handleSubmit}>
                              {/* Branch Selection - Enhanced */}
                              <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">
                                  <FaBuilding className="text-danger me-2" />
                                  Select Your Branch <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="branch-select-wrapper">
                                  <Form.Select
                                    name="branch_id"
                                    value={formData.branch_id}
                                    onChange={handleChange}
                                    required
                                    className="form-select-lg"
                                  >
                                    <option value="">-- Choose your branch --</option>
                                    {branches.map(branch => (
                                      <option key={branch.id} value={branch.id}>
                                        {branch.city}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </div>
                              </Form.Group>

                              {/* Complaint Type - Enhanced with Icons */}
                              <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">
                                  <FaQuoteRight className="text-danger me-2" />
                                  What would you like to share?
                                </Form.Label>
                                <div className="complaint-types-grid">
                                  {complaintTypes.map(type => (
                                    <div
                                      key={type.value}
                                      className={`type-card ${formData.complaint_type === type.value ? 'active' : ''}`}
                                      onClick={() => setFormData({...formData, complaint_type: type.value})}
                                    >
                                      <div className="type-icon" style={{ color: type.color }}>
                                        {type.icon}
                                      </div>
                                      <span>{type.value}</span>
                                    </div>
                                  ))}
                                </div>
                              </Form.Group>

                              {/* Message - Enhanced with Character Counter */}
                              <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">
                                  <FaComment className="text-danger me-2" />
                                  Your Message <span className="text-danger">*</span>
                                </Form.Label>
                                <div className="message-input-wrapper">
                                  <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Describe your concern, suggestion, or feedback in detail..."
                                    required
                                    className="message-input"
                                  />
                                  <div className="char-counter">
                                    <span className={charCount < 10 ? 'text-danger' : 'text-success'}>
                                      {charCount}/500
                                    </span>
                                    {charCount < 10 && (
                                      <small className="text-danger ms-2">
                                        Minimum 10 characters
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </Form.Group>

                              {/* Image Upload Toggle */}
                              <div className="image-upload-toggle mb-3">
                                <Button
                                  variant="link"
                                  className="p-0 text-decoration-none"
                                  onClick={() => setShowImageUpload(!showImageUpload)}
                                >
                                  <FaImage className="me-2" />
                                  {showImageUpload ? 'Hide' : 'Add'} Images (Optional)
                                  <small className="text-muted ms-2">(Max 5 images, 5MB each)</small>
                                </Button>
                              </div>

                              {/* Image Upload Section */}
                              <AnimatePresence>
                                {showImageUpload && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="image-upload-section mb-4"
                                  >
                                    <div className="image-upload-area">
                                      {/* Upload Button */}
                                      <div 
                                        className="upload-trigger"
                                        onClick={() => fileInputRef.current?.click()}
                                      >
                                        <FaUpload className="upload-icon" />
                                        <p className="mb-0">Click to upload images</p>
                                        <small className="text-muted">
                                          Supports: JPG, PNG, GIF, WebP, BMP (Max 5MB each)
                                        </small>
                                      </div>
                                      
                                      <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp"
                                        multiple
                                        onChange={handleImageSelect}
                                        style={{ display: 'none' }}
                                      />
                                      
                                      {/* Image Preview Grid */}
                                      {images.length > 0 && (
                                        <div className="image-preview-grid mt-3">
                                          {images.map((image, index) => (
                                            <motion.div
                                              key={image.id}
                                              className="image-preview-item"
                                              initial={{ scale: 0.8, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              exit={{ scale: 0.8, opacity: 0 }}
                                            >
                                              <div className="image-preview-wrapper">
                                                <img 
                                                  src={image.preview} 
                                                  alt={`Preview ${index + 1}`}
                                                  className="preview-image"
                                                />
                                                {image.uploading && (
                                                  <div className="upload-overlay">
                                                    <div className="upload-progress">
                                                      <Spinner size="sm" />
                                                      <div className="progress-bar-custom">
                                                        <div 
                                                          className="progress-fill"
                                                          style={{ width: `${uploadProgress[image.id] || 0}%` }}
                                                        />
                                                      </div>
                                                      <span>{uploadProgress[image.id] || 0}%</span>
                                                    </div>
                                                  </div>
                                                )}
                                                {!image.uploading && (
                                                  <button
                                                    className="remove-image-btn"
                                                    onClick={() => removeImage(image.id)}
                                                  >
                                                    <FaTrash />
                                                  </button>
                                                )}
                                              </div>
                                              <div className="image-info">
                                                <small className="text-muted">
                                                  {image.name.length > 20 
                                                    ? image.name.substring(0, 17) + '...' 
                                                    : image.name}
                                                </small>
                                                <small className="text-muted d-block">
                                                  {formatFileSize(image.size)}
                                                </small>
                                              </div>
                                            </motion.div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {/* Upload Info */}
                                      {images.length > 0 && (
                                        <div className="upload-info mt-2">
                                          <small className="text-success">
                                            <FaCheck className="me-1" />
                                            {images.filter(img => !img.uploading).length} of {images.length} images ready
                                          </small>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Privacy Toggle */}
                              <div className="privacy-toggle mb-4">
                                <Button
                                  variant="link"
                                  className="p-0 text-decoration-none"
                                  onClick={() => setShowPrivacy(!showPrivacy)}
                                >
                                  {showPrivacy ? <FaEyeSlash /> : <FaEye />}
                                  <span className="ms-2">
                                    {showPrivacy ? 'Hide' : 'Show'} Privacy Details
                                  </span>
                                </Button>
                                
                                <AnimatePresence>
                                  {showPrivacy && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="privacy-details mt-3"
                                    >
                                      <ul className="list-unstyled">
                                        <li className="mb-2">
                                          <FaCheckCircle className="text-success me-2" size={14} />
                                          We do not collect your name, email, or phone number
                                        </li>
                                        <li className="mb-2">
                                          <FaCheckCircle className="text-success me-2" size={14} />
                                          Your IP address is temporarily logged but never shared
                                        </li>
                                        <li className="mb-2">
                                          <FaCheckCircle className="text-success me-2" size={14} />
                                          All messages and images are encrypted during transmission
                                        </li>
                                        <li className="mb-2">
                                          <FaCheckCircle className="text-success me-2" size={14} />
                                          Images are stored securely and only accessible to management
                                        </li>
                                      </ul>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Submit Button - Enhanced */}
                              <div className="d-grid">
                                <Button
                                  variant="danger"
                                  type="submit"
                                  size="lg"
                                  disabled={submitting}
                                  className="submit-btn py-3"
                                >
                                  {submitting ? (
                                    <>
                                      <Spinner size="sm" className="me-2" />
                                      Securely Submitting...
                                    </>
                                  ) : (
                                    <>
                                      <FaPaperPlane className="me-2" />
                                      Submit Anonymously
                                      <FaArrowRight className="ms-2" />
                                    </>
                                  )}
                                </Button>
                              </div>

                              {/* Trust Seal */}
                              <div className="trust-seal text-center mt-4">
                                <FaLockOpen className="text-success me-1" />
                                <small className="text-muted">
                                  Your message and images are protected by 256-bit encryption
                                </small>
                              </div>
                            </Form>
                          )}
                        </div>
                      </Col>

                      {/* Right Panel - Info & Testimonials */}
                      <Col lg={5} className="info-panel">
                        <div className="p-4 p-lg-5">
                          {/* Quick Stats */}
                          <div className="quick-stats mb-5">
                            <h5 className="fw-bold mb-3">Why Speak Up?</h5>
                            <div className="stat-item mb-3">
                              <div className="d-flex align-items-center">
                                <div className="stat-number me-3">1</div>
                                <div>
                                  <strong>100% Anonymous</strong>
                                  <p className="mb-0 small">No identity tracking</p>
                                </div>
                              </div>
                            </div>
                            <div className="stat-item mb-3">
                              <div className="d-flex align-items-center">
                                <div className="stat-number me-3">2</div>
                                <div>
                                  <strong>Direct to Management</strong>
                                  <p className="mb-0 small">Reaches the right people</p>
                                </div>
                              </div>
                            </div>
                            <div className="stat-item mb-3">
                              <div className="d-flex align-items-center">
                                <div className="stat-number me-3">3</div>
                                <div>
                                  <strong>Follow-up Available</strong>
                                  <p className="mb-0 small">Use your reference number</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Testimonials */}
                          <div className="testimonials-section mb-5">
                            <h5 className="fw-bold mb-3">What Others Say</h5>
                            {testimonials.map((testimonial, index) => (
                              <motion.div
                                key={index}
                                className="testimonial-card mb-3"
                                whileHover={{ scale: 1.02 }}
                              >
                                <FaQuoteRight className="quote-icon" />
                                <p className="mb-2">{testimonial.text}</p>
                                <div className="testimonial-author">
                                  <strong>- {testimonial.author}</strong>
                                  <small className="text-muted d-block">
                                    {testimonial.role}
                                  </small>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Support Contact */}
                          <div className="support-contact">
                            <div className="d-flex align-items-center">
                              <div className="support-icon me-3">
                                <FaHeadset />
                              </div>
                              <div>
                                <small>Need immediate help?</small>
                                <p className="fw-bold mb-0">HR Support: ext. 1234</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Trust Features Section */}
      <section className="trust-features py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold">Why Employees Trust Us</h2>
              <p className="text-muted">A safe space for every voice</p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={3}>
              <motion.div
                className="feature-card"
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">
                  <FaUserSecret />
                </div>
                <h5>Complete Anonymity</h5>
                <p className="small text-muted">Your identity stays with you</p>
              </motion.div>
            </Col>
            <Col md={3}>
              <motion.div
                className="feature-card"
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">
                  <FaLock />
                </div>
                <h5>Secure & Private</h5>
                <p className="small text-muted">256-bit encryption</p>
              </motion.div>
            </Col>
            <Col md={3}>
              <motion.div
                className="feature-card"
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">
                  <FaClock />
                </div>
                <h5>24/7 Availability</h5>
                <p className="small text-muted">Submit anytime, anywhere</p>
              </motion.div>
            </Col>
            <Col md={3}>
              <motion.div
                className="feature-card"
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">
                  <FaHandsHelping />
                </div>
                <h5>Action Oriented</h5>
                <p className="small text-muted">Your voice creates change</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </motion.div>
  );
};

export default EmployeeSupport;