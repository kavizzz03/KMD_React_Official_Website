import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Carousel, Row, Col, Card, Button, Container, Badge, Spinner } from "react-bootstrap";
import ProductCard from "./ProductCard";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaInstagram, 
  FaFacebook, 
  FaWhatsapp,
  FaStar,
  FaShippingFast,
  FaLeaf,
  FaAward,
  FaUtensils,
  FaHeart,
  FaClock,
  FaUsers,
  FaShoppingBag
} from "react-icons/fa";
import "./HomePage.css";

const API_BASE = "https://kmd.cpsharetxt.com/api";

const HomePage = () => {
  const [slides, setSlides] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [slidesRes, bestRes, recentRes] = await Promise.all([
          axios.get(`${API_BASE}/get_slides.php`),
          axios.get(`${API_BASE}/get_products.php`, { params: { type: "best_seller", limit: 6 } }),
          axios.get(`${API_BASE}/get_products.php`, { params: { type: "all", limit: 6 } })
        ]);
        
        console.log("API Response - Slides:", slidesRes.data);
        console.log("API Response - Best Sellers:", bestRes.data);
        console.log("API Response - Recent Products:", recentRes.data);
        
        setSlides(slidesRes.data || []);
        setBestSellers(bestRes.data || []);
        setRecentProducts(recentRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Set reliable fallback data
        setSlides([
          {
            id: 1,
            title: "Welcome to KMD Sweet House",
            description: "Experience the authentic taste of traditional Sri Lankan sweets made with love and generations-old recipes",
            image_url: "/images/hero-bg.jpg"
          }
        ]);
        setBestSellers([]);
        setRecentProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Simple loading component
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="warning" style={{ width: '3rem', height: '3rem' }} />
          <h4 className="mt-3 text-warning">Loading Sweet Delights...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        {slides && slides.length > 0 ? (
          <Carousel fade interval={5000} controls indicators className="hero-carousel">
            {slides.map((slide, index) => (
              <Carousel.Item key={slide.id || index}>
                <div 
                  className="hero-slide d-flex align-items-center justify-content-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${slide.image_url ? `https://kmd.cpsharetxt.com/${slide.image_url}` : '/images/hero-bg.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '80vh',
                    width: '100%'
                  }}
                >
                  <Container>
                    <div className="hero-content text-white text-center">
                      <Badge bg="warning" text="dark" className="mb-3 px-3 py-2 fs-6">
                        Premium Sri Lankan Sweets
                      </Badge>
                      <h1 className="display-4 fw-bold mb-3">
                        {slide.title || "KMD Sweet House"}
                      </h1>
                      <p className="lead mb-4 fs-5">
                        {slide.description || "Traditional sweets made with love and generations-old recipes"}
                      </p>
                      <div className="hero-buttons">
                        <Button variant="warning" size="lg" className="me-3 px-4 py-2 fw-bold" href="/products">
                          <FaShoppingBag className="me-2" />
                          Shop Now
                        </Button>
                        <Button variant="outline-light" size="lg" className="px-4 py-2" href="#about">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </Container>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          // Fallback hero section
          <div 
            className="hero-fallback d-flex align-items-center justify-content-center"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              minHeight: '80vh',
              color: 'white'
            }}
          >
            <Container>
              <div className="text-center">
                <Badge bg="warning" text="dark" className="mb-3 px-3 py-2 fs-6">
                  Premium Sri Lankan Sweets
                </Badge>
                <h1 className="display-4 fw-bold mb-3">KMD Sweet House</h1>
                <p className="lead mb-4 fs-5">
                  Experience the authentic taste of traditional Sri Lankan sweets made with love and generations-old recipes
                </p>
                <div className="hero-buttons">
                  <Button variant="warning" size="lg" className="me-3 px-4 py-2 fw-bold" href="/products">
                    <FaShoppingBag className="me-2" />
                    Shop Now
                  </Button>
                  <Button variant="outline-light" size="lg" className="px-4 py-2" href="#about">
                    Learn More
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-warning text-dark">
        <Container>
          <Row className="text-center g-4">
            <Col md={3} sm={6}>
              <div className="p-3">
                <FaUsers size={40} className="mb-3" />
                <h3 className="fw-bold mb-2">5000+</h3>
                <p className="mb-0 fw-medium">Happy Customers</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="p-3">
                <FaAward size={40} className="mb-3" />
                <h3 className="fw-bold mb-2">50+</h3>
                <p className="mb-0 fw-medium">Sweet Varieties</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="p-3">
                <FaClock size={40} className="mb-3" />
                <h3 className="fw-bold mb-2">11+</h3>
                <p className="mb-0 fw-medium">Years Experience</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="p-3">
                <FaHeart size={40} className="mb-3" />
                <h3 className="fw-bold mb-2">100%</h3>
                <p className="mb-0 fw-medium">Quality Guarantee</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Why Choose KMD Sweet House?</h2>
            <p className="text-muted fs-5">
              Experience the authentic taste of Sri Lankan tradition in every bite
            </p>
          </div>
          
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <FaLeaf size={50} className="text-warning" />
                  </div>
                  <h5 className="fw-bold mb-3">Traditional Recipes</h5>
                  <p className="text-muted">
                    Authentic Sri Lankan sweets made with generations-old family recipes preserved for decades
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <FaAward size={50} className="text-warning" />
                  </div>
                  <h5 className="fw-bold mb-3">Premium Quality</h5>
                  <p className="text-muted">
                    Finest natural ingredients carefully selected for the most delicious and authentic sweets
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <FaShippingFast size={50} className="text-warning" />
                  </div>
                  <h5 className="fw-bold mb-3">Fresh Daily</h5>
                  <p className="text-muted">
                    Made fresh every morning with love and care, ensuring perfect quality and taste
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Best Sellers Section */}
      <section className="products-section py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Customer Favorites</h2>
            <p className="text-muted fs-5">Our most loved traditional sweets</p>
          </div>
          
          {bestSellers && bestSellers.length > 0 ? (
            <Row xs={1} sm={2} md={3} className="g-4">
              {bestSellers.map(product => (
                <Col key={product.id}>
                  <ProductCard p={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <FaAward size={60} className="text-warning mb-3" />
              <h5 className="text-muted">Featured Products Coming Soon</h5>
              <p className="text-muted">Our delicious sweets will be available here shortly</p>
              <Button variant="outline-warning" href="/products">
                Explore All Sweets
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Recent Products Section */}
      <section className="products-section py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">New Arrivals</h2>
            <p className="text-muted fs-5">Discover our latest sweet creations</p>
          </div>
          
          {recentProducts && recentProducts.length > 0 ? (
            <Row xs={1} sm={2} md={3} className="g-4">
              {recentProducts.map(product => (
                <Col key={product.id}>
                  <ProductCard p={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <FaUtensils size={60} className="text-warning mb-3" />
              <h5 className="text-muted">New Creations in Progress</h5>
              <p className="text-muted">We're preparing some amazing new sweets for you</p>
            </div>
          )}
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="about-section py-5 text-white" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2 fs-6">Our Story</Badge>
              <h2 className="fw-bold mb-4">About KMD Sweet House</h2>
              <p className="mb-4 fs-5">
                Welcome to KMD Sweet House, where tradition meets taste! For over 11 years, we've been serving 
                the most authentic Sri Lankan sweets to families across the island.
              </p>
              <p className="mb-4 fs-5">
                From classic Milk Sweets to festive Konda Kavum, we bring joy to every bite with authentic 
                Sri Lankan flavors passed down through generations.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <span className="d-flex align-items-center">
                  <FaStar className="text-warning me-2" /> Family Recipes
                </span>
                <span className="d-flex align-items-center">
                  <FaLeaf className="text-warning me-2" /> Natural Ingredients
                </span>
                <span className="d-flex align-items-center">
                  <FaAward className="text-warning me-2" /> Premium Quality
                </span>
              </div>
              <Button variant="light" size="lg" className="fw-bold">
                Read Our Story
              </Button>
            </Col>
            <Col lg={6} className="text-center">
              <div className="about-image p-5">
                <FaUtensils size={120} className="text-warning" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Store Info Section */}
      <section className="store-section py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Visit Our Sweet Haven</h2>
            <p className="text-muted fs-5">Experience the wonderful aroma of fresh sweets at our store</p>
          </div>
          
          <Row className="align-items-center">
            <Col lg={6}>
              <Card className="h-100 border-0 shadow">
                <Card.Body className="p-4">
                  <h3 className="fw-bold mb-4">Main Branch</h3>
                  <div className="mb-4">
                    <p className="d-flex align-items-center mb-3">
                      <FaMapMarkerAlt className="text-warning me-3 fs-5" />
                      <span>12/D/2, High Level Road, Thunnana, Hanwella</span>
                    </p>
                    <p className="d-flex align-items-center mb-3">
                      <FaPhone className="text-warning me-3 fs-5" />
                      <span>+94 777189893</span>
                    </p>
                    <p className="d-flex align-items-center mb-3">
                      <FaPhone className="text-warning me-3 fs-5" />
                      <span>011 2831705</span>
                    </p>
                    <p className="d-flex align-items-center mb-3">
                      <FaEnvelope className="text-warning me-3 fs-5" />
                      <span>kmdproduction2025@gmail.com</span>
                    </p>
                  </div>
                  <div className="d-grid gap-2 d-md-flex">
                    <Button variant="warning" className="flex-fill me-md-2" href="https://maps.app.goo.gl/xZMSKuc7cDdJSH3b9" target="_blank">
                      <FaMapMarkerAlt className="me-2" /> Get Directions
                    </Button>
                    <Button variant="outline-warning" className="flex-fill" href="tel:+94777189893">
                      <FaPhone className="me-2" /> Call Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mt-4 mt-lg-0">
              <Card className="border-0 shadow text-center h-100">
                <Card.Body className="p-5 d-flex flex-column justify-content-center">
                  <FaMapMarkerAlt size={60} className="text-warning mb-3 mx-auto" />
                  <h4 className="fw-bold mb-3">Visit Our Store</h4>
                  <p className="text-muted mb-4">
                    12/D/2, High Level Road<br />
                    Thunnana, Hanwella
                  </p>
                  <Button variant="warning" href="https://maps.app.goo.gl/xZMSKuc7cDdJSH3b9" target="_blank">
                    Open in Google Maps
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="contact-section py-5 bg-dark text-white">
        <Container>
          <div className="text-center">
            <h2 className="fw-bold mb-4">Connect With Us</h2>
            <p className="fs-5 mb-4">
              We'd love to hear from you! Reach out for orders, inquiries, or just to say hello.
            </p>
            
            <div className="contact-info mb-4">
              <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 fs-5 mb-4">
                <div className="d-flex align-items-center">
                  <FaPhone className="me-2 text-warning" />
                  <span>+94 777189893</span>
                </div>
                <div className="d-flex align-items-center">
                  <FaPhone className="me-2 text-warning" />
                  <span>011 2831705</span>
                </div>
                <div className="d-flex align-items-center">
                  <FaEnvelope className="me-2 text-warning" />
                  <span>kmdproduction2025@gmail.com</span>
                </div>
              </div>
            </div>
            
            <div className="social-links d-flex justify-content-center gap-3">
              <a href="https://www.facebook.com/share/1Cd3cf2AhS/" className="btn btn-outline-light rounded-circle p-3">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/kmdsweethouse?igsh=MXhyYTZxaXMzeGtx" className="btn btn-outline-light rounded-circle p-3">
                <FaInstagram />
              </a>
              <a href="https://wa.me/94777189893" target="_blank" rel="noopener noreferrer" className="btn btn-success rounded-circle p-3">
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* WhatsApp Float Button */}
      <div className="whatsapp-float">
        <a 
          href="https://wa.me/94777189893" 
          target="_blank" 
          rel="noopener noreferrer"
          className="whatsapp-btn d-flex align-items-center justify-content-center rounded-circle shadow"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            backgroundColor: '#25D366',
            color: 'white',
            textDecoration: 'none',
            zIndex: 1000
          }}
        >
          <FaWhatsapp size={24} />
        </a>
      </div>
    </div>
  );
};

export default HomePage;