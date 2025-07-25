import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getShopOrders } from '../../api/orderApi';
import { getShopById } from '../../api/shopApi';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { FaBoxOpen, FaClipboardList, FaPlusCircle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon: Icon, title, value, to, colorClass }) => (
  <Link to={to}>
    <Card className="p-6 !shadow-md hover:!shadow-xl transition-all duration-300">
      <div className="flex items-center">
        <div className={`p-4 rounded-full mr-4 ${colorClass}`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </Card>
  </Link>
);

export const ShopkeeperDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, pendingOrders: 0, totalOrders: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.shop) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [shopRes, ordersRes] = await Promise.all([
          getShopById(user.shop),
          getShopOrders(user.shop)
        ]);
        
        const shopData = shopRes.data;
        const ordersData = ordersRes.data;
        setOrders(ordersData);

        setStats({
          products: shopData.products.length,
          pendingOrders: ordersData.filter(o => o.status === 'PENDING_APPROVAL').length,
          totalOrders: ordersData.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  const orderChartData = useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace('_', ' '), orders: value }));
  }, [orders]);


  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Shopkeeper Dashboard</h1>
        <Link to="/shopkeeper/products?action=add">
            <Button icon={FaPlusCircle}>Add New Product</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            icon={FaClipboardList} 
            title="Pending Orders" 
            value={stats.pendingOrders} 
            to="/shopkeeper/orders"
            colorClass="bg-yellow-500"
        />
        <StatCard 
            icon={FaBoxOpen} 
            title="Total Products" 
            value={stats.products} 
            to="/shopkeeper/products"
            colorClass="bg-purple-500"
        />
        <StatCard 
            icon={FaClipboardList} 
            title="Total Orders" 
            value={stats.totalOrders} 
            to="/shopkeeper/orders"
            colorClass="bg-blue-500"
        />
      </div>

      <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Orders Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#0891b2" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
    </div>
  );
};