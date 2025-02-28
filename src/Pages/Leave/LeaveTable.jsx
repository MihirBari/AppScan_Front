import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config'; // Replace with your API base URL
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import FilterModal from './FilterModal';
import { CiFilter } from 'react-icons/ci';
import ExportTable from './ExportTable';
import { PiExportBold } from 'react-icons/pi';
import { Edit } from '@mui/icons-material';
import { AuthContext } from "../../context/AuthContext";

const LeaveTable = () => {
  const [rows, setRows] = useState([]);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
      const controller = new AbortController();
      const signal = controller.signal;
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/Leave/showApplicationLeave`,
          {
            role: currentUser.role,
            id: currentUser.id,
            signal: signal,
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            }
          }
        );
        // Check for 'dealers' in response data
        if (response.data && Array.isArray(response.data.dealers)) {
          setRows(response.data.dealers); // use the correct data key
         // setFilteredUsers(response.data.dealers); // use the correct data key
          console.log(response.data.dealers);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.error('Error fetching orders:', err);
        }
      }
      return () => {
        controller.abort(); // Cancel the request if the component unmounts
      };
    };
  
    fetchOrders();
  }, [filters]);
  

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = (itemId) => {
    axios
      .delete(`${API_BASE_URL}/api/Leave/deleteApplication`, { data: { id: itemId },
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        }
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

  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

 
  const navigate = useNavigate();
  const handleViewClick = (id) => {
    navigate(`view/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`edit/${id}`);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100, // Adjust width as needed
      renderCell: (params) => (
        <span
          className='view-link'
          onClick={() => handleViewClick(params.row.id)}
          style={{
            cursor: 'pointer',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {params.row.id}
        </span>
      ),
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'surname', headerName: 'Surname', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'fromDate',
      headerName: 'From Date',
      width: 150,
      renderCell: (params) => (
        <span
          className='view-link'
          style={{
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {formatDate(params.row.fromDate)}
        </span>
      )
    },
    {
      field: 'toDate',
      headerName: 'To Date',
      width: 150,
      renderCell: (params) => (
        <span
          className='view-link'
          style={{
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {formatDate(params.row.toDate)}
        </span>
      )
    },
    { field: 'duration', headerName: 'Duration', width: 150 },
    { field: 'days', headerName: 'Days', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          sx={{ color: 'primary.main' }}
          onClick={() => handleEditClick(id)}
        />,
        <GridActionsCellItem
          icon={<MdDelete />}
          label="Delete"
          className="textPrimary"
          onClick={() => handleDeleteClick(id)}
          color="inherit"
        />,
      ],
    },
  ];

  const handleExportClick = () => {
    setExportModalIsOpen(true);
  };

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData); // Set filteredTotalData
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
  }

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = rows.filter(row => 
        row.name.toLowerCase().includes(searchTerm) || row.surname.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filteredData);
};

  return (
    <>
      <div className="flex items-center">
      <input
                type="text"
                placeholder="Search"
                onChange={handleSearch}
                className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            />
        <PiExportBold
          size={40}
          style={{ marginLeft: "25px", marginBottom: "25px" }}
          onClick={handleExportClick}
        />
        <ExportTable
          data={filteredUsers}
          isOpen={exportModalIsOpen}
          onRequestClose={() => setExportModalIsOpen(false)}
        />
        <CiFilter
          size={40}
          style={{ marginLeft: "25px", marginBottom: "25px" }}
          onClick={handleCiFilterClick}
        />
      </div>

      <FilterModal
        isOpen={filterModalIsOpen}
        onClose={() => setFilterModalIsOpen(false)}
        onApplyFilters={onApplyFilters}
        resetFilters={() => setFilters(initialFilters)} // Pass initial filters to resetFilters
      />
      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={handleCloseDeleteConfirmation}
        onDelete={() => {
          handleDeleteConfirmation(deleteItemId);
          handleCloseDeleteConfirmation();
        }}
      />

      <Box sx={{ height: 600, width: '100%', overflow: 'auto', scrollBehavior: 'smooth' }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          autoHeight={true} // Adjust row height dynamically
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[20, 40, 60]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
};

export default LeaveTable