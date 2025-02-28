import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import API_BASE_URL from "../../config";
import Select from "react-select";
import { AuthContext } from "../../context/AuthContext";
Modal.setAppElement("#root");

const FilterModal = ({ isOpen, onClose, onApplyFilters, resetFilters }) => {
  const [customerEntity, setCustomerEntity] = useState([]);
  const [customerEntitys, setCustomerEntitys] = useState([]);
  const [licenseType, setLicenseType] = useState([]);
  const [type, setType] = useState([]);
  const [types, setTypes] = useState([]);

  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const fetchCustomerEntity = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/opportunity/customerEntityAlert`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            }
          }
        );
        setCustomerEntitys(response.data);
        // console.log("Entity:", response.data);
      } catch (error) {
        console.error("Error fetching customer entities:", error.message);
      }
    };

    const fetchTypeOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Opportunity/product`,
           {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`
            } }
        );
        setTypes(response.data);
      } catch (error) {
        console.error("Error fetching type options:", error);
      }
    };

    fetchCustomerEntity();
    fetchTypeOptions();
  }, []);

  const applyFilters = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Opportunity/sendAlert`,
        {
          params: {
            customerEntity: customerEntity?.map((entity) => entity.value),
            type: type?.map((t) => t.value),
            licenseType: licenseType?.map((l) => l.value),
          }, 
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            }
          
        }
      );

      onApplyFilters(response.data.products);

      // Update localStorage only if filters are applied successfully
      localStorage.setItem(
        "expenseFilters",
        JSON.stringify({
          customerEntity,
          type,
          licenseType,
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
        customerEntity: storedCustomerEntity,
        type: storedType,
        licenseType: storedLicenseType,
      } = JSON.parse(storedFilters);

      // Set filter values to state
      setCustomerEntity(storedCustomerEntity || []);
      setType(storedType || []);
      setLicenseType(storedLicenseType || []);
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
    setCustomerEntity([]);
    setType([]);
    setLicenseType([]);
    resetFilters();
  };

  const customerEntityOptions = customerEntitys.map((entity) => ({
    value: entity.alert_entity,
    label: entity.alert_entity,
  }));

  const opportunityTypeOptions = types.map((entity) => ({
    value: entity.name,
    label: entity.name,
  }));

  const licenseTypeOptions = [
    { value: "New", label: "New" },
    { value: "Renewal", label: "Renewal" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          zIndex: 9999,
        },
        content: {
          height: "50%",
          margin: "auto",
        },
      }}
    >
      <div className="filter-modal">
        <div className="flex flex-wrap">
          <Select
            isMulti
            options={licenseTypeOptions}
            value={licenseType}
            onChange={(selectedOptions) => setLicenseType(selectedOptions || [])}
            placeholder="Select License Type"
            className="p-2 w-full md:w-1/4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
          />

          <Select
            isMulti
            options={opportunityTypeOptions}
            value={type}
            onChange={(selectedOptions) => setType(selectedOptions || [])}
            placeholder="Select Opportunity Type"
            className="p-2 w-full md:w-1/4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
          />

          <Select
            isMulti
            options={customerEntityOptions}
            value={customerEntity}
            onChange={(selectedOptions) => setCustomerEntity(selectedOptions || [])}
            placeholder="Select Customer Entity"
            className="p-2 w-full md:w-1/4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
          />

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
      </div>
    </Modal>
  );
};

export default FilterModal;
