import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./orders.css";
import DataTable, { createTheme } from "react-data-table-component";
import API_BASE_URL from "../../config";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import ExportTable from "./ExportTable";
import FilterModal from "./FilterModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { PiExportBold } from "react-icons/pi";
import { AuthContext } from "../../context/AuthContext";
import { FaFilter } from "react-icons/fa6";

const TableCustomer = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteContact, setDeleteContact] = useState(null);
  const [filters, setFilters] = useState({
    city: "",
    customerentity: "",
  });
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/contact/showCustomer`,
          {
            withCredentials: true, 
            signal,
          }
        );

        setUsers(response.data.products);
        setFilteredUsers(response.data.products);
        // console.log(response.data.products);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          console.error("Error fetching orders:", err);
        }
      }
      return () => {
        controller.abort(); // Cancel the request if the component unmounts
      };
    };

    fetchOrders();
  }, [currentUser]);

  const handleEditClick = (userId) => {
    navigate(`edit/${userId.id}`);
  };

  const handleDeleteConfirmation = (itemId, customEntity) => {
    axios
      .delete(`${API_BASE_URL}/api/Contact/deleteCustomer`, {
        data: { id: itemId, 
          customer_entity: customEntity },
      withCredentials:true,
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

  // Function to handle closing the delete confirmation dialog
  const handleCloseDeleteConfirmation = () => {
    setDeleteItemId(null);
    setDeleteContact(null)
    setShowDeleteConfirmation(false);
  };

  // Function to handle delete operation
  const handleDeleteClick = (row) => {
    setDeleteItemId(row.id);
    setDeleteContact(row.customer_entity)
    setShowDeleteConfirmation(true);
  };

  const handleViewClick = (id) => {
     console.log("id", id);
    navigate(`${id}`);
  };

  const handleViewClicked = (row) => {
    navigate(`${row.id}`);
  };

  const columns = [
    {
      name: "Sr. No",
      selector: (_, index) => index + 1,
      sortable: false,
      width: "80px",
    },
    // {
    //   name: "ID",
    //   selector: (row) => row.id,
    //   sortable: true,
    //   center: true,
    // },
    {
      name: "Name Of Customer Entity",
      sortable: true,
      width: "340px",
      cell: (row) => (
        <span
          className="view-link"
          onClick={() => handleViewClick(row.id)}
          style={{
            cursor: "pointer",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {row.customer_entity}
        </span>
      ),
      center: true,
    },
    {
      name: "E-Mail",
      cell: (row) => (
        <span
          className="view-link"
          onClick={() => handleViewClick(row.id)}
          style={{
            cursor: "pointer",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {row.email}
        </span>
      ),
      sortable: true,
      width: "250px",
    },
    {
      name: "Address",
      cell: (row) => (
        <span
          className="view-link"
          onClick={() => handleViewClick(row.id)}
          style={{
            cursor: "pointer",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {row.address}
        </span>
      ),
      sortable: true,
      width: "250px",
      center: true,
    },
    {
      name: "City",
      cell: (row) => (
        <span
          className="view-link"
          onClick={() => handleViewClick(row.id)}
          style={{
            cursor: "pointer",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {row.city}
        </span>
      ),
      sortable: true,
      width: "250px",
      center: true,
    },
    {
      name: "State",
      cell: (row) => (
        <span
          className="view-link"
          onClick={() => handleViewClick(row.id)}
          style={{
            cursor: "pointer",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {row.state}
        </span>
      ),
      sortable: true,
      width: "250px",
      center: true,
    },
    {
      name: "Website",
      cell: (row) => (
        <span
          className="view-link"
          onClick={() => handleViewClick(row.id)}
          style={{
            cursor: "pointer",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {row.website}
        </span>
      ),
      sortable: true,
      width: "250px",
      center: true,
    },
    {
      name: "Edit",
      cell: (row) => <MdEdit onClick={() => handleEditClick(row)}>Edit</MdEdit>,
      button: true,
      center: true,
    },
    {
      name: "Delete",
      cell: (row) => (
        <MdDelete onClick={() => handleDeleteClick(row)}>Delete</MdDelete>
      ),
      button: true,
      center: true,
    },
    {
      name: "View",
      cell: (row) => <FaEye onClick={() => handleViewClicked(row)} />,
      button: true,
      center: true,
    },
  ];

  const CustomHeader = ({ column }) => (
    <div title={column.name} style={{ whiteSpace: "normal" }}>
      {column.name}
    </div>
  );

  const modifiedColumns = columns.map((col) => ({
    ...col,
    header: <CustomHeader column={col} />,
  }));

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData);
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
    city: "",
    customerentity: "",
  };

  createTheme(
    "solarized",
    {
      text: {
        primary: "#FFFFFF",
        secondary: "#FFFFFF",
      },
      background: {
        default: "rgba(59,139,246,1)",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#073642",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(59,139,246,1)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "light"
  );

  const customStyles = {
    headCells: {
      style: {
        color: "rgb(255 255 255)",
        zIndex: "auto",
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor:"#000000"
        },
      },
    },
    header: {
      style: {
        minHeight: "56px",
        fontSize: "25px",
      },
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor:"#000000"
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor:"#000000"
        },
        fontSize: "16px",
      },
    },
  };

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  const handleExportClick = () => {
    setExportModalIsOpen(true);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = users.filter(
      (user) =>
        user.customer_entity &&
        user.customer_entity.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filteredData);
  };

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to top when page changes
    }
  }, [currentPage]);

  // Modify pagination options to capture page changes
  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page state
  };

  const customPaginationComponentOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
    onChangePage: handlePageChange, // Update the page change handler
  };

  return (
    <div ref={tableRef} className="order">
      <div className="flex items-center">
        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}
        >
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearch}
            className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <PiExportBold
            size={40}
            style={{ marginLeft: "25px" }}
            onClick={handleExportClick}
          />
          <ExportTable
            data={filteredUsers}
            isOpen={exportModalIsOpen}
            onRequestClose={() => setExportModalIsOpen(false)}
          />

          <FaFilter
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
          />

          <DeleteConfirmationDialog
            isOpen={showDeleteConfirmation}
            onClose={handleCloseDeleteConfirmation}
            onDelete={() => {
              handleDeleteConfirmation(deleteItemId,deleteContact); // Call the delete confirmation function with the deleteItemId
              handleCloseDeleteConfirmation(); // Close the dialog after deletion
            }}
          />
        </div>
      </div>
      <DataTable
        className="dataTable"
        columns={modifiedColumns}
        data={filteredUsers}
        customStyles={customStyles}
        striped
        theme="solarized"
        pagination
        highlightOnHover
        paginationPerPage={20}
        paginationRowsPerPageOptions={[20, 40, 60]}
        paginationComponentOptions={customPaginationComponentOptions}
        onChangePage={handlePageChange}
      />
    </div>
  );
};

export default TableCustomer;
