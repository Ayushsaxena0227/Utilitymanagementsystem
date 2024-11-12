import React from "react";
import "../styles/NotificationModal.css";

const Modal = ({ message, onClose }) => {
  const handleOkay = () => {
    console.log("Okay button clicked.");
    onClose(false);
  };

  const handleRemindLater = () => {
    console.log("Remind me later button clicked.");
    onClose(true);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Notification</h2>
        <p>{message}</p>
        <button onClick={handleOkay}>Okay I'll check</button>
        <button onClick={handleRemindLater}>Remind me later</button>
      </div>
    </div>
  );
};

export default Modal;
