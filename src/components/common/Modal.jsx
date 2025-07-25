import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Button } from './Button';

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50,
    transition: {
      duration: 0.2
    }
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  type = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer,
  className = ''
}) => {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4'
  };

  const typeConfig = {
    default: {
      icon: null,
      headerClass: 'bg-white',
      iconClass: ''
    },
    success: {
      icon: CheckCircle,
      headerClass: 'bg-gradient-to-r from-green-50 to-emerald-50',
      iconClass: 'text-green-500'
    },
    warning: {
      icon: AlertTriangle,
      headerClass: 'bg-gradient-to-r from-yellow-50 to-orange-50',
      iconClass: 'text-yellow-500'
    },
    error: {
      icon: AlertCircle,
      headerClass: 'bg-gradient-to-r from-red-50 to-rose-50',
      iconClass: 'text-red-500'
    },
    info: {
      icon: Info,
      headerClass: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      iconClass: 'text-blue-500'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
          />
          
          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl 
              border border-slate-200/50 overflow-hidden ${className}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={`
                px-6 py-4 border-b border-slate-200/50 flex items-center justify-between
                ${config.headerClass}
              `}>
                <div className="flex items-center space-x-3">
                  {IconComponent && (
                    <div className={`
                      w-8 h-8 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center
                      ${config.iconClass}
                    `}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  )}
                  {title && (
                    <h3 className="text-lg font-semibold text-slate-900">
                      {title}
                    </h3>
                  )}
                </div>
                
                {showCloseButton && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
            
            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/50">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Confirmation Modal Component
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      size="sm"
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'error' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-slate-600 leading-relaxed">
        {message}
      </p>
    </Modal>
  );
};

// Alert Modal Component
export const AlertModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info',
  buttonText = 'OK'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      size="sm"
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>
            {buttonText}
          </Button>
        </div>
      }
    >
      <p className="text-slate-600 leading-relaxed">
        {message}
      </p>
    </Modal>
  );
};