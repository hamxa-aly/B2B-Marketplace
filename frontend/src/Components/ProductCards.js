import React, { useState, useEffect } from 'react';

export default function ProductCards({
  img,
  title,
  isTopProduct,
  ratings = 5,
  price,
  hasFreeDelivery,
}) {
  const [RatingStars, setRatingStars] = useState([
    '/star-empty.png',
    '/star-empty.png',
    '/star-empty.png',
    '/star-empty.png',
    '/star-empty.png',
  ]);

  // Update stars when the rating changes
  useEffect(() => {
    const updatedStars = Array(5).fill('/star-empty.png');

    for (let i = 0; i < Math.floor(ratings); i++) {
      updatedStars[i] = '/star-filled.png';
    }

    if (ratings % 1 !== 0) {
      updatedStars[Math.floor(ratings)] = '/star-half-filled.png';
    }

    setRatingStars(updatedStars);
  }, [ratings]);

  // Truncate title to first 5 words and append "..."
  const truncatedTitle = title.split(' ').slice(0, 3).join(' ') + (title.split(' ').length > 5 ? '..' : '');

  return (
    <div className="w-56 h-72 bg-[#34383A] m-6 rounded-md">
      <div className="w-full h-40 flex justify-center items-center bg-white rounded-t-md overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-auto h-full object-cover"
        />
      </div>
      <div className="flex flex-row justify-center items-center space-x-4 my-1">
        <img
          src="/top-rated.png"
          alt="product is top rated"
          className={`${isTopProduct ? 'visible' : 'hidden'} object-contain`}
          style={{ width: '30px', height: '30px' }}
        />

        <div className="flex flex-col justify-center items-center">
          {/* Truncated title with hover effect */}
          <h3
            className="text-white font-bold truncate"
            title={title} // Show complete title on hover
          >
            {truncatedTitle}
          </h3>

          <div className="flex justify-center items-center space-x-1">
            {RatingStars.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`star ${index + 1}`}
                className="w-full h-auto"
                style={{ width: '20px', height: '20px' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex my-8 ml-3 justify-between items-center">
        <div>
          <h3 className="text-white font-bold">Rs. {price}</h3>
        </div>

        <div className="flex space-x-4 mr-5">
          <img
            src="/free-shipping.png"
            alt="free shipping available"
            className={`${hasFreeDelivery ? 'visible' : 'hidden'} object-contain`}
            style={{ width: '30px', height: '30px' }}
          />
          <img
            src="/add-to-cart.png"
            alt="add to cart"
            style={{ width: '30px', height: '30px' }}
          />
        </div>
      </div>
    </div>
  );
}
