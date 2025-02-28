import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EditOpportunityModal from "./editLeaveModal";
import axios from "axios";
import API_BASE_URL from "../../config";
import { toast } from "react-toastify";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { AuthContext } from "../../context/AuthContext";
import { TiTick } from "react-icons/ti";
import { RxCross1 } from "react-icons/rx";

const LeaveDetail = ({ product }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [comment, setComment] = useState("");

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const {
    id,
    name,
    surname,
    status,
    fromDate,
    toDate,
    duration,
    days,
    description,
    history,
  } = product;

  const handleDeleteConfirmation = (itemId) => {
    axios
      .delete(`${API_BASE_URL}/api/Leave/deleteApplication`, { data: { id: itemId },
        withCredentials:true,
      })
      .then((response) => {
        console.log("Delete successful:", response.data);
        toast.success("Deleted Successfully");
        navigate("/Leave");
      })
      .catch((error) => {
        console.error("Error deleting:", error);
      });
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteItemId(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setShowDeleteConfirmation(true);
  };

  const handleStatusChange = (newStatus) => {
    axios
      .put(`${API_BASE_URL}/api/Leave/leaveConfirm/${id}`, {
        status: newStatus,
        history: comment,
        name:name,
        surname:surname,
        withCredentials:true,
      })
      .then((response) => {
        toast.success(`Leave application ${newStatus}`);
        navigate("/Leave");
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const isApproved = status.toLowerCase() === "approved";
  //const isRejected = status.toLowerCase() === "rejected";
  const currentDate = new Date();
  const fromDateObj = new Date(fromDate);
  const isOneDayAfterFromDate = currentDate > new Date(fromDateObj.setDate(fromDateObj.getDate() + 1));

  const hideButtons = isApproved &&  isOneDayAfterFromDate && currentUser.role !== "Admin";

  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <p className="text-gray-700 text-lg font-semibold mb-2">
          Name: {name} {surname}
        </p>
        <p className="text-gray-600 mb-2">Status: {status}</p>
        <p className="text-gray-600 mb-2">From Date: {formatDate(fromDate)}</p>
        <p className="text-gray-600 mb-2">To Date: {formatDate(toDate)}</p>
        <p className="text-gray-600 mb-2">Duration Type: {duration}</p>
        <p className="text-gray-600 mb-2">No Of Days: {days}</p>
        <p className="text-gray-600 mb-2">Description: {description}</p>
        <p className="text-gray-600 mb-4">Comments: {history}</p>

        {currentUser.role === "Admin" && status === "request" && (
          <div className="mt-4">
              <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter comment here..."
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                />
                <div className="flex mt-4">
                  <button
                    onClick={() => handleStatusChange("approved")}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none mr-2"
                  >
                    <TiTick className="mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange("rejected")}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    <RxCross1 className="mr-2" />
                    Reject
                  </button>
                </div>
              </div>
        
          </div>
        )}

        <div className="flex items-center justify-around mt-6">
          {!hideButtons && (
            <>
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Edit
              </button>
              {editModalOpen && (
                <EditOpportunityModal
                  isOpen={editModalOpen}
                  onClose={() => setEditModalOpen(false)}
                  id={id}
                />
              )}
              <button
                onClick={() => handleDeleteClick(id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
              >
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
            </>
          )}
          <Link to="/Leave">
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none">
              Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetail;
