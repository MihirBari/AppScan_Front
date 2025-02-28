import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import API_BASE_URL from "../../config";
import { AuthContext } from "../../context/AuthContext";
Modal.setAppElement("#root");
const FilterModal = ({ isOpen, onClose, onApplyFilters, resetFilters,id }) => {
  const [designation, setDesignation] = useState("");
  const [designations, setDesignations] = useState([]);
  const { currentUser } = useContext(AuthContext)
  const [name, setName] = useState("");
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);

  useEffect(() => {
    const fetchDesignation = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/contact/designation`,
          { headers: {
            Authorization: `Bearer ${currentUser.accessToken}`
          }}
        );
        setDesignations(response.data);
       // console.log(response.data);
      } catch (error) {
        console.error("Error fetching product types:", error.message);
      }
    };

    fetchDesignation();
  }, []);


  const applyFilters = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/contact/showSummaryContact/${id}`,
        {
          params: {
            designation,     
            name
          },
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`
          }
        }
      );

      onApplyFilters(response.data.products);
      // Update localStorage only if filters are applied successfully
      localStorage.setItem(
        "expenseFilters",
        JSON.stringify({
          
          designation,
          
          name,
        })
      );
    } catch (error) {
      console.error("Error applying filters:", error.message);
    }
  };

  const retrieveAndSetFilters = async () => {
    // Retrieve filter values from localStorage
    const storedFilters = localStorage.getItem("expenseFilters");
    if (storedFilters) {
      const {
        
        designation: storedDesignation,
       
      } = JSON.parse(storedFilters);

      // Set filter values to state
     
      setDesignation(storedDesignation);
      
      setShouldApplyFilters(true);
    }
  };

  useEffect(() => {
    // Retrieve and set filters from localStorage when the component mounts
    retrieveAndSetFilters();
  }, []);

  useEffect(() => {
    // Apply filters when the flag is set to true
    if (shouldApplyFilters) {
      applyFilters();
      // Reset the flag to false after applying filters
      setShouldApplyFilters(false);
    }
  }, [shouldApplyFilters]);

  const handleResetFilters = () => {
   
    setDesignation("");
    setName("");
    resetFilters();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          zIndex: 9999,
        },
        content: {
          height: "20%", // Set the height here, e.g., 50%
          margin: "auto", // Center the modal horizontally
        },
      }}
    >
      <div className="filter-modal">
        <input
          type="text"
          placeholder="Name of Customer"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2"
        />


        <select
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2"
        >
          <option value="">Select Designation</option>
          {designations &&
            designations.map((data, index) => (
              <option key={index} value={data.designation}>
                {data.designation}
              </option>
            ))}
        </select>
        {/* Apply and Cancel buttons */}
        <button
          onClick={() => {
            applyFilters();
            onClose();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          style={{ marginLeft: "10px" }}
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
          style={{ marginLeft: "10px" }}
        >
          Clear Filters
        </button>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default FilterModal;
