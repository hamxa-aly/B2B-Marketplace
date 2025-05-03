import React, { useState } from 'react';
import { Await, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, faStarHalfAlt, 
  faChevronLeft, faChevronRight, 
  faMinus, faPlus, 
  faUserPlus, faStore, 
  faTruck
} from '@fortawesome/free-solid-svg-icons';

export default function ProductDescription({
  ratings = 5,
  storeId,
  storeName = "A1 Decores",
  storeFollowers = 0,
  storeLogo = 'temp-store-logo'
}) {
  const token = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)?.[1];
  const location = useLocation();
  const { id ,images, name, desc, price, hasFreeDelivery, minOrder, stock } = location.state;

  const [orderAmount, setOrderAmount] = useState(minOrder);
  const [currentImage, setCurrentImage] = useState(0);

  function onIncreaseDecreaseAmount(action) {
    if (action === 'decrease') {
      setOrderAmount(prev => Math.max(prev - 1, minOrder));
    } else if (action === 'increase') {
      setOrderAmount(prev => Math.min(prev + 1, stock));
    }
  }

  function ChangeImage(action) {
    if (action === 'next') {
      setCurrentImage(prev => (prev + 1) % images.length);
    } else if (action === 'prev') {
      setCurrentImage(prev => (prev - 1 + images.length) % images.length);
    }
  }

  async function onAddToCartClick() {
    if (stock >= minOrder && orderAmount >= minOrder) {
        const body = JSON.stringify({ productID: id, quantity: orderAmount }); // Fix: Ensure keys match backend

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/AddtoCart`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",  // Fix: Ensure JSON content type
                "Authorization": `${token}`,
            },
            body: body  // Fix: Stringify the body
        });

        const data = await response.json();
        console.log(data.message);
    }
}


  const RatingStars = () => {
    const fullStars = Math.floor(ratings);
    const hasHalfStar = ratings % 1 !== 0;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={index < fullStars ? faStar : (index === fullStars && hasHalfStar ? faStarHalfAlt : ['far', 'star'])}
            className="text-[#FA7E1E] w-5 h-5"
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({ratings} out of 5)</span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="relative aspect-square">
            <img
              src={images[currentImage]}
              alt={name}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
              onClick={() => ChangeImage('prev')}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
              onClick={() => ChangeImage('next')}
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
            </button>
          </div>
          <div className="flex space-x-2 overflow-x-auto py-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${name} thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                  index === currentImage ? 'ring-2 ring-[#FA7E1E]' : ''
                }`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={`/${storeLogo}.png`}
                  alt={`${storeName} logo`}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold">{storeName}</h3>
                  <p className="text-sm text-gray-600">{storeFollowers} followers</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-white hover:bg-gray-100 text-[#34383A] px-3 py-2 rounded-md text-sm border border-[#34383A]">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                  Follow
                </button>
                <button className="bg-[#34383A] hover:bg-[#4a4f52] text-white px-3 py-2 rounded-md text-sm">
                  <FontAwesomeIcon icon={faStore} className="mr-2" />
                  Visit Store
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 my-10">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-[#34383A]">PKR {price}/-</p>
            {hasFreeDelivery && (
              <div className="flex items-center">
                <FontAwesomeIcon icon={faTruck} className="text-[#FA7E1E] mr-2" />
                <span className="text-sm font-medium text-[#FA7E1E]">Free Shipping</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">{desc}</p>
          </div>

          <RatingStars />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <span className="bg-[#FA7E1E] text-white text-sm font-medium px-3 py-2 rounded-l-lg">Min Order</span>
              <span className="bg-[#34383A] text-white text-sm font-medium px-3 py-2 rounded-r-lg">{minOrder} pieces</span>
            </div>
            <div className="flex items-center justify-between space-x-4 text-center bg-[#D9D9D9] rounded-full">
              <button 
                className="p-2"
                onClick={() => onIncreaseDecreaseAmount('decrease')}
              >
                <FontAwesomeIcon icon={faMinus} className="w-5 h-5" />
              </button>
              <span className="text-lg font-semibold flex-1 text-center">{orderAmount}</span>
              <button 
                className="p-2"
                onClick={() => onIncreaseDecreaseAmount('increase')}
              >
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center my-8">
            <button 
              className="w-96 h-10 bg-[#34383A] rounded-xl text-white hover:bg-[#4a4f52]" 
              onClick={onAddToCartClick}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

