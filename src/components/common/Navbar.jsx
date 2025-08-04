import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaShoppingBag, FaStore, FaTruck, FaCog, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.svg';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeLinkStyle = {
    color: '#0891b2',
    textShadow: '0 0 5px rgba(8, 145, 178, 0.3)',
  };

  const navLinkClass = "py-2 transition-colors duration-300 hover:text-cyan-600";

  const renderRoleLinks = (isMobile = false) => {
    if (!isAuthenticated) return null;
    
    const mobileClass = isMobile ? 'flex items-center gap-3 w-full p-3 rounded-lg hover:bg-cyan-50' : 'flex items-center';
    const iconClass = "mr-3 text-cyan-600";

    switch (user.role) {
      case 'customer':
        return (
          <>
            <NavLink to="/my-orders" className={mobileClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setMobileMenuOpen(false)}>
              <FaShoppingBag className={iconClass} /> My Orders
            </NavLink>
            <NavLink to="/cart" className={`${mobileClass} relative`} onClick={() => setMobileMenuOpen(false)}>
              <FaShoppingCart className={iconClass} /> Cart
            </NavLink>
          </>
        );
      case 'shopkeeper':
        return <NavLink to="/shopkeeper/dashboard" className={mobileClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setMobileMenuOpen(false)}><FaStore className={iconClass} /> Dashboard</NavLink>;
      case 'delivery_agent':
        return <NavLink to="/delivery/dashboard" className={mobileClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setMobileMenuOpen(false)}><FaTruck className={iconClass} /> Dashboard</NavLink>;
      case 'admin':
        return <NavLink to="/admin/dashboard" className={mobileClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={() => setMobileMenuOpen(false)}><FaCog className={iconClass} /> Admin Panel</NavLink>;
      default:
        return null;
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Bazaryo Logo" className="h-9 sm:h-10" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
            <NavLink to="/" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Products</NavLink>
            {renderRoleLinks()}
          </div>
          
          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="group relative">
                <button className="flex items-center gap-2 font-semibold text-slate-700">
                  <FaUserCircle className="text-cyan-600" size={24} />
                  {user.name.split(' ')[0]}
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <div className="py-1">
                    {/* --- CORRECTED DROPDOWN --- */}
                    {user.role === 'customer' && (
                        <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                            My Profile
                        </Link>
                    )}
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">Login</Button></Link>
                <Link to="/register"><Button>Register</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-700">
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg shadow-lg"
          >
            <div className="px-5 pt-5 pb-6 space-y-1">
              <NavLink to="/" className="block p-3 rounded-lg text-base font-medium text-slate-700 hover:bg-cyan-50" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
              <NavLink to="/products" className="block p-3 rounded-lg text-base font-medium text-slate-700 hover:bg-cyan-50" onClick={() => setMobileMenuOpen(false)}>Products</NavLink>
              {renderRoleLinks(true)}
              <div className="pt-4 border-t border-slate-200">
                {isAuthenticated ? (
                    <div className="space-y-2">
                        {/* --- CORRECTED MOBILE MENU --- */}
                        {user.role === 'customer' && (
                            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="w-full">
                                <Button variant="ghost" className="w-full">My Profile</Button>
                            </Link>
                        )}
                        <Button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full" variant="secondary">Logout</Button>
                    </div>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login" className="w-full"><Button variant="ghost" className="w-full">Login</Button></Link>
                    <Link to="/register" className="w-full"><Button className="w-full">Register</Button></Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};