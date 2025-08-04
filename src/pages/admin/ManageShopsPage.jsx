import React, { useState, useEffect, useMemo } from 'react';
import { getAllShops, updateShop } from '../../api/shopApi';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Store, User, Tag } from 'lucide-react';
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
      header: 'Shop',
      accessor: 'shopInfo',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">{row.name}</p>
            <p className="text-xs text-gray-500">ID: {row._id.slice(-8)}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Owner',
      accessor: 'owner.name',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700 font-medium">{row.owner?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-semibold rounded-full">
            {row.category}
          </span>
        </div>
      ),
    },
    {
      header: 'Verification Status',
      accessor: 'isVerified',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.isVerified ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-semibold rounded-full">
                VERIFIED
              </span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-xs font-semibold rounded-full">
                UNVERIFIED
              </span>
            </>
          )}
        </div>
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
          className="min-w-[100px]"
        >
          {updatingId === row._id ? <Spinner size="sm" /> : (row.isVerified ? 'Unverify' : 'Verify')}
        </Button>
      )
    }
  ], [shops, updatingId]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Store className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Manage Shops
              </h1>
              <p className="text-gray-600 mt-1">Verify and manage shop listings</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {shops.filter(shop => shop.isVerified).length}
              </p>
              <p className="text-sm text-gray-500">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {shops.filter(shop => !shop.isVerified).length}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{shops.length}</p>
              <p className="text-sm text-gray-500">Total Shops</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Table Section */}
      <Table columns={columns} data={shops} isLoading={loading} />
    </div>
  );
};