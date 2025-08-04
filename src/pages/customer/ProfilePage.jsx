// Code Block 1: The Starting Point (Known to Work)
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { updateMyProfile } from '../../api/userApi';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { User, Mail, MapPin, Home, Globe } from 'lucide-react';
import { LocationPicker } from '../../components/common/LocationPicker';

export const ProfilePage = () => {
  const { user, refreshUser, loading: authLoading } = useAuth();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialPosition, setInitialPosition] = useState(null);

  useEffect(() => {
    if (user) {
      console.log("User object in useEffect:", user);
      const address = user.address || {};
      const location = address.location || {};
      const coordinates = location.coordinates || [];
      reset({
        name: user.name,
        email: user.email,
        "address[street]": user.address?.street || '',
        "address[city]": user.address?.city || '',
        "address[pincode]": user.address?.pincode || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateMyProfile(data);
      await refreshUser();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Update your personal details and address information.</CardDescription>
        </CardHeader>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" id="name" register={register} validation={{ required: 'Name is required' }} error={errors.name} leftIcon={User} />
              <Input label="Email Address" id="email" type="email" register={register} error={errors.email} disabled leftIcon={Mail} helperText="Email cannot be changed." />
            </div>
            <div className="pt-6 border-t">
                 <h3 className="text-lg font-semibold text-slate-800 mb-4">Delivery Address</h3>
                 <div className="space-y-4">
                    <Input label="Street Address" id="street" name="address[street]" register={register} validation={{ required: 'Street is required' }} error={errors.address?.street} placeholder="e.g., 123 Main St" leftIcon={Home}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="City" id="city" name="address[city]" register={register} validation={{ required: 'City is required' }} error={errors.address?.city} placeholder="e.g., New Delhi" leftIcon={Globe} />
                        <Input label="Pincode" id="pincode" name="address[pincode]" register={register} validation={{ required: 'Pincode is required' }} error={errors.address?.pincode} placeholder="e.g., 110001" leftIcon={MapPin}/>
                    </div>
                 </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>Save Changes</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};