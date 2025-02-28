import React from "react";
import Modal from "react-modal";
Modal.setAppElement("#root");
const DeleteConfirmationDialog = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Delete Confirmation"
      style={{
        overlay: {
          zIndex: 9999,
        },
        content: {
          height: "20%",
          width: "20%", // Set the height here, e.g., 50%
          margin: "auto", // Center the modal horizontally
        },
      }}
      ariaHideApp={false}
    >
      <div className="flex flex-col items-center justify-center">
        <h3 className="mb-4">Are you sure you want to delete this item?</h3>
        <div className="space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationDialog;
