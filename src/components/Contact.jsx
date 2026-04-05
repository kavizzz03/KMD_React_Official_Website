import React, { useState } from "react";
import "./Contact.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaPaperPlane, 
  FaMap,
  FaUser,
  FaTag,
  FaComment,
  FaCookie,
  FaCandyCane,
  FaBirthdayCake,
  FaIceCream
} from "react-icons/fa";

const API_URL = "https://kmd.cpsharetxt.com/send_message.php";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.warn("🦄 Please fill out all fields!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(API_URL, formData);

      if (res.data.status === "success") {
        toast.success("🎉 Sweet! Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("❌ Oops! Error sending message. Please try again.");
      }
    } catch (err) {
      toast.error("⚠️ Server error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      {/* Animated Background */}
      <div className="contact-bg-pattern"></div>
      
      {/* Floating Sweet Elements */}
      <div className="floating-sweets-contact">
        <div className="floating-sweet-contact">🍬</div>
        <div className="floating-sweet-contact">🍪</div>
        <div className="floating-sweet-contact">🎂</div>
        <div className="floating-sweet-contact">🧁</div>
        <div className="floating-sweet-contact">🍫</div>
        <div className="floating-sweet-contact">🍭</div>
        <div className="floating-sweet-contact">🍩</div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header Section */}
      <div className="contact-header">
        <h1 className="contact-title">Sweet Conversations</h1>
        <p className="contact-subtitle">
          Got questions or special requests? We're all ears! Send us a message and let's create something sweet together.
        </p>
      </div>

      {/* Main Content */}
      <div className="contact-content">
        {/* Contact Form */}
        <div className="contact-form-container">
          <div className="form-glass">
            <div className="form-header">
              <h2 className="form-title">Send Sweet Message</h2>
              <p className="form-subtitle">We'll whip up a response faster than you can say "delicious!"</p>
            </div>

            <form onSubmit={handleSubmit} className="creative-form">
              <div className="form-group">
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Sweet Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    disabled={loading}
                  />
                  <FaUser className="form-icon" />
                </div>
              </div>

              <div className="form-group">
                <div className="form-input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    disabled={loading}
                  />
                  <FaEnvelope className="form-icon" />
                </div>
              </div>

              <div className="form-group">
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Message Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                    disabled={loading}
                  />
                  <FaTag className="form-icon" />
                </div>
              </div>

              <div className="form-group">
                <div className="form-input-wrapper">
                  <textarea
                    name="message"
                    placeholder="Your sweet message here... 🍪"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    disabled={loading}
                  ></textarea>
                  <FaComment className="form-icon" />
                </div>
              </div>

              <div className="submit-btn-wrapper">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`creative-submit-btn ${loading ? 'loading' : ''}`}
                >
                  {loading ? "Baking Your Message..." : "Send Sweet Message"}
                  {!loading && <FaPaperPlane />}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="contact-info-creative">
          {/* Location Card */}
          <div className="info-card-glass">
            <div className="info-header">
              <div className="info-icon-wrapper">
                <FaMapMarkerAlt />
              </div>
              <h3 className="info-title">Visit Our Sweet Haven</h3>
            </div>
            <div className="info-content">
              <p>12/D/2, High Level Road</p>
              <p>Thunnana, Hanwella</p>
              <p>Come taste the magic! ✨</p>
            </div>
          </div>

          {/* Contact Card */}
          <div className="info-card-glass">
            <div className="info-header">
              <div className="info-icon-wrapper">
                <FaPhone />
              </div>
              <h3 className="info-title">Call Us Anytime</h3>
            </div>
            <div className="info-content">
              <p>+94 777189893</p>
              <p>011 2831705</p>
              <p>We're just a call away! 📞</p>
            </div>
          </div>

          {/* Hours & Email Card */}
          <div className="info-card-glass">
            <div className="info-header">
              <div className="info-icon-wrapper">
                <FaClock />
              </div>
              <h3 className="info-title">Sweet Hours & Contact</h3>
            </div>
            <div className="info-content">
              <p><strong>Open Daily:</strong> 8:00 AM - 8:00 PM</p>
              <p><strong>Email:</strong> kmdproduction2025@gmail.com</p>
              <p>Fresh sweets daily! 🎂</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="social-links-creative">
            <a href="#" className="social-link-creative" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-link-creative" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://wa.me/94777189893" className="social-link-creative" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="map-section-creative">
        <h3 className="map-title">Find Our Sweet Spot</h3>
        <div className="map-container-creative">
          <div className="map-interactive">
            <FaMap className="map-icon-creative" />
            <h4>KMD Sweet House</h4>
            <p>12/D/2, High Level Road</p>
            <p>Thunnana, Hanwella</p>
            <p>Where sweetness lives! 🏡</p>
            <a 
              href="https://maps.app.goo.gl/xZMSKuc7cDdJSH3b9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="map-link-creative"
            >
              <FaMapMarkerAlt />
              Find Us on Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;