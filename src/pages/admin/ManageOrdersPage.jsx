import React, { useState, useEffect, useMemo, useCallback } from 'react';
// --- CORRECTED IMPORTS ---
import { getAllOrders } from '../../api/orderApi';
import { getAllUsers } from '../../api/userApi';
import { assignAgentToOrder } from '../../api/orderApi'; // This was missing
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal'; // This was missing
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
    switch(status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'OUT_FOR_DELIVERY': return 'bg-indigo-100 text-indigo-800';
      case 'REJECTED':
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  }
  
  const columns = useMemo(() => [
    {
      header: 'Order ID',
      accessor: '_id',
      Cell: ({ row }) => <span className="font-mono text-xs">{row._id.slice(-8)}...</span>
    },
    {
      header: 'Customer',
      accessor: 'userId.name',
      Cell: ({ row }) => row.userId?.name || 'N/A'
    },
    {
      header: 'Shop',
      accessor: 'shopId.name',
      Cell: ({ row }) => row.shopId?.name || 'N/A'
    },
    {
      header: 'Delivery Agent',
      accessor: 'deliveryAgentId.name',
      Cell: ({ row }) => row.deliveryAgentId?.name || <span className="text-slate-400">Not Assigned</span>
    },
    {
      header: 'Total',
      accessor: 'totalAmount',
      Cell: ({ row }) => `$${row.totalAmount.toFixed(2)}`
    },
    {
      header: 'Status',
      accessor: 'status',
      Cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
          {row.status.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      Cell: ({ row }) => new Date(row.createdAt).toLocaleString(),
    },
    // --- THIS ACTIONS COLUMN WAS MISSING ---
    {
      header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        // Conditionally render the button only if an agent can be assigned
        row.status === 'PROCESSING' && !row.deliveryAgentId ? (
          <Button size="sm" onClick={() => openAssignModal(row)}>
            Assign Agent
          </Button>
        ) : null
      ),
    },
  ], []); // Removed dependencies as functions are wrapped in useCallback

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">All System Orders</h1>
      <Table columns={columns} data={orders} isLoading={loading} />

      {/* --- THIS MODAL WAS MISSING --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Delivery Agent">
        <h3 className="font-semibold mb-2">Select an available agent for order:</h3>
        <p className="font-mono text-xs mb-4 text-slate-500">{selectedOrder?._id}</p>
        
        {availableAgents.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableAgents.map(agent => (
              <button 
                key={agent._id}
                onClick={() => handleAssignAgent(agent._id)}
                disabled={isAssigning}
                className="w-full text-left p-3 bg-slate-50 hover:bg-cyan-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {agent.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">No delivery agents are currently available.</p>
        )}
      </Modal>
    </div>
  );
};