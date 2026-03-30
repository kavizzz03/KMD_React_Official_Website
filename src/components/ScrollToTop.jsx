import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaTshirt, FaStar } from 'react-icons/fa';
import './ScrollToTop.css';

const ScrollToTop = ({ 
  threshold = 300, 
  position = 'right',
  color = 'danger',
  size = 'md',
  showProgress = true,
  tooltip = 'Back to Top'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      setScrollProgress(scrolled);
      
      if (winScroll > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToTopInstant = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  const sizeStyles = {
    sm: { width: '40px', height: '40px', iconSize: '16px' },
    md: { width: '50px', height: '50px', iconSize: '20px' },
    lg: { width: '60px', height: '60px', iconSize: '24px' }
  };

  const positionStyles = {
    right: { right: '30px' },
    left: { left: '30px' },
    center: { left: '50%', transform: 'translateX(-50%)' }
  };

  const colorStyles = {
    danger: {
      background: '#dc2626',
      hover: '#b91c1c',
      shadow: 'rgba(220, 38, 38, 0.3)'
    },
    dark: {
      background: '#1f2937',
      hover: '#111827',
      shadow: 'rgba(31, 41, 55, 0.3)'
    },
    light: {
      background: '#f3f4f6',
      hover: '#e5e7eb',
      shadow: 'rgba(243, 244, 246, 0.3)',
      text: '#1f2937'
    }
  };

  const buttonVariants = {
    initial: { 
      scale: 0, 
      opacity: 0,
      y: 20
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    },
    hover: { 
      scale: 1.1,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: { 
      scale: 0.9 
    }
  };

  const progressVariants = {
    initial: { rotate: -90 },
    animate: { 
      rotate: -90,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={`asb-scroll-top scroll-${position} size-${size}`}
          style={{
            ...positionStyles[position],
            ...sizeStyles[size]
          }}
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          whileHover="hover"
          whileTap="tap"
        >
          {/* Main Button */}
          <motion.button
            className="scroll-button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
              backgroundColor: colorStyles[color]?.background || colorStyles.danger.background,
              width: '100%',
              height: '100%'
            }}
          >
            {/* Progress Circle */}
            {showProgress && (
              <svg className="progress-circle" viewBox="0 0 100 100">
                <circle
                  className="progress-bg"
                  cx="50"
                  cy="50"
                  r="45"
                />
                <motion.circle
                  className="progress-bar"
                  cx="50"
                  cy="50"
                  r="45"
                  strokeLinecap="round"
                  variants={progressVariants}
                  animate="animate"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 45}`,
                    strokeDashoffset: `${2 * Math.PI * 45 * (1 - scrollProgress / 100)}`,
                    stroke: color === 'light' ? '#dc2626' : '#ffffff'
                  }}
                />
              </svg>
            )}
            
            {/* Arrow Icon */}
            <FaArrowUp 
              className="arrow-icon"
              style={{ 
                fontSize: sizeStyles[size].iconSize,
                color: color === 'light' ? '#1f2937' : '#ffffff'
              }} 
            />
          </motion.button>

          {/* Tooltip */}
          {tooltip && (
            <motion.div 
              className="scroll-tooltip"
              initial={{ opacity: 0, x: position === 'right' ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {tooltip}
            </motion.div>
          )}

          {/* Double Click Hint */}
          <motion.div 
            className="double-click-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={scrollToTopInstant}
          >
            Double click for instant
          </motion.div>

          {/* Decorative Fashion Icons */}
          <motion.div 
            className="scroll-decorations"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaTshirt className="decor-icon top" />
            <FaStar className="decor-icon bottom" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;