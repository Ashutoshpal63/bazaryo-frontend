import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableOrders, getMyDeliveries } from '../../api/orderApi';
import { updateMyProfile } from '../../api/userApi';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { FaMotorcycle, FaBoxOpen } from 'react-icons/fa';
import { Switch } from '../../components/common/Switch'; // Assuming a Switch component exists
import toast from 'react-hot-toast';

const DashboardStatCard = ({ icon: Icon, title, value, to, colorClass }) => (
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

export const DeliveryDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({ available: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [availableRes, activeRes] = await Promise.all([
          getAvailableOrders(),
          getMyDeliveries()
        ]);
        setStats({
          available: availableRes.data.length,
          active: activeRes.data.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleAvailabilityToggle = async (isAvailable) => {
    setIsUpdatingStatus(true);
    try {
      await updateMyProfile({ isAvailable });
      await refreshUser(); // Refresh user context to get the latest status
      toast.success(`You are now ${isAvailable ? 'available' : 'unavailable'} for deliveries.`);
    } catch (error) {
      toast.error("Failed to update availability status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Delivery Dashboard</h1>
      
      <Card className="p-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold">Hello, {user.name.split(' ')[0]}!</h2>
                <p className="opacity-80">Here's a summary of your delivery status.</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium">{user.isAvailable ? "Available" : "Unavailable"}</span>
              <Switch 
                checked={user.isAvailable} 
                onCheckedChange={handleAvailabilityToggle}
                disabled={isUpdatingStatus}
              />
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardStatCard 
          icon={FaMotorcycle} 
          title="Available Jobs" 
          value={stats.available} 
          to="/delivery/available-orders"
          colorClass="bg-green-500"
        />
        <DashboardStatCard 
          icon={FaBoxOpen} 
          title="My Active Deliveries" 
          value={stats.active} 
          to="/delivery/my-deliveries"
          colorClass="bg-purple-500"
        />
      </div>
    </div>
  );
};