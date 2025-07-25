import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { MainLayout } from '../components/layout/MainLayout';
import { FiHome, FiCompass } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const NotFoundPage = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // Wrap with MainLayout to keep the Navbar and Footer visible
    <MainLayout>
      <div className="flex items-center justify-center flex-grow text-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="py-20"
        >
          {/* Large 404 number with gradient text */}
          <motion.h1
            variants={itemVariants}
            className="text-8xl md:text-9xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            404
          </motion.h1>
          
          {/* Main heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-slate-800 mt-4 tracking-tight"
          >
            Page Not Found
          </motion.h2>
          
          {/* Descriptive text */}
          <motion.p
            variants={itemVariants}
            className="text-slate-500 mt-4 max-w-md mx-auto"
          >
            Oops! The page you are looking for seems to have been lost in the digital ether. It might have been moved or deleted.
          </motion.p>
          
          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/">
              <Button size="lg" icon={FiHome}>
                Go Back Home
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="ghost" icon={FiCompass}>
                Explore Products
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};