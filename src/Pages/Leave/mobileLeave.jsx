import React, { useState, useEffect, useContext } from "react";
import SideNavBar from "../Sidebar/Navbar";
import MobileDetail from "./MobileDetail";
import axios from "axios";
import API_BASE_URL from "../../config";
import FilterModal from "./FilterModal";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaFilter } from "react-icons/fa6";

const MobileLeave = () => {
  const [applications, setApplications] = useState([]); // Initialize as an empty array
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(null); // Initialize as null
  const [filters, setFilters] = useState({
    name: "",
    surname: "",
    status: "",
    fromDate: "",
    toDate: "",
    type: "",
    duration: "",
    days: "",
    description: "",
    history: "",
    assignedTo: "",
  });

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/Leave/showApplicationLeave`,
          {
            role: currentUser.role,
            id: currentUser.id,
           withCredentials:true,
          }
        );
       // console.log("API Response:", response.data);
        setApplications(response.data.dealers);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchData();
  }, [currentUser]);


  

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData);
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
    name: "",
    status: "",
    fromDate: "",
    toDate: "",
    type: "",
    duration: "",
    days: "",
    description: "",
    history: "",
    assignedTo: "",
  };

  const renderApplications = () => {
    const dataToRender = filteredUsers !== null ? filteredUsers : applications;
    if (dataToRender.length === 0) {
      return <p>No leave applications found.</p>;
    }
    return dataToRender.map((application) => (
      <MobileDetail
        key={application.id}
        product={application}
        style={{ flex: "1 0 300px", margin: "10px" }}
      />
    ));
  };
  const navigate = useNavigate();
  const handleAddClick = () => {
    navigate("/addLeave");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNavBar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mb-4">
          <div className="flex items-center">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "10px",
              }}
            >
              
              <FilterModal
                isOpen={filterModalIsOpen}
                onClose={() => setFilterModalIsOpen(false)}
                onApplyFilters={onApplyFilters}
                users={applications}
                resetFilters={() => setFilters(initialFilters)}
              />
              <h1 className="text-2xl mt-8 font-semibold text-center">
                Leave Applications
              </h1>
              <div style={{ float: "right" }}>
          <IoMdAddCircle size={40} onClick={handleAddClick} />
          <FaFilter
                size={40}
                //style={{ marginLeft: "25px",ma }}
                onClick={handleCiFilterClick}
              />
        </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            {renderApplications()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLeave;
