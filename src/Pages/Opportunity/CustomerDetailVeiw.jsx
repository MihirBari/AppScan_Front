import React, { useState, useEffect, useContext } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import AddContact from "../Contact/AddContact";
import axios from "axios";
import API_BASE_URL from "../../config";
import { toast } from "react-toastify";
import DeleteConfirmationDialog from "../Contact/DeleteConfirmationDialog";
import { Link, useParams } from "react-router-dom";
import EditContact from "../Contact/editContact";
import FilterModal from "../Summary/filterModalContact";
import { CiFilter } from "react-icons/ci";
import OpportunityDetails from "../Summary/opportunityDetails";
import { AuthContext } from "../../context/AuthContext";
import { IoMdAddCircle } from "react-icons/io";

const CustomerDetailVeiw = () => {
  const [addContactIsOpen, setAddContactIsOpen] = useState(false);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerEntity, setCustomerEntity] = useState(""); 
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    designation: "",
    name: "",
  });

  const { id } = useParams();

  const handleAddClick = () => {
    setAddContactIsOpen(true);
  };

  const handleEditClick = (customerId) => {
    setEdit(true);
    setCustomerId(customerId); // Assuming you have a state to store the customer ID
  };

  const handleDeleteConfirmation = (itemId) => {
    axios
      .delete(`${API_BASE_URL}/api/Contact/deleteContact`, {
        data: { id: itemId },
        withCredentials:true
      })
      .then((response) => {
        console.log("Delete successful:", response.data);
        toast.success("Deleted Successfully");
        window.location.reload();
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

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData);
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
    designation: "",
    name: "",
  };

  const { currentUser } = useContext(AuthContext)

  console.log("id : ",id)

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  useEffect(() => {
    const fetchCustomerEntity = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Contact/summaryContactCustomerentity/${id}`,
          {
            withCredentials:true
          }
        );
        console.log(response.data[0].customer_entity)
        setCustomerEntity(response.data[0].customer_entity); // Assuming the API returns the entity as `customer_entity`
      } catch (error) {
        console.error("Error fetching customer entity:", error);
      }
    };
  
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Contact/showSummaryContact/${id}`,
          {
            withCredentials:true
          }
        );
        setCustomers(response.data.products);
        setFilteredUsers(response.data.products);
        setLoading(false); // Update loading state
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setLoading(false);
      }
    };
  
    fetchCustomerEntity(); // Fetch the customer entity first
    fetchContacts(); // Fetch contact details
  }, [id, currentUser]);
  

  return (
    <>
    <div className="h-screen flex-1 p-7">
      <div>
        <h1 className="text-2xl font-semibold text-center"> {customerEntity}</h1>
      </div>
      <div style={{ float: "right" }}>
      <IoMdAddCircle 
        size={40}
        onClick={handleAddClick}
        />
        <AddContact
          isOpen={addContactIsOpen}
          onClose={() => setAddContactIsOpen(false)}
          customer_entity={customerEntity}
        />
        <CiFilter
          size={40}
          style={{ marginLeft: "25px" }}
          onClick={handleCiFilterClick}
        />
        <FilterModal
          isOpen={filterModalIsOpen}
          onClose={() => setFilterModalIsOpen(false)}
          onApplyFilters={onApplyFilters}
          filters={filters}
          resetFilters={() => setFilters(initialFilters)}
          id={id}

        />
      </div>

      <div>
        {loading ? (
          <div>Loading...</div>
        ) : customers.length === 0 ? (
          <div className="text-xl font text-center">
            No Contacts available, please add details.
          </div>
        ) : (
          Array.isArray(customers) &&
          filteredUsers.map((customer) => (
            <div
              key={customer.id}
              style={{
                border: "1px solid #000000",
                padding: "10px",
                margin: "10px",
                height: "auto",
                width: "90%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                backgroundColor:"#ffff"
              }}
            >
              <div>
                <h2>Name </h2>
                <div>{customer.name}</div>
              </div>
              <div>
                <h2>Designation </h2>
                <div>{customer.designation}</div>
              </div>
              <div>
                <h2>Phone </h2>
                <div>{customer.phone}</div>
              </div>
              <div>
                <h2>Email </h2>
                <div>{customer.email}</div>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <MdEdit onClick={() => handleEditClick(customer.id)} />
                {edit && (
                  <EditContact
                    isOpen={edit}
                    onClose={() => setEdit(false)}
                    customerId={customerId}
                  />
                )}
                <MdDelete onClick={() => handleDeleteClick(customer.id)} />
                <DeleteConfirmationDialog
                  isOpen={showDeleteConfirmation}
                  onClose={handleCloseDeleteConfirmation}
                  onDelete={() => {
                    handleDeleteConfirmation(deleteItemId);
                    handleCloseDeleteConfirmation();
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
      <Link to={`/Opportunity/view/${id}`}>
        <button
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "8px 16px",
            cursor: "pointer",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Back
        </button>
      </Link>
    <div>
      <OpportunityDetails  id={id}  />
    </div>
    </div>
    </>
  );
};

export default CustomerDetailVeiw;
