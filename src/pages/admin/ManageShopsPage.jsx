import React, { useState, useEffect, useMemo } from 'react';
import { getAllShops, updateShop } from '../../api/shopApi';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Spinner } from '../../components/common/Spinner';

export const ManageShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await getAllShops();
        setShops(response.data);
      } catch (error) {
        toast.error('Failed to fetch shops.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleVerification = async (shopId, isVerified) => {
    setUpdatingId(shopId);
    try {
      await updateShop(shopId, { isVerified: !isVerified });
      toast.success(`Shop verification status updated.`);
      fetchShops(); // Refresh the list
    } catch (err) {
      toast.error("Failed to update shop status.");
    } finally {
      setUpdatingId(null);
    }
  };
  
  const columns = useMemo(() => [
    {
      header: 'Shop Name',
      accessor: 'name',
    },
    {
      header: 'Owner',
      accessor: 'owner.name', // Assuming owner is populated
      Cell: ({ row }) => row.owner?.name || 'N/A'
    },
    {
      header: 'Category',
      accessor: 'category',
    },
    {
      header: 'Verification Status',
      accessor: 'isVerified',
      Cell: ({ row }) => (
        <span className={`flex items-center text-sm font-medium ${row.isVerified ? 'text-green-600' : 'text-red-600'}`}>
          {row.isVerified ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
          {row.isVerified ? 'Verified' : 'Unverified'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      Cell: ({ row }) => (
        <Button 
          size="sm"
          variant={row.isVerified ? 'danger' : 'primary'}
          onClick={() => handleVerification(row._id, row.isVerified)}
          disabled={updatingId === row._id}
        >
          {updatingId === row._id ? <Spinner size="sm" /> : (row.isVerified ? 'Unverify' : 'Verify')}
        </Button>
      )
    }
  ], [shops, updatingId]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Manage Shops</h1>
      <Table columns={columns} data={shops} isLoading={loading} />
    </div>
  );
};