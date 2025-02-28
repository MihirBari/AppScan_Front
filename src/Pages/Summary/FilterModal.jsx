import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import API_BASE_URL from "../../config";
import Select from "react-select";
import { AuthContext } from "../../context/AuthContext";
Modal.setAppElement("#root");
const FilterModal = ({ isOpen, onClose, onApplyFilters, resetFilters }) => {
  const [type, setType] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [licenseType, setLicenseType] = useState([]);
  const [status, setStatus] = useState([]);
  const [licenseFrom, setLicenseFrom] = useState("");
  const [licenseTo, setLicenseTo] = useState("");
  const [dateFilterType, setDateFilterType] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchTypeOptions = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Opportunity/product`,
          { signal: signal,
            withCredentials:true,
           }
        );
        setType(response.data);
      } catch (error) {
        console.error("Error fetching type options:", error);
      }
    };

    fetchTypeOptions();

    return () => {
      controller.abort();
    };
  }, []);

  const applyFilters = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Opportunity/showOpportunity`,
        {
          params: {
            type: selectedTypes,
            status,
            licenseType,
            licenseFrom,
            licenseTo,
            dateFilterType,
            selectedDate: dateFilterType !== "between" ? selectedDate : null,
            startDate: dateFilterType === "between" ? startDate : null,
            endDate: dateFilterType === "between" ? endDate : null,
          },
          withCredentials:true,        }
      );
      onApplyFilters(response.data.products);
      //console.log("server", response.data.aggregates);
      localStorage.setItem(
        "SummaryFilters",
        JSON.stringify({
          selectedTypes,
          status,
          licenseType,
          licenseFrom,
          licenseTo,
          dateFilterType,
          selectedDate,
          startDate,
          endDate,
        })
      );
    } catch (error) {
      console.error("Error applying filters:", error.message);
    }
  };

  useEffect(() => {
    const storedFilters = localStorage.getItem("SummaryFilters");
    if (storedFilters) {
      const {
        selectedTypes: storedSelectedTypes,
        status: storedStatus,
        LicenseType: storedLicenseType,
        licenseFrom: storedLicenseFrom,
        licenseTo: storedLicenseTo,
        dateFilterType: storedDateFilterType,
        selectedDate: storedSelectedDate,
        startDate: storedStartDate,
        endDate: storedEndDate,
      } = JSON.parse(storedFilters);

      setSelectedTypes(storedSelectedTypes || []);
      setLicenseType(storedLicenseType);
      setStatus(storedStatus);
      setLicenseFrom(storedLicenseFrom);
      setLicenseTo(storedLicenseTo);
      setDateFilterType(storedDateFilterType);
      setSelectedDate(storedSelectedDate);
      setStartDate(storedStartDate);
      setEndDate(storedEndDate);

      setShouldApplyFilters(true);
    }
  }, []);

  useEffect(() => {
    if (shouldApplyFilters) {
      applyFilters();
      setShouldApplyFilters(false);
    }
  }, [shouldApplyFilters]);

  const handleResetFilters = () => {
    setSelectedTypes([]);
    setStatus("");
    setLicenseType("");
    setLicenseFrom("");
    setLicenseTo("");
    setDateFilterType("");
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setStartDate(null);
    setEndDate(null);
    resetFilters();
  };

  const typeOptionsTransformed = type.map((entity) => ({
    value: entity.name,
    label: entity.name,
  }));
  const opportunityStatusOptions = [
    { value: "Quotation Done", label: "Quotation Done" },
    { value: "Demo Done", label: "Demo Done" },
    { value: "POC Done", label: "POC Done" },
    { value: "Proposal Sub", label: "Proposal Sub" },
    { value: "Won", label: "Won" },
    { value: "Lost", label: "Lost" },
  ];

  const LicenseTypeOptions = [
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
            options={typeOptionsTransformed}
            value={typeOptionsTransformed.filter((option) =>
              selectedTypes.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              setSelectedTypes(
                selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
              )
            }
            placeholder="Select Opportunity Type"
            className="p-2 w-full md:w-1/4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
          />

          <Select
            isMulti
            options={LicenseTypeOptions}
            value={LicenseTypeOptions.filter((option) =>
              Array.isArray(licenseType)
                ? licenseType.includes(option.value)
                : false
            )}
            onChange={(selectedOptions) =>
              setLicenseType(
                selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
              )
            }
            placeholder="Select License Type"
            className="p-2 rounded border w-full md:w-1/4 border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
          />

          <Select
            isMulti
            options={opportunityStatusOptions}
            value={opportunityStatusOptions.filter((option) =>
              Array.isArray(status) ? status.includes(option.value) : false
            )}
            onChange={(selectedOptions) =>
              setStatus(
                selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
              )
            }
            placeholder="Select Opportunity Status"
            className="p-2 rounded w-full md:w-1/4 border border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
          />

          <div className="p-2 rounded border w-full md:w-1/4 border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2">
            <label>License From:</label>
            <input
              type="date"
              value={licenseFrom}
              onChange={(e) => setLicenseFrom(e.target.value)}
            />
          </div>

          <div className="p-2 rounded border w-full md:w-1/4 border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2">
            <label>License To:</label>
            <input
              type="date"
              value={licenseTo}
              onChange={(e) => setLicenseTo(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-2">
          <button
            onClick={() => {
              applyFilters();
              onClose();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            style={{ marginLeft: "10px" }}
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="bg-red-500 text-white px-4 py-2 rounded"
            style={{ marginLeft: "10px" }}
          >
            Clear Filters
          </button>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded"
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
