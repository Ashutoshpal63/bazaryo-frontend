import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { Navbar } from '../../components/common/Navbar.jsx';
import { Footer } from '../../components/common/Footer.jsx';
import { motion } from 'framer-motion';
import { ShoppingBag, Mail, Lock, ArrowRight, Store, Smile, Bike } from 'lucide-react';

const getDashboardPath = (role) => {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'shopkeeper': return '/shopkeeper/dashboard';
    case 'delivery_agent': return '/delivery/dashboard';
    default: return '/';
  }
};

export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const loggedInUser = await login(data);
      const redirectPath = from || getDashboardPath(loggedInUser.role);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.3 } },
  };

  const benefits = [
    { icon: Store, title: "Discover Local Gems", desc: "Find unique products from shops right in your neighborhood." },
    { icon: Smile, title: "Support Community", desc: "Every purchase you make directly supports local entrepreneurs." },
    { icon: Bike, title: "Fast & Convenient", desc: "Get your daily needs delivered to your doorstep, hassle-free." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex flex-col">
      <Navbar />

      {/* --- FIX: Removed 'items-center' to allow content to align to the top --- */}
      <div className="flex-1 flex justify-center pt-24 pb-12 px-4">
        {/* This 'items-center' correctly aligns the two columns with each other */}
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Welcome Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-12 w-12 text-cyan-600" />
                {/* --- FIX: Corrected typo from text-slate-00 to text-slate-800 --- */}
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
                  Welcome Back to <span className="text-cyan-600">Bazaryo</span>
                </h1>
              </div>
              <p className="text-xl text-slate-600 leading-relaxed">
                Sign in to access your personalized marketplace experience. Connect with local shopkeepers and enjoy seamless shopping.
              </p>
            </div>

            <div className="space-y-6 pt-8 border-t border-slate-200/50">
              <h3 className="text-xl font-semibold text-slate-700 text-center">Why You'll Love Shopping With Us</h3>
              <div className="grid grid-cols-1 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.15 }}
                    className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50"
                  >
                    <benefit.icon className="h-10 w-10 text-cyan-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-800">{benefit.title}</h4>
                      <p className="text-sm text-slate-600">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 p-8 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
                <p className="text-slate-500">Enter your credentials to continue</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input label="Email Address" id="email" type="email" register={register} validation={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } }} error={errors.email} placeholder="you@example.com" className="pl-10" />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input label="Password" id="password" type="password" register={register} validation={{ required: 'Password is required' }} error={errors.password} placeholder="••••••••" className="pl-10" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-cyan-600 rounded" />
                    <span className="ml-2 text-sm text-slate-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" size="lg" className="w-full group" disabled={loading}>
                  {loading ? (<><Spinner size="sm" className="mr-2" />Signing In...</>) : (<>Sign In<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>)}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-cyan-600 hover:text-cyan-500 hover:underline">
                    Create one now
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};