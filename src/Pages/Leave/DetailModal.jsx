import React from 'react';
import Modal from "react-modal";


const DetailModal = ({ isOpen, onClose, orderData, filteredData }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: {
                    zIndex: 9999,
                },
                content: {
                    height: '50%', // Set the height here, e.g., 50%
                    margin: 'auto', // Center the modal horizontally
                },
            }}
        >
            <div className="flex flex-wrap justify-around">
                {filteredData && Object.entries(filteredData).map(([key, value]) => (
                    <div key={key} className="w-1/4 p-4 border border-gray-300 rounded-md m-2">
                        <h2 className="text-center font-semibold">{key}</h2>
                        <p className="text-center mt-2">{value}</p>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default DetailModal;