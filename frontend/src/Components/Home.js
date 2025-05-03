import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle, faStar, faTruck } from '@fortawesome/free-solid-svg-icons';

import { SetUserRole } from '../redux/Slices/UserRole';
import { SetStoreStatus } from '../redux/Slices/Store';
import { setTimestamp } from '../redux/Slices/ProductTimeStampSlice';
import { setProductImages } from '../redux/Slices/ProductImagesSlice';
import { setProductsState } from '../redux/Slices/ProductsSlice';

const ProductCard = ({ img, title, isTopProduct, price, hasFreeDelivery }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
    <div className="relative">
      <img src={img} alt={title} className="w-full h-48 object-cover" />
      {isTopProduct && (
        <div className="absolute top-2 left-2 bg-[#FF7104] text-white px-2 py-1 rounded-full text-xs font-bold">
          <FontAwesomeIcon icon={faStar} className="mr-1" />
          Top Rated
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-[#34383A] mb-2 truncate">{title}</h3>
      <div className="flex justify-between items-center">
        <span className="text-[#FF7104] font-bold">PKR {price.toFixed(2)}</span>
        {hasFreeDelivery && (
          <span className="text-green-600 text-sm">
            <FontAwesomeIcon icon={faTruck} className="mr-1" />
            Free Delivery
          </span>
        )}
      </div>
    </div>
  </div>
);

export default function Home() {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loginStatus = useSelector((state) => state.login.value);
  const products = useSelector((state) => state.products.value);
  const images = useSelector((state) => state.productImages.value);
  const timeStamp = useSelector((state) => state.timestamp.timestamp);
  const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/${timeStamp}`;
        const serverResponse = await fetch(url, { method: 'GET' });
        const jsonResponse = await serverResponse.json();

        if (jsonResponse.error) {
          setErrorMessage(jsonResponse.error);
        } else {
          dispatch(setTimestamp(jsonResponse.timeStamp));
          console.log("Received Products: ", jsonResponse.products.length);

          // Update products in Redux only if they are new
          if (jsonResponse.products.length > 0) {
            dispatch(setProductsState(jsonResponse.products)); // Update Redux with products
          }

          // Fetch images for the new products or updated products
          if (jsonResponse.products.length > 0) {
            fetchProductImages(jsonResponse.products);
          }
        }
      } catch (error) {
        setErrorMessage("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    }

    async function fetchProductImages(newProducts) {
      const newProductImages = {};

      for (let product of newProducts) {
        // Only fetch image if it's not already fetched or if it's new
        if (!images[product._id]) {
          try {
            const imageResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getImage${encodeURIComponent(product.ThumbnailURL)}`);
            if (imageResponse.ok) {
              const thumbnail = URL.createObjectURL(await imageResponse.blob());
              newProductImages[product._id] = {
                thumbnail,
                additionalImages: [thumbnail],
              };

              for (let img of product.ImagesURL) {
                const imgResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/getImage${encodeURIComponent(img)}`);
                if (imgResponse.ok) {
                  newProductImages[product._id].additionalImages.push(URL.createObjectURL(await imgResponse.blob()));
                }
              }
            }
          } catch (error) {
            console.error('Error fetching image:', error);
          }
        }
      }

      // Only update Redux if new images were fetched
      if (Object.keys(newProductImages).length > 0) {
        dispatch(setProductImages(newProductImages));
      }
    }

    async function fetchUserRoleAndStoreStatus() {
      try {
        const serverResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/userRoleAndStoreStatus`, {
          method: 'GET',
          headers: { authorization: `${token}` },
        });
        const jsonResponse = await serverResponse.json();

        if (!jsonResponse.error) {
          dispatch(SetUserRole(jsonResponse.userRole || "buyer"));
          dispatch(SetStoreStatus(jsonResponse.storeStatus || false));
        } else {
          console.error(jsonResponse.error);
        }
      } catch (error) {
        console.error('Error fetching user role and store status:', error);
      }
    }

    if (loginStatus) {
      fetchUserRoleAndStoreStatus();
    }

    if (timeStamp !== "undefined") { // Ensure timeStamp is initialized before calling fetch
      fetchProducts();
    }

    return () => {
      // Clean up when unmounting
      setLoading(false);
      setErrorMessage("");
    };
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-[#FF7104]" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="mb-4" />
        <p className="text-xl font-semibold">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#34383A] mb-8 text-center">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to="/productDescription"
            state={{
              id: product._id,
              images: images[product._id]?.additionalImages || [],
              name: product.Name,
              desc: product.Description,
              price: product.Price.$numberDecimal,
              hasFreeDelivery: product.HasFreeShipping,
              minOrder: product.MinimumOrder,
              stock: product.Stock,
            }}
            className="block"
          >
            <ProductCard
              img={images[product._id]?.thumbnail}
              title={product.Name}
              isTopProduct={product.isTopRated}
              price={parseFloat(product.Price.$numberDecimal)}
              hasFreeDelivery={product.HasFreeShipping}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
