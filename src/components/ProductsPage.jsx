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
  InputGroup
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaFilter, 
  FaShoppingCart, 
  FaEye, 
  FaStar,
  FaFire,
  FaLeaf,
  FaAward,
  FaCheckCircle,
  FaTimes,
  FaSortAmountDown
} from "react-icons/fa";
import ProductCard from "./ProductCard";
import "./ProductsPage.css";

const API_BASE = "https://kmd.cpsharetxt.com/api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, supRes] = await Promise.all([
          axios.get(`${API_BASE}/get_products.php`, { 
            params: { type: "all", limit: 100 } 
          }),
          axios.get(`${API_BASE}/get_suppliers.php`)
        ]);
        setProducts(prodRes.data || []);
        setSuppliers(supRes.data || []);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products;

    // Apply supplier filter
    if (supplierFilter) {
      filtered = filtered.filter((p) => String(p.supplier_id) === supplierFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.discounted_price || a.sell_price) - (b.discounted_price || b.sell_price);
        case "price-high":
          return (b.discounted_price || b.sell_price) - (a.discounted_price || a.sell_price);
        case "name":
          return a.name.localeCompare(b.name);
        case "best-seller":
          return (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, supplierFilter, searchTerm, sortBy]);

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const clearFilters = () => {
    setSupplierFilter("");
    setSearchTerm("");
    setSortBy("name");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (supplierFilter) count++;
    if (searchTerm) count++;
    if (sortBy !== "name") count++;
    return count;
  };

  if (loading) {
    return (
      <div className="products-loading-container d-flex justify-content-center align-items-center min-vh-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Spinner animation="border" variant="warning" size="lg" className="mb-3" />
          <p className="h5 text-muted">Loading sweet delights...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="products-page"
    >
      <Container className="py-4">
        {/* Header Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="products-header mb-5"
        >
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold text-dark mb-2">
                Our Sweet Collection
              </h1>
              <p className="lead text-muted mb-0">
                Discover {products.length} traditional Sri Lankan sweets made with love and tradition
              </p>
            </Col>
            <Col lg={6}>
              <div className="stats-cards">
                <Row className="g-3">
                  <Col xs={4}>
                    <div className="stat-card text-center">
                      <div className="stat-number text-warning fw-bold">{products.length}</div>
                      <div className="stat-label small">Total Products</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="stat-card text-center">
                      <div className="stat-number text-success fw-bold">
                        {products.filter(p => p.is_best_seller).length}
                      </div>
                      <div className="stat-label small">Best Sellers</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="stat-card text-center">
                      <div className="stat-number text-primary fw-bold">
                        {suppliers.length}
                      </div>
                      <div className="stat-label small">Suppliers</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </motion.section>

        {/* Filters Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="filters-section mb-4"
        >
          <Card className="filters-card">
            <Card.Body>
              <Row className="g-3 align-items-end">
                {/* Search */}
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold mb-2">
                      <FaSearch className="me-2 text-muted" />
                      Search Products
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

                {/* Supplier Filter */}
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="fw-semibold mb-2">
                      <FaFilter className="me-2 text-muted" />
                      Filter by Supplier
                    </Form.Label>
                    <Form.Select
                      value={supplierFilter}
                      onChange={(e) => setSupplierFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Suppliers</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Sort By */}
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="fw-semibold mb-2">
                      <FaSortAmountDown className="me-2 text-muted" />
                      Sort By
                    </Form.Label>
                    <Form.Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="filter-select"
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="best-seller">Best Sellers First</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Actions */}
                <Col md={2}>
                  <div className="d-flex gap-2">
                    {getActiveFilterCount() > 0 && (
                      <Button
                        variant="outline-danger"
                        onClick={clearFilters}
                        className="flex-grow-1"
                        size="sm"
                      >
                        <FaTimes className="me-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>

              {/* Active Filters */}
              {getActiveFilterCount() > 0 && (
                <div className="active-filters mt-3">
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <small className="text-muted me-2">Active filters:</small>
                    {supplierFilter && (
                      <Badge bg="primary" className="filter-badge">
                        Supplier: {suppliers.find(s => String(s.id) === supplierFilter)?.name}
                        <FaTimes 
                          className="ms-1 cursor-pointer" 
                          onClick={() => setSupplierFilter("")}
                        />
                      </Badge>
                    )}
                    {searchTerm && (
                      <Badge bg="info" className="filter-badge">
                        Search: {searchTerm}
                        <FaTimes 
                          className="ms-1 cursor-pointer" 
                          onClick={() => setSearchTerm("")}
                        />
                      </Badge>
                    )}
                    {sortBy !== "name" && (
                      <Badge bg="warning" className="filter-badge">
                        Sorted by {sortBy.replace('-', ' ')}
                        <FaTimes 
                          className="ms-1 cursor-pointer" 
                          onClick={() => setSortBy("name")}
                        />
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.section>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="results-count mb-4"
        >
          <Row className="align-items-center">
            <Col>
              <p className="text-muted mb-0">
                Showing <strong>{filteredAndSortedProducts.length}</strong> of{" "}
                <strong>{products.length}</strong> products
                {getActiveFilterCount() > 0 && " (filtered)"}
              </p>
            </Col>
            <Col xs="auto">
              <div className="d-flex align-items-center gap-3">
                {filteredAndSortedProducts.length > 0 && (
                  <>
                    <Badge bg="light" text="dark" className="feature-badge">
                      <FaLeaf className="me-1 text-success" />
                      Natural Ingredients
                    </Badge>
                    <Badge bg="light" text="dark" className="feature-badge">
                      <FaAward className="me-1 text-warning" />
                      Premium Quality
                    </Badge>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </motion.div>

        {/* Products Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="products-grid-section"
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
                {getActiveFilterCount() > 0 
                  ? "Try adjusting your filters to see more results."
                  : "No products available at the moment."
                }
              </p>
              {getActiveFilterCount() > 0 && (
                <Button variant="warning" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-4">
              <AnimatePresence>
                {filteredAndSortedProducts.map((product, index) => (
                  <Col key={product.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <ProductCard 
                        p={product} 
                        onAddToCart={(message) => showToast(message)}
                      />
                    </motion.div>
                  </Col>
                ))}
              </AnimatePresence>
            </Row>
          )}
        </motion.section>

        {/* Quick Actions */}
        {filteredAndSortedProducts.length > 8 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="quick-actions-section mt-5"
          >
            <Card className="quick-actions-card text-center">
              <Card.Body className="py-4">
                <h5 className="mb-3">Can't find what you're looking for?</h5>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button variant="outline-primary" onClick={clearFilters}>
                    Show All Products
                  </Button>
                  <Button variant="outline-success">
                    <FaFire className="me-2" />
                    View Best Sellers
                  </Button>
                  <Button variant="outline-warning">
                    Contact Supplier
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </motion.section>
        )}
      </Container>

      {/* Success Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="success-toast"
          >
            <div className="toast-content d-flex align-items-center">
              <FaCheckCircle className="text-success me-3 fs-4" />
              <div>
                <strong className="d-block">{toastMessage}</strong>
                <small>Product added to your cart</small>
              </div>
            </div>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => window.dispatchEvent(new Event("cartUpdated"))}
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