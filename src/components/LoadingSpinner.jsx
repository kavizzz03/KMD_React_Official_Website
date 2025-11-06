import React from 'react';
import { motion } from 'framer-motion';
import { FaUtensils } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'lg', text = "Loading delicious sweets..." }) => {
  const sizes = {
    sm: '2rem',
    md: '3rem',
    lg: '4rem'
  };

  return (
    <div className="loading-spinner text-center">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity }
        }}
        style={{ width: sizes[size], height: sizes[size] }}
        className="mx-auto mb-3 text-warning"
      >
        <FaUtensils size="100%" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted mb-0"
      >
        {text}
      </motion.p>
      <motion.div
        className="progress mt-3"
        style={{ width: '200px', height: '4px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="progress-bar bg-warning"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;