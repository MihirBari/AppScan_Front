import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const EditEmployes = () => {
  const initialInputs = {
    id:"",
    name: "",
    surname: "",
    designation: "",
    joining_date: "",
    last_date: "",
    status: "Active", // Defaulting to Active
    DOB: "",
    team:"",
    personal_email: "",
  };
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [inputs, setInputs] = useState(initialInputs);
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const teamOptions = [
    { value: "BigFix", label: "BigFix" },
    { value: "SolarWinds", label: "SolarWinds" },
    { value: "Armis", label: "Armis" },
    { value: "Tenable", label: "Tenable" },
  ];

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Employes/viewEmployes/${id}`,
          {headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          }}
        );
        const employeeData = response.data[0];
        if (employeeData) {
          setInputs({
            id: employeeData.id || "",
            name: employeeData.name || "",
            surname: employeeData.surname || "",
            designation: employeeData.designation || "",
            joining_date: formatDate(employeeData.joining_date) || "",
            last_date: formatDate(employeeData.last_date) || "",
            status: employeeData.status || "Active",
            DOB: formatDate(employeeData.DOB) || "",
            team: employeeData.team || "",
            personal_email: employeeData.personal_email || "",
          });
        } else {
          console.error("Employee data is undefined");
          setError("Employee data is undefined");
          toast.error("Failed to fetch employee details");
        }
      } catch (err) {
        console.error(err);
        setError(err.response);
        toast.error("Failed to fetch employee details");
      }
    };
  
    fetchEmployee();
  }, [id]);
  
  // Helper function to format date in YYYY-MM-DD format
  const formatDate = (dateString) => {
    if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If date is invalid, handle accordingly
      throw new Error("Invalid date");
    }

    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() - timezoneOffset);
    return adjustedDate.toISOString().split("T")[0];
  } catch (error) {
    console.error(`Error formatting date: ${error.message}`);
    return ""; // or handle the error in an appropriate way for your application
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/Employes/editEmployes/${id}`, inputs,
        {headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        }}
      );
      toast.success("Employee updated successfully");
      navigate("/Employees");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update employee");
    }
  };

  const handleClose = () => {
    navigate("/Employees");
  };

  const handleTeamChange = (selectedOptions) => {
    setInputs((prev) => ({
      ...prev,
      team: selectedOptions ? selectedOptions.map(option => option.value) : [],
    }));
  };

  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Edit Employee
        </h2>
      </div>
      <div className="mt-8 sm:w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
            {renderInput("id", "ID", "Employee's ID")}
              {renderInput("name", "Name", "Employee's Name")}
              {renderInput("surname", "Surname", "Employee's Surname")}
              {renderInput("designation", "Designation", "Employee's Designation")}
              {renderInput("joining_date", "Joining Date", "date","date")}
              {renderInput("last_date", "Last Date", "date","date")}
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={inputs.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              {renderInput("DOB", "Date of Birth", "date","date")}
              <div className="col-span-2">
                <label htmlFor="team" className="block text-sm font-medium text-gray-700">
                  Team
                </label>
                <Select
                  isMulti
                  name="team"
                  options={teamOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={teamOptions.filter(option => inputs.team.includes(option.value))}
                  onChange={handleTeamChange}
                />
              </div>
              {renderInput("personal_email", "Personal Email", "Employee's Personal Email")}
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleSubmit}
                className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Update
              </button>
              <button
                onClick={handleClose}
                className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  function renderInput(name, label, placeholder, type = "text") {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <input
            type={type}
            name={name}
            id={name}
            required
            onChange={handleChange}
            value={inputs[name]}
            placeholder={placeholder}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    );
  }

};


export default EditEmployes;
