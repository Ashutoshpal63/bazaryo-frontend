import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'default',
  shadow = 'default',
  border = false,
  gradient = false,
  ...props 
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-lg shadow-slate-200/50',
    lg: 'shadow-xl shadow-slate-200/60',
    colored: 'shadow-lg shadow-cyan-500/10'
  };

  const baseClasses = `
    bg-white rounded-2xl overflow-hidden transition-all duration-300
    ${border ? 'border border-slate-200/60' : ''}
    ${gradient ? 'bg-gradient-to-br from-white to-slate-50/50' : ''}
    ${shadowStyles[shadow]}
    ${paddingStyles[padding]}
  `;

  const hoverAnimation = hover ? {
    y: -8,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverAnimation}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {/* Subtle top border accent */}
      {gradient && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      )}
      
      {children}
    </motion.div>
  );
};

// Card variants for specific use cases
export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-slate-100 pb-4 mb-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-slate-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-slate-600 mt-2 leading-relaxed ${className}`}>
    {children}
  </p>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-slate-100 pt-4 mt-6 ${className}`}>
    {children}
  </div>
);