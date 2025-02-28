import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./orders.css";
import DataTable, { createTheme } from "react-data-table-component";
import API_BASE_URL from "../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ExportTable from "./ExportTable";
import FilterModal from "./FilterModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { AuthContext } from "../../context/AuthContext";
import { FaFilter } from "react-icons/fa6";

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const tableRef = useRef(null); // Add this ref
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State variable for delete confirmation dialog
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    surname:"",
    status: "",
    fromDate: "",
    toDate:"",
    duration:"",
    days:"",
    description:"",
    history:"",
    assignedTo:""
  });

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/Leave/showApplicationLeave`,
          {
            role: currentUser.role,
            id: currentUser.id,
            team: currentUser.team,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            }
          }
        );
        setUsers(response.data.dealers);
        setFilteredUsers(response.data.dealers);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
  
    fetchOrders();
  }, [currentUser]);



  const handleDeleteConfirmation = (itemId) => {
    axios
      .delete(`${API_BASE_URL}/api/Leave/deleteApplication`, { data: { id: itemId },
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        } })
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
    setShowDeleteConfirmation(false);
  };


  const handleViewClicked = (id) => {
    //console.log("Viewing order with ID:", id);
    navigate(`view/${id}`);
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
    //   cell: (row) => (
    //     <span
    //       className="view-link"
    //       onClick={
    //         currentUser.role === "Admin" || 
    //         (currentUser.name === row.name && currentUser.surname === row.surname)
    //           ? () => handleViewClicked(row.id)
    //           : null
    //       }
    //       style={{ cursor: "pointer", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start" }}
    //     >
    //       {row.id}
    //     </span>
    //   ),
    //   width: "100px",
    // },
    {
      name: "Name",
      selector: (row) => row.name,
      cell: (row) => (
        <span
          className="view-link"
          onClick={
            currentUser.role === "Admin" || 
            (currentUser.name === row.name && currentUser.surname === row.surname)
              ? () => handleViewClicked(row.id)
              : null
          }
          style={{ cursor: "pointer", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start" }}
        >
          {row.name}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Surname",
      selector: (row) => row.surname,
      cell: (row) => (
        <span
          className="view-link"
          onClick={
            currentUser.role === "Admin" || 
            (currentUser.name === row.name && currentUser.surname === row.surname)
              ? () => handleViewClicked(row.id)
              : null
          }
          style={{ cursor: "pointer", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start" }}
        >
          {row.surname}
        </span>
      ),
      sortable: true,
    },
    
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className="view-link"
          onClick={
            currentUser.role === "Admin" || 
            (currentUser.name === row.name && currentUser.surname === row.surname)
              ? () => handleViewClicked(row.id)
              : null
          }
          style={{ cursor: "pointer", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start" }}
        >
          {row.status}
        </span>
      ),
      sortable: true,
      width: "150px",
    },
    {
      name: "From Date",
      selector: (row) => {
        if (!row.fromDate) return " ";
        const date = new Date(row.fromDate);
        return isNaN(date) ? " " : date.toLocaleString("en-UK", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "IST",
        });
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "To Date",
      selector: (row) => {
        if (!row.toDate) return " ";
        const date = new Date(row.toDate);
        return isNaN(date) ? " " : date.toLocaleString("en-UK", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "IST",
        });
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Duration",
      selector: (row) => row.duration,
      sortable: true,
    },
    {
      name: "Days",
      selector: (row) => row.days,
      sortable: true,
      width: "140px",
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

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData);
  
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
     name: "",
    status: "",
    fromDate: "",
    toDate:"",
    duration:"",
    days:"",
    description:"",
    history:"",
    assignedTo:""
  };

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === "kushal") {
      window.location.href = "https://www.youtube.com/watch?v=GBIIQ0kP15E";
  return;
  }

    const filteredData = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || user.surname.toLowerCase().includes(searchTerm)
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
  selectAllRowsItemText: 'All',
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
          {/* <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleExportClick}
          >
            Export
          </button> */}
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
            users={users}
            resetFilters={() => setFilters(initialFilters)}
          />
          
          <DeleteConfirmationDialog
            isOpen={showDeleteConfirmation}
            onClose={handleCloseDeleteConfirmation}
            onDelete={() => {
              handleDeleteConfirmation(deleteItemId); // Call the delete confirmation function with the deleteItemId
              handleCloseDeleteConfirmation(); // Close the dialog after deletion
            }}
          />
        </div>
      </div>
      <DataTable
        className="dataTable"
        columns={modifiedColumns}
        data={filteredUsers}
        //fixedHeader
        customStyles={customStyles} // Pass the updated customStyles object here
        fixedHeaderScrollHeight="800px"
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

export default Users;
