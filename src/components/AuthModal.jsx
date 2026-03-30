import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, Button, Form } from 'react-bootstrap';
import { 
  FaTimes, FaUser, FaLock, FaEnvelope, 
  FaGoogle, FaFacebook, FaInstagram, 
  FaApple, FaEye, FaEyeSlash, FaCheckCircle,
  FaTshirt, FaHeart, FaShoppingBag, FaArrowRight
} from 'react-icons/fa';
import './AuthModal.css';

const AuthModal = ({ mode = 'login', onClose, onLogin, onSwitchMode }) => {
  const [activeTab, setActiveTab] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    const newErrors = {};
    if (activeTab === 'register') {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!agreeTerms) {
        newErrors.terms = "Please agree to terms";
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (activeTab === 'login') {
        onLogin({ 
          email: formData.email, 
          name: 'User',
          avatar: '/images/avatars/user.jpg'
        });
      } else {
        onLogin({ 
          email: formData.email, 
          name: formData.firstName || 'User',
          avatar: '/images/avatars/user.jpg'
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    // Check password strength for registration
    if (name === 'password' && activeTab === 'register') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    setPasswordStrength(Math.min(strength, 100));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return '#dc2626';
    if (passwordStrength < 75) return '#f59e0b';
    return '#10b981';
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { delay: 0.2 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Modal 
      show={true} 
      onHide={onClose} 
      centered 
      dialogClassName="asb-auth-modal"
      backdrop="static"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Modal.Header className="asb-auth-header">
          <div className="auth-brand">
            <div className="brand-icon">
              <FaTshirt />
            </div>
            <div className="brand-text">
              <h3>ASB<span>FASHION</span></h3>
              <p>Beyond Tradition</p>
            </div>
          </div>
          <button
            type="button"
            className="auth-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </Modal.Header>
        
        <Modal.Body className="asb-auth-body">
          {/* Tab Switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              <FaUser className="tab-icon" />
              Sign In
            </button>
            <button
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              <FaHeart className="tab-icon" />
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Form onSubmit={handleSubmit} className="auth-form">
                {activeTab === 'register' && (
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label className="auth-label">First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className={`auth-input ${errors.firstName ? 'is-invalid' : ''}`}
                          required
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label className="auth-label">Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className={`auth-input ${errors.lastName ? 'is-invalid' : ''}`}
                          required
                        />
                      </Form.Group>
                    </div>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="auth-label">
                    <FaEnvelope className="me-2" />
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`auth-input ${errors.email ? 'is-invalid' : ''}`}
                    required
                  />
                </Form.Group>

                {activeTab === 'register' && (
                  <Form.Group className="mb-3">
                    <Form.Label className="auth-label">
                      <FaUser className="me-2" />
                      Phone Number (Optional)
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 77 123 4567"
                      className="auth-input"
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="auth-label">
                    <FaLock className="me-2" />
                    Password
                  </Form.Label>
                  <div className="password-input-wrapper">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={activeTab === 'login' ? "Enter your password" : "Create a password"}
                      className={`auth-input ${errors.password ? 'is-invalid' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  
                  {activeTab === 'register' && formData.password && (
                    <div className="password-strength mt-2">
                      <div className="strength-bar">
                        <div 
                          className="strength-fill"
                          style={{ 
                            width: `${passwordStrength}%`,
                            backgroundColor: getPasswordStrengthColor()
                          }}
                        />
                      </div>
                      <small style={{ color: getPasswordStrengthColor() }}>
                        {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Medium' : 'Strong'} password
                      </small>
                    </div>
                  )}
                </Form.Group>

                {activeTab === 'register' && (
                  <Form.Group className="mb-3">
                    <Form.Label className="auth-label">Confirm Password</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className={`auth-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <Form.Text className="text-danger">
                        {errors.confirmPassword}
                      </Form.Text>
                    )}
                  </Form.Group>
                )}

                {activeTab === 'login' && (
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      label="Remember me"
                      className="auth-checkbox"
                    />
                    <a href="/forgot-password" className="forgot-password">
                      Forgot password?
                    </a>
                  </div>
                )}

                {activeTab === 'register' && (
                  <div className="terms-section mb-4">
                    <Form.Check
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      label={
                        <span className="terms-label">
                          I agree to the <a href="/terms">Terms of Service</a> and{' '}
                          <a href="/privacy">Privacy Policy</a>
                        </span>
                      }
                      className={`auth-checkbox ${errors.terms ? 'is-invalid' : ''}`}
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="auth-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                      <FaArrowRight className="ms-2" />
                    </>
                  )}
                </Button>

                <div className="auth-divider">
                  <span>or continue with</span>
                </div>

                <div className="social-auth">
                  <button type="button" className="social-btn google">
                    <FaGoogle />
                    <span>Google</span>
                  </button>
                  <button type="button" className="social-btn facebook">
                    <FaFacebook />
                    <span>Facebook</span>
                  </button>
                  <button type="button" className="social-btn instagram">
                    <FaInstagram />
                    <span>Instagram</span>
                  </button>
                </div>

                {activeTab === 'login' && (
                  <div className="auth-footer text-center mt-4">
                    <p className="mb-0">
                      New to ASB FASHION?{' '}
                      <button
                        type="button"
                        className="switch-auth-btn"
                        onClick={() => setActiveTab('register')}
                      >
                        Create an account
                      </button>
                    </p>
                  </div>
                )}

                {activeTab === 'register' && (
                  <div className="auth-footer text-center mt-4">
                    <p className="mb-0">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="switch-auth-btn"
                        onClick={() => setActiveTab('login')}
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                )}
              </Form>
            </motion.div>
          </AnimatePresence>

          {/* Trust Badges */}
          <div className="auth-trust-badges">
            <div className="trust-item">
              <FaShoppingBag className="text-danger" />
              <span>Secure Checkout</span>
            </div>
            <div className="trust-item">
              <FaHeart className="text-danger" />
              <span>100% Authentic</span>
            </div>
            <div className="trust-item">
              <FaCheckCircle className="text-danger" />
              <span>Member Benefits</span>
            </div>
          </div>
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default AuthModal;