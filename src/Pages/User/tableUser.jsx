import React, { useContext, useEffect, useRef, useState } from 'react';
import "./orders.css";
import DataTable from 'react-data-table-component';
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import axios from 'axios';
import API_BASE_URL from "../../config";
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationDialog from "./DeleteConfirmationDialog.jsx";
import { AuthContext } from '../../context/AuthContext.jsx';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const tableRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchUsers = async () => {
          try {
            const response = await axios.get(
              `${API_BASE_URL}/api/user/userData`,
              {
                signal: signal,
                withCredentials:true,
              }
            );
            setUsers(response.data);
            setFilteredUsers(response.data);
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
    
        fetchUsers();
      }, [currentUser]);

    const handleEditClick = (userId) => {
        navigate(`edit/${userId}`);
    };

    const handleDeleteClick = (itemId) => {
        setDeleteItemId(itemId);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmation = () => {
        if (deleteItemId) {
            axios.delete(`${API_BASE_URL}/api/user/delete`, { data: { id: deleteItemId },
                withCredentials:true,
            })
                .then((response) => {
                    console.log("Delete successful. Deleted user ID:", deleteItemId);
                    setUsers(users.filter(user => user.id !== deleteItemId));
                    setFilteredUsers(filteredUsers.filter(user => user.id !== deleteItemId));
                    toast.success("Deleted Successfully");
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    toast.error("Error deleting user");
                })
                .finally(() => {
                    setShowDeleteConfirmation(false);
                    setDeleteItemId(null);
                });
        }
    };

    const handleCloseDeleteConfirmation = () => {
        setDeleteItemId(null);
        setShowDeleteConfirmation(false);
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
    
        if (searchTerm === "kushal") {
            window.open("https://www.youtube.com/watch?v=GBIIQ0kP15E");
        return;
        }
    
        // Filter users as usual
        const filteredData = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)
        );
        setFilteredUsers(filteredData);
    };

    const columns = [
        {
            name: 'Sr. No',
            selector: (_, index) => index + 1,
            sortable: false,
            width: '80px',
        },
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Surname',
            selector: (row) => row.surname,
            sortable: true,
        },
        {
            name: 'Role',
            selector: (row) => row.role,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: 'Total Leave Taken',
            selector: (row) => row.holidays_taken,
            sortable: true,
        },
        {
            name: 'Team',
            selector: (row) => row.team,
            sortable: true,
        },
        {
            name: 'Edit',
            cell: (row) => (
                <MdEdit onClick={() => handleEditClick(row.id)}>Edit</MdEdit>
            ),
            button: true,
        },
        {
            name: 'Delete',
            cell: (row) => (
                <MdDelete onClick={() => handleDeleteClick(row.id)}>Delete</MdDelete>
            ),
            button: true,
        },
    ];

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
        <div ref={tableRef} className='order'>
            <input
                type="text"
                placeholder="Search"
                onChange={handleSearch}
                className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <DataTable
                className='dataTable'
                columns={columns}
                data={filteredUsers}
                striped
                pagination
                paginationPerPage={20}
                paginationRowsPerPageOptions={[20, 40, 60]}
                paginationComponentOptions={customPaginationComponentOptions}
                onChangePage={handlePageChange}
            />
            <DeleteConfirmationDialog
                isOpen={showDeleteConfirmation}
                onClose={handleCloseDeleteConfirmation}
                onDelete={handleDeleteConfirmation}
            />
        </div>
    );
};

export default Users;
