import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getShopOrders, updateOrderStatus } from '../../api/orderApi';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';

export const ShopOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    if (!user?.shop) return;
    try {
      setLoading(true);
      const response = await getShopOrders(user.shop);
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order has been ${newStatus.toLowerCase()}.`);
      fetchOrders(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }

  const columns = useMemo(() => [
    { header: 'Order ID', accessor: '_id', Cell: ({ row }) => <span className="font-mono text-xs">{row._id.slice(-8)}...</span> },
    { header: 'Customer', accessor: 'userId.name', Cell: ({ row }) => row.userId?.name || 'N/A' },
    { header: 'Date', accessor: 'createdAt', Cell: ({ row }) => new Date(row.createdAt).toLocaleDateString() },
    { header: 'Total', accessor: 'totalAmount', Cell: ({ row }) => `$${row.totalAmount.toFixed(2)}` },
    {
      header: 'Status',
      accessor: 'status',
      Cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
          {row.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        row.status === 'PENDING_APPROVAL' ? (
          <div className="flex space-x-2">
            <Button size="sm" variant="primary" className="!px-2 !py-1" onClick={() => handleStatusUpdate(row._id, 'ACCEPTED')} disabled={updatingId === row._id}>
              <FaCheck />
            </Button>
            <Button size="sm" variant="danger" className="!px-2 !py-1" onClick={() => handleStatusUpdate(row._id, 'REJECTED')} disabled={updatingId === row._id}>
              <FaTimes />
            </Button>
          </div>
        ) : null
      ),
    },
  ], [updatingId]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Manage My Orders</h1>
      <Table columns={columns} data={orders} isLoading={loading} />
    </div>
  );
};