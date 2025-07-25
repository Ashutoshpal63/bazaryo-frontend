import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trackOrder } from '../../api/orderApi';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';
import { Alert } from '../../components/common/Alert';
import { FaCheckCircle, FaStore, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

// This would be replaced with a real map component like Google Maps or Leaflet
const MockMap = ({ location }) => (
  <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500">
    <p>Map Placeholder</p>
    {location && <p className="ml-2 font-mono text-xs">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>}
  </div>
);

const statusSteps = [
  'PENDING_APPROVAL', 'PENDING_PAYMENT', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED'
];

export const OrderTrackingPage = () => {
  const { id: orderId } = useParams();
  
  // --- FIX #1: Correctly call useSocket without the token ---
  const { isConnected, on, emit } = useSocket();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null);

  // Fetch initial order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await trackOrder(orderId);
        setOrder(response.data);
        
        if (response.data?.deliveryAgentId?.currentLocation?.coordinates) {
          const [lng, lat] = response.data.deliveryAgentId.currentLocation.coordinates;
          setAgentLocation({ lat, lng });
        }
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError(err.response?.data?.message || 'Could not load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  // Set up socket listeners
  useEffect(() => {
    if (isConnected && orderId) {
      emit('joinOrderRoom', orderId);
      
      const locationUpdateHandler = (data) => {
        setAgentLocation(data.location);
      };

      on('locationUpdated', locationUpdateHandler);

      // --- FIX #2: The incorrect cleanup logic has been completely removed ---
      // Cleanup is now handled automatically inside the useSocket hook.
    }
  }, [isConnected, orderId, emit, on]);

  const currentStatusIndex = order ? statusSteps.indexOf(order.status) : -1;

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }
  
  if (error) {
    return (
        <div className="container mx-auto p-8">
            <Alert type="error" title="Cannot Track Order" message={error} />
        </div>
    );
  }
  
  if (!order) {
    return (
        <div className="container mx-auto p-8">
            <Alert type="warning" title="Order Not Found" message="The order ID does not seem to exist." />
        </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Track Your Order</h1>
        <p className="text-slate-500 mb-8 font-mono text-sm">ID: {order._id}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* --- FIX #3: ADDED THE MISSING JSX FOR THE STATUS TIMELINE --- */}
            <Card className="p-6">
              <h2 className="font-bold text-xl mb-6">Order Status</h2>
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 border-l-2 border-slate-300 border-dashed"></div>
                {statusSteps.map((step, index) => (
                  <div key={step} className="flex items-center mb-6 relative">
                    <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                      index <= currentStatusIndex ? 'bg-cyan-600 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      <FaCheckCircle />
                    </div>
                    <div className="ml-4">
                      <p className={`font-semibold ${index <= currentStatusIndex ? 'text-slate-800' : 'text-slate-500'}`}>
                        {step.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* --- FIX #3: ADDED THE MISSING JSX FOR ORDER ITEMS --- */}
            <Card className="p-6">
              <h2 className="font-bold text-xl mb-4">Items in Order</h2>
              <ul className="divide-y divide-slate-200">
                {order.products.map(item => (
                  <li key={item.productId} className="py-3 flex justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="p-6">
              <h2 className="font-bold text-xl mb-4">Live Location</h2>
              <MockMap location={agentLocation} />
              <p className="text-xs text-center mt-2 text-slate-500">
                Connection Status: {isConnected ? 'Live' : 'Disconnected'}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="font-bold text-xl mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                    <FaStore className="text-slate-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-500">Shop</p>
                        <p className="font-semibold">{order.shopId?.name || 'Shop details unavailable'}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <FaMapMarkerAlt className="text-slate-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-500">Delivery Address</p>
                        <p className="font-semibold">
                            {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}
                        </p>
                    </div>
                </div>
                 <div className="flex items-start">
                    <FaUser className="text-slate-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-500">Delivery Agent</p>
                        <p className="font-semibold">
                            {order.deliveryAgentId?.name || <span className="text-slate-500 font-normal">Waiting for assignment...</span>}
                        </p>
                    </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};