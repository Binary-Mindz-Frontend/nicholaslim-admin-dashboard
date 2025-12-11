import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const UpdateAdvertiseModal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null; // Do not render if `show` is false

  return (
   <div className="fixed inset-0 backdrop-blur-xl bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 rounded-lg lg:w-2/6 shadow-lg transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-600 bg-transparent border-none cursor-pointer hover:text-red-600"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default UpdateAdvertiseModal;
