import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Button, Modal, Carousel, Form } from "react-bootstrap";
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaImage, FaChevronLeft, FaChevronRight, 
  FaHeart, FaShare, FaDownload, FaCamera, FaClock, FaTag, FaArrowRight, 
  FaSearch, FaFilter, FaEye, FaRegHeart, FaExpand, FaPlay, FaTh, FaThList, 
  FaTimes, FaGem, FaCrown, FaTrophy, FaUsers, FaArrowUp, FaArrowDown, 
  FaGift, FaStar, FaInfoCircle, FaBriefcase, FaChalkboardTeacher, 
  FaHandsHelping, FaGlassCheers, FaAward, FaCalendarCheck, FaBuilding,
  FaRegCalendar, FaRegClock, FaUserTie, FaChartLine, FaRocket, FaLightbulb
} from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./GalleryPage.css";

const API_BASE = "https://whats.asbfashion.com/api";

// Event Category Icons
const categoryIcons = {
  'csr': <FaHandsHelping />,
  'training': <FaChalkboardTeacher />,
  'leadership': <FaUserTie />,
  'celebration': <FaGlassCheers />,
  'award': <FaAward />,
  'team-building': <FaUsers />,
  'workshop': <FaLightbulb />,
  'default': <FaCalendarAlt />
};

const GalleryPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [likedEvents, setLikedEvents] = useState({});
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [fullGalleryImages, setFullGalleryImages] = useState([]);
  const [fullGalleryTitle, setFullGalleryTitle] = useState("");
  
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Events", icon: <FaStar />, color: "#dc2626" },
    { id: "csr", name: "CSR Projects", icon: <FaHandsHelping />, color: "#10b981" },
    { id: "training", name: "Training Programs", icon: <FaChalkboardTeacher />, color: "#3b82f6" },
    { id: "leadership", name: "Leadership", icon: <FaUserTie />, color: "#8b5cf6" },
    { id: "celebration", name: "Celebrations", icon: <FaGlassCheers />, color: "#f59e0b" },
    { id: "team-building", name: "Team Building", icon: <FaUsers />, color: "#06b6d4" },
    { id: "workshop", name: "Workshops", icon: <FaLightbulb />, color: "#ef4444" },
    { id: "award", name: "Awards", icon: <FaAward />, color: "#f97316" }
  ];

  // Years for filtering
  const years = ["all", "2024", "2023", "2022", "2021"];

  useEffect(() => {
    fetchEvents();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle URL params without redirecting
  useEffect(() => {
    if (id && events.length > 0) {
      const event = events.find(e => e.id === parseInt(id));
      if (event) {
        openEventModal(event);
      }
    }
  }, [id, events]);

  const handleScroll = () => {
    setShowBackToTop(window.pageYOffset > 500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/get_events.php`);
      if (response.data.success) {
        // Add category to events based on title/description
        const eventsWithCategory = response.data.events.map(event => ({
          ...event,
          category: detectCategory(event),
          status: getEventStatus(event.event_date)
        }));
        setEvents(eventsWithCategory);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (eventDate) => {
    if (!eventDate) return "completed";
    const event = new Date(eventDate);
    const now = new Date();
    
    if (event > now) return "upcoming";
    if (event.toDateString() === now.toDateString()) return "ongoing";
    return "completed";
  };

  const detectCategory = (event) => {
    const title = event.title?.toLowerCase() || "";
    const desc = event.description?.toLowerCase() || "";
    
    if (title.includes("csr") || title.includes("community") || desc.includes("social responsibility")) return "csr";
    if (title.includes("training") || title.includes("workshop") || desc.includes("skill development")) return "training";
    if (title.includes("leadership") || title.includes("management")) return "leadership";
    if (title.includes("celebration") || title.includes("party") || title.includes("festival")) return "celebration";
    if (title.includes("team") || title.includes("building") || title.includes("bonding")) return "team-building";
    if (title.includes("award") || title.includes("recognition") || title.includes("ceremony")) return "award";
    if (title.includes("workshop") || title.includes("seminar")) return "workshop";
    return "default";
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    // Update URL without reloading the page
    window.history.pushState({}, '', `/gallery/${event.id}`);
  };

  const closeEventModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    // Reset URL without reloading
    window.history.pushState({}, '', '/gallery');
  };

  const openFullGallery = (event) => {
    setFullGalleryImages(event.images || []);
    setFullGalleryTitle(event.title);
    setShowFullGallery(true);
  };

  const handleLike = (eventId, e) => {
    e.stopPropagation();
    setLikedEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const openImageViewer = (index) => {
    setSelectedImageIndex(index);
    setShowImageViewer(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const getEventYear = (dateString) => {
    if (!dateString) return "2024";
    return new Date(dateString).getFullYear().toString();
  };

  const getStatusConfig = (status) => {
    const configs = {
      upcoming: { color: 'warning', text: 'Upcoming', icon: <FaClock />, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      ongoing: { color: 'success', text: 'In Progress', icon: <FaPlay />, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
      completed: { color: 'secondary', text: 'Completed', icon: <FaTrophy />, gradient: 'linear-gradient(135deg, #6b7280, #4b5563)' }
    };
    return configs[status] || configs.completed;
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === "all" || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === "all" || getEventYear(event.event_date) === filterYear;
    return matchesCategory && matchesSearch && matchesYear;
  });

  const allImages = events.flatMap(event => event.images || []);

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-container">
          <div className="loading-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="loading-text"
          >
            Loading ASB Fashion Moments...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Premium Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <motion.div className="hero-bg" style={{ opacity, scale }}>
          <div className="hero-particles">
            {[...Array(80)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 5}s`
              }} />
            ))}
          </div>
          <div className="hero-gradient"></div>
        </motion.div>
        
        <Container className="hero-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="hero-badge-wrapper"
            >
              
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="gradient-text">Our Journey</span> in Moments
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Celebrating our CSR initiatives, training programs, leadership events, 
              and unforgettable team moments
            </motion.p>
            
         
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="hero-scroll"
              onClick={() => document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>Explore Our Story</span>
              <FaArrowDown className="scroll-icon" />
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <div id="main-content">
        {/* Premium Category Filters */}
        <section className="category-section">
          <Container>
            <div className="category-wrapper">
              <div className="category-title">
                <FaBriefcase className="title-icon" />
                <h3>Explore by Category</h3>
              </div>
              <div className="category-grid">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                    style={{ '--category-color': category.color }}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">
                      {category.id === "all" ? events.length : events.filter(e => e.category === category.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Filter Bar with View Toggle */}
        <section className="filter-bar">
          <Container>
            <div className="filter-container">
              <div className={`search-box ${isSearchFocused ? 'focused' : ''}`}>
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search events, locations, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchTerm && (
                  <button className="clear-btn" onClick={() => setSearchTerm("")}>
                    <FaTimes />
                  </button>
                )}
              </div>
              
              <div className="filter-group">
                <FaCalendarAlt className="filter-icon" />
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="year-select"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year === "all" ? "All Years" : year}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <FaTh />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <FaThList />
                </button>
              </div>
            </div>
          </Container>
        </section>

        {/* Events Grid/List Section */}
        <section className="events-section">
          <Container>
            {filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="empty-state"
              >
                <div className="empty-icon">
                  <FaCamera />
                </div>
                <h3>No events found</h3>
                <p>Try adjusting your search or filter to find what you're looking for</p>
                <button className="btn-reset" onClick={() => { setSearchTerm(""); setFilterYear("all"); setActiveCategory("all"); }}>
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <div className={`events-grid ${viewMode}`}>
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={viewMode === "grid" ? { y: -8 } : { x: 8 }}
                    className={`event-card ${viewMode === "list" ? "list-view" : ""} ${hoveredEvent === event.id ? "hovered" : ""}`}
                    onMouseEnter={() => setHoveredEvent(event.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    onClick={() => openEventModal(event)}
                  >
                    <div className={`card-image ${viewMode === "list" ? "list-image" : ""}`}>
                      <img
                        src={event.images?.[0]?.image_url || "/images/event-placeholder.jpg"}
                        alt={event.title}
                      />
                      <div className="image-overlay">
                        <div className="overlay-content">
                          <FaEye className="overlay-icon" />
                          <span>View Gallery</span>
                        </div>
                      </div>
                      <div className="category-tag" style={{ background: categories.find(c => c.id === event.category)?.color || "#dc2626" }}>
                        {categoryIcons[event.category] || categoryIcons.default}
                        <span>{categories.find(c => c.id === event.category)?.name || "Event"}</span>
                      </div>
                      {event.status === 'ongoing' && (
                        <div className="live-tag">
                          <div className="live-dot"></div>
                          <span>LIVE</span>
                        </div>
                      )}
                      <div className="photo-count">
                        <FaImage />
                        <span>{event.images?.length || 0}</span>
                      </div>
                    </div>
                    
                    <div className={`card-content ${viewMode === "list" ? "list-content" : ""}`}>
                      <div className="card-header">
                        <div className="event-meta">
                          <div className="event-date-badge">
                            <FaRegCalendar />
                            <span>{formatDate(event.event_date)}</span>
                          </div>
                          {event.location && (
                            <div className="event-location-badge">
                              <FaMapMarkerAlt />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="event-status" style={{ background: getStatusConfig(event.status).gradient }}>
                          {getStatusConfig(event.status).icon}
                          <span>{getStatusConfig(event.status).text}</span>
                        </div>
                      </div>
                      
                      <h3 className="event-title">{event.title}</h3>
                      
                      <p className="event-description">
                        {event.description?.substring(0, viewMode === "list" ? 200 : 100)}
                        {event.description?.length > (viewMode === "list" ? 200 : 100) ? "..." : ""}
                      </p>
                      
                      <div className="card-footer">
                        <div className="event-stats">
                          <span className="stat">
                            <FaImage />
                            {event.images?.length || 0} Photos
                          </span>
                        
                        </div>
                        <div className="event-actions">
                       
                          <button 
                            className="view-gallery-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEventModal(event);
                            }}
                          >
                            View Gallery
                            <FaArrowRight />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Container>
        </section>
      </div>

      {/* Event Modal with Image Gallery - No Redirect */}
      <Modal
        show={showModal}
        onHide={closeEventModal}
        size="xl"
        centered
        className="premium-modal"
        backdrop="static"
      >
        <Modal.Header className="modal-header-custom">
          <Modal.Title>
            <div className="modal-title-wrapper">
              <div className="modal-category-badge" style={{ background: categories.find(c => c.id === selectedEvent?.category)?.color }}>
                {selectedEvent && categoryIcons[selectedEvent.category]}
                <span>{selectedEvent && categories.find(c => c.id === selectedEvent.category)?.name}</span>
              </div>
              <h2>{selectedEvent?.title}</h2>
            </div>
          </Modal.Title>
          <div className="modal-actions">
            <button 
              className="modal-action-btn"
              onClick={() => {
                if (selectedEvent?.images?.length) {
                  openFullGallery(selectedEvent);
                }
              }}
            >
              <FaExpand /> Full Gallery
            </button>
            <button 
              className="modal-action-btn"
              onClick={() => {
                // Share functionality
                navigator.share?.({
                  title: selectedEvent?.title,
                  text: selectedEvent?.description,
                  url: window.location.href
                }).catch(() => {});
              }}
            >
              <FaShare /> Share
            </button>
            <button className="modal-close" onClick={closeEventModal}>
              <FaTimes />
            </button>
          </div>
        </Modal.Header>
        
        <Modal.Body className="modal-body-custom">
          {selectedEvent && (
            <>
              <div className="event-info-grid">
                <div className="info-card">
                  <FaRegCalendar />
                  <div>
                    <label>Event Date</label>
                    <p>{formatDate(selectedEvent.event_date)}</p>
                  </div>
                </div>
                {selectedEvent.location && (
                  <div className="info-card">
                    <FaMapMarkerAlt />
                    <div>
                      <label>Location</label>
                      <p>{selectedEvent.location}</p>
                    </div>
                  </div>
                )}
                <div className="info-card">
                  <FaRegClock />
                  <div>
                    <label>Status</label>
                    <div className="status-indicator" style={{ background: getStatusConfig(selectedEvent.status).gradient }}>
                      {getStatusConfig(selectedEvent.status).icon}
                      <span>{getStatusConfig(selectedEvent.status).text}</span>
                    </div>
                  </div>
                </div>
                <div className="info-card">
                  <FaImage />
                  <div>
                    <label>Total Photos</label>
                    <p>{selectedEvent.images?.length || 0} Memories</p>
                  </div>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div className="event-description-box">
                  <h4>About This Event</h4>
                  <p>{selectedEvent.description}</p>
                </div>
              )}

              <div className="gallery-section">
                <div className="gallery-header">
                  <h4>
                    <FaCamera />
                    Photo Gallery
                  </h4>
                  {selectedEvent.images?.length > 6 && (
                    <Button 
                      variant="link" 
                      className="view-all-btn"
                      onClick={() => openFullGallery(selectedEvent)}
                    >
                      View All {selectedEvent.images?.length} Photos
                      <FaArrowRight className="ms-2" />
                    </Button>
                  )}
                </div>
                <div className="gallery-masonry">
                  {selectedEvent.images?.slice(0, 12).map((image, idx) => (
                    <motion.div
                      key={image.id || idx}
                      whileHover={{ scale: 1.03 }}
                      className="gallery-item"
                      onClick={() => openImageViewer(idx)}
                    >
                      <img 
                        src={image.image_url} 
                        alt={image.caption || selectedEvent.title} 
                        onError={(e) => {
                          e.target.src = "/images/event-placeholder.jpg";
                        }}
                      />
                      <div className="gallery-overlay">
                        <FaEye />
                        <span>View</span>
                      </div>
                      {image.caption && (
                        <div className="image-caption">
                          <small>{image.caption}</small>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                {selectedEvent.images?.length === 0 && (
                  <div className="no-images-placeholder">
                    <FaCamera size={48} />
                    <p>No images available for this event yet.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Fullscreen Image Viewer inside Modal */}
      <Modal
        show={showImageViewer}
        onHide={() => setShowImageViewer(false)}
        fullscreen
        className="fullscreen-viewer"
      >
        <Modal.Header className="viewer-header">
          <Modal.Title>
            <FaCamera />
            {selectedEvent?.title}
          </Modal.Title>
          <div className="viewer-controls">
            <span className="image-counter">
              {selectedImageIndex + 1} / {selectedEvent?.images?.length || 0}
            </span>
            <button className="close-viewer" onClick={() => setShowImageViewer(false)}>
              <FaTimes />
            </button>
          </div>
        </Modal.Header>
        
        <Modal.Body className="viewer-body">
          {selectedEvent && selectedEvent.images && (
            <Carousel
              activeIndex={selectedImageIndex}
              onSelect={setSelectedImageIndex}
              controls
              indicators
              interval={null}
              prevIcon={<FaChevronLeft className="carousel-nav" />}
              nextIcon={<FaChevronRight className="carousel-nav" />}
            >
              {selectedEvent.images.map((image, idx) => (
                <Carousel.Item key={image.id || idx}>
                  <div className="viewer-image-container">
                    <img 
                      src={image.image_url} 
                      alt={image.caption || selectedEvent.title}
                      onError={(e) => {
                        e.target.src = "/images/event-placeholder.jpg";
                      }}
                    />
                    {image.caption && (
                      <div className="viewer-caption">
                        <p>{image.caption}</p>
                      </div>
                    )}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Modal.Body>
      </Modal>

      {/* Full Gallery Modal for All Images */}
      <Modal
        show={showFullGallery}
        onHide={() => setShowFullGallery(false)}
        size="xl"
        centered
        className="full-gallery-modal"
      >
        <Modal.Header className="full-gallery-header">
          <Modal.Title>
            <FaCamera className="me-2" />
            {fullGalleryTitle} - Complete Gallery
          </Modal.Title>
          <button className="close-gallery" onClick={() => setShowFullGallery(false)}>
            <FaTimes />
          </button>
        </Modal.Header>
        <Modal.Body className="full-gallery-body">
          <div className="full-gallery-grid">
            {fullGalleryImages.map((image, idx) => (
              <motion.div
                key={image.id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="full-gallery-item"
                onClick={() => {
                  setSelectedImageIndex(idx);
                  setShowFullGallery(false);
                  setShowImageViewer(true);
                }}
              >
                <img 
                  src={image.image_url} 
                  alt={image.caption || fullGalleryTitle}
                  onError={(e) => {
                    e.target.src = "/images/event-placeholder.jpg";
                  }}
                />
                {image.caption && (
                  <div className="full-gallery-caption">
                    <p>{image.caption}</p>
                  </div>
                )}
                <div className="full-gallery-overlay">
                  <FaEye />
                  <span>View Full</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="back-to-top"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;