import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeart, 
  FaShare, 
  FaEye, 
  FaStar,
  FaFilter,
  FaSortAmountDown,
  FaShoppingBag,
  FaArrowRight,
  FaCrown,
  FaTshirt,
  FaFemale,
  FaChild,
  FaGem,
  FaFire,
  FaAward,
  FaCalendar,
  FaClock,
  FaTag,
  FaLeaf,
  FaPalette,
  FaRuler,
  FaCheckCircle
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./CollectionPage.css";

const CollectionPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  // Collections data
  const collections = [
    {
      id: "summer-breeze",
      name: "Summer Breeze 2024",
      category: "Summer",
      description: "Light and breezy summer wear for the modern fashion enthusiast",
      longDescription: "Embrace the warmth of summer with our exclusive Summer Breeze collection. Featuring lightweight fabrics, vibrant colors, and breathable designs perfect for those sunny days. Each piece is crafted to keep you cool while looking effortlessly stylish.",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1441984904996-1380e4c4ef8f?w=1200&h=400&fit=crop",
      items: 24,
      launchDate: "2024-06-01",
      colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
      styles: ["Casual", "Beach", "Party", "Vacation"],
      featured: true,
      tags: ["Summer", "Lightweight", "Breathable", "Vibrant"]
    },
    {
      id: "urban-street",
      name: "Urban Street Style",
      category: "Streetwear",
      description: "Edgy streetwear collection for the urban trendsetter",
      longDescription: "Make a statement with our Urban Street collection. Inspired by city life and street culture, these pieces blend comfort with attitude. From oversized hoodies to cargo pants, find your urban edge here.",
      image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=400&fit=crop",
      items: 18,
      launchDate: "2024-05-15",
      colors: ["#2C3E50", "#E74C3C", "#ECF0F1", "#3498DB"],
      styles: ["Street", "Casual", "Sport", "Urban"],
      featured: true,
      tags: ["Streetwear", "Urban", "Edgy", "Comfort"]
    },
    {
      id: "traditional-elegance",
      name: "Traditional Elegance",
      category: "Traditional",
      description: "Timeless traditional wear with a contemporary twist",
      longDescription: "Celebrate heritage with our Traditional Elegance collection. Featuring classic silhouettes reimagined for the modern wearer, each piece honors Sri Lankan craftsmanship while embracing contemporary aesthetics.",
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop",
      items: 32,
      launchDate: "2024-04-20",
      colors: ["#C0392B", "#F39C12", "#16A085", "#8E44AD"],
      styles: ["Traditional", "Festival", "Wedding", "Ceremonial"],
      featured: true,
      tags: ["Traditional", "Heritage", "Elegant", "Handcrafted"]
    },
    {
      id: "kids-fun",
      name: "Kids Fun Collection",
      category: "Kids",
      description: "Playful and comfortable outfits for your little ones",
      longDescription: "Let your little ones shine with our Kids Fun collection. Designed for play and adventure, these pieces combine durability with adorable styles. From playful prints to comfortable fabrics, every outfit is made for happy moments.",
      image: "https://images.unsplash.com/photo-1503919545889-a8c5f9125e9b?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=1200&h=400&fit=crop",
      items: 28,
      launchDate: "2024-03-10",
      colors: ["#F7DC6F", "#F1948A", "#85C1E2", "#58D68D"],
      styles: ["Play", "School", "Party", "Casual"],
      featured: false,
      tags: ["Kids", "Playful", "Comfortable", "Colorful"]
    },
    {
      id: "office-ready",
      name: "Office Ready",
      category: "Formal",
      description: "Professional attire for the modern workplace",
      longDescription: "Elevate your workwear with our Office Ready collection. Sharp tailoring, premium fabrics, and sophisticated designs ensure you look professional and feel confident from meetings to after-work events.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1441984904996-1380e4c4ef8f?w=1200&h=400&fit=crop",
      items: 22,
      launchDate: "2024-02-15",
      colors: ["#2C3E50", "#7F8C8D", "#34495E", "#5D6D7E"],
      styles: ["Formal", "Business", "Professional", "Corporate"],
      featured: false,
      tags: ["Formal", "Business", "Professional", "Elegant"]
    },
    {
      id: "weekend-vibes",
      name: "Weekend Vibes",
      category: "Casual",
      description: "Relaxed and comfortable weekend wear",
      longDescription: "Unwind in style with our Weekend Vibes collection. Perfect for lazy Sundays and casual outings, these pieces prioritize comfort without compromising on style. Soft fabrics, relaxed fits, and easy-going designs await.",
      image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=400&fit=crop",
      items: 16,
      launchDate: "2024-01-20",
      colors: ["#F39C12", "#16A085", "#E74C3C", "#3498DB"],
      styles: ["Casual", "Weekend", "Travel", "Relaxed"],
      featured: false,
      tags: ["Casual", "Comfortable", "Relaxed", "Weekend"]
    },
    {
      id: "wedding-dreams",
      name: "Wedding Dreams",
      category: "Wedding",
      description: "Bridal and groom collections for your special day",
      longDescription: "Make your special day unforgettable with our Wedding Dreams collection. From exquisite bridal wear to dapper groom attire, every piece is designed to make you look and feel extraordinary on your big day.",
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop",
      items: 42,
      launchDate: "2023-12-10",
      colors: ["#FDFEFE", "#FAD7A0", "#D4AC0D", "#E6B0AA"],
      styles: ["Wedding", "Formal", "Traditional", "Bridal"],
      featured: true,
      tags: ["Wedding", "Bridal", "Groom", "Special Occasion"]
    },
    {
      id: "sport-active",
      name: "Sport Active",
      category: "Activewear",
      description: "Performance wear for an active lifestyle",
      longDescription: "Push your limits with our Sport Active collection. Engineered for performance and designed for style, these pieces feature moisture-wicking fabrics, ergonomic fits, and breathable materials to keep you comfortable during any activity.",
      image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&h=600&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=400&fit=crop",
      items: 20,
      launchDate: "2023-11-05",
      colors: ["#2874A6", "#E67E22", "#27AE60", "#E74C3C"],
      styles: ["Sport", "Active", "Gym", "Training"],
      featured: false,
      tags: ["Activewear", "Sport", "Performance", "Comfort"]
    }
  ];

  // Collection items (products in the collection)
  const collectionItems = [
    {
      id: 1,
      name: "Floral Summer Dress",
      category: "women",
      price: 4500,
      originalPrice: 6500,
      discount: 30,
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop",
      rating: 4.5,
      reviews: 128,
      collection: "summer-breeze",
      colors: ["#FF6B6B", "#4ECDC4"],
      sizes: ["XS", "S", "M", "L"],
      description: "Light and breezy summer dress with beautiful floral patterns"
    },
    {
      id: 2,
      name: "Linen Blend Shirt",
      category: "men",
      price: 3500,
      originalPrice: 4800,
      discount: 27,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop",
      rating: 4.3,
      reviews: 89,
      collection: "summer-breeze",
      colors: ["#FFFFFF", "#E0E0E0", "#A9A9A9"],
      sizes: ["S", "M", "L", "XL"],
      description: "Premium linen shirt perfect for casual and formal occasions"
    },
    {
      id: 3,
      name: "Canvas Sneakers",
      category: "accessories",
      price: 2800,
      originalPrice: 3900,
      discount: 28,
      image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&h=500&fit=crop",
      rating: 4.7,
      reviews: 234,
      collection: "summer-breeze",
      colors: ["#FFFFFF", "#000000", "#8B4513"],
      sizes: ["38", "39", "40", "41", "42", "43"],
      description: "Comfortable canvas sneakers for everyday wear"
    },
    {
      id: 4,
      name: "Wide Leg Pants",
      category: "women",
      price: 3200,
      originalPrice: 4500,
      discount: 29,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop",
      rating: 4.4,
      reviews: 156,
      collection: "summer-breeze",
      colors: ["#000000", "#808080", "#F5F5F5"],
      sizes: ["XS", "S", "M", "L"],
      description: "Trendy wide leg pants for a chic look"
    },
    {
      id: 5,
      name: "Hoodie Street Style",
      category: "men",
      price: 4200,
      originalPrice: 5800,
      discount: 28,
      image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=400&h=500&fit=crop",
      rating: 4.6,
      reviews: 312,
      collection: "urban-street",
      colors: ["#000000", "#808080", "#800020"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "Street style hoodie with modern design"
    },
    {
      id: 6,
      name: "Cargo Pants",
      category: "men",
      price: 3800,
      originalPrice: 5200,
      discount: 27,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop",
      rating: 4.5,
      reviews: 178,
      collection: "urban-street",
      colors: ["#2C3E50", "#34495E", "#566573"],
      sizes: ["S", "M", "L", "XL"],
      description: "Stylish cargo pants with multiple pockets"
    },
    {
      id: 7,
      name: "Graphic Tee",
      category: "men",
      price: 2200,
      originalPrice: 3200,
      discount: 31,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop",
      rating: 4.2,
      reviews: 98,
      collection: "urban-street",
      colors: ["#FFFFFF", "#000000", "#808080"],
      sizes: ["S", "M", "L", "XL"],
      description: "Cool graphic t-shirt for street style"
    },
    {
      id: 8,
      name: "Traditional Saree",
      category: "women",
      price: 8500,
      originalPrice: 12000,
      discount: 29,
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop",
      rating: 4.8,
      reviews: 567,
      collection: "traditional-elegance",
      colors: ["#C0392B", "#8E44AD", "#16A085"],
      sizes: ["One Size"],
      description: "Elegant traditional saree with gold border"
    },
    {
      id: 9,
      name: "Embroidered Kurta",
      category: "men",
      price: 5500,
      originalPrice: 7800,
      discount: 30,
      image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=400&h=500&fit=crop",
      rating: 4.7,
      reviews: 234,
      collection: "traditional-elegance",
      colors: ["#FDFEFE", "#F8F9F9", "#FAD7A0"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "Hand-embroidered kurta for special occasions"
    },
    {
      id: 10,
      name: "Kids Party Dress",
      category: "kids",
      price: 2800,
      originalPrice: 3900,
      discount: 28,
      image: "https://images.unsplash.com/photo-1503919545889-a8c5f9125e9b?w=400&h=500&fit=crop",
      rating: 4.6,
      reviews: 145,
      collection: "kids-fun",
      colors: ["#F7DC6F", "#F1948A", "#85C1E2"],
      sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
      description: "Adorable party dress for your little princess"
    },
    {
      id: 11,
      name: "Boys Formal Shirt",
      category: "kids",
      price: 2200,
      originalPrice: 3200,
      discount: 31,
      image: "https://images.unsplash.com/photo-1503919545889-a8c5f9125e9b?w=400&h=500&fit=crop",
      rating: 4.3,
      reviews: 89,
      collection: "kids-fun",
      colors: ["#FFFFFF", "#A9A9A9", "#0000FF"],
      sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
      description: "Stylish formal shirt for young gentlemen"
    },
    {
      id: 12,
      name: "Blazer Formal",
      category: "men",
      price: 9500,
      originalPrice: 13500,
      discount: 30,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop",
      rating: 4.8,
      reviews: 345,
      collection: "office-ready",
      colors: ["#2C3E50", "#34495E", "#1C2833"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "Premium formal blazer for the perfect fit"
    },
    {
      id: 13,
      name: "Casual Denim Jacket",
      category: "women",
      price: 4800,
      originalPrice: 6800,
      discount: 29,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop",
      rating: 4.5,
      reviews: 167,
      collection: "weekend-vibes",
      colors: ["#1B4D8A", "#2E5895", "#003399"],
      sizes: ["XS", "S", "M", "L"],
      description: "Classic denim jacket with modern style"
    },
    {
      id: 14,
      name: "Wedding Lehenga",
      category: "women",
      price: 25000,
      originalPrice: 35000,
      discount: 29,
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop",
      rating: 4.9,
      reviews: 789,
      collection: "wedding-dreams",
      colors: ["#C0392B", "#8E44AD", "#D35400"],
      sizes: ["S", "M", "L"],
      description: "Exquisite bridal lehenga for your special day"
    },
    {
      id: 15,
      name: "Gym T-shirt",
      category: "men",
      price: 1800,
      originalPrice: 2500,
      discount: 28,
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop",
      rating: 4.4,
      reviews: 234,
      collection: "sport-active",
      colors: ["#2874A6", "#E67E22", "#27AE60"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "Breathable gym t-shirt for workouts"
    }
  ];

  const categories = ["All", "Women", "Men", "Kids", "Accessories"];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Get current collection
  const currentCollection = collections.find(c => c.id === collectionId) || collections[0];

  // Filter items by collection and category
  const filteredItems = collectionItems
    .filter(item => item.collection === (collectionId || "summer-breeze"))
    .filter(item => activeCategory === "all" || item.category === activeCategory)
    .sort((a, b) => {
      switch(sortBy) {
        case "featured":
          return (b.rating - a.rating);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "discount":
          return b.discount - a.discount;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const formatPrice = (price) => {
    return `LKR ${price.toLocaleString()}`;
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'men': return <FaTshirt />;
      case 'women': return <FaFemale />;
      case 'kids': return <FaChild />;
      default: return <FaGem />;
    }
  };

  const getRandomImage = () => {
    const images = [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop"
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  if (loading) {
    return (
      <div className="asb-collection-loading">
        <div className="loading-content">
          <FaCrown className="loading-icon" />
          <h4>ASB FASHION</h4>
          <p>Loading collection...</p>
          <div className="loading-bar" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="asb-collection-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Collection Hero */}
      <section 
        className="collection-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url(${currentCollection.coverImage})`
        }}
      >
        <div className="hero-overlay">
          <Container>
            <motion.div 
              className="hero-content text-white"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge bg="danger" className="hero-badge mb-3">
                <FaStar className="me-2" />
                {currentCollection.featured ? "Featured Collection" : "Collection"}
              </Badge>
              <h1 className="display-3 fw-bold mb-3">{currentCollection.name}</h1>
              <p className="lead mb-4">{currentCollection.description}</p>
              
              <div className="collection-meta">
                <div className="meta-item">
                  <FaShoppingBag className="meta-icon" />
                  <span>{currentCollection.items} Items</span>
                </div>
                <div className="meta-item">
                  <FaCalendar className="meta-icon" />
                  <span>Launched: {new Date(currentCollection.launchDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="collection-tags mt-3">
                {currentCollection.tags.map((tag, index) => (
                  <Badge key={index} bg="light" text="dark" className="me-2 mb-2 px-3 py-2">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </Container>
        </div>
      </section>

      {/* Collection Stats */}
      <section className="collection-stats">
        <Container>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaAward className="stat-icon" />
                <div>
                  <h3>Premium</h3>
                  <p>Quality</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaLeaf className="stat-icon" />
                <div>
                  <h3>Sustainable</h3>
                  <p>Materials</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaFire className="stat-icon" />
                <div>
                  <h3>Trending</h3>
                  <p>Now</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <FaCheckCircle className="stat-icon" />
                <div>
                  <h3>Authentic</h3>
                  <p>Guaranteed</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-4">
        {/* Collection Description */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h5 className="text-danger mb-3">About the Collection</h5>
            <p className="lead text-muted">{currentCollection.longDescription}</p>
          </Col>
        </Row>

        {/* Filters Row */}
        <Row className="mb-4 align-items-center">
          <Col lg={6}>
            <div className="category-filters">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className={`category-btn ${activeCategory === category.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.toLowerCase())}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </Col>
          <Col lg={6}>
            <div className="sort-filter">
              <FaSortAmountDown className="me-2 text-danger" />
              <Form.Select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="rating">Top Rated</option>
              </Form.Select>
            </div>
          </Col>
        </Row>

        {/* Results Info */}
        <div className="results-info mb-4">
          <p className="text-muted">
            Showing <strong>{filteredItems.length}</strong> items in <strong>{currentCollection.name}</strong>
          </p>
        </div>

        {/* Products Grid */}
        <Row xs={2} md={3} lg={4} className="g-4">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <Col key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="collection-product-card">
                    <div className="product-image-wrapper">
                      {item.discount > 0 && (
                        <Badge bg="danger" className="discount-badge">
                          -{item.discount}%
                        </Badge>
                      )}
                      <Card.Img 
                        variant="top" 
                        src={item.image} 
                        alt={item.name}
                        className="product-image"
                      />
                      <div className="product-overlay">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="overlay-btn"
                          onClick={() => handleItemClick(item)}
                        >
                          <FaEye /> Quick View
                        </Button>
                      </div>
                    </div>
                    <Card.Body>
                      <div className="product-category">
                        {getCategoryIcon(item.category)}
                        <small className="ms-1">{item.category}</small>
                      </div>
                      <Card.Title className="product-title">{item.name}</Card.Title>
                      <div className="product-rating mb-2">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < Math.floor(item.rating) ? 'text-warning' : 'text-light'} 
                            />
                          ))}
                        </div>
                        <small className="text-muted ms-2">({item.reviews})</small>
                      </div>
                      <div className="product-price">
                        <span className="sale-price">{formatPrice(item.price)}</span>
                        <span className="original-price">{formatPrice(item.originalPrice)}</span>
                      </div>
                      <Button 
                        variant="outline-danger" 
                        className="w-100 mt-3 view-btn"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </AnimatePresence>
        </Row>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="empty-state text-center py-5">
            <FaEye size={60} className="text-muted mb-3" />
            <h4>No items found</h4>
            <p className="text-muted">Try selecting a different category</p>
          </div>
        )}

        {/* Style Guide */}
        <section className="style-guide mt-5">
          <Card className="style-guide-card">
            <Card.Body>
              <Row className="align-items-center">
                <Col lg={8}>
                  <h3 className="fw-bold mb-3">How to Style This Collection</h3>
                  <p className="text-muted mb-4">
                    {currentCollection.name} offers versatile pieces that can be styled for various occasions. 
                    Here are our expert tips to make the most of this collection.
                  </p>
                  <div className="style-tips">
                    {currentCollection.styles.map((style, index) => (
                      <Badge key={index} bg="light" text="dark" className="style-tip me-2 mb-2 px-3 py-2">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </Col>
                <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
                  <Button variant="danger" size="lg" onClick={() => navigate("/lookbook")}>
                    View Lookbook <FaArrowRight className="ms-2" />
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </section>

        {/* Related Collections */}
        <section className="related-collections mt-5">
          <h3 className="section-title mb-4">Explore Other Collections</h3>
          <Row xs={2} md={4} className="g-4">
            {collections.filter(c => c.id !== currentCollection.id).slice(0, 4).map((collection) => (
              <Col key={collection.id}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="collection-card"
                  onClick={() => navigate(`/collection/${collection.id}`)}
                >
                  <img src={collection.image} alt={collection.name} className="collection-image" />
                  <div className="collection-card-overlay">
                    <h5>{collection.name}</h5>
                    <p>{collection.items} Items</p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </section>
      </Container>

      {/* Quick View Modal */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div 
            className="quick-view-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <Row className="g-4">
              <Col md={6}>
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name}
                  className="img-fluid rounded mb-3"
                />
                <div className="color-swatches mb-3">
                  <small className="text-muted d-block mb-2">Available Colors:</small>
                  <div className="d-flex gap-2">
                    {selectedItem.colors?.map((color, idx) => (
                      <div 
                        key={idx}
                        className="color-swatch"
                        style={{ backgroundColor: color }}
                        onClick={() => setCurrentImage(idx)}
                      />
                    ))}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <Badge bg="danger" className="mb-3">{currentCollection.name}</Badge>
                <h3 className="fw-bold mb-3">{selectedItem.name}</h3>
                <div className="rating mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(selectedItem.rating) ? 'text-warning' : 'text-light'} />
                  ))}
                  <span className="ms-2 text-muted">({selectedItem.reviews} reviews)</span>
                </div>
                <div className="price-section mb-4">
                  <span className="sale-price h3 text-danger">{formatPrice(selectedItem.price)}</span>
                  <span className="original-price ms-3 text-muted text-decoration-line-through">
                    {formatPrice(selectedItem.originalPrice)}
                  </span>
                  <Badge bg="success" className="ms-3">Save {selectedItem.discount}%</Badge>
                </div>
                <p className="text-muted mb-4">{selectedItem.description}</p>
                
                <div className="size-section mb-4">
                  <small className="text-muted d-block mb-2">Available Sizes:</small>
                  <div className="d-flex gap-2">
                    {selectedItem.sizes?.map((size, idx) => (
                      <Button key={idx} variant="outline-secondary" size="sm" className="size-btn">
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <Button variant="danger" size="lg" className="flex-fill" onClick={() => {
                    setShowModal(false);
                    navigate(`/product/${selectedItem.id}`);
                  }}>
                    View Full Details
                  </Button>
                  <Button variant="outline-danger" size="lg">
                    <FaHeart />
                  </Button>
                </div>
              </Col>
            </Row>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CollectionPage;