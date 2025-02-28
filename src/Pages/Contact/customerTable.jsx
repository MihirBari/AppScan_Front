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
import { AuthContext } from '../../context/AuthContext';

const CustomerTable = () => {
  const [rows, setRows] = useState([]);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    customerentity: "",
  });

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/contact/showCustomer`,
          {
            withCredentials:true,
            signal: signal,
          }
        );
        setRows(response.data.products);
        setFilteredUsers(response.data.products);
        console.log(response.data.products);
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
  }, []);

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = (itemId) => {
    console.log('Deleting order with ID:', itemId);

    axios({
      method: 'delete',
      url: `${API_BASE_URL}/api/Contact/deleteCustomer`,
      data: { id: itemId },
      withCredentials:true,
    })
      .then((response) => {
        console.log('Delete successful. Deleted order_id:', itemId);
        setRows((prevRows) => prevRows.filter((row) => row.id !== itemId));
        setFilteredUsers((prevFilteredUsers) => prevFilteredUsers.filter((row) => row.id !== itemId));
        toast.success('Deleted Successfully');
      })
      .catch((error) => {
        console.error('Error deleting:', error);
        toast.error('Error deleting order');
      });
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteItemId(null);
    setShowDeleteConfirmation(false);
  };

  const handleEditClick = (id) => {
    navigate(`edit/${id}`);
  };



  const navigate = useNavigate();
  const handleViewClick = (customer_entity) => {
    navigate(`${customer_entity}`);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'customer_entity',
      headerName: 'Customer Entity',
      width: 400, // Adjust width as needed
      renderCell: (params) => (
        <span
          className='view-link'
          onClick={() => handleViewClick(params.row.customer_entity)}
          style={{
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {params.row.customer_entity}
        </span>
      ),
    },
    { field: 'email', headerName: 'E-Mail', width: 150 },
   
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'website', headerName: 'Website', width: 150 },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id,customer_entity }) => [
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
    city: "",
    customerentity: "",
  };

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = rows.filter(
      (row) =>
        row.customer_entity &&
        row.customer_entity.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filteredData);
  };

  return (
    <>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search"
          style={{ marginBottom: "25px" }}
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
export default CustomerTable