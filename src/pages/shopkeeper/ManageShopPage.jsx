// src/pages/shopkeeper/ManageShopPage.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { getShopById, updateShop } from '../../api/shopApi';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Alert } from '../../components/common/Alert';
import { Store, Tag, Upload } from 'lucide-react';

export const ManageShopPage = () => {
  const { user, refreshUser } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [logoPreview, setLogoPreview] = useState(null);
  const shopLogo = watch('logo');

  useEffect(() => {
    const fetchShop = async () => {
      if (!user?.shop) {
        setLoading(false);
        return;
      }
      try {
        const response = await getShopById(user.shop);
        setShop(response.data);
        reset({
          name: response.data.name,
          category: response.data.category,
        });
        setLogoPreview(response.data.logoUrl);
      } catch (error) {
        toast.error("Could not load your shop details.");
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [user, reset]);

  useEffect(() => {
    if (shopLogo && shopLogo[0]) {
      const file = shopLogo[0];
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [shopLogo]);

  const onSubmit = async (data) => {
    if (!shop) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    if (data.logo && data.logo[0]) {
      formData.append('logo', data.logo[0]);
    }

    try {
      await updateShop(shop._id, formData);
      await refreshUser();
      toast.success('Shop details updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }
  
  if (!user.shop) {
      return <Alert type="warning" title="No Shop Found" message="Your account is not associated with a shop. Please create one or contact support." />;
  }

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">Manage Your Shop</h1>
        <Card>
            <CardHeader>
                <CardTitle>Shop Details</CardTitle>
                <CardDescription>Update your shop's public information and branding.</CardDescription>
            </CardHeader>
            <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <Input label="Shop Name" id="name" register={register} validation={{ required: true }} leftIcon={Store} />
                    <Input label="Shop Category" id="category" register={register} validation={{ required: true }} leftIcon={Tag} />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Shop Logo</label>
                        <div className="flex items-center gap-6">
                            {logoPreview && <img src={logoPreview} alt="Logo Preview" className="w-24 h-24 rounded-full object-cover" />}
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="logo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-slate-500"/>
                                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-slate-500">PNG, JPG (MAX. 800x400px)</p>
                                    </div>
                                    <input id="logo-upload" type="file" className="hidden" {...register("logo")} accept="image/*" />
                                </label>
                            </div> 
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>Update Shop</Button>
                    </div>
                </form>
            </div>
        </Card>
    </div>
  );
};