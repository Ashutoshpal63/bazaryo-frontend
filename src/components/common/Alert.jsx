import React from 'react';
import { FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const alertConfig = {
  info: {
    icon: FaInfoCircle,
    bgClass: 'bg-blue-50',
    iconClass: 'text-blue-400',
    titleClass: 'text-blue-800',
    messageClass: 'text-blue-700',
  },
  success: {
    icon: FaCheckCircle,
    bgClass: 'bg-green-50',
    iconClass: 'text-green-400',
    titleClass: 'text-green-800',
    messageClass: 'text-green-700',
  },
  warning: {
    icon: FaExclamationTriangle,
    bgClass: 'bg-yellow-50',
    iconClass: 'text-yellow-400',
    titleClass: 'text-yellow-800',
    messageClass: 'text-yellow-700',
  },
  error: {
    icon: FaTimesCircle,
    bgClass: 'bg-red-50',
    iconClass: 'text-red-400',
    titleClass: 'text-red-800',
    messageClass: 'text-red-700',
  },
};

export const Alert = ({ type = 'info', title, message }) => {
  const { icon: Icon, bgClass, iconClass, titleClass, messageClass } = alertConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-md ${bgClass} p-4`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClass}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${titleClass}`}>{title}</h3>
          {message && (
            <div className={`mt-2 text-sm ${messageClass}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};