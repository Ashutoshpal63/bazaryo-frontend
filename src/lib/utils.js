import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// --- ADD THIS NEW FUNCTION ---
/**
 * Formats a number as Indian Rupees (₹).
 * @param {number} amount - The number to format.
 * @returns {string} The formatted currency string, e.g., "₹1,250".
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, // Use 2 if you want to show paise, e.g., ₹1,250.50
  }).format(amount);
};