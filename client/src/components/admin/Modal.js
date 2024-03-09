// Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ closeModal, children }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        {children}
        <button onClick={closeModal}>OK</button>
      </div>
    </div>
  );
};

export default Modal;
