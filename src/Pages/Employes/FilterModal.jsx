import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import API_BASE_URL from "../../config";

Modal.setAppElement("#root");

const FilterModal = ({ isOpen, onClose, onApplyFilters, resetFilters }) => {
  const [names, setNames] = useState([]);
  const [surnames, setSurnames] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [selectedSurnames, setSelectedSurnames] = useState([]);
  const [status, setStatus] = useState("Active"); // Initialize status as an empty string

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchNames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Employes/name`, { signal,withCredentials:true, });
        setNames(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.error('Error fetching names:', err);
        }
      }
    };

    const fetchSurnames = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Employes/surname`, { signal,withCredentials:true, });
        setSurnames(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          console.error('Error fetching surnames:', err);
        }
      }
    };

    fetchNames();
    fetchSurnames();

    return () => {
      controller.abort();
    };
  }, []);

  const handleApplyFilters = () => {
    const filters = {
      name: selectedNames.map((name) => name.value),
      surname: selectedSurnames.map((surname) => surname.value),
      status: status, // Include the status in the filters
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setSelectedNames([]);
    setSelectedSurnames([]);
    setStatus(""); // Reset status to an empty string
    resetFilters();
  };

  const nameOptions = names.map((name) => ({ value: name, label: name }));
  const surnameOptions = surnames.map((surname) => ({ value: surname, label: surname }));

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          zIndex: 9999,
        },
        content: {
          height: '50%',
          margin: 'auto',
        },
      }}
    >
      <div className="filter-modal">
        <div className="flex flex-wrap">
          {/* <Select
            isMulti
            options={nameOptions}
            value={selectedNames}
            onChange={setSelectedNames}
            placeholder="Select Names"
            className="p-2 w-full md:w-1/2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
          />
          <Select
            isMulti
            options={surnameOptions}
            value={selectedSurnames}
            onChange={setSelectedSurnames}
            placeholder="Select Surnames"
            className="p-2 w-full md:w-1/2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
          /> */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2"
          >
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>
        </div>

        <div className="mt-2">
          <button
            onClick={handleApplyFilters}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            style={{ marginLeft: '10px' }}
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="bg-red-500 text-white px-4 py-2 rounded"
            style={{ marginLeft: '10px' }}
          >
            Clear Filters
          </button>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
