import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers, deleteUser } from '../../api/userApi';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';
import { Trash2, Edit3, Users, UserCheck, Shield, Truck } from 'lucide-react';

export const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        toast.error('Failed to fetch users.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user: ${userName}?`)) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
        toast.success('User deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete user.');
      }
    }
  };
  
  const columns = useMemo(() => [
    {
      header: 'Avatar',
      accessor: 'avatar',
      Cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold text-sm">
              {row.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Name',
      accessor: 'name',
      Cell: ({ row }) => (
        <div>
          <p className="font-semibold text-gray-800">{row.name}</p>
          <p className="text-xs text-gray-500">ID: {row._id.slice(-8)}</p>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      Cell: ({ row }) => (
        <span className="text-gray-700 font-medium">{row.email}</span>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.role === 'admin' && <Shield className="h-4 w-4 text-red-500" />}
          {row.role === 'shopkeeper' && <Users className="h-4 w-4 text-purple-500" />}
          {row.role === 'delivery_agent' && <Truck className="h-4 w-4 text-yellow-500" />}
          {row.role === 'customer' && <UserCheck className="h-4 w-4 text-green-500" />}
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            row.role === 'admin' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' : 
            row.role === 'shopkeeper' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800' :
            row.role === 'delivery_agent' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' :
            'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
          }`}>
            {row.role.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      Cell: ({ row }) => (
        <div>
          <p className="text-gray-700 font-medium">
            {new Date(row.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(row.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      Cell: ({ row }) => (
        <div className="flex space-x-3">
          <Button size="sm" variant="ghost" className="p-2 h-9 w-9 hover:bg-indigo-50 hover:text-indigo-600">
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="danger" 
            className="p-2 h-9 w-9" 
            onClick={() => handleDelete(row._id, row.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ], [users]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Manage Users
              </h1>
              <p className="text-gray-600 mt-1">View and manage all platform users</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Table Section */}
      <Table columns={columns} data={users} isLoading={loading} />
    </div>
  );
};