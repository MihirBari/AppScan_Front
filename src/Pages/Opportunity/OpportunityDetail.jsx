import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditOpportunityModal from './EditOpportunityModal';
import Modal from 'react-modal';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API_BASE_URL from '../../config';
import { AuthContext } from '../../context/AuthContext';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import axios from 'axios';

const OpportunityDetail = ({ product }) => {
  const [editModalOpen, setEditModalOpen] = useState(false); // State to manage edit modal open/close
  const [pdfModalOpen, setPdfModalOpen] = useState(false); // State to manage PDF modal open/close
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

const { currentUser } = useContext(AuthContext);
const navigate = useNavigate()

  const handleEditClick = () => {
  //  console.log("Clicked");
    setEditModalOpen(true); // Open the modal when Edit button is clicked
  };

  const handlePdfClick = () => {
    setPdfModalOpen(true); // Open the PDF modal when eye icon is clicked
  };

  const formatIndianNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId); // Set the itemId to be deleted
    setShowDeleteConfirmation(true); // Show the delete confirmation dialog
  };

  const handleDeleteConfirmation = (itemId) => {
    console.log("Deleting order with ID:", itemId);

    axios({
      method: "delete",
      url: `${API_BASE_URL}/api/Opportunity/deleteOpportunity`,
      data: { id: itemId }, // Include only the ID in the request payload
      withCredentials:true
    })
      .then((response) => {
        console.log("Delete successful. Deleted order_id:", itemId);
        toast.success("Deleted Successfully");
        navigate('/Opportunity')
      })
      .catch((error) => {
        console.error("Error deleting:", error);
        toast.error("Error deleting order");
      });
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteItemId(null);
    setShowDeleteConfirmation(false);
  };

  const {
    id,
    customer_entity,
    description,
    name,
    phone,
    email,
    type,
    License_type,
    value,
    closure_time,
    status,
    period,
    license_from,
    license_to,
    pdf
  } = product;

  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <Link to={`/Customer/view/${id}`}>
          <h2 className="text-xl font-semibold mb-2">Customer Entity : {customer_entity}</h2>
        </Link>
        <p className="text-gray-600 mb-2">Customer Name : {name}</p>
        <p className="text-gray-600 mb-2">Customer Email : {email}</p>
        <p className="text-gray-600 mb-2">Customer Phone : {phone}</p>
        <p className="text-gray-600 mb-2">Description : {description}</p>
        <p className="text-gray-800 font-semibold mb-2">Value: ₹{formatIndianNumber(value)}</p>
        <p className="text-gray-600 mb-2">Type : {type}</p>
        <p className="text-gray-600 mb-2">License Type : {License_type}</p>
        <p className="text-gray-600 mb-2">Closure Time : {closure_time}</p>
        <p className="text-gray-600 mb-2">Current Status : {status}</p>
        <p className="text-gray-600 mb-2">Comments : {period}</p>
        <p className="text-gray-600 mb-2">License From: {license_from}</p>
        <p className="text-gray-600 mb-2">License To : {license_to}</p>

        {pdf && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">PDF Document:</h3>
            <button onClick={handlePdfClick} className="text-blue-500 hover:underline">
              <FaEye size={30} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-around mt-4">
          <button onClick={handleEditClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
            Edit
          </button>
          {editModalOpen && <EditOpportunityModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />}
            <button onClick={() => handleDeleteClick(id)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-red-600 focus:outline-none">
              Delete
            </button>
            <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={handleCloseDeleteConfirmation}
        onDelete={() => {
          handleDeleteConfirmation(deleteItemId);
          handleCloseDeleteConfirmation();
        }}
      />
          <Link to="/Opportunity">
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">
              Back
            </button>
          </Link>
        </div>
      </div>

      {/* PDF Modal */}
      <Modal
        isOpen={pdfModalOpen}
        onRequestClose={() => setPdfModalOpen(false)}
        style={{
          overlay: { zIndex: 9999 },
          content: { height: '90%', width: '90%', margin: 'auto', padding: 0, display: 'flex', flexDirection: 'column' },
        }}
        ariaHideApp={false}
      >
        <div className="flex-grow" style={{ display: 'flex', flexDirection: 'column' }}>
          <embed src={pdf} type="application/pdf" style={{ flexGrow: 1 }} />
          <button onClick={() => setPdfModalOpen(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default OpportunityDetail;