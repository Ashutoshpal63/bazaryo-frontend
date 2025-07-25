import React, { useState, useEffect } from 'react';
import { getAdminDashboardStats } from '../../api/adminApi';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { FaUsers, FaStore, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// A small component for a single statistic card
const StatCard = ({ icon: Icon, title, value, colorClass }) => (
  <Card className="p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  </Card>
);

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
  
  const orderChartData = stats ? Object.entries(stats.orderStats)
    .filter(([key]) => key !== 'total')
    .map(([name, value]) => ({ name, orders: value })) : [];

  const userChartData = stats ? Object.entries(stats.usersByRole)
    .map(([name, value]) => ({ name, users: value })) : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FaUsers} title="Total Users" value={stats.totalUsers} colorClass="bg-blue-500" />
        <StatCard icon={FaStore} title="Total Shops" value={stats.totalShops} colorClass="bg-purple-500" />
        <StatCard icon={FaShoppingCart} title="Total Orders" value={stats.orderStats.total} colorClass="bg-green-500" />
        <StatCard icon={FaDollarSign} title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} colorClass="bg-yellow-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">User Roles</h2>
           <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#818cf8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};