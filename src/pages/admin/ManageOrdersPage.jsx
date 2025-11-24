import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllOrders } from '../../api/orderApi';
import { getAllUsers } from '../../api/userApi';
import { assignAgentToOrder } from '../../api/orderApi';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ShoppingCart, User, Store, Truck, IndianRupee, Calendar, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE FOR MODAL AND AGENT ASSIGNMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  // --- FUNCTION TO FETCH ORDERS (WRAPPED IN USECALLBACK) ---
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // --- FUNCTION TO OPEN THE MODAL AND FETCH AGENTS ---
  const openAssignModal = async (order) => {
    setSelectedOrder(order);
    try {
      // Fetch only delivery agents who are marked as available
      const response = await getAllUsers({ role: 'delivery_agent', isAvailable: true });
      setAvailableAgents(response.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Could not fetch available agents.');
    }
  };

  // --- FUNCTION TO HANDLE THE API CALL TO ASSIGN AN AGENT ---
  const handleAssignAgent = async (agentId) => {
    if (!selectedOrder) return;
    setIsAssigning(true);
    try {
      await assignAgentToOrder(selectedOrder._id, agentId);
      toast.success('Agent assigned successfully!');
      setIsModalOpen(false);
      fetchOrders(); // Refresh the order list to show the new agent
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign agent.');
    } finally {
      setIsAssigning(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800';
      case 'PENDING_APPROVAL': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800';
      case 'PROCESSING': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800';
      case 'OUT_FOR_DELIVERY': return 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800';
      case 'REJECTED':
      case 'CANCELLED': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800';
      default: return 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800';
    }
  }

  const columns = useMemo(() => [
    {
      header: 'Order',
      accessor: 'orderInfo',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Order #{row._id.slice(-8)}</p>
            <p className="text-xs text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: 'userId.name',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700 font-medium">{row.userId?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      header: 'Shop',
      accessor: 'shopId.name',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Store className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700 font-medium">{row.shopId?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      header: 'Delivery Agent',
      accessor: 'deliveryAgentId.name',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Truck className="h-4 w-4 text-gray-500" />
          {row.deliveryAgentId?.name ? (
            <span className="text-gray-700 font-medium">{row.deliveryAgentId.name}</span>
          ) : (
            <span className="text-gray-400 italic">Not Assigned</span>
          )}
        </div>
      )
    },
    {
      header: 'Total',
      accessor: 'totalAmount',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <IndianRupee className="h-4 w-4 text-green-500" />
          <span className="font-semibold text-green-600">₹{row.totalAmount.toFixed(2)}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      Cell: ({ row }) => (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
          {row.status.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        row.status === 'PROCESSING' && !row.deliveryAgentId ? (
          <Button
            size="sm"
            onClick={() => openAssignModal(row)}
            className="flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Assign Agent</span>
          </Button>
        ) : row.status === 'PROCESSING' && row.deliveryAgentId ? (
          <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-semibold rounded-full">
            Assign Agent
          </span>
        ) : null
      ),
    },
  ], []); // Removed dependencies as functions are wrapped in useCallback

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Manage Orders
              </h1>
              <p className="text-gray-600 mt-1">Track and manage all system orders</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(order => order.status === 'DELIVERED').length}
              </p>
              <p className="text-sm text-gray-500">Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter(order => order.status === 'PROCESSING').length}
              </p>
              <p className="text-sm text-gray-500">Processing</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <Table columns={columns} data={orders} isLoading={loading} />

      {/* Agent Assignment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Delivery Agent">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Select an available agent for order:</h3>
          <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <p className="font-mono text-sm text-gray-600">#{selectedOrder?._id.slice(-8)}</p>
          </div>
        </div>

        {availableAgents.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {availableAgents.map(agent => (
              <button
                key={agent._id}
                onClick={() => handleAssignAgent(agent._id)}
                disabled={isAssigning}
                className="w-full text-left p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-200 disabled:opacity-50 border border-gray-200 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {agent.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800">{agent.name}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Truck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No delivery agents are currently available.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};