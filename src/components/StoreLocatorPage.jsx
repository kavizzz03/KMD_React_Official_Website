import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, Button, Badge, InputGroup, Form, Dropdown, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMapMarkerAlt, FaPhone, FaClock, FaDirections, FaSearch, FaStore,
  FaStar, FaWhatsapp, FaFilter, FaBuilding, FaTimes, FaCheckCircle, 
  FaParking, FaTshirt, FaChild, FaHeart, FaUsers, FaCrown, FaShare,
  FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaTiktok,
  FaWifi, FaCoffee, FaWheelchair, FaBaby, FaCar, FaCreditCard,
  FaLeaf, FaGem, FaFire, FaArrowRight, FaMapMarkedAlt, FaRoute,
  FaMobile, FaEnvelope, FaGlobeAsia, FaAward, FaMedal, FaGift,
  FaRegHeart, FaRegBuilding, FaRegClock, FaRegStar, FaInfoCircle
} from "react-icons/fa";
import { MdLocalParking, MdWc, MdRestaurant, MdSecurity } from "react-icons/md";
import "./StoreLocatorPage.css";

const StoreLocatorPage = () => {
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featureFilter, setFeatureFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [hoveredBranch, setHoveredBranch] = useState(null);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Extract unique districts from branches
  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(branches.map(b => b.district || 'Other'))];
    return ['All', ...uniqueDistricts];
  }, [branches]);

  // Fetch Data from PHP Backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("https://whats.asbfashion.com/api/get_branches.php");
        const data = await response.json();
        if (data.error) throw new Error(data.message);
        setBranches(data);
      } catch (err) {
        console.error("Failed to load branches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Update active filter count
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (featureFilter !== "All") count++;
    if (selectedDistrict !== "All") count++;
    setActiveFilterCount(count);
  }, [searchTerm, featureFilter, selectedDistrict]);

  // Real-time Status Logic
  const checkStatus = (hoursStr) => {
    try {
      const now = new Date();
      const [start, end] = hoursStr.split(" - ");
      const parseTime = (t) => {
        let [time, modifier] = t.split(" ");
        let [hrs, mins] = time.split(":").map(Number);
        if (modifier === "PM" && hrs < 12) hrs += 12;
        if (modifier === "AM" && hrs === 12) hrs = 0;
        return hrs * 60 + mins;
      };
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      return currentMinutes >= parseTime(start) && currentMinutes <= parseTime(end);
    } catch { return true; }
  };

  // Filtering logic
  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      const matchesSearch = searchTerm === "" || 
        b.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.landmark && b.landmark.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFeature = featureFilter === "All" || (b.features && b.features.includes(featureFilter));
      const matchesDistrict = selectedDistrict === "All" || b.district === selectedDistrict;
      return matchesSearch && matchesFeature && matchesDistrict;
    });
  }, [searchTerm, featureFilter, selectedDistrict, branches]);

  // Get unique features for filter
  const allFeatures = useMemo(() => {
    const features = new Set();
    branches.forEach(b => {
      b.features?.forEach(f => features.add(f));
    });
    return ['All', ...Array.from(features)];
  }, [branches]);

  // Get icon for feature
  const getFeatureIcon = (feature) => {
    switch(feature) {
      case 'Parking': return <FaCar className="feature-icon" />;
      case 'Wedding Collection': return <FaHeart className="feature-icon" />;
      case 'Changing Rooms': return <MdWc className="feature-icon" />;
      case 'Kids Corner': return <FaChild className="feature-icon" />;
      case 'Cafe': return <FaCoffee className="feature-icon" />;
      case 'Premium Lounge': return <FaCrown className="feature-icon" />;
      case 'WiFi': return <FaWifi className="feature-icon" />;
      case 'Wheelchair Access': return <FaWheelchair className="feature-icon" />;
      case 'Baby Care': return <FaBaby className="feature-icon" />;
      case 'Credit Cards': return <FaCreditCard className="feature-icon" />;
      default: return <FaCheckCircle className="feature-icon" />;
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  if (loading) {
    return (
      <div className="store-loading-container">
        <div className="loading-content">
          <div className="loading-animation">
            <FaStore className="loading-icon" />
            <Spinner animation="border" variant="danger" className="loading-spinner" />
          </div>
          <h4>ASB FASHION</h4>
          <p>Finding the perfect store for you...</p>
          <div className="loading-progress">
            <div className="loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="asb-store-locator-red"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Hero Section */}
      <section className="store-hero-red">
        <div className="hero-pattern-red"></div>
        <div className="hero-overlay-red">
          <Container>
            <motion.div 
              className="hero-content text-center"
              variants={fadeInUp}
            >
              <motion.div 
                className="hero-badge-wrapper"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge className="hero-badge-red">
                  <FaStore className="me-2" />
                  {branches.length} BRANCHES ISLANDWIDE
                </Badge>
              </motion.div>
              
              <h1 className="hero-title-red">
                Find Your Nearest <span className="hero-highlight-red">ASB Fashion</span> Store
              </h1>
              
              <p className="hero-subtitle-red">
                Visit any of our {branches.length} locations across Sri Lanka for the ultimate fashion experience
              </p>
              
              {/* Search and Filter Bar */}
              <div className="filter-card-red">
                <Row className="g-3">
                  <Col lg={5}>
                    <InputGroup className="search-group-red">
                      <InputGroup.Text className="search-icon-red">
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control 
                        placeholder="Search by city, address, or landmark..." 
                        className="search-input-red"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <Button 
                          variant="link" 
                          className="clear-search-red"
                          onClick={() => setSearchTerm("")}
                        >
                          <FaTimes />
                        </Button>
                      )}
                    </InputGroup>
                  </Col>
                  
                  <Col lg={3}>
                    <Dropdown className="filter-dropdown-red w-100">
                      <Dropdown.Toggle variant="light" className="filter-toggle-red">
                        <FaFilter className="me-2" /> 
                        <span className="filter-label-red">{featureFilter === "All" ? "All Features" : featureFilter}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="filter-menu-red">
                        {allFeatures.map((feature, idx) => (
                          <Dropdown.Item 
                            key={idx} 
                            onClick={() => setFeatureFilter(feature)}
                            className="filter-item-red"
                          >
                            {feature !== 'All' && getFeatureIcon(feature)}
                            <span className="ms-2">{feature}</span>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  
                  <Col lg={2}>
                    <Dropdown className="filter-dropdown-red w-100">
                      <Dropdown.Toggle variant="light" className="filter-toggle-red">
                        <FaStore className="me-2" /> 
                        <span className="filter-label-red">{selectedDistrict}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="filter-menu-red">
                        {districts.map((district, idx) => (
                          <Dropdown.Item 
                            key={idx} 
                            onClick={() => setSelectedDistrict(district)}
                            className="filter-item-red"
                          >
                            {district}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  
                  <Col lg={2}>
                    <div className="view-toggle-red">
                      <Button 
                        variant={viewMode === "grid" ? "danger" : "outline-danger"}
                        onClick={() => setViewMode("grid")}
                        className="toggle-btn-red"
                      >
                        Grid
                      </Button>
                      <Button 
                        variant={viewMode === "list" ? "danger" : "outline-danger"}
                        onClick={() => setViewMode("list")}
                        className="toggle-btn-red"
                      >
                        List
                      </Button>
                    </div>
                  </Col>
                </Row>

                {/* Active Filters */}
                {activeFilterCount > 0 && (
                  <motion.div 
                    className="active-filters-red"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Badge className="active-filter-badge-red">
                      {activeFilterCount} Active Filter{activeFilterCount > 1 ? 's' : ''}
                    </Badge>
                    <Button 
                      variant="link" 
                      className="clear-filters-red"
                      onClick={() => {
                        setSearchTerm("");
                        setFeatureFilter("All");
                        setSelectedDistrict("All");
                      }}
                    >
                      Clear all
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Results Count */}
              <motion.div 
                className="results-count-red"
                variants={fadeInUp}
              >
                <p>
                  Found <strong>{filteredBranches.length}</strong> stores matching your criteria
                </p>
              </motion.div>
            </motion.div>
          </Container>
        </div>
      </section>

      <Container className="py-5">
        {/* Grid/List View */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Row className="g-4">
                {filteredBranches.map((branch, idx) => {
                  const isOpen = checkStatus(branch.hours);
                  return (
                    <Col lg={4} md={6} key={branch.id}>
                      <motion.div
                        variants={fadeInUp}
                        whileHover={{ y: -8 }}
                        onHoverStart={() => setHoveredBranch(branch.id)}
                        onHoverEnd={() => setHoveredBranch(null)}
                      >
                        <Card className="store-card-red">
                          <div className="card-image-container-red">
                            <Card.Img 
                              variant="top" 
                              src={branch.image || "https://images.unsplash.com/photo-1441984904996-1380e4c4ef8f?w=400&h=200&fit=crop"} 
                              className="card-image-red"
                            />
                            <div className="image-badges-red">
                              <Badge className={`status-badge-red ${isOpen ? 'open' : 'closed'}`}>
                                <span className="status-dot-red"></span>
                                {isOpen ? 'OPEN NOW' : 'CLOSED'}
                              </Badge>
                              {branch.isHead && (
                                <Badge className="head-badge-red">
                                  <FaBuilding className="me-1" /> HEAD OFFICE
                                </Badge>
                              )}
                            </div>
                            {hoveredBranch === branch.id && (
                              <div className="image-overlay-red">
                                <Button 
                                  variant="danger" 
                                  size="sm"
                                  className="quick-view-btn-red"
                                  onClick={() => setSelectedBranch(branch)}
                                >
                                  <FaInfoCircle className="me-1" /> Quick Info
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          <Card.Body className="card-body-red">
                            <div className="card-header-red">
                              <div>
                                <h5 className="card-title-red">{branch.city}</h5>
                                <div className="rating-display-red">
                                  <FaStar className="star-icon-red" />
                                  <span className="rating-value-red">{branch.rating}</span>
                                  <span className="rating-count-red">({branch.employees}+ staff)</span>
                                </div>
                              </div>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                className="share-button-red"
                                onClick={() => {
                                  navigator.clipboard.writeText(branch.address);
                                }}
                                title="Copy address"
                              >
                                <FaShare />
                              </Button>
                            </div>

                            <div className="store-info-red">
                              <div className="info-row-red">
                                <FaMapMarkerAlt className="info-icon-red" />
                                <span className="info-text-red">{branch.address}</span>
                              </div>
                              {branch.landmark && (
                                <div className="info-row-red">
                                  <FaStore className="info-icon-red" />
                                  <span className="info-text-red">Near: {branch.landmark}</span>
                                </div>
                              )}
                              <div className="info-row-red">
                                <FaPhone className="info-icon-red" />
                                <span className="info-text-red">{branch.phone} | {branch.mobile}</span>
                              </div>
                              <div className="info-row-red">
                                <FaClock className="info-icon-red" />
                                <span className="info-text-red">{branch.hours}</span>
                              </div>
                            </div>

                            <div className="feature-tags-red">
                              {branch.features?.slice(0, 4).map((f, i) => (
                                <Badge key={i} className="feature-tag-red">
                                  {getFeatureIcon(f)} {f}
                                </Badge>
                              ))}
                              {branch.features?.length > 4 && (
                                <Badge className="feature-tag-red more-tag-red">
                                  +{branch.features.length - 4}
                                </Badge>
                              )}
                            </div>

                            <div className="action-buttons-red">
                              <Button 
                                variant="danger" 
                                className="directions-btn-red"
                                href={branch.map_link} 
                                target="_blank"
                              >
                                <FaDirections className="me-2" /> Get Directions
                              </Button>
                              <div className="contact-buttons-red">
                                <Button 
                                  variant="outline-success" 
                                  className="contact-btn-red"
                                  href={`https://wa.me/94${branch.mobile?.replace(/^0/, '')}`}
                                >
                                  <FaWhatsapp /> 
                                </Button>
                                <Button 
                                  variant="outline-primary" 
                                  className="contact-btn-red"
                                  href={`tel:${branch.phone}`}
                                >
                                  <FaPhone /> 
                                </Button>
                                <Button 
                                  variant="outline-info" 
                                  className="contact-btn-red"
                                  onClick={() => setSelectedBranch(branch)}
                                >
                                  <FaStore /> 
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="store-list-red">
                {filteredBranches.map((branch, idx) => {
                  const isOpen = checkStatus(branch.hours);
                  return (
                    <motion.div
                      key={branch.id}
                      variants={fadeInUp}
                      whileHover={{ x: 5 }}
                    >
                      <Card className="list-card-red mb-3">
                        <Card.Body>
                          <Row className="align-items-center">
                            <Col md={1}>
                              <img 
                                src={branch.image || "https://images.unsplash.com/photo-1441984904996-1380e4c4ef8f?w=80&h=80&fit=crop"} 
                                alt={branch.city}
                                className="list-store-image-red"
                              />
                            </Col>
                            <Col md={2}>
                              <h5 className="list-city-red">{branch.city}</h5>
                              <Badge className={`list-status-red ${isOpen ? 'open' : 'closed'}`}>
                                {isOpen ? 'OPEN' : 'CLOSED'}
                              </Badge>
                              <div className="list-rating-red">
                                <FaStar className="star-icon-red" /> {branch.rating}
                              </div>
                            </Col>
                            <Col md={3}>
                              <div className="list-address-red">
                                <FaMapMarkerAlt className="me-2" />
                                {branch.address.substring(0, 40)}...
                              </div>
                              <div className="list-phone-red">
                                <FaPhone className="me-2" />
                                {branch.phone}
                              </div>
                              <div className="list-hours-red">
                                <FaClock className="me-2" />
                                {branch.hours}
                              </div>
                            </Col>
                            <Col md={3}>
                              <div className="list-features-red">
                                {branch.features?.slice(0, 3).map((f, i) => (
                                  <Badge key={i} className="list-feature-tag-red">
                                    {f}
                                  </Badge>
                                ))}
                              </div>
                            </Col>
                            <Col md={3}>
                              <div className="list-actions-red">
                                <Button 
                                  variant="danger" 
                                  size="sm"
                                  className="list-directions-red"
                                  href={branch.map_link}
                                  target="_blank"
                                >
                                  <FaDirections className="me-1" /> Directions
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  className="list-details-red"
                                  onClick={() => setSelectedBranch(branch)}
                                >
                                  Details
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredBranches.length === 0 && (
          <motion.div 
            className="empty-state-red"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaStore className="empty-icon-red" />
            <h4>No Stores Found</h4>
            <p>Try adjusting your filters or search criteria</p>
            <Button 
              variant="danger"
              onClick={() => {
                setSearchTerm("");
                setFeatureFilter("All");
                setSelectedDistrict("All");
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Quick Stats */}
        <section className="stats-section-red">
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="stat-card-red">
                <FaStore className="stat-icon-red" />
                <div>
                  <h3>{branches.length}+</h3>
                  <p>Branches</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card-red">
                <FaUsers className="stat-icon-red" />
                <div>
                  <h3>500+</h3>
                  <p>Staff Members</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card-red">
                <FaStar className="stat-icon-red" />
                <div>
                  <h3>4.8</h3>
                  <p>Avg Rating</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card-red">
                <FaHeart className="stat-icon-red" />
                <div>
                  <h3>50K+</h3>
                  <p>Happy Customers</p>
                </div>
              </div>
            </Col>
          </Row>
        </section>
      </Container>

      {/* Branch Details Modal */}
      <AnimatePresence>
        {selectedBranch && (
          <motion.div 
            className="modal-overlay-red"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBranch(null)}
          >
            <motion.div 
              className="branch-modal-red"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn-red" onClick={() => setSelectedBranch(null)}>
                <FaTimes />
              </button>

              <div className="modal-header-red">
                <img 
                  src={selectedBranch.image || "https://images.unsplash.com/photo-1441984904996-1380e4c4ef8f?w=600&h=300&fit=crop"} 
                  alt={selectedBranch.city}
                />
                <div className="modal-header-content-red">
                  <h2>{selectedBranch.city}</h2>
                  {selectedBranch.isHead && <Badge className="head-office-badge-red">HEAD OFFICE</Badge>}
                </div>
              </div>

              <div className="modal-body-red">
                <Row>
                  <Col md={6}>
                    <div className="modal-info-section-red">
                      <h6><FaMapMarkerAlt className="section-icon-red" /> Address</h6>
                      <p>{selectedBranch.address}</p>
                    </div>
                    
                    <div className="modal-info-section-red">
                      <h6><FaPhone className="section-icon-red" /> Contact</h6>
                      <p>{selectedBranch.phone}</p>
                      <p>{selectedBranch.mobile}</p>
                      <p>{selectedBranch.email}</p>
                    </div>
                    
                    <div className="modal-info-section-red">
                      <h6><FaClock className="section-icon-red" /> Hours</h6>
                      <p>{selectedBranch.hours}</p>
                    </div>
                    
                    {selectedBranch.manager && (
                      <div className="modal-info-section-red">
                        <h6><FaUsers className="section-icon-red" /> Store Manager</h6>
                        <p>{selectedBranch.manager}</p>
                        <p>{selectedBranch.employees} employees</p>
                      </div>
                    )}
                  </Col>
                  
                  <Col md={6}>
                    <div className="modal-info-section-red">
                      <h6><FaCheckCircle className="section-icon-red" /> Features</h6>
                      <div className="modal-features-red">
                        {selectedBranch.features?.map((feature, idx) => (
                          <Badge key={idx} className="modal-feature-red">
                            {getFeatureIcon(feature)} {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {selectedBranch.landmark && (
                      <div className="modal-info-section-red">
                        <h6><FaStore className="section-icon-red" /> Landmark</h6>
                        <p>{selectedBranch.landmark}</p>
                      </div>
                    )}

                    {selectedBranch.opening_year && (
                      <div className="modal-info-section-red history-section-red">
                        <h6><FaAward className="section-icon-red" /> Store History</h6>
                        <p>Serving since {selectedBranch.opening_year} • {selectedBranch.customer_count}+ customers</p>
                      </div>
                    )}
                  </Col>
                </Row>

                <div className="modal-actions-red">
                  <Row className="g-3">
                    <Col md={6}>
                      <Button 
                        variant="danger" 
                        size="lg" 
                        className="modal-directions-btn-red"
                        href={selectedBranch.map_link}
                        target="_blank"
                      >
                        <FaDirections className="me-2" /> Get Directions
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Button 
                        variant="outline-success" 
                        size="lg" 
                        className="modal-contact-btn-red"
                        href={`https://wa.me/94${selectedBranch.mobile?.replace(/^0/, '')}`}
                      >
                        <FaWhatsapp className="me-2" /> WhatsApp
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Button 
                        variant="outline-primary" 
                        size="lg" 
                        className="modal-contact-btn-red"
                        href={`tel:${selectedBranch.phone}`}
                      >
                        <FaPhone className="me-2" /> Call
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StoreLocatorPage;