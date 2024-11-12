import React from 'react';
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;