import React, { useState, useEffect, useCallback } from 'react';
import { getMyDeliveries, updateOrderStatus } from '../../api/orderApi';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { FaUser, FaStore, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const MyDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { user } = useAuth();
  // Safely pass the token to the socket hook
  const { emit } = useSocket(user?.token);

  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyDeliveries();
      setDeliveries(response.data);
    } catch (error) {
      toast.error('Failed to fetch your deliveries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
      // Refresh the list to remove the completed order
      fetchDeliveries();
    } catch (error) {
      toast.error('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };
  
  const sendLocationUpdate = (orderId) => {
     if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser.");
        return;
     }
     navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        emit('updateLocation', {
            orderId,
            agentId: user._id,
            location: { lat: latitude, lng: longitude }
        });
        toast.success("Location update sent!");
     });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">My Active Deliveries</h1>
      
      {deliveries.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-500">You have no active deliveries. Claim a job from the "Available Jobs" page!</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {deliveries.map(order => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <Card className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Order Info */}
                  <div className="md:col-span-2 space-y-3">
                    <p className="font-mono text-xs text-slate-500">ID: {order._id}</p>
                    <div className="flex items-center text-sm">
                      <FaStore className="mr-3 text-slate-400" />
                      <div>
                        <p className="font-semibold">PICKUP FROM:</p>
                        {/* SAFE ACCESS for shop name */}
                        <p>{order.shopId?.name || 'Unknown Shop'}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <FaUser className="mr-3 text-slate-400" />
                      <div>
                        <p className="font-semibold">DELIVER TO:</p>
                        {/* SAFE ACCESS for customer name */}
                        <p>{order.userId?.name || 'Unknown Customer'}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <FaMapMarkerAlt className="mr-3 text-slate-400" />
                      <div>
                         <p className="font-semibold">ADDRESS:</p>
                         {/* --- THIS IS THE CORRECTED CODE BLOCK --- */}
                         <p>
                           {order.deliveryAddress
                             ? `${order.deliveryAddress?.street || 'N/A'}, ${order.deliveryAddress?.city || 'N/A'}`
                             : 'Address not provided'
                           }
                         </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col justify-between space-y-3">
                    <div className="text-right">
                       <p className="text-lg font-bold text-slate-800">${order.totalAmount.toFixed(2)}</p>
                       <p className="text-xs font-semibold text-blue-600">{order.status.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Button size="sm" variant="outline" onClick={() => sendLocationUpdate(order._id)}>Send Location</Button>
                        {order.status === 'PROCESSING' && (
                            <Button size="sm" onClick={() => handleStatusUpdate(order._id, 'OUT_FOR_DELIVERY')} disabled={updatingId === order._id}>
                                {updatingId === order._id ? <Spinner size="sm"/> : 'Mark as Out for Delivery'}
                            </Button>
                        )}
                        {order.status === 'OUT_FOR_DELIVERY' && (
                            <Button size="sm" variant="primary" onClick={() => handleStatusUpdate(order._id, 'DELIVERED')} disabled={updatingId === order._id}>
                                {updatingId === order._id ? <Spinner size="sm"/> : 'Mark as Delivered'}
                            </Button>
                        )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};