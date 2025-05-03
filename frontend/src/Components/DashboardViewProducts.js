import React, { useEffect, useState } from 'react';
import DashboardProductCard from './DashboardProductCard';
import DeleteConfirmationPopup from './DeleteConfirmationPopup';

const DashBoardViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1];
  // Fetch products based on the id
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storeIDResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/seller/GetStoreId`,{method:'GET', headers: {
          authorization: `${token}`,
        }});
        if(!storeIDResponse.ok){
          throw new Error('Failed to fetch store ID');
        }
        const jsonResponse =await storeIDResponse.json();
        const id = jsonResponse.storeID;

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/getStoreProduts/${id}`,
          {method:'GET', headers: {
            authorization: `${token}`,
          }}
        ); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data); 
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    fetchProducts();
  }, [token]);


  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/deleteProduct/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          authorization: `${token}`,
        }
      });
  
      if (response.ok) {
        const msg = (await response.json()).message || 'Product deleted successfully';
        setSuccessMessage(msg);
        setErrorMessage(''); // Clear any existing error messages
  
        // Remove the product from the state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productToDelete)
        );
      } else {
        const error = (await response.json()).error || 'Failed to delete the product';
        setErrorMessage(error);
        setSuccessMessage(''); // Clear any existing success messages
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
      setSuccessMessage(''); // Clear any existing success messages
    } finally {
      setIsDeletePopupOpen(false); // Close the delete popup
      setProductToDelete(null); // Reset the selected product
      setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 5000); // Clear messages after 5 seconds
    }
  };
  

  return (
    <div className="p-4">
      {errorMessage && (
        <div className="text-red-500 mb-4">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="text-green-500 mb-4">
          {successMessage}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <DashboardProductCard
              key={product._id}
              id={product._id}
              title={product.Name}
              thumbnail={product.ThumbnailURL || '/placeholder.svg'} // Use placeholder if no image
              price={parseFloat(product.Price?.$numberDecimal || 0)}
              quantity={product.Stock || 0}
              onDelete={() => handleDeleteClick(product._id)}
              onUpdate={() => console.log(`Update clicked for ${product._id}`)}
            />
          ))
        ) : (
          <div className="col-span-full text-center">
            No products available.
          </div>
        )}

        <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      </div>
    </div>
  );
};

export default DashBoardViewProduct;
