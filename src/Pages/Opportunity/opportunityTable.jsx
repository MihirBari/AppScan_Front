import React, { useState, useEffect } from 'react';
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

const OpportunityTable = () => {
  const [rows, setRows] = useState([]);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    customerEntities: "",
    type: "",
    LicenseType: "",
    value: "",
    closureTime: "",
    status: "",
    period: "",
    licenseFrom: "",
    licenseTo: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      const controller = new AbortController();
      const signal = controller.signal;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Opportunity/showOpportunity`,
          {
            params: filters, // Pass filters as parameters to the backend
            signal: signal, // Pass the signal to the request
          }
        );
        if (response.data && Array.isArray(response.data.products)) {
          setRows(response.data.products);
          setFilteredUsers(response.data.products);
          console.log(response.data.products);
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
    console.log('Deleting order with ID:', itemId);

    axios({
      method: 'delete',
      url: `${API_BASE_URL}/api/Opportunity/deleteOpportunity`,
      data: { id: itemId },
      headers: {
        'Content-Type': 'application/json',
      },
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

  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatIndianNumber = (value) => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const navigate = useNavigate();
  const handleViewClick = (id) => {
    navigate(`view/${id}`);
  };

  const handleEditClick = (id) => {
    navigate(`edit/${id}`);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'customer_entity',
      headerName: 'Customer Entity',
      width: 300, // Adjust width as needed
      renderCell: (params) => (
        <span
          className='view-link'
          onClick={() => handleViewClick(params.row.id)}
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
    { field: 'type', headerName: 'Opportunity Type', width: 150 },
    { field: 'License_type', headerName: 'License Type', width: 150 },
    {
      field: 'value',
      headerName: 'Value',
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
          {formatIndianNumber(params.row.value)}
        </span>
      )
    },
    { field: 'status', headerName: 'Opportunity Status', width: 150 },
    {
      field: 'license_from',
      headerName: 'From',
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
          {formatDate(params.row.license_from)}
        </span>
      )
    },
    {
      field: 'license_to',
      headerName: 'To',
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
          {formatDate(params.row.license_to)}
        </span>
      )
    },
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
    customerEntities: "",
    type: "",
    LicenseType: "",
    value: "",
    closureTime: "",
    status: "",
    licenseFrom: "",
    licenseTo: "",
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

export default OpportunityTable;
