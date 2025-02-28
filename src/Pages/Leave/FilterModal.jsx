import React, { useState } from "react";
import Modal from "react-modal";
import Select from "react-select";

Modal.setAppElement("#root");

const FilterModal = ({ isOpen, onClose, onApplyFilters, users, resetFilters }) => {
  const [status, setStatus] = useState("");
  const [dateFilterType, setDateFilterType] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const applyFilters = () => {
    // Filter users data based on status and date criteria
    let filteredUsers = users;

    if (status.length > 0) {
      filteredUsers = filteredUsers.filter((user) => status.includes(user.status));
    }

    if (dateFilterType) {
      const selectedDateObj = new Date(selectedDate);
      const startDateObj = startDate ? new Date(startDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;

      if (dateFilterType === "equal") {
        filteredUsers = filteredUsers.filter((user) => new Date(user.fromDate).toDateString() === selectedDateObj.toDateString());
      } else if (dateFilterType === "before") {
        filteredUsers = filteredUsers.filter((user) => new Date(user.fromDate) < selectedDateObj);
      } else if (dateFilterType === "after") {
        filteredUsers = filteredUsers.filter((user) => new Date(user.fromDate) > selectedDateObj);
      } else if (dateFilterType === "between") {
        filteredUsers = filteredUsers.filter((user) => new Date(user.fromDate) >= startDateObj && new Date(user.fromDate) <= endDateObj);
      }
    }

    onApplyFilters(filteredUsers); // Apply filtered users data
  };

  const handleResetFilters = () => {
    setStatus("");
    setDateFilterType("");
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setStartDate(null);
    setEndDate(null);
    resetFilters();
  };

  const statusOptions = [
    { value: "request", label: "Request" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
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
      <div className="flex flex-wrap">
        <Select
          isMulti
          options={statusOptions}
          value={statusOptions.filter((option) => status.includes(option.value))}
          onChange={(selectedOptions) => setStatus(selectedOptions ? selectedOptions.map((option) => option.value) : [])}
          placeholder="Select Status Type"
          className="p-2 w-full md:w-1/4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
        />

        <select
          value={dateFilterType}
          onChange={(e) => setDateFilterType(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2"
        >
          <option value="">Select Date Filter</option>
          <option value="equal">Equal to</option>
          <option value="before">Before</option>
          <option value="after">After</option>
          <option value="between">Between</option>
        </select>

        {dateFilterType &&
          (dateFilterType === "equal" || dateFilterType === "before" || dateFilterType === "after") && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2"
            />
          )}

        {dateFilterType === "between" && (
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2"
            />
          </div>
        )}

        <button onClick={applyFilters} className="bg-blue-500 text-white px-4 py-2 rounded" style={{ marginLeft: "10px" }}>
          Apply Filters
        </button>
        <button onClick={handleResetFilters} className="bg-red-500 text-white px-4 py-2 rounded" style={{ marginLeft: "10px" }}>
          Clear Filters
        </button>
        <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded" style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default FilterModal;
