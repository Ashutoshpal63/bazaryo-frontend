import React, { useState, useEffect, useCallback } from 'react';
import { getMyOrders } from '../../api/orderApi';
import { processPayment } from '../../api/paymentApi'; // IMPORTED
import { Link } from 'react-router-dom';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { FaBoxOpen, FaCreditCard, FaClipboardList } from 'react-icons/fa'; // IMPORTED FaCreditCard
import toast from 'react-hot-toast'; // IMPORTED toast

// Helper function to style the status pills
const getStatusPill = (status) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
  switch (status) {
    case 'DELIVERED':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'PENDING_PAYMENT': // Style for the new status
      return `${baseClasses} bg-orange-100 text-orange-800`;
    case 'PENDING_APPROVAL':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'PROCESSING':
    case 'OUT_FOR_DELIVERY':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'REJECTED':
    case 'CANCELLED':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-slate-100 text-slate-800`;
  }
};

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingOrderId, setPayingOrderId] = useState(null); // State to track which order is being paid

  // useCallback ensures this function isn't recreated on every render
  const fetchOrders = useCallback(async () => {
    try {
      // Don't show the main spinner for re-fetches, only for the initial load
      if (orders.length === 0) setLoading(true);
      setError(null);
      const response = await getMyOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('We couldn\'t load your orders. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, [orders.length]); // Dependency on orders.length to re-create only when it changes from 0

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Function to handle the payment process
  const handlePayment = async (orderId) => {
    setPayingOrderId(orderId); // Set loading state for this specific button
    try {
      await processPayment(orderId);
      toast.success('Payment processing! Your order status will update shortly.');
      
      // Re-fetch orders after a delay to allow the backend to update the status
      setTimeout(() => {
        fetchOrders();
      }, 3000); // 3-second delay is usually enough for dummy processing
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      // It's better to let the order status change rather than immediately resetting the button,
      // but for this UX, we'll reset it after the timeout.
      setTimeout(() => setPayingOrderId(null), 3000);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert type="error" title="An Error Occurred" message={error} />
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaClipboardList className="mx-auto text-5xl text-slate-300" />
        <h1 className="mt-4 text-3xl font-bold text-slate-800">No Orders Yet</h1>
        <p className="mt-2 text-slate-500">You haven't placed any orders. Let's change that!</p>
        <Link to="/products" className="mt-6 inline-block">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-8">My Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id} className="p-4 sm:p-6 !shadow-md hover:!shadow-xl transition-all">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                <div className="col-span-1">
                  <p className="text-sm font-semibold text-slate-800">Order ID</p>
                  <p className="font-mono text-xs text-slate-500">{order._id}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm font-semibold text-slate-800">Date Placed</p>
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm font-semibold text-slate-800">Total</p>
                  <p className="text-lg font-bold text-slate-900">${order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="col-span-1 flex flex-col items-start sm:items-end space-y-2">
                  <div className={getStatusPill(order.status)}>
                    {order.status.replace(/_/g, ' ')}
                  </div>
                  
                  {/* --- THIS IS THE CRITICAL LOGIC --- */}
                  {/* If order is pending payment, show Pay button */}
                  {order.status === 'PENDING_PAYMENT' ? (
                    <Button 
                      size="sm" 
                      onClick={() => handlePayment(order._id)}
                      disabled={payingOrderId === order._id} // Disable only this button
                      // Show spinner inside button if it's being paid
                      icon={payingOrderId === order._id ? () => <Spinner size="sm" /> : FaCreditCard}
                    >
                      {payingOrderId === order._id ? 'Processing...' : 'Pay Now'}
                    </Button>
                  ) : (
                  // Otherwise, show Track Order button
                    <Link to={`/orders/${order._id}/track`}>
                      <Button size="sm" variant="outline" icon={FaBoxOpen}>
                        Track Order
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};