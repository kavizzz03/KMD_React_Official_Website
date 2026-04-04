// components/CollectionsPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { 
  FaArrowRight, 
  FaCrown, 
  FaFire, 
  FaStar, 
  FaCalendar, 
  FaShoppingBag,
  FaGem,
  FaLeaf,
  FaAward,
  FaTag,
  FaSpinner,
  FaExclamationTriangle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CollectionsPage.css";

const CollectionsPage = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredCollection, setFeaturedCollection] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch collections from API
      const response = await axios.get('https://whats.asbfashion.com/api/collections.php');
      
      if (response.data.success) {
        setCollections(response.data.collections);
        
        // Find featured collection
        const featured = response.data.collections.find(c => c.featured === true);
        if (featured) {
          setFeaturedCollection(featured);
        } else if (response.data.collections.length > 0) {
          setFeaturedCollection(response.data.collections[0]);
        }
      } else {
        setError(response.data.message || "Failed to load collections");
        // Use mock data as fallback
        setCollections(getMockCollections());
        setFeaturedCollection(getMockCollections()[0]);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      setError("Unable to connect to server. Using demo collections.");
      // Use mock data as fallback
      setCollections(getMockCollections());
      setFeaturedCollection(getMockCollections()[0]);
    } finally {
      setLoading(false);
    }
  };

  // Mock collections data as fallback
  const getMockCollections = () => [
    {
      id: "summer-breeze",
      name: "Summer Breeze 2024",
      category: "Summer",
      description: "Light and breezy summer wear for the modern fashion enthusiast",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1441984904996-1380e4c4ef8f?w=1200&h=400&fit=crop",
      items: 24,
      launchDate: "2024-06-01",
      featured: true,
      tags: ["Summer", "Lightweight", "Breathable"]
    },
    {
      id: "urban-street",
      name: "Urban Street Style",
      category: "Streetwear",
      description: "Edgy streetwear collection for the urban trendsetter",
      image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=400&fit=crop",
      items: 18,
      launchDate: "2024-05-15",
      featured: true,
      tags: ["Streetwear", "Urban", "Edgy"]
    },
    {
      id: "traditional-elegance",
      name: "Traditional Elegance",
      category: "Traditional",
      description: "Timeless traditional wear with a contemporary twist",
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop",
      items: 32,
      launchDate: "2024-04-20",
      featured: true,
      tags: ["Traditional", "Heritage", "Elegant"]
    },
    {
      id: "kids-fun",
      name: "Kids Fun Collection",
      category: "Kids",
      description: "Playful and comfortable outfits for your little ones",
      image: "https://images.unsplash.com/photo-1503919545889-a8c5f9125e9b?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=1200&h=400&fit=crop",
      items: 28,
      launchDate: "2024-03-10",
      featured: false,
      tags: ["Kids", "Playful", "Comfortable"]
    },
    {
      id: "office-ready",
      name: "Office Ready",
      category: "Formal",
      description: "Professional attire for the modern workplace",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1441984904996-1380e4c4ef8f?w=1200&h=400&fit=crop",
      items: 22,
      launchDate: "2024-02-15",
      featured: false,
      tags: ["Formal", "Business", "Professional"]
    },
    {
      id: "weekend-vibes",
      name: "Weekend Vibes",
      category: "Casual",
      description: "Relaxed and comfortable weekend wear",
      image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=400&fit=crop",
      items: 16,
      launchDate: "2024-01-20",
      featured: false,
      tags: ["Casual", "Comfortable", "Relaxed"]
    },
    {
      id: "wedding-dreams",
      name: "Wedding Dreams",
      category: "Wedding",
      description: "Bridal and groom collections for your special day",
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop",
      items: 42,
      launchDate: "2023-12-10",
      featured: true,
      tags: ["Wedding", "Bridal", "Groom"]
    },
    {
      id: "sport-active",
      name: "Sport Active",
      category: "Activewear",
      description: "Performance wear for an active lifestyle",
      image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=400&fit=crop",
      items: 20,
      launchDate: "2023-11-05",
      featured: false,
      tags: ["Activewear", "Sport", "Performance"]
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "Coming Soon";
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'summer':
        return <FaStar />;
      case 'streetwear':
        return <FaFire />;
      case 'traditional':
        return <FaCrown />;
      case 'kids':
        return <FaGem />;
      case 'formal':
        return <FaAward />;
      case 'casual':
        return <FaLeaf />;
      case 'wedding':
        return <FaCrown />;
      case 'activewear':
        return <FaFire />;
      default:
        return <FaTag />;
    }
  };

  if (loading) {
    return (
      <div className="collections-loading">
        <div className="loading-content">
          <div className="loading-spinner">
            <FaSpinner className="spinning-icon" />
          </div>
          <h4 className="mt-4">ASB FASHION</h4>
          <p className="text-muted">Discovering our collections...</p>
          <div className="loading-bar">
            <div className="loading-bar-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && collections.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <FaExclamationTriangle className="text-danger mb-3" style={{ fontSize: "3rem", opacity: 0.5 }} />
          <h3 className="text-danger mb-3">Unable to Load Collections</h3>
          <p className="text-muted mb-4">{error}</p>
          <Button variant="danger" onClick={fetchCollections}>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <motion.div 
      className="collections-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="collections-hero">
        <div className="hero-overlay">
          <Container className="h-100">
            <div className="hero-content text-center text-white">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge bg="danger" className="hero-badge mb-3 px-3 py-2">
                  <FaCrown className="me-2" /> OUR COLLECTIONS
                </Badge>
                <h1 className="display-3 fw-bold mb-3">Explore Our Collections</h1>
                <p className="lead mb-4">Curated fashion for every occasion and style</p>
                <div className="hero-stats">
                  <span className="hero-stat"><FaGem /> {collections.length}+ Collections</span>
                  <span className="hero-stat"><FaFire /> Seasonal Trends</span>
                  <span className="hero-stat"><FaAward /> Limited Editions</span>
                </div>
              </motion.div>
            </div>
          </Container>
        </div>
      </section>

      <Container className="py-5">
        {/* Featured Collection Banner */}
        {featuredCollection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="featured-collection mb-5"
          >
            <div className="featured-banner" style={{
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url(${featuredCollection.coverImage || featuredCollection.image})`
            }}>
              <div className="featured-content">
                <Badge bg="danger" className="featured-badge mb-3">
                  <FaFire className="me-1" /> FEATURED COLLECTION
                </Badge>
                <h2 className="featured-title">{featuredCollection.name}</h2>
                <p className="featured-description">{featuredCollection.description}</p>
                <div className="featured-meta">
                  <span><FaShoppingBag className="me-1" /> {featuredCollection.items} Items</span>
                  <span><FaCalendar className="me-1" /> {formatDate(featuredCollection.launchDate)}</span>
                </div>
                <Button 
                  variant="danger" 
                  size="lg" 
                  className="featured-btn mt-3"
                  onClick={() => navigate(`/collection/${featuredCollection.id}`)}
                >
                  Explore Collection <FaArrowRight className="ms-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Collections Grid */}
        <div className="collections-header mb-4">
          <h2 className="section-title">All Collections</h2>
          <p className="section-subtitle text-muted">Discover our curated fashion collections</p>
        </div>

        <Row xs={1} md={2} lg={3} className="g-4">
          {collections.map((collection, index) => (
            <Col key={collection.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Card className="collection-card">
                  <div className="collection-image-wrapper">
                    <Card.Img 
                      variant="top" 
                      src={collection.image} 
                      alt={collection.name}
                      className="collection-image"
                    />
                    {collection.featured && (
                      <Badge bg="danger" className="featured-tag">
                        <FaFire className="me-1" /> Featured
                      </Badge>
                    )}
                    {collection.discount && (
                      <Badge bg="warning" text="dark" className="discount-tag">
                        -{collection.discount}%
                      </Badge>
                    )}
                    <div className="collection-overlay">
                      <Button 
                        variant="light" 
                        className="view-btn"
                        onClick={() => navigate(`/collection/${collection.id}`)}
                      >
                        View Collection <FaArrowRight className="ms-2" />
                      </Button>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="collection-category">
                      {getCategoryIcon(collection.category)}
                      <small className="ms-1 text-muted">{collection.category || 'Collection'}</small>
                    </div>
                    <Card.Title className="collection-title">
                      {collection.name}
                    </Card.Title>
                    <Card.Text className="collection-description">
                      {collection.description}
                    </Card.Text>
                    <div className="collection-meta">
                      <div className="meta-item">
                        <FaShoppingBag className="meta-icon" />
                        <span>{collection.items} Items</span>
                      </div>
                      <div className="meta-item">
                        <FaCalendar className="meta-icon" />
                        <span>{formatDate(collection.launchDate)}</span>
                      </div>
                    </div>
                    <div className="collection-tags mt-3">
                      {collection.tags?.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} bg="light" text="dark" className="tag-badge me-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      variant="outline-danger" 
                      className="w-100 mt-3 explore-btn"
                      onClick={() => navigate(`/collection/${collection.id}`)}
                    >
                      Explore <FaArrowRight className="ms-2" />
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Newsletter Section */}
        <section className="newsletter-banner mt-5">
          <Row className="align-items-center">
            <Col lg={8}>
              <h3 className="text-white mb-2">Stay Updated with New Collections</h3>
              <p className="text-white-50 mb-3 mb-lg-0">
                Subscribe to get notified about our latest collections and exclusive offers
              </p>
            </Col>
            <Col lg={4}>
              <div className="newsletter-input-group">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="newsletter-input"
                />
                <button className="newsletter-btn">Subscribe</button>
              </div>
            </Col>
          </Row>
        </section>
      </Container>
    </motion.div>
  );
};

export default CollectionsPage;