// src/pages/AboutPage.jsx
import React from "react";
import { FaHeart, FaAward, FaUsers, FaLeaf, FaStar, FaCookie, FaCandyCane, FaBirthdayCake } from "react-icons/fa";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="floating-sweets-hero">
          <div className="floating-sweet">🍬</div>
          <div className="floating-sweet">🍪</div>
          <div className="floating-sweet">🎂</div>
          <div className="floating-sweet">🧁</div>
          <div className="floating-sweet">🍫</div>
        </div>
        <h1>About Us</h1>
        <p>Bringing sweetness to life since 2014</p>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <div className="about-text">
          <h2>Our Sweet Journey</h2>
          <p>
            Our journey began in <strong>January 2014</strong> with a simple dream —
            to share homemade sweets made with love, care, and real flavor.
            What started as a small family business quickly grew through the
            support of our loyal customers who believed in our taste and
            quality.
          </p>

          <p>
            After years of hard work and dedication, we proudly opened our
            <strong> first official branch in 2021</strong>. It marked a special
            milestone that turned our dream into a brand known for freshness,
            creativity, and happiness in every bite.
          </p>

          <p>
            Today, we continue to serve the community with the same passion,
            offering delightful treats that bring people together. Our goal is
            simple — to make every day a little sweeter.
          </p>
        </div>

        <div className="about-image">
          <img
            src="https://plus.unsplash.com/premium_photo-1668437381039-21807fe4d2b9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1990"
            alt="Our Sweet Shop"
          />
          <div className="image-decoration">
            <FaCookie />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="about-timeline">
        <h2>Our Journey Timeline</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-year">2014</div>
              <h3>The Beginning</h3>
              <p>Started as a small home-based sweet business with traditional family recipes</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-year">2018</div>
              <h3>Growing Popularity</h3>
              <p>Expanded our customer base and introduced modern sweet variations</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-year">2021</div>
              <h3>First Branch</h3>
              <p>Opened our first official store, marking a major milestone in our journey</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-year">2024</div>
              <h3>Sweet Excellence</h3>
              <p>Continuing to serve happiness with innovation and traditional values</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="about-values">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <FaHeart />
            </div>
            <h3>Made with Love</h3>
            <p>Every sweet is crafted with passion and care, just like homemade treats</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <FaLeaf />
            </div>
            <h3>Quality Ingredients</h3>
            <p>We use only the finest natural ingredients for authentic flavors</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <FaUsers />
            </div>
            <h3>Community First</h3>
            <p>Building relationships and sweetening lives in our community</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <FaAward />
            </div>
            <h3>Excellence</h3>
            <p>Committed to maintaining the highest standards in taste and service</p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="about-mission">
        <h2>Our Sweet Mission</h2>
        <p>
          To craft high-quality sweets that spread joy and flavor, while
          keeping our traditional recipes alive with a modern touch. We believe
          in creating moments of happiness, one sweet treat at a time.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;