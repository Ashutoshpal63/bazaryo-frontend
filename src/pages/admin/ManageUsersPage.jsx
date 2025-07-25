import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers, deleteUser } from '../../api/userApi';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';
import { FaTrash, FaPen } from 'react-icons/fa';

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
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Role',
      accessor: 'role',
      Cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          row.role === 'admin' ? 'bg-red-100 text-red-800' : 
          row.role === 'shopkeeper' ? 'bg-purple-100 text-purple-800' :
          row.role === 'delivery_agent' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {row.role.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      Cell: ({ row }) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: '_id',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="p-2 h-8 w-8">
            <FaPen />
          </Button>
          <Button 
            size="sm" 
            variant="danger" 
            className="p-2 h-8 w-8" 
            onClick={() => handleDelete(row._id, row.name)}
          >
            <FaTrash />
          </Button>
        </div>
      )
    }
  ], [users]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Manage Users</h1>
        {/* Add search bar or filters here if needed */}
      </div>
      <Table columns={columns} data={users} isLoading={loading} />
    </div>
  );
};