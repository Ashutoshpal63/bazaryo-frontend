import React, { useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.svg';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaUsers, FaStore, FaSignOutAlt, FaBars, FaTimes, FaCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const dashboardLinks = {
  admin: [
    { to: '/admin/dashboard', icon: FaTachometerAlt, text: 'Dashboard' },
    { to: '/admin/users', icon: FaUsers, text: 'Manage Users' },
    { to: '/admin/shops', icon: FaStore, text: 'Manage Shops' },
    { to: '/admin/orders', icon: FaClipboardList, text: 'All Orders' },
  ],
  shopkeeper: [
    { to: '/shopkeeper/dashboard', icon: FaTachometerAlt, text: 'Dashboard' },
    { to: '/shopkeeper/products', icon: FaBoxOpen, text: 'My Products' },
    { to: '/shopkeeper/orders', icon: FaClipboardList, text: 'My Orders' },
    { to: '/shopkeeper/shop', icon: FaCog, text: 'Manage Shop' },
  ],
  delivery_agent: [
    { to: '/delivery/dashboard', icon: FaTachometerAlt, text: 'Dashboard' },
    { to: '/delivery/available-orders', icon: FaClipboardList, text: 'Available Orders' },
    { to: '/delivery/my-deliveries', icon: FaBoxOpen, text: 'My Deliveries' },
  ]
};

const SidebarContent = ({ user, logout }) => {
  const links = dashboardLinks[user.role] || [];
  const activeLinkStyle = {
    backgroundColor: '#0891b2', // bg-cyan-600
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(8, 145, 178, 0.5), 0 2px 4px -1px rgba(8, 145, 178, 0.3)'
  };
  const navLinkClass = "flex items-center p-3 my-1 rounded-lg text-slate-300 hover:bg-cyan-800/50 hover:text-white transition-all duration-200";

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-4 border-b border-slate-700">
        <Link to="/">
          <img src={logo} alt="Bazaryo" className="h-10" />
        </Link>
      </div>
      <nav className="flex-1 p-4">
        {links.map(({ to, icon: Icon, text }) => (
          <NavLink
            key={to}
            to={to}
            end // for dashboard exact match
            className={navLinkClass}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            <Icon className="mr-3" />
            <span>{text}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center w-full p-3 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Static Sidebar for desktop */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <SidebarContent user={user} logout={logout} />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-64 z-40 lg:hidden"
            >
              <SidebarContent user={user} logout={logout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow-sm lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
            <FaBars size={24} />
          </button>
          <span className="font-semibold text-lg text-slate-800 capitalize">{user?.role} Dashboard</span>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};