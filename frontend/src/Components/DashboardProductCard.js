import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setProductImages } from '../redux/Slices/ProductImagesSlice';

const DashboardProductCard = ({ title, id, thumbnail, price, quantity, onDelete, onUpdate }) => {
  const dispatch = useDispatch();
  const productImages = useSelector(state => state.productImages.value);

  useEffect(() => {
    const fetchAndSetImage = async () => {
      try {
        // Check if the image for the given ID is already in the state
        if (!productImages[id]) {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getImage?url=${encodeURIComponent(thumbnail)}`);
          if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            // Update the productImages state with the new image
            dispatch(
              setProductImages({
                ...productImages,
                [id]: {
                  thumbnail: imageUrl,
                  additionalImages: [],
                },
              })
            );
          } else {
            console.error(`Failed to fetch image for product ID: ${id}`);
          }
        }
      } catch (error) {
        console.error(`Error fetching image for product ID: ${id}`, error);
      }
    };

    fetchAndSetImage();
  }, [id, thumbnail, dispatch, productImages]);

  const truncateTitle = (text) => {
    const words = text.split(' ');
    return words.length > 4 ? words.slice(0, 4).join(' ') + '...' : text;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-sm">
      <div className="relative aspect-square">
        <img
          src={productImages[id]?.thumbnail || '/placeholder.svg'}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold mb-2">
          {truncateTitle(title)}
        </h3>

        <div className="mb-2">
          {quantity === 0 ? (
            <span className="text-red-500 font-medium">Out of Stock</span>
          ) : (
            <span className="text-green-500 font-medium">In Stock ({quantity})</span>
          )}
        </div>

        <div className="font-bold">Rs. {price.toFixed(2)}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 pt-0">
        <button
          onClick={onUpdate}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          Update
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default DashboardProductCard;
