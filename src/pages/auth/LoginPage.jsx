import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.svg';

const getDashboardPath = (role) => {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';
        case 'shopkeeper':
            return '/shopkeeper/dashboard';
        case 'delivery_agent':
            return '/delivery/dashboard';
        default:
            return '/';
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
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-cyan-50 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/50"
      >
        <div className="text-center">
            <Link to="/">
                <img src={logo} alt="Bazaryo" className="mx-auto h-12 mb-4" />
            </Link>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back!</h2>
          <p className="text-slate-500 mt-2">Sign in to continue to Bazaryo.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email Address"
            id="email"
            type="email"
            register={register}
            validation={{ 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address"
              }
            }}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            register={register}
            validation={{ required: 'Password is required' }}
            error={errors.password}
            placeholder="••••••••"
          />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <p className="text-sm text-center text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-cyan-600 hover:text-cyan-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};