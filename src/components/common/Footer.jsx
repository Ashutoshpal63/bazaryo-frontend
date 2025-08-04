import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  // --- Shortened footer sections ---
  const footerSections = [
    {
      title: 'Navigation',
      links: [
        { to: '/products', label: 'All Products' },
        { to: '/my-orders', label: 'My Orders' },
        { to: '/cart', label: 'Shopping Cart' },
        { to: '/#', label: 'Become a Partner' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { href: '#', label: 'Help Center' },
        { href: '#', label: 'Contact Us' },
        { href: '#', label: 'Privacy Policy' },
        { href: '#', label: 'Terms of Service' },
      ]
    }
  ];

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.1),transparent_50%)]" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Brand section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">B</span>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Bazaryo
                  </span>
                </div>
                
                {/* --- Shortened description --- */}
                <p className="text-slate-300 leading-relaxed max-w-md">
                  Your favorite local stores, delivered instantly.
                </p>
                
                <div className="flex space-x-4">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50"
                      aria-label={label}
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links sections */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-8">
              {footerSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        {link.to ? (
                          <Link
                            to={link.to}
                            className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm block py-1"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm block py-1"
                          >
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
              <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4" />
            </motion.button>
            </div>
          </div>
        </div>

        
      </div>
    </footer>
  );
};