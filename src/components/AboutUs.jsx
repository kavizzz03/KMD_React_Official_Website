import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Card, Button, Badge, Modal, Carousel
} from "react-bootstrap";
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaInstagram, 
  FaFacebook, FaWhatsapp, FaTwitter, FaLinkedin,
  FaArrowRight, FaClock, FaAward, FaLeaf, FaUsers, 
  FaStore, FaHeart, FaQuoteRight, FaCalendarAlt,
  FaRibbon, FaGem, FaStar, FaTrophy, FaHandHoldingHeart,
  FaTree, FaBook, FaHome, FaChild, FaEye, FaBullseye,
  FaChartLine, FaHandsHelping, FaUserTie, FaHistory,
  FaBuilding, FaGlobeAsia, FaChevronRight, FaGift,
  FaCheckCircle, FaStoreAlt, FaCrown, FaSpinner
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AboutUs.css";

const AboutUs = () => {
  const navigate = useNavigate();
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch CSR projects from the correct URL
  // Updated fetch function with better error handling
useEffect(() => {
  const fetchCSRProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching CSR projects from API...");
      const response = await axios.get("https://whats.asbfashion.com/api/get_csr_projects.php");
      
      console.log("API Response:", response.data);
      
      if (response.data && response.data.success) {
        console.log("Projects loaded successfully:", response.data.projects.length);
        setProjects(response.data.projects);
      } else {
        console.warn("API returned unsuccessful response:", response.data);
        setError("API returned unsuccessful response");
        setProjects(fallbackCSRActivities);
      }
    } catch (error) {
      console.error("Error fetching CSR projects:", error);
      
      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        setError(`Server error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        setError("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        setError(`Request error: ${error.message}`);
      }
      
      // Fallback to static data on error
      setProjects(fallbackCSRActivities);
    } finally {
      setLoading(false);
    }
  };

  fetchCSRProjects();
}, []);

  // Icon mapping for CSR activities
  const getIconForProject = (title) => {
    const iconMap = {
      'School Uniform Donations': <FaChild size={30} />,
      'Housing Projects': <FaHome size={30} />,
      'Dry Rations Distribution': <FaHandHoldingHeart size={30} />,
      'Environmental Initiatives': <FaTree size={30} />
    };
    
    // Return mapped icon or default icon
    return iconMap[title] || <FaHandHoldingHeart size={30} />;
  };

  // Fallback CSR Activities (Static data)
  const fallbackCSRActivities = [
    {
      id: 1,
      title: "School Uniform Donations",
      description: "Annual distribution of school uniforms, learning materials, and shoes to underprivileged school children across Sri Lanka.",
      stats: "5000+ students benefited",
      images: ["/images/csr/school-uniform.jpg"]
    },
    {
      id: 2,
      title: "Housing Projects",
      description: "Supporting housing projects for low-income families, providing safe and comfortable homes.",
      stats: "25+ families supported",
      images: ["/images/csr/housing.jpg"]
    },
    {
      id: 3,
      title: "Dry Rations Distribution",
      description: "Regular distribution of essential dry rations to communities in need, especially during festive seasons and emergencies.",
      stats: "1000+ families helped annually",
      images: ["/images/csr/rations.jpg"]
    },
    {
      id: 4,
      title: "Environmental Initiatives",
      description: "Tree planting campaigns and sustainable fashion initiatives to promote environmental consciousness.",
      stats: "5000+ trees planted",
      images: ["/images/csr/environment.jpg"]
    }
  ];

  // Company milestones from history
  const milestones = [
    { year: "1989", event: "ASB Fashion Established", icon: FaBuilding },
    { year: "1994", event: "Metal Roof Shop Opened", icon: FaStore },
    { year: "1995", event: "Dress Line - Ambalangoda", icon: FaStore },
    { year: "1996", event: "ASB Tangalle Branch", icon: FaStore },
    { year: "1999", event: "Sale Shop - Ambalangoda", icon: FaStore },
    { year: "2000", event: "ASB Nuwaraeliya & Balangoda", icon: FaStore },
    { year: "2001", event: "ASB Anuradhapura & Panadura", icon: FaStore },
    { year: "2002", event: "ASB Matara Branch", icon: FaStore },
    { year: "2003", event: "ASB Ampara & SDS Matara", icon: FaStore },
    { year: "2005", event: "ASB Panadura New Building", icon: FaBuilding },
    { year: "2007", event: "ASB Galle Branch", icon: FaStore },
    { year: "2009", event: "ASB Anuradhapura New Building, Malambe & Kuliyapitiya", icon: FaBuilding },
    { year: "2010", event: "Jajee Panadura, Tangalle New Building & Anjalee Matara", icon: FaBuilding },
    { year: "2011", event: "ASB Warakapola, Matara New Building & Akuressa", icon: FaBuilding },
    { year: "2012", event: "ASB Ampara New Building & Wattala", icon: FaBuilding },
    { year: "2014", event: "ASB Aluthgama Branch", icon: FaStore },
    { year: "2024", event: "Digital Transformation & E-commerce Launch", icon: FaGlobeAsia },
    { year: "2025", event: "Glamour Gate - Premium Fashion Destination in Negombo", icon: FaCrown, highlight: true }
  ];

  // Latest Branch - Glamour Gate in Negombo (Now Open)
  const latestBranch = {
    name: "Glamour Gate by ASB Fashion",
    location: "Negombo",
    openedDate: "December 10, 2025",
    address: "412 Main Street, Negombo",
    phone: "0703871457",
    manager: "Mr. Rohitha Senanayake",
    hours: "9:30 AM - 8:30 PM",
    description: "Premium fashion destination featuring exclusive collections and personalized styling services",
    features: [
      "Premium Collections",
      "Personal Stylist Service",
      "VIP Lounge",
      "Free Parking"
    ],
    image: "/images/branches/glamour-gate.jpg"
  };

  // Management team (without images)
  const managementTeam = [
    {
      name: "Mr. A. Jayasiri De Silva",
      position: "Founder & Former Chairman",
      experience: "Over 35 years of excellence in textile retail",
      description: "Founded ASB Fashion in 1989 with a vision to provide quality fashion at affordable prices."
    },
    {
      name: "Mrs. P.A.K.D. Jeewanthi",
      position: "Chairperson",
      experience: "20+ years in retail leadership and business development",
      description: "Leading ASB Fashion towards innovation and growth while maintaining core values."
    },
    {
      name: "Mr. A.A. De Silva",
      position: "Director - Operations",
      experience: "18 years in supply chain and retail operations",
      description: "Oversees branch operations and ensures seamless customer experience across all locations."
    },
    {
      name: "Mr. A.S.B. De Silva",
      position: "Director - Business Development",
      experience: "15 years in brand management and business expansion",
      description: "Drives the company's expansion strategy including the new Glamour Gate in Negombo."
    }
  ];

  const handleImageError = (e) => {
    e.target.src = "/images/placeholder.jpg";
    e.target.onerror = null; // Prevent infinite loop
  };

  // Function to construct full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "/images/placeholder.jpg";
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it starts with '/', it's a relative path from root
    if (imagePath.startsWith('/')) {
      return `https://whats.asbfashion.com${imagePath}`;
    }
    
    // Otherwise, assume it's relative to the API
    return `https://whats.asbfashion.com/${imagePath}`;
  };

  return (
    <motion.div 
      className="asb-about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="about-hero">
        <Container>
          <Row className="align-items-center" style={{ minHeight: '500px' }}>
            <Col lg={8} className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge bg="danger" className="hero-badge mb-4 px-4 py-2">
                  Since 1989
                </Badge>
                <h1 className="display-3 fw-bold mb-3">About ASB Fashion</h1>
                <p className="lead mb-4 fs-4">
                  Making life fashionable for over three decades with quality, affordability, and trust.
                </p>
                <div className="hero-stats d-flex gap-4">
                  <div>
                    <h3 className="text-white mb-0">35+</h3>
                    <p className="text-white-50">Years of Excellence</p>
                  </div>
                  <div>
                    <h3 className="text-white mb-0">18+</h3>
                    <p className="text-white-50">Branches Islandwide</p>
                  </div>
                  <div>
                    <h3 className="text-white mb-0">50K+</h3>
                    <p className="text-white-50">Happy Customers</p>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Latest Branch Announcement - Glamour Gate (Now Open) */}
      <section className="latest-branch-announcement py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <Badge bg="success" className="mb-3 px-4 py-2">
              <FaCrown className="me-2" /> NOW OPEN
            </Badge>
          </motion.div>
          
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="new-branch-content"
              >
                <h2 className="display-5 fw-bold mb-3">
                  Introducing <span className="text-danger">Glamour Gate</span>
                </h2>
                <div className="branch-location mb-3">
                  <FaMapMarkerAlt className="text-danger me-2" />
                  <span className="fs-4">Negombo</span>
                </div>
                <div className="opening-date mb-4">
                  <FaCalendarAlt className="text-success me-2" />
                  <span className="fs-5">Opened December 10, 2025</span>
                </div>
                <p className="lead mb-4">
                  {latestBranch.description}
                </p>
                <div className="branch-features mb-4">
                  <h5 className="fw-bold mb-3">Features:</h5>
                  <Row>
                    {latestBranch.features.map((feature, index) => (
                      <Col md={6} key={index} className="mb-2">
                        <FaCheckCircle className="text-success me-2" />
                        {feature}
                      </Col>
                    ))}
                  </Row>
                </div>
                <Button 
                  variant="danger" 
                  size="lg"
                  onClick={() => {
                    setSelectedBranch(latestBranch);
                    setShowBranchModal(true);
                  }}
                >
                  View Branch Details <FaArrowRight className="ms-2" />
                </Button>
              </motion.div>
            </Col>
            <Col lg={5}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="new-branch-image"
              >
                <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                  <Card.Img 
                    src="/images/branches/glamour-gate.jpg" 
                    alt="Glamour Gate Negombo"
                    onError={handleImageError}
                  />
                  <Card.ImgOverlay className="d-flex align-items-end justify-content-end">
                    <div className="open-now-badge bg-success text-white p-3 rounded-3">
                      <h5 className="mb-0">
                        <FaCheckCircle className="me-2" />
                        Open Now
                      </h5>
                    </div>
                  </Card.ImgOverlay>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Vision & Mission Section */}
      <section className="vision-mission py-5 bg-light">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="vision-card h-100"
              >
                <div className="vision-icon">
                  <FaEye size={40} />
                </div>
                <h2 className="fw-bold mb-3">Our Vision</h2>
                <p className="lead">
                  "Making life fashionable by being the no. 1 textile chain in Sri Lanka 
                  with the benchmark of lowest price."
                </p>
                <div className="vision-quote mt-4">
                  <FaQuoteRight className="text-danger me-2" />
                  <em>Setting the standard for affordable fashion in Sri Lanka</em>
                </div>
              </motion.div>
            </Col>
            <Col md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mission-card h-100"
              >
                <div className="mission-icon">
                  <FaBullseye size={40} />
                </div>
                <h2 className="fw-bold mb-3">Our Mission</h2>
                <p className="lead">
                  "Be innovative in continuously developing customer service excellence and 
                  relationship management, learning to be more professional and identify the 
                  talent of our team to be the best in the textile industry. Consistently grow 
                  market share and to be the most profitable and popular Sri Lankan textile 
                  chain."
                </p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Company Overview */}
      <section className="company-overview py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <Badge bg="danger" className="mb-3 px-4 py-2">Our Company</Badge>
            <h2 className="display-6 fw-bold">Sri Lanka's Trusted Fashion Destination</h2>
          </motion.div>

          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="lead mb-4">
                  We responsibly source high quality local and international garments catering 
                  to a wider selection of customers with various tastes such as sizes, types of 
                  clothes, styles, colors and budgets etc.
                </p>
                <p className="mb-4">
                  Established in 1989 and having several branches island wide, ASB Fashion 
                  strives to continuously offer outstanding products at lowest prices in the 
                  Sri Lankan market. The company emphasizes facets such as innovation, value 
                  and service by carrying the latest fashionable textiles at affordable prices 
                  and offering a personalized customer service.
                </p>
                <p className="mb-4">
                  The group's fashion retail shops in Sri Lanka offer women's clothes, kids 
                  garments as well as men's clothes and accessories, thus providing the 
                  opportunity to purchase good quality branded clothes in Sri Lanka for the 
                  entire family under one roof.
                </p>
                <Button variant="danger" size="lg" onClick={() => navigate("/stores")}>
                  Find a Store Near You <FaArrowRight className="ms-2" />
                </Button>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="company-stats-grid"
              >
                <Row className="g-3">
                  <Col sm={6}>
                    <Card className="stat-card text-center p-4 border-0 shadow-sm">
                      <FaStore size={40} className="text-danger mb-3" />
                      <h3>18+</h3>
                      <p>Branches</p>
                    </Card>
                  </Col>
                  <Col sm={6}>
                    <Card className="stat-card text-center p-4 border-0 shadow-sm">
                      <FaUsers size={40} className="text-danger mb-3" />
                      <h3>500+</h3>
                      <p>Employees</p>
                    </Card>
                  </Col>
                  <Col sm={6}>
                    <Card className="stat-card text-center p-4 border-0 shadow-sm">
                      <FaHeart size={40} className="text-danger mb-3" />
                      <h3>50K+</h3>
                      <p>Happy Customers</p>
                    </Card>
                  </Col>
                  <Col sm={6}>
                    <Card className="stat-card text-center p-4 border-0 shadow-sm">
                      <FaAward size={40} className="text-danger mb-3" />
                      <h3>35+</h3>
                      <p>Years of Excellence</p>
                    </Card>
                  </Col>
                </Row>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Chairman's Message */}
      <section className="chairman-message py-5 bg-light">
        <Container>
          <Row>
            <Col lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="message-content text-center"
              >
                <Badge bg="danger" className="mb-3 px-4 py-2">Chairman's Message</Badge>
                <h2 className="fw-bold mb-4">A Message from Our Founder</h2>
                <div className="message-quote mb-4 mx-auto" style={{ maxWidth: '800px' }}>
                  <FaQuoteRight size={40} className="text-danger mb-3" />
                  <p className="lead fst-italic">
                    "I always believe that my customers deserve good quality for a reasonable 
                    price irrespective where they live, how they live or what they consume. 
                    That was my concept from the very beginning of my business."
                  </p>
                </div>
                <p className="mb-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
                  It gives me great pleasure to warmly welcome you to ASB Fashion and its website. 
                  I'm proud that ASB group the company that I created is aiming to be a dynamic 
                  leader in the Sri Lankan textile industry. By now ASB has carved a name in the 
                  retail textile industry on a firm ground.
                </p>
                <p className="mb-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
                  ASB is dedicated to deliver superior values to our customers, employees & society, 
                  through an innovative approach to change as per the need of the hour. In the end, 
                  I must appreciate the continuous and untiring efforts of the ASB family members 
                  that have enabled the group to reach its present position. I strongly believe that 
                  their continuous commitment will assist the organization to achieve its objectives & goals.
                </p>
                <div className="mt-4">
                  <h5 className="fw-bold">Mr. A. Jayasiri De Silva</h5>
                  <p className="text-muted">Founder & Former Chairman</p>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Management Team (Text Only) */}
      <section className="management-team py-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <Badge bg="danger" className="mb-3 px-4 py-2">Management</Badge>
            <h2 className="display-6 fw-bold">Our Leadership Team</h2>
          </motion.div>

          <Row className="g-4">
            {managementTeam.map((member, index) => (
              <Col md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="management-card border-0 shadow-sm h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="management-icon bg-danger text-white me-3">
                          <FaUserTie size={24} />
                        </div>
                        <div>
                          <h4 className="fw-bold mb-1">{member.name}</h4>
                          <Badge bg="light" text="dark">{member.position}</Badge>
                        </div>
                      </div>
                      <div className="management-details">
                        <p className="mb-2">
                          <strong>Experience:</strong> {member.experience}
                        </p>
                        <p className="mb-0 text-muted">
                          {member.description}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* History Timeline */}
      <section className="history-timeline py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <Badge bg="danger" className="mb-3 px-4 py-2">Our Journey</Badge>
            <h2 className="display-6 fw-bold">History of ASB Fashion</h2>
          </motion.div>

          <Row>
            <Col lg={12}>
              <div className="timeline">
                {milestones.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`timeline-card border-0 shadow-sm ${item.highlight ? 'bg-warning text-dark' : ''}`}>
                      <Card.Body>
                        <div className={`timeline-year ${item.highlight ? 'text-dark' : 'text-danger'} fw-bold mb-2`}>
                          <FaCalendarAlt className="me-2" />
                          {item.year}
                        </div>
                        <div className="d-flex align-items-center">
                          <item.icon className={`${item.highlight ? 'text-dark' : 'text-danger'} me-3`} size={20} />
                          <p className="mb-0">{item.event}</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CSR Activities - Updated with proper image handling */}
     

      {/* Call to Action */}
      <section className="about-cta py-5 bg-danger text-white">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="display-6 fw-bold mb-3">Visit Our Stores Today</h2>
            <p className="lead mb-4">Experience the best of fashion with ASB Fashion</p>
            <Button 
              variant="light" 
              size="lg" 
              onClick={() => navigate("/stores")}
              className="me-3 mb-2"
            >
              Find a Store
            </Button>
            <Button 
              variant="outline-light" 
              size="lg" 
              onClick={() => navigate("/contact")}
              className="mb-2"
            >
              Contact Us
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* Branch Details Modal */}
      <Modal show={showBranchModal} onHide={() => setShowBranchModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger">{selectedBranch?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBranch && (
            <Row>
              <Col md={6}>
                <img 
                  src={selectedBranch.image} 
                  alt={selectedBranch.name}
                  className="img-fluid rounded-4 mb-3"
                  onError={handleImageError}
                  style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
                />
              </Col>
              <Col md={6}>
                <h6 className="fw-bold mb-3">Branch Details</h6>
                <p><FaMapMarkerAlt className="text-danger me-2" /> {selectedBranch.address}</p>
                <p><FaPhone className="text-danger me-2" /> {selectedBranch.phone}</p>
                <p><FaClock className="text-danger me-2" /> {selectedBranch.hours}</p>
                <p><FaUserTie className="text-danger me-2" /> Manager: {selectedBranch.manager}</p>
                <p><FaCalendarAlt className="text-danger me-2" /> Opened: {selectedBranch.openedDate}</p>
                
                <h6 className="fw-bold mt-3 mb-2">Features:</h6>
                <ul className="list-unstyled">
                  {selectedBranch.features?.map((feature, idx) => (
                    <li key={idx} className="mb-2">
                      <FaCheckCircle className="text-success me-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="danger" 
                  className="w-100 mt-3"
                  href={`https://maps.google.com/?q=${encodeURIComponent(selectedBranch.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </Button>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default AboutUs;