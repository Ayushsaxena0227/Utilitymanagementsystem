import React from "react";
import "../styles/Modal.css";

const Modal = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <button onClick={onClose} className="modal-close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
