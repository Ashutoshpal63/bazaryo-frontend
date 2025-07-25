import React, { useState, useEffect, useCallback } from 'react';
import { getAvailableOrders, claimOrder } from '../../api/orderApi';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { FaMapMarkerAlt, FaStore } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const AvailableOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

  // Using useCallback for performance optimization
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAvailableOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch available orders.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleClaimOrder = async (orderId) => {
    setClaimingId(orderId);
    try {
      await claimOrder(orderId);
      toast.success('Order claimed successfully! Find it in "My Deliveries".');
      
      // UI Optimization: Remove the claimed order from the list instantly
      // instead of re-fetching the entire list from the server.
      setOrders(currentOrders => currentOrders.filter(o => o._id !== orderId));

    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not claim order.');
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Available Jobs</h1>
      
      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-500">No available orders at the moment. Check back soon!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <Card key={order._id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <p className="font-mono text-xs text-slate-500">ID: {order._id.slice(-8)}</p>
                  <p className="font-bold text-lg text-green-600">${order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="mb-4">
                  <div className="flex items-center text-slate-700 mb-2">
                    <FaStore className="mr-2 text-slate-400" />
                    {/* SAFE ACCESS for shop name */}
                    <span className="font-semibold">{order.shopId?.name || 'Unknown Shop'}</span>
                  </div>
                  <div className="flex items-start text-slate-700">
                    <FaMapMarkerAlt className="mr-2 mt-1 text-slate-400 flex-shrink-0" />
                    {/* --- THIS IS THE CORRECTED CODE BLOCK --- */}
                    <span className="text-sm">
                      {order.deliveryAddress
                        ? `${order.deliveryAddress?.street || 'N/A'}, ${order.deliveryAddress?.city || 'N/A'}`
                        : 'Address not provided'
                      }
                    </span>
                    {/* --- END OF CORRECTION --- */}
                  </div>
                </div>
              </div>
              <Button 
                className="w-full mt-2"
                onClick={() => handleClaimOrder(order._id)}
                disabled={claimingId === order._id}
              >
                {claimingId === order._id ? <Spinner size="sm" /> : 'Claim This Order'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};