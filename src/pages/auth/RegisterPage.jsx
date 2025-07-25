import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.svg';

export const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Watch the 'role' field to conditionally render shopkeeper fields
  const role = watch('role', 'customer');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      // Don't show toast here, as AuthContext handles it.
      // Redirect to home page or dashboard after successful registration.
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } },
  };

  const fieldVariants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-cyan-50 py-12 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg p-8 space-y-6 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/50"
      >
        <div className="text-center">
          <Link to="/">
            <img src={logo} alt="Bazaryo" className="mx-auto h-12 mb-4" />
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Create an Account</h2>
          <p className="text-slate-500 mt-2">Join the Bazaryo community today!</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* User Details */}
          <Input
            label="Full Name"
            id="name"
            register={register}
            validation={{ required: 'Your name is required' }}
            error={errors.name}
            placeholder="John Doe"
          />
          <Input
            label="Email Address"
            id="email"
            type="email"
            register={register}
            validation={{ required: 'Email is required' }}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            register={register}
            validation={{ 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            }}
            error={errors.password}
            placeholder="6+ characters"
          />

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${role === 'customer' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'}`}>
                <input type="radio" value="customer" {...register('role')} className="form-radio text-cyan-600" />
                <span className="ml-3 text-sm font-medium text-slate-700">Customer</span>
              </label>
              <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${role === 'shopkeeper' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'}`}>
                <input type="radio" value="shopkeeper" {...register('role')} className="form-radio text-cyan-600" />
                <span className="ml-3 text-sm font-medium text-slate-700">Shopkeeper</span>
              </label>
            </div>
          </div>
          
          {/* Shopkeeper-specific fields */}
          <AnimatePresence>
            {role === 'shopkeeper' && (
              <motion.div
                key="shop-fields"
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4 pt-4 border-t border-slate-200 overflow-hidden"
              >
                 <h3 className="text-md font-semibold text-slate-700">Shop Details</h3>
                 <Input
                    label="Shop Name"
                    id="shopName"
                    register={register}
                    validation={{ required: 'Shop name is required for shopkeepers' }}
                    error={errors.shopName}
                    placeholder="e.g., The Fresh Market"
                />
                 <Input
                    label="Shop Category"
                    id="shopCategory"
                    register={register}
                    validation={{ required: 'Shop category is required' }}
                    error={errors.shopCategory}
                    placeholder="e.g., Grocery"
                />
                 <Input
                    label="Shop Pincode"
                    id="pincode"
                    register={register}
                    validation={{ required: 'Shop pincode is required' }}
                    error={errors.pincode}
                    placeholder="e.g., 110016"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>
        </form>

        <p className="text-sm text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-cyan-600 hover:text-cyan-500 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};