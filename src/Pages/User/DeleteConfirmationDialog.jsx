import React from "react";
import Modal from "react-modal";

const DeleteConfirmationDialog = ({ isOpen, onClose, onDelete }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          zIndex: 9999,
        },
        content: {
          height: "20%",
          width: "20%",
          margin: "auto",
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
