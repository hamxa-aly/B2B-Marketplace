import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUpload, faBox, faDollarSign, faWarehouse, faShoppingCart, faShieldAlt, faImage, faImages, faTruck } from '@fortawesome/free-solid-svg-icons';

export default function ProductUploadForm() {
  const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1];
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    minOrderQuantity: '',
    productCategory: '',
    Stock: '',
    keyFeatures: '',
    productDimensions: '',
    legalDisclaimers: '',
    Warranty: '',
    sku: '',
    tags: '',
    faqs: '',
    freeShipping: true,
  });

  const [files, setFiles] = useState({
    thumbnail: null,
    productImages: [],
    video: null,
  });

  const categories = [
    'Electronics', 'Clothing', 'Home Appliances', 'Toys & Games', 'Books',
    'Beauty & Personal Care', 'Automotive', 'Jewelry', 'Furniture', 'Groceries',
    'Footwear', 'Sports & Fitness', 'Musical Instruments', 'Mobile Accessories',
    'Health & Wellness', 'Baby Products', 'Pet Supplies', 'Stationery', 'Watches',
    'Luggage & Travel', 'Garden Supplies', 'Industrial Tools', 'Kitchenware',
    'Outdoor & Adventure', 'Arts & Crafts',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: name === 'productImages' ? Array.from(files) : files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (files.thumbnail) data.append('thumbnail', files.thumbnail);
    if (files.productImages.length > 0) {
      Array.from(files.productImages).forEach((file) =>
        data.append('productImages', file)
      );
    }
    if (files.video) data.append('video', files.video);

    try {
      console.log('Adding product');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/AddProduct`, {
        method: 'POST',
        headers: {
          authorization: `${token}`,
        },
        body: data,
      });

      if (response.ok) {
        alert('Product uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Error uploading product');
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Server error occurred');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-lg overflow-hidden">
      <div className="bg-[#FA7E1E] text-white py-6 px-8">
        <h2 className="text-3xl font-bold text-center">Upload Product</h2>
      </div>
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={faBox}
              name="productName"
              label="Product Name"
              value={formData.productName}
              onChange={handleInputChange}
              required
            />
            <SelectField
              icon={faWarehouse}
              name="productCategory"
              label="Category"
              value={formData.productCategory}
              onChange={handleInputChange}
              options={categories}
              required
            />
            <InputField
              icon={faDollarSign}
              name="productPrice"
              label="Price"
              type="number"
              value={formData.productPrice}
              onChange={handleInputChange}
              required
            />
            <InputField
              icon={faWarehouse}
              name="Stock"
              label="Stock"
              type="number"
              value={formData.Stock}
              onChange={handleInputChange}
              required
            />
            <InputField
              icon={faShoppingCart}
              name="minOrderQuantity"
              label="Minimum Order Quantity"
              type="number"
              value={formData.minOrderQuantity}
              onChange={handleInputChange}
              required
            />
            <InputField
              icon={faShieldAlt}
              name="Warranty"
              label="Warranty"
              value={formData.Warranty}
              onChange={handleInputChange}
            />
          </div>

          <TextAreaField
            name="productDescription"
            label="Description"
            value={formData.productDescription}
            onChange={handleInputChange}
            required
          />

          <FileUploadField
            icon={faImage}
            name="thumbnail"
            label="Thumbnail"
            onChange={handleFileChange}
            required
          />
          <FileUploadField
            icon={faImages}
            name="productImages"
            label="Product Images"
            onChange={handleFileChange}
            multiple
            required
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="freeShipping"
              name="freeShipping"
              checked={formData.freeShipping}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, freeShipping: e.target.checked }))
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="freeShipping" className="text-sm text-gray-700 flex items-center">
              <FontAwesomeIcon icon={faTruck} className="mr-2" />
              Free Shipping
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            Upload Product
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ icon, name, label, type = "text", value, onChange, showInfo = true, info = "" ,required }) {
  return (
    <div>
      <div className=' w-auto h-auto p-4 bg-amber-100 relative bottom-3 text-sm rounded-lg'>
          {info}
      </div>
      <div className="flex justify-between">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {label}
      </label>
      {showInfo && <FontAwesomeIcon icon={faInfoCircle} />}
      </div>
      
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function SelectField({ icon, name, label, value, onChange, options, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ name, label, value, onChange, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    </div>
  );
}

function FileUploadField({ icon, name, label, onChange, multiple, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {label}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        onChange={onChange}
        multiple={multiple}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
}

