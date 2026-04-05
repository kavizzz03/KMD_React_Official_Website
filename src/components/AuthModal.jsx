import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, Button, Form, Tab, Tabs } from 'react-bootstrap';
import { FaTimes, FaUser, FaLock, FaEnvelope, FaGoogle, FaFacebook } from 'react-icons/fa';

const AuthModal = ({ mode = 'login', onClose, onLogin, onSwitchMode }) => {
  const [activeTab, setActiveTab] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login/registration
    if (activeTab === 'login') {
      onLogin({ email: formData.email, name: 'User' });
    } else {
      onLogin({ email: formData.email, name: formData.firstName });
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Modal show centered onHide={onClose} className="auth-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <Modal.Header className="border-0 position-relative">
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            onClick={onClose}
            aria-label="Close"
          />
        </Modal.Header>
        
        <Modal.Body className="px-4 pb-4">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4 border-0"
            fill
          >
            <Tab eventKey="login" title="Sign In">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope className="text-muted" />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock className="text-muted" />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button type="submit" variant="warning" size="lg" className="w-100 mb-3">
                    Sign In
                  </Button>
                </Form>
              </motion.div>
            </Tab>
            
            <Tab eventKey="register" title="Create Account">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First name"
                          required
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last name"
                          required
                        />
                      </Form.Group>
                    </div>
                  </div>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </Form.Group>

                  <Button type="submit" variant="warning" size="lg" className="w-100">
                    Create Account
                  </Button>
                </Form>
              </motion.div>
            </Tab>
          </Tabs>

          <div className="text-center">
            <div className="divider mb-4">
              <span className="px-3 bg-white text-muted">or continue with</span>
            </div>
            
            <div className="d-flex gap-3 justify-content-center">
              <Button variant="outline-danger" className="social-btn">
                <FaGoogle />
              </Button>
              <Button variant="outline-primary" className="social-btn">
                <FaFacebook />
              </Button>
            </div>
          </div>
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default AuthModal;