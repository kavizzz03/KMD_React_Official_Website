import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Row, 
  Col, 
  Spinner, 
  Form, 
  Button, 
  Container,
  Card,
  Badge,
  InputGroup,
  Dropdown,
  ButtonGroup
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaFilter, 
  FaShoppingBag, 
  FaEye, 
  FaStar,
  FaFire,
  FaLeaf,
  FaAward,
  FaCheckCircle,
  FaTimes,
  FaSortAmountDown,
  FaTshirt,
  FaFemale,
  FaChild,
  FaGem,
  FaHeart,
  FaArrowRight,
  FaChevronDown,
  FaUndo,
  FaTags,
  FaClock,
  FaTruck
} from "react-icons/fa";
import ProductCard from "./ProductCard";
import "./ProductsPage.css";

const API_BASE = "https://whats.asbfashion.com/api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Category data
  const categoryData = [
    { id: "men", name: "Men's Fashion", icon: FaTshirt, color: "#2563eb" },
    { id: "women", name: "Women's Fashion", icon: FaFemale, color: "#dc2626" },
    { id: "kids", name: "Kids Collection", icon: FaChild, color: "#f59e0b" },
    { id: "accessories", name: "Accessories", icon: FaGem, color: "#8b5cf6" },
    { id: "traditional", name: "Traditional Wear", icon: FaStar, color: "#059669" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes] = await Promise.all([
          axios.get(`${API_BASE}/get_products.php`, { 
            params: { type: "all", limit: 100 } 
          })
        ]);
        setProducts(prodRes.data || []);
        setCategories(categoryData);
      } catch (e) {
        console.error("Error fetching data:", e);
        // Fallback data
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products;

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply price range filter
    if (priceRange.min) {
      filtered = filtered.filter((p) => (p.discounted_price || p.sell_price) >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter((p) => (p.discounted_price || p.sell_price) <= Number(priceRange.max));
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      const priceA = a.discounted_price || a.sell_price || 0;
      const priceB = b.discounted_price || b.sell_price || 0;
      
      switch (sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "newest":
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default: // featured
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      }
    });

    return filtered;
  }, [products, categoryFilter, searchTerm, sortBy, priceRange]);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const clearFilters = () => {
    setCategoryFilter("");
    setSearchTerm("");
    setSortBy("featured");
    setPriceRange({ min: "", max: "" });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (categoryFilter) count++;
    if (searchTerm) count++;
    if (sortBy !== "featured") count++;
    if (priceRange.min || priceRange.max) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="asb-products-loading">
        <div className="loading-content">
          <Spinner animation="border" variant="danger" className="mb-3" />
          <h4>ASB FASHION</h4>
          <p>Loading the latest styles...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="asb-products-page"
    >
      <Container fluid className="px-0">
        {/* Hero Banner */}
        <section className="asb-products-hero">
          <Container>
            <motion.div 
              className="hero-content text-center text-white"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge bg="light" text="dark" className="hero-badge mb-3 px-4 py-2">
                <FaTags className="me-2" />
                New Arrivals Daily
              </Badge>
              <h1 className="display-4 fw-bold mb-3">Fashion Collection 2024</h1>
              <p className="lead mb-0">Discover the perfect blend of tradition and modernity</p>
            </motion.div>
          </Container>
        </section>

        <Container className="py-4">
          {/* Header Section */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="asb-products-header mb-4"
          >
            <Row className="align-items-center">
              <Col lg={8}>
                <div className="d-flex align-items-center gap-3 mb-3 mb-lg-0">
                  <h1 className="display-5 fw-bold text-dark mb-0">
                    Our Collection
                  </h1>
                  <Badge bg="danger" className="fs-6 px-3 py-2">
                    {filteredAndSortedProducts.length} Items
                  </Badge>
                </div>
                <p className="text-muted mb-0">
                  Explore our latest fashion trends and timeless classics
                </p>
              </Col>
              <Col lg={4}>
                <div className="stats-cards">
                  <Row className="g-2">
                    <Col xs={4}>
                      <div className="stat-card text-center p-2">
                        <div className="stat-number text-danger fw-bold fs-4">{products.length}</div>
                        <div className="stat-label small">Total Items</div>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="stat-card text-center p-2">
                        <div className="stat-number text-success fw-bold fs-4">
                          {products.filter(p => p.is_new).length}
                        </div>
                        <div className="stat-label small">New Arrivals</div>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="stat-card text-center p-2">
                        <div className="stat-number text-warning fw-bold fs-4">
                          {products.filter(p => p.is_sale).length}
                        </div>
                        <div className="stat-label small">On Sale</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </motion.section>

          {/* Mobile Filter Toggle */}
          <div className="d-lg-none mb-3">
            <Button 
              variant="outline-danger" 
              className="w-100 d-flex align-items-center justify-content-between"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span><FaFilter className="me-2" /> Filters & Sort</span>
              <FaChevronDown className={`filter-arrow ${showFilters ? 'open' : ''}`} />
            </Button>
          </div>

          <Row>
            {/* Filters Sidebar */}
            <Col lg={3} className={`filters-column ${showFilters ? 'show' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="filters-sidebar"
              >
                <Card className="filters-card border-0 shadow-sm">
                  <Card.Header className="bg-white py-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="mb-0 fw-bold">
                        <FaFilter className="me-2 text-danger" />
                        Filters
                      </h5>
                      {getActiveFilterCount() > 0 && (
                        <Button 
                          variant="link" 
                          className="text-danger p-0"
                          onClick={clearFilters}
                        >
                          <FaUndo className="me-1" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {/* Search */}
                    <div className="filter-section mb-4">
                      <h6 className="filter-title">Search</h6>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="filter-search"
                        />
                        {searchTerm && (
                          <Button 
                            variant="outline-danger"
                            onClick={() => setSearchTerm("")}
                          >
                            <FaTimes />
                          </Button>
                        )}
                      </InputGroup>
                    </div>

                    {/* Categories */}
                    <div className="filter-section mb-4">
                      <h6 className="filter-title">Categories</h6>
                      <div className="category-list">
                        <Button
                          variant={categoryFilter === "" ? "danger" : "outline-secondary"}
                          className="category-btn w-100 mb-2"
                          onClick={() => setCategoryFilter("")}
                        >
                          All Categories
                        </Button>
                        {categoryData.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <Button
                              key={cat.id}
                              variant={categoryFilter === cat.id ? "danger" : "outline-secondary"}
                              className="category-btn w-100 mb-2 d-flex align-items-center"
                              onClick={() => setCategoryFilter(cat.id)}
                            >
                              <Icon className="me-2" style={{ color: cat.color }} />
                              {cat.name}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="filter-section mb-4">
                      <h6 className="filter-title">Price Range (LKR)</h6>
                      <Row className="g-2">
                        <Col xs={6}>
                          <Form.Control
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                          />
                        </Col>
                        <Col xs={6}>
                          <Form.Control
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                          />
                        </Col>
                      </Row>
                    </div>

                    {/* Sort Options */}
                    <div className="filter-section mb-4">
                      <h6 className="filter-title">Sort By</h6>
                      <Form.Select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                      >
                        <option value="featured">Featured</option>
                        <option value="newest">Newest First</option>
                        <option value="popular">Most Popular</option>
                        <option value="rating">Top Rated</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                      </Form.Select>
                    </div>

                    {/* Quick Filters */}
                    <div className="filter-section">
                      <h6 className="filter-title">Quick Filters</h6>
                      <div className="quick-filters">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="quick-filter-btn"
                          onClick={() => setSortBy("newest")}
                        >
                          <FaClock className="me-1" /> New Arrivals
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="quick-filter-btn"
                          onClick={() => setSortBy("popular")}
                        >
                          <FaFire className="me-1" /> Trending
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="quick-filter-btn"
                          onClick={() => setSortBy("rating")}
                        >
                          <FaStar className="me-1" /> Top Rated
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="quick-filter-btn"
                          onClick={() => setSortBy("price-low")}
                        >
                          <FaTags className="me-1" /> Under LKR 2000
                        </Button>
                      </div>
                    </div>

                    {/* Active Filters */}
                    {getActiveFilterCount() > 0 && (
                      <div className="active-filters mt-4 pt-3 border-top">
                        <h6 className="filter-title mb-2">Active Filters</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {categoryFilter && (
                            <Badge bg="danger" className="filter-badge">
                              {categoryData.find(c => c.id === categoryFilter)?.name}
                              <FaTimes 
                                className="ms-2 cursor-pointer" 
                                onClick={() => setCategoryFilter("")}
                              />
                            </Badge>
                          )}
                          {searchTerm && (
                            <Badge bg="danger" className="filter-badge">
                              "{searchTerm}"
                              <FaTimes 
                                className="ms-2 cursor-pointer" 
                                onClick={() => setSearchTerm("")}
                              />
                            </Badge>
                          )}
                          {priceRange.min && (
                            <Badge bg="danger" className="filter-badge">
                              Min: LKR {priceRange.min}
                              <FaTimes 
                                className="ms-2 cursor-pointer" 
                                onClick={() => setPriceRange({ ...priceRange, min: "" })}
                              />
                            </Badge>
                          )}
                          {priceRange.max && (
                            <Badge bg="danger" className="filter-badge">
                              Max: LKR {priceRange.max}
                              <FaTimes 
                                className="ms-2 cursor-pointer" 
                                onClick={() => setPriceRange({ ...priceRange, max: "" })}
                              />
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                {/* Promo Card */}
                <Card className="promo-card mt-4 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <FaTruck size={40} className="text-danger mb-3" />
                    <h6 className="fw-bold mb-2">Free Shipping</h6>
                    <p className="small text-muted mb-3">On orders over LKR 5000</p>
                    <Button variant="danger" size="sm" href="/sale">
                      Shop Now <FaArrowRight className="ms-1" />
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Products Grid */}
            <Col lg={9}>
              {/* Results Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="results-header mb-4"
              >
                <Row className="align-items-center">
                  <Col>
                    <p className="text-muted mb-0">
                      Showing <strong>{filteredAndSortedProducts.length}</strong> of{" "}
                      <strong>{products.length}</strong> products
                    </p>
                  </Col>
                  <Col xs="auto">
                    <ButtonGroup className="view-toggle">
                      <Button 
                        variant={viewMode === "grid" ? "danger" : "outline-danger"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        Grid
                      </Button>
                      <Button 
                        variant={viewMode === "list" ? "danger" : "outline-danger"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        List
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </motion.div>

              {/* Products Grid/List */}
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="products-section"
              >
                {filteredAndSortedProducts.length === 0 ? (
                  <div className="no-products text-center py-5">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="no-products-icon mb-4"
                    >
                      <FaSearch size={64} className="text-muted" />
                    </motion.div>
                    <h3 className="text-dark mb-3">No Products Found</h3>
                    <p className="text-muted mb-4">
                      Try adjusting your filters to see more results.
                    </p>
                    <Button variant="danger" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <Row xs={viewMode === "grid" ? 2 : 1} md={viewMode === "grid" ? 3 : 1} lg={viewMode === "grid" ? 3 : 1} className="g-4">
                    <AnimatePresence>
                      {filteredAndSortedProducts.map((product, index) => (
                        <Col key={product.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            layout
                          >
                            <ProductCard 
                              p={product} 
                              viewMode={viewMode}
                              onAddToCart={(message) => showToast(message)}
                            />
                          </motion.div>
                        </Col>
                      ))}
                    </AnimatePresence>
                  </Row>
                )}
              </motion.section>

              {/* Load More */}
              {filteredAndSortedProducts.length > 0 && filteredAndSortedProducts.length < products.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="load-more text-center mt-5"
                >
                  <Button variant="outline-danger" size="lg" className="px-5">
                    Load More Products
                  </Button>
                </motion.div>
              )}
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Success Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="asb-success-toast"
          >
            <div className="toast-content">
              <FaCheckCircle className="text-success me-3 fs-4" />
              <div>
                <strong>{toastMessage}</strong>
                <small className="d-block text-muted">Added to your cart</small>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => window.location.href = '/cart'}
              className="ms-3"
            >
              View Cart
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductsPage;