import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { motion } from 'framer-motion';
import { FaUpload, FaTimesCircle } from 'react-icons/fa';
import { Spinner } from '../common/Spinner';

/**
 * A form for creating or editing a product.
 * @param {function} onSubmit - The function to call when the form is submitted. It receives the form data.
 * @param {object} [initialData] - Existing product data for pre-filling the form in edit mode.
 * @param {boolean} [isLoading=false] - A flag to show a loading state on the submit button.
 */
export const ProductForm = ({ onSubmit, initialData = null, isLoading = false }) => {
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      price: '',
      quantityAvailable: '',
      category: '',
      productImage: null,
    },
  });

  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || null);
  const productImage = watch('productImage');

  // Reset the form if the initialData changes (e.g., when selecting a new product to edit)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setImagePreview(initialData.imageUrl);
    }
  }, [initialData, reset]);

  // Update the image preview when a new file is selected
  useEffect(() => {
    if (productImage && productImage[0]) {
      const file = productImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [productImage]);

  const onFormSubmit = (data) => {
    // Construct FormData to handle file upload
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      // If the field is the file input and a file is selected, append the file
      if (key === 'productImage' && data.productImage && data.productImage[0]) {
        formData.append(key, data.productImage[0]);
      } else if (key !== 'productImage') {
        // Otherwise, append the text value
        formData.append(key, data[key]);
      }
    });
    onSubmit(formData);
  };

  const clearImage = () => {
    setImagePreview(null);
    reset({ ...watch(), productImage: null }); // Clear the file from the form state
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-6 bg-white p-8 rounded-2xl shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Text Inputs */}
        <div className="space-y-6">
          <Input
            label="Product Name"
            id="name"
            register={register}
            validation={{ required: 'Product name is required' }}
            error={errors.name}
            placeholder="e.g., Organic Apples"
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              rows="4"
              className={`w-full px-4 py-2.5 bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-colors duration-300 ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Detailed description of the product"
            ></textarea>
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <Input
            label="Category"
            id="category"
            register={register}
            validation={{ required: 'Category is required' }}
            error={errors.category}
            placeholder="e.g., Grocery, Electronics"
          />

          <div className="flex gap-4">
            <Input
              label="Price ($)"
              id="price"
              type="number"
              register={register}
              validation={{ 
                required: 'Price is required', 
                valueAsNumber: true,
                min: { value: 0.01, message: 'Price must be positive' } 
              }}
              error={errors.price}
              placeholder="e.g., 2.99"
            />
            <Input
              label="Stock Quantity"
              id="quantityAvailable"
              type="number"
              register={register}
              validation={{ 
                required: 'Stock quantity is required',
                valueAsNumber: true,
                min: { value: 0, message: 'Stock cannot be negative' }
              }}
              error={errors.quantityAvailable}
              placeholder="e.g., 100"
            />
          </div>
        </div>

        {/* Right Column - Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="mx-auto h-40 w-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-1 right-1 bg-white/70 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTimesCircle size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <FaUpload className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600">
                    <Controller
                      name="productImage"
                      control={control}
                      rules={{ required: !initialData }} // Image is required only when creating
                      render={({ field: { onChange, onBlur, name, ref } }) => (
                        <label
                          htmlFor="productImage"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="productImage"
                            name={name}
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onBlur={onBlur}
                            ref={ref}
                            onChange={(e) => onChange(e.target.files)}
                          />
                        </label>
                      )}
                    />
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </div>
          {errors.productImage && <p className="mt-1 text-xs text-red-600">{errors.productImage.message || 'Product image is required'}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            initialData ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </motion.form>
  );
};