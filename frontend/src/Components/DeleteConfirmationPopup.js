import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-[#FF7104] transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-[#FF7104] mb-4" />
          <h2 className="text-2xl font-bold text-[#34383A] mb-4">Delete Product</h2>
          <p className="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
            >
              No
            </button>
            <button
              onClick={() => {
                onConfirm();
              }}
              className="px-4 py-2 bg-[#FF7104] text-white rounded hover:bg-[#e66700] transition-colors duration-200"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;

