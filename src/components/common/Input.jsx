import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

export const Input = ({ 
  label, 
  id, 
  type = 'text', 
  register, 
  validation = {}, 
  error, 
  placeholder, 
  className = '',
  helperText,
  success,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  
  const inputClasses = `
    w-full px-4 py-3.5 bg-slate-50/50 backdrop-blur-sm
    border-2 rounded-xl transition-all duration-300 ease-out
    focus:outline-none focus:ring-4 focus:bg-white
    placeholder:text-slate-400 text-slate-900
    ${LeftIcon ? 'pl-12' : ''}
    ${RightIcon || isPassword ? 'pr-12' : ''}
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
      : success 
        ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50/30'
        : 'border-slate-200 focus:border-cyan-500 focus:ring-cyan-500/20 hover:border-slate-300'
    }
    ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''}
    ${isFocused ? 'transform scale-[1.01]' : ''}
  `;

  const labelClasses = `
    block text-sm font-medium mb-2 transition-colors duration-200
    ${error ? 'text-red-700' : success ? 'text-green-700' : 'text-slate-700'}
  `;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <motion.label 
          htmlFor={id} 
          className={labelClasses}
          animate={{ color: error ? '#b91c1c' : success ? '#15803d' : '#374151' }}
        >
          {label}
          {validation.required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {LeftIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            <LeftIcon className="w-5 h-5" />
          </div>
        )}
        
        <motion.input
          id={id}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...register(id, validation)}
          className={inputClasses}
          {...props}
        />
        
        {/* Right Icon or Password Toggle */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          {isPassword ? (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
          ) : RightIcon ? (
            <motion.button
              type="button"
              onClick={onRightIconClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1"
            >
              <RightIcon className="w-5 h-5" />
            </motion.button>
          ) : error ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : success ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : null}
        </div>
      </div>
      
      {/* Helper text, error, or success message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error.message}</p>
          </motion.div>
        )}
        
        {success && !error && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center space-x-2"
          >
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-600">{success}</p>
          </motion.div>
        )}
        
        {helperText && !error && !success && (
          <motion.p
            key="helper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-sm text-slate-500"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};