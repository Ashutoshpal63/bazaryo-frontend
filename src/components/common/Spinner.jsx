import React from 'react';
import { motion } from 'framer-motion';

export const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  label = 'Loading...'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colorClasses = {
    primary: 'border-cyan-500 border-t-transparent',
    secondary: 'border-slate-400 border-t-transparent',
    success: 'border-green-500 border-t-transparent',
    warning: 'border-yellow-500 border-t-transparent',
    error: 'border-red-500 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        className={`
          rounded-full ${sizeClasses[size]} ${colorClasses[color]}
        `}
        role="status"
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
      </motion.div>
    </div>
  );
};

// Pulsing Spinner Variant
export const PulseSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  label = 'Loading...'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'bg-cyan-500',
    secondary: 'bg-slate-400',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    white: 'bg-white'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`
          rounded-full ${sizeClasses[size]} ${colorClasses[color]}
        `}
        role="status"
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
      </motion.div>
    </div>
  );
};

// Dots Spinner Variant
export const DotsSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  label = 'Loading...'
}) => {
  const sizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const colorClasses = {
    primary: 'bg-cyan-500',
    secondary: 'bg-slate-400',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    white: 'bg-white'
  };

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`} role="status" aria-label={label}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -8, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut'
          }}
          className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
};

// Loading Overlay Component
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  spinnerProps = {},
  message = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg"
        >
          <Spinner {...spinnerProps} />
          {message && (
            <p className="mt-3 text-sm font-medium text-slate-600">
              {message}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};