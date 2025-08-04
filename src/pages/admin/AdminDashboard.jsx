import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom'; // <-- IMPORT Link for Quick Actions
import { getAdminDashboardStats } from '../../api/adminApi';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
// --- THIS IS THE CORRECTED IMPORT BLOCK ---
import { FaUsers, FaStore, FaShoppingCart, FaRupeeSign, FaArrowUp, FaChartBar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Enhanced StatCard with a corrected icon
const StatCard = ({ icon: Icon, title, value, gradient, trend }) => (
  <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`p-4 rounded-xl mr-4 ${gradient} shadow-lg`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="flex items-center text-green-600">
          {/* --- THIS IS THE FIX: Replaced FaTrendingUp with FaArrowUp --- */}
          <FaArrowUp className="h-4 w-4 mr-1" />
          <span className="text-sm font-semibold">+{trend}%</span>
        </div>
      )}
    </div>
  </Card>
);

// Custom colors for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  
  const orderChartData = useMemo(() => stats ? Object.entries(stats.orderStats)
    .filter(([key]) => key !== 'total')
    .map(([name, value]) => ({ 
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
      orders: value 
    })) : [], [stats]);

  const userChartData = useMemo(() => stats ? Object.entries(stats.usersByRole)
    .map(([name, value]) => ({ 
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
      users: value 
    })) : [], [stats]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-center font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Monitor your platform's performance and growth</p>
      </div>
      
      {/* Enhanced Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={FaUsers} 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          trend="12"
        />
        <StatCard 
          icon={FaStore} 
          title="Total Shops" 
          value={stats.totalShops.toLocaleString()} 
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          trend="8"
        />
        <StatCard 
          icon={FaShoppingCart} 
          title="Total Orders" 
          value={stats.orderStats.total.toLocaleString()} 
          gradient="bg-gradient-to-r from-green-500 to-green-600"
          trend="15"
        />
          <StatCard 
          icon={FaRupeeSign} 
          title="Total Revenue" 
          value={stats.totalRevenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })} 
          gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
          trend="23"
        />
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Order Status Chart */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-800">Order Status Distribution</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={orderChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        
        {/* User Roles Pie Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800">User Roles</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={userChartData} dataKey="users" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {userChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* --- UX IMPROVEMENT: Quick Actions are now functional links --- */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/users" className="block p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <FaUsers className="h-6 w-6 mb-2" />
            <h3 className="font-semibold">Manage Users</h3>
          </Link>
          <Link to="/admin/shops" className="block p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            <FaStore className="h-6 w-6 mb-2" />
            <h3 className="font-semibold">Manage Shops</h3>
          </Link>
          <Link to="/admin/orders" className="block p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <FaShoppingCart className="h-6 w-6 mb-2" />
            <h3 className="font-semibold">Manage Orders</h3>
          </Link>
        </div>
      </Card>
    </div>
  );
};