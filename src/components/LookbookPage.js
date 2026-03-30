import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Modal, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeart, FaShare, FaEye, FaInstagram, FaTiktok, FaYoutube,
  FaChevronLeft, FaChevronRight, FaLayerGroup, FaRegHeart, 
  FaRegEye, FaShoppingBag, FaPalette, FaCamera, FaArrowRight,
  FaGem, FaCrown, FaInfinity, FaQuoteLeft, FaStar, FaFire
} from "react-icons/fa";
import "./LookbookPage.css";

const LookbookPage = () => {
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0); 
  const [likedItems, setLikedItems] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    fetch("https://whats.asbfashion.com/api/get_lookbook.php")
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handleLike = async (id, e) => {
    if(e) e.stopPropagation();
    try {
      const response = await fetch("https://whats.asbfashion.com/api/update_likes.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
      });
      if (response.ok) {
        setItems(prev => prev.map(item => item.id === id ? { ...item, likes: (item.likes || 0) + 1 } : item));
        if(selectedItem?.id === id) setSelectedItem(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
        setLikedItems(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setLikedItems(prev => ({ ...prev, [id]: false })), 1000);
      }
    } catch (error) { console.error(error); }
  };

  const getFullGallery = () => {
    if (!selectedItem) return [];
    return [selectedItem.image, ...(selectedItem.all_images || [])].filter(img => img);
  };

  if (loading) return (
    <div className="lookbook-loading-container">
      <div className="loading-content">
        <div className="loading-animation">
          <FaGem className="loading-sparkle" />
          <Spinner animation="border" variant="danger" className="loading-spinner" />
        </div>
        <h4>ASB FASHION</h4>
        <p>Curating exclusive looks for you...</p>
        <div className="loading-progress">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div 
      className="asb-lookbook-primary-red"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section - Red Primary */}
      <section className="lookbook-hero-primary-red">
        <div className="hero-bg-pattern"></div>
        <div className="hero-overlay-primary-red">
          <Container>
            <motion.div 
              className="hero-content-primary-red"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="hero-floating-badge"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaCrown className="crown-icon" />
                <span>ASB EXCLUSIVE COLLECTION</span>
                <FaGem className="gem-icon" />
              </motion.div>
              
              <h1 className="hero-title-primary-red">
                <span className="title-gradient">Style</span>
                <span className="title-accent">Reimagined</span>
              </h1>
              
              <p className="hero-subtitle-primary-red">
                Experience the essence of luxury fashion with our curated lookbook
              </p>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <FaInfinity className="stat-icon" />
                  <span>{items.length}+ Exclusive Looks</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <FaCamera className="stat-icon" />
                  <span>2026 Collection</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <FaStar className="stat-icon" />
                  <span>Premium Quality</span>
                </div>
              </div>
            </motion.div>
          </Container>
        </div>
      </section>

      {/* Featured Filter Bar - Red Primary */}
      <section className="featured-filter-section">
        <Container>
          <motion.div 
            className="filter-bar-primary-red"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="filter-left">
              <FaFire className="filter-sparkle" />
              <span className="filter-label">Trending Collection</span>
            </div>
            <div className="filter-right">
              <div className="result-count-primary-red">
                <span className="count-number">{items.length}</span>
                <span className="count-text">Signature Looks</span>
              </div>
              <div className="luxury-badge-primary-red">
                <FaGem />
                <span>ASB Signature</span>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Lookbook Grid - Red Primary Cards */}
      <Container className="lookbook-grid-primary-red">
        <Row className="g-5">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <Col lg={4} md={6} key={item.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.08 }}
                  onHoverStart={() => setHoveredItem(item.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                >
                  <Card className="lookbook-card-primary-red">
                    <div className="card-image-wrapper">
                      <div className="card-image-container">
                        <Card.Img 
                          variant="top" 
                          src={item.image} 
                          className={`card-image-primary-red ${hoveredItem === item.id ? 'image-zoom' : ''}`}
                        />
                        <div className="image-glow-effect"></div>
                      </div>
                      
                      <div className="card-badges-primary-red">
                        <Badge className="pieces-badge-primary-red">
                          <FaLayerGroup className="me-1" /> {item.items_count || 3} Pieces
                        </Badge>
                        {item.category && (
                          <Badge className="category-badge-primary-red">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      
                      <motion.div 
                        className="card-overlay-primary-red"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button 
                          variant="danger" 
                          className="view-details-btn-primary-red"
                          onClick={() => { 
                            setSelectedItem(item); 
                            setShowModal(true); 
                            setActiveImgIdx(0); 
                          }}
                        >
                          <FaEye className="me-2" /> Explore Look
                          <FaArrowRight className="ms-2" />
                        </Button>
                      </motion.div>
                      
                      <motion.button 
                        className={`like-btn-primary-red ${likedItems[item.id] ? 'liked' : ''}`}
                        onClick={(e) => handleLike(item.id, e)}
                        whileTap={{ scale: 0.9 }}
                        animate={likedItems[item.id] ? { scale: [1, 1.2, 1] } : {}}
                      >
                        <FaHeart />
                        <span className="like-tooltip">Love it</span>
                      </motion.button>
                    </div>
                    
                    <Card.Body className="card-body-primary-red">
                      <div className="card-title-section">
                        <h5 className="card-title-primary-red">{item.title}</h5>
                        <div className="card-stats">
                          <div className="stat-like">
                            <FaHeart className={`stat-icon-heart ${likedItems[item.id] ? 'liked-icon' : ''}`} />
                            <span>{item.likes || 0}</span>
                          </div>
                          <div className="stat-view">
                            <FaRegEye />
                            <span>1.2k</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="card-description-primary-red">
                        {item.description?.substring(0, 80) || "Discover this stunning piece from our latest collection..."}
                      </p>
                      
                      <div className="card-footer-primary-red">
                        <div className="designer-tag">
                          <FaQuoteLeft className="quote-icon" />
                          <span>ASB Studio</span>
                        </div>
                        <div className="shop-hint">
                          <FaShoppingBag />
                          <span>Shop now</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </AnimatePresence>
        </Row>
      </Container>

      {/* Empty State */}
      {items.length === 0 && (
        <motion.div 
          className="empty-state-primary-red"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="empty-state-content">
            <FaCamera className="empty-icon-primary-red" />
            <h3>Coming Soon</h3>
            <p>New luxury collections are being curated for you</p>
            <Button 
              variant="danger" 
              className="empty-state-btn"
              onClick={() => window.location.reload()}
            >
              Refresh Collection
            </Button>
          </div>
        </motion.div>
      )}

      {/* Enhanced Modal - Red Primary Theme */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="xl" 
        centered
        dialogClassName="lookbook-modal-primary-red"
      >
        <Modal.Header closeButton className="modal-header-primary-red">
          <Modal.Title className="modal-title-primary-red">
            <div className="title-wrapper">
              <FaGem className="title-icon" />
              <span className="modal-title-text">{selectedItem?.title}</span>
            </div>
            {selectedItem?.category && (
              <Badge className="modal-category-badge-primary-red">{selectedItem.category}</Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-primary-red">
          {selectedItem && (
            <Row className="g-5">
              <Col lg={7}>
                <div className="gallery-primary-red">
                  <div className="main-image-wrapper">
                    <img 
                      src={getFullGallery()[activeImgIdx]} 
                      className="main-image-primary-red" 
                      alt="gallery" 
                    />
                    {getFullGallery().length > 1 && (
                      <>
                        <button 
                          className="gallery-nav-btn-primary-red prev"
                          onClick={() => setActiveImgIdx(prev => (prev - 1 + getFullGallery().length) % getFullGallery().length)}
                        >
                          <FaChevronLeft />
                        </button>
                        <button 
                          className="gallery-nav-btn-primary-red next"
                          onClick={() => setActiveImgIdx(prev => (prev + 1) % getFullGallery().length)}
                        >
                          <FaChevronRight />
                        </button>
                      </>
                    )}
                  </div>
                  {getFullGallery().length > 1 && (
                    <div className="thumbnail-strip">
                      {getFullGallery().map((img, idx) => (
                        <motion.div 
                          key={idx} 
                          className={`thumbnail-item ${activeImgIdx === idx ? 'active' : ''}`}
                          onClick={() => setActiveImgIdx(idx)}
                          whileHover={{ scale: 1.05 }}
                        >
                          <img src={img} alt={`thumb-${idx}`} className="thumbnail-img" />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
              
              <Col lg={5}>
                <div className="details-primary-red">
                  <div className="detail-section">
                    <div className="collection-badge-primary-red">
                      <FaLayerGroup />
                      <span><strong>{selectedItem.items_count || 3}</strong> Piece Ensemble</span>
                    </div>
                  </div>

                  <div className="detail-section designer-notes-primary-red">
                    <h6>
                      <FaQuoteLeft className="section-icon" />
                      Designer's Narrative
                    </h6>
                    <p>{selectedItem.description || "A masterpiece of contemporary fashion, blending tradition with modern aesthetics."}</p>
                  </div>

                  {selectedItem.colors && selectedItem.colors.length > 0 && (
                    <div className="detail-section color-palette-primary-red">
                      <h6>
                        <FaPalette className="section-icon" />
                        Chromatic Story
                      </h6>
                      <div className="color-swatches-primary-red">
                        {selectedItem.colors.map((c, i) => (
                          <motion.div 
                            key={i} 
                            className="color-swatch-primary-red"
                            style={{ backgroundColor: c }}
                            whileHover={{ scale: 1.1 }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="detail-section style-tags-primary-red">
                    <h6>Style Essence</h6>
                    <div className="tags-container-primary-red">
                      <span className="tag-primary-red">Premium</span>
                      <span className="tag-primary-red">Artisanal</span>
                      <span className="tag-primary-red">Contemporary</span>
                      <span className="tag-primary-red">Statement</span>
                    </div>
                  </div>

                  <div className="action-section">
                    <Button variant="danger" size="lg" className="shop-btn-primary-red">
                      <FaShoppingBag className="me-2" /> Purchase This Look
                      <FaArrowRight className="ms-2" />
                    </Button>
                    <div className="action-group">
                      <motion.Button 
                        variant="outline-danger" 
                        className="action-btn-primary-red"
                        onClick={() => handleLike(selectedItem.id)}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaHeart className={`me-2 ${likedItems[selectedItem.id] ? 'liked-heart' : ''}`} />
                        {selectedItem.likes || 0} Likes
                      </motion.Button>
                      <motion.Button 
                        variant="outline-secondary" 
                        className="action-btn-primary-red"
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaShare className="me-2" /> Share
                      </motion.Button>
                    </div>
                  </div>
                  
                  <div className="social-share-primary-red">
                    <span>Share the inspiration</span>
                    <div className="social-icons">
                      <FaInstagram />
                      <FaTiktok />
                      <FaYoutube />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default LookbookPage;