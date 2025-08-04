import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  MapPin, 
  Smile, 
  Search, 
  ShoppingCart, 
  Truck, 
  Package, 
  Clock, 
  Shield, 
  Star,
  Users,
  Zap,
  Heart,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Globe,
  Award
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar.jsx';
import { Footer } from '../../components/common/Footer.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Card } from '../../components/common/Card.jsx';

// Enhanced Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Card 
        className="h-full p-8 hover:shadow-2xl transition-all duration-500 border border-slate-200/50 hover:border-cyan-200/50 bg-gradient-to-br from-white to-slate-50/30"
        hover={false}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`flex items-center justify-center h-16 w-16 rounded-2xl ${gradient} text-white mx-auto mb-6 shadow-lg shadow-cyan-500/20`}
          >
            <Icon size={28} />
          </motion.div>
          <h3 className="text-xl font-bold mb-4 text-slate-800 group-hover:text-cyan-700 transition-colors text-center">
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed text-center">
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

// Enhanced Stats Card Component
const StatCard = ({ number, label, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="flex items-center justify-center mb-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-8 h-8 text-cyan-200 mr-3" />
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="text-4xl md:text-5xl font-black text-white"
        >
          {number}
        </motion.div>
      </div>
      <div className="text-cyan-100 text-lg font-medium">{label}</div>
    </motion.div>
  );
};

// Enhanced Step Card Component
const StepCard = ({ step, title, description, icon: Icon, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay * 0.2 }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="relative mb-8">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`w-32 h-32 mx-auto rounded-full ${gradient} flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-cyan-500/20`}
        >
          {step}
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-cyan-100"
        >
          <Icon className="w-8 h-8 text-cyan-600" />
        </motion.div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-slate-800 group-hover:text-cyan-700 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 text-lg leading-relaxed max-w-sm mx-auto">
        {description}
      </p>
    </motion.div>
  );
};

export const HomePage = () => {
  const features = [
    {
      icon: MapPin,
      title: "Hyperlocal Focus",
      description: "We bring your neighborhood stores online, supporting local businesses and ensuring the freshest products reach your doorstep.",
      gradient: "bg-gradient-to-br from-cyan-500 to-blue-600"
    },
    {
      icon: ShoppingBag,
      title: "Endless Variety",
      description: "From daily groceries to gourmet meals and electronics, discover everything you need from local shops in one convenient platform.",
      gradient: "bg-gradient-to-br from-blue-500 to-indigo-600"
    },
    {
      icon: Smile,
      title: "Seamless Experience",
      description: "Enjoy intuitive browsing, secure payments, real-time tracking, and exceptional customer service from order to delivery.",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Your data and payments are protected with bank-level security. Shop with confidence knowing your information is safe.",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600"
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Get your orders delivered in as little as 30 minutes. We optimize routes and partner with local stores for speed.",
      gradient: "bg-gradient-to-br from-orange-500 to-red-600"
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Every product is carefully selected and quality-checked by our partner stores before it reaches your doorstep.",
      gradient: "bg-gradient-to-br from-violet-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50"></div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 4 }}
            className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 text-sm font-bold shadow-lg border border-cyan-200/50 backdrop-blur-sm">
              <Truck className="w-5 h-5 mr-2" />
              Lightning Fast Local Delivery
            </span>
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
          >
            Your Neighborhood,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600">
              Delivered Fresh
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed"
          >
            Bazaryo connects you with trusted local shops for groceries, meals, and essentials. 
            Experience the convenience of doorstep delivery while supporting your community.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button size="lg" icon={ShoppingBag} className="text-lg px-8 py-4">
              Start Shopping Now
            </Button>
            <Button variant="outline" size="lg" icon={Search} className="text-lg px-8 py-4">
              Explore Local Shops
            </Button>
          </motion.div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Simple. Fast. Reliable.
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              From browsing your favorite local stores to getting items delivered to your door, 
              we've made the process effortless and enjoyable.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 -translate-y-1/2 z-0 rounded-full"></div>
            
            <div className="grid lg:grid-cols-3 gap-16 relative z-10">
              <StepCard 
                step="1"
                title="Discover & Browse"
                description="Explore a curated selection of products from trusted local shops in your neighborhood."
                icon={Search}
                gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
                delay={0}
              />
              <StepCard 
                step="2"
                title="Order & Pay"
                description="Add items to your cart and checkout securely with multiple payment options available."
                icon={ShoppingCart}
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                delay={1}
              />
              <StepCard 
                step="3"
                title="Track & Receive"
                description="Follow your order in real-time and receive fresh products at your doorstep within 30 minutes."
                icon={Truck}
                gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                delay={2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Why Choose Bazaryo?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We're more than just a delivery service - we're your neighborhood's digital marketplace.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title}
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
                gradient={feature.gradient}
                delay={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="relative py-24 bg-slate-800 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-cyan-900/90"></div>

        <div className="container mx-auto px-4 text-center relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Connecting Communities,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                One Delivery at a Time
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-slate-300 mb-10 leading-relaxed">
              Every order you place on Bazaryo supports a local business owner and strengthens your community. 
              Together, we're building a more connected and sustainable local economy.
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              icon={Heart} 
              className="text-lg px-8 py-4 bg-white text-slate-800 hover:bg-cyan-50 hover:text-cyan-800"
            >
              Support Local Businesses
            </Button>
          </motion.div>
        </div>
      </section>


      <Footer />
    </div>
  );
};