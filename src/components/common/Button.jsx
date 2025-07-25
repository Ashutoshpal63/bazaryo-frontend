import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  icon: Icon,
  loading = false,
  fullWidth = false,
  ...props 
}) => {
  const baseStyle = `
    relative font-semibold rounded-xl focus:outline-none focus:ring-4 
    transition-all duration-300 ease-out inline-flex items-center justify-center gap-2.5
    transform-gpu will-change-transform overflow-hidden
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-blue-600 text-white 
      hover:from-cyan-600 hover:to-blue-700 
      focus:ring-cyan-500/30 
      shadow-lg shadow-cyan-500/25 
      hover:shadow-xl hover:shadow-cyan-500/40
      border border-cyan-400/20
    `,
    secondary: `
      bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 
      hover:from-slate-200 hover:to-slate-300 
      focus:ring-slate-400/30
      shadow-md shadow-slate-200/50
      border border-slate-300/50
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white 
      hover:from-red-600 hover:to-red-700 
      focus:ring-red-500/30
      shadow-lg shadow-red-500/25
      hover:shadow-xl hover:shadow-red-500/40
      border border-red-400/20
    `,
    ghost: `
      bg-transparent text-cyan-600 
      hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 
      focus:ring-cyan-500/20
      border border-transparent hover:border-cyan-200
    `,
    outline: `
      bg-transparent border-2 border-cyan-500 text-cyan-600 
      hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 
      hover:text-white hover:border-transparent
      focus:ring-cyan-500/30
      shadow-sm hover:shadow-lg hover:shadow-cyan-500/25
    `
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs min-h-[32px]',
    md: 'px-6 py-3 text-sm min-h-[44px]',
    lg: 'px-8 py-4 text-base min-h-[52px]'
  };
  
  const disabledStyle = `
    disabled:opacity-60 disabled:cursor-not-allowed 
    disabled:shadow-none disabled:transform-none
  `;

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyle} ${className}`}
      {...props}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && !disabled && !loading && (
        <div className="absolute inset-0 -top-px overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {Icon && <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />}
          {children}
        </>
      )}
    </motion.button>
  );
};