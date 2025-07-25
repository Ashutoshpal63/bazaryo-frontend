import React from 'react';
import { motion } from 'framer-motion';

export const Switch = React.forwardRef(({ 
  checked = false, 
  onCheckedChange, 
  disabled = false,
  size = 'md',
  label,
  description,
  className = '',
  ...props 
}, ref) => {
  const sizeConfig = {
    sm: {
      track: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: 'translate-x-4'
    },
    md: {
      track: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5'
    },
    lg: {
      track: 'h-7 w-13',
      thumb: 'h-6 w-6',
      translate: 'translate-x-6'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <motion.button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        className={`
          ${config.track} relative inline-flex shrink-0 cursor-pointer rounded-full 
          border-2 border-transparent transition-all duration-300 ease-out
          focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-white
          ${checked 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 focus:ring-cyan-500/30' 
            : 'bg-slate-200 hover:bg-slate-300 focus:ring-slate-400/30'
          }
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-md'
          }
        `}
        {...props}
      >
        <span className="sr-only">{label || 'Toggle switch'}</span>
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`
            ${config.thumb} pointer-events-none inline-block rounded-full 
            bg-white shadow-lg ring-0 transition-transform duration-300 ease-out
            ${checked ? config.translate : 'translate-x-0'}
          `}
        >
          {/* Inner glow effect when checked */}
          {checked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20"
            />
          )}
        </motion.span>
      </motion.button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label className="text-sm font-medium text-slate-900 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-slate-500 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';