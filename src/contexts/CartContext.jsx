import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as cartApi from '../api/cartApi';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartApi.getCart();
      setCart(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Could not load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated, user, fetchCart]);

  const addToCart = async (product, quantity) => {
    if (!product || !product._id) {
        toast.error("Invalid product data.");
        return;
    }
      
    const previousCart = [...cart];
    const existingItemIndex = cart.findIndex(item => item.productId._id === product._id);
    let newCart;

    if (existingItemIndex > -1) {
      newCart = cart.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      const newItem = {
        productId: product,
        quantity: quantity,
      };
      newCart = [...cart, newItem];
    }
    setCart(newCart);
    toast.success(`${product.name} added to cart!`);

    try {
      await cartApi.addItemToCart({ productId: product._id, quantity });
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      toast.error(err.response?.data?.message || "Could not add item. Reverting.");
      setCart(previousCart);
    }
  };
  
  const removeFromCart = async (productId) => {
    const previousCart = [...cart];
    setCart(currentCart => currentCart.filter(item => item.productId._id !== productId));
    toast.success("Item removed from cart.");

    try {
      await cartApi.removeItemFromCart(productId);
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      toast.error("Could not remove item. Reverting.");
      setCart(previousCart);
    }
  };

  const clearCart = async () => {
    const previousCart = [...cart];
    setCart([]);
    toast.success("Cart has been cleared.");
    
    try {
      await cartApi.clearCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
      toast.error("Could not clear the cart. Reverting.");
      setCart(previousCart);
    }
  };
  
  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * (item.productId?.price || 0)), 0), [cart]);

  const contextValue = useMemo(() => ({
    cart,
    cartCount,
    cartTotal,
    loading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCart,
  }), [cart, cartCount, cartTotal, loading, error, fetchCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};