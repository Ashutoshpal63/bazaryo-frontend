import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Store, Tag, MapPin, ArrowRight, Heart, PackageCheck } from 'lucide-react';

export const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const role = watch('role', 'customer');

  // --- CORRECTED ONSUBMIT FUNCTION ---
  // This function now handles role-based redirection after a successful registration.
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const newUser = await registerUser(data);
      
      // If the new user is a customer, redirect them to complete their profile.
      if (newUser.role === 'customer') {
        toast.success("Welcome! Please complete your profile to continue.");
        navigate('/profile');
      } else {
        // For other roles like shopkeeper, navigate to the home page or a relevant dashboard.
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
  
  const fieldVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2 } }
  };

  const benefits = [
    { icon: Store, title: "Empower Local Businesses", desc: "Provide shopkeepers with a platform to thrive and reach more customers." },
    { icon: Heart, title: "Shop with Purpose", desc: "Join a community that values local economies and fresh products." },
    { icon: PackageCheck, title: "A Seamless Experience", desc: "From browsing to delivery, enjoy a smooth and simple process." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4">
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
                <UserPlus className="h-12 w-12 text-cyan-600" />
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">
                  Join the <span className="text-cyan-600">Movement</span>
                </h1>
              </div>
              <p className="text-xl text-slate-600 leading-relaxed">
                Create an account to support local businesses and enjoy the freshest products from your neighborhood, delivered to your door.
              </p>
            </div>

            <div className="space-y-6 pt-8 border-t border-slate-200/50">
                <h3 className="text-xl font-semibold text-slate-700 text-center">Start Your Journey With Us</h3>
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
          
          {/* Right Side - Register Form */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Create an Account</h2>
                <p className="text-slate-500 mt-2">Fill in the details to get started.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" /><Input label="Full Name" id="name" register={register} validation={{ required: 'Your name is required' }} error={errors.name} placeholder="John Doe" className="pl-10" /></div>
                <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" /><Input label="Email Address" id="email" type="email" register={register} validation={{ required: 'Email is required' }} error={errors.email} placeholder="you@example.com" className="pl-10" /></div>
                <div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" /><Input label="Password" id="password" type="password" register={register} validation={{ required: 'Password is required', minLength: { value: 6, message: 'Must be 6+ characters' } }} error={errors.password} placeholder="••••••••" className="pl-10" /></div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${role === 'customer' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'}`}><input type="radio" value="customer" {...register('role')} className="form-radio text-cyan-600" defaultChecked /><span className="ml-3 text-sm font-medium text-slate-700">Customer</span></label>
                    <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${role === 'shopkeeper' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'}`}><input type="radio" value="shopkeeper" {...register('role')} className="form-radio text-cyan-600" /><span className="ml-3 text-sm font-medium text-slate-700">Shopkeeper</span></label>
                  </div>
                </div>
                
                <AnimatePresence>
                  {role === 'shopkeeper' && (
                    <motion.div key="shop-fields" variants={fieldVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4 pt-4 border-t border-slate-200 overflow-hidden">
                       <h3 className="text-md font-semibold text-slate-700">Shop Details</h3>
                       <div className="relative"><Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" /><Input label="Shop Name" id="shopName" register={register} validation={{ required: 'Shop name is required' }} error={errors.shopName} placeholder="e.g., The Fresh Market" className="pl-10" /></div>
                       <div className="relative"><Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" /><Input label="Shop Category" id="shopCategory" register={register} validation={{ required: 'Shop category is required' }} error={errors.shopCategory} placeholder="e.g., Grocery" className="pl-10" /></div>
                       <div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" /><Input label="Shop Pincode" id="pincode" register={register} validation={{ required: 'Shop pincode is required' }} error={errors.pincode} placeholder="e.g., 110016" className="pl-10" /></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button type="submit" size="lg" className="w-full group" disabled={loading}>
                  {loading ? (<><Spinner size="sm" className="mr-2" />Creating Account...</>) : (<>Create Account <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>)}
                </Button>
              </form>

              <p className="text-sm text-center text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-cyan-600 hover:text-cyan-500 hover:underline">Sign in</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};