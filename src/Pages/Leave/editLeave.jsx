import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const EditLeave = () => {
  const initialInputs = {
    name: "",
    surname: "",
    status: "",
    fromDate: "",
    toDate: "",
    duration: "",
    days: 0, // Initialize days as 0
    description: "",
    history: "",
  };

  const { id } = useParams();
  const [inputs, setInputs] = useState(initialInputs);
  const [err, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext); // Assuming you have currentUser from context

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Calculate days difference if both fromDate and toDate are set
    if (name === "fromDate" || name === "toDate") {
      const fromDate = name === "fromDate" ? value : inputs.fromDate;
      const toDate = name === "toDate" ? value : inputs.toDate;
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const timeDifference = to.getTime() - from.getTime();
        const daysDifference =
          Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1; // Adding 1 to include both start and end dates
        setInputs((prev) => ({
          ...prev,
          days: daysDifference,
        }));
      } else {
        setInputs((prev) => ({
          ...prev,
          days: 0,
        }));
      }
    }
  };

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Leave/showOneApplicationLeave/${id}`,
          { headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          }}
          
        );
        const sellerData = response.data[0];
        console.log("Seller Data:", sellerData);

        const formattedFromDate = new Date(sellerData.fromDate)
          .toISOString()
          .split("T")[0];

        const formattedToDate = new Date(sellerData.toDate)
          .toISOString()
          .split("T")[0];

        setInputs({
          name: sellerData.name,
          surname: sellerData.surname,
          status: sellerData.status,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          type: sellerData.type,
          duration: sellerData.duration,
          days: sellerData.days,
          description: sellerData.description,
          history: sellerData.history,
        });
      } catch (err) {
        console.error(err);
        setError(err.response);
        toast.error("Failed to fetch seller details");
      }
    };

    // Fetch data when the component mounts
    fetchSeller();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check the duration and set toDate to null if duration is "Half Day"
    const updatedInputs = {
      ...inputs,
      toDate: inputs.duration === "Half Day" ? null : inputs.toDate,
    };

    try {
      await axios.put(
        `${API_BASE_URL}/api/Leave/editApplicationAdmin/${id}`,
        updatedInputs,
        { headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        }}
      );
      setInputs(initialInputs);
      toast.success("Updated successfully");
      navigate("/Leave");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };

  const renderInput = (
    name,
    label,
    placeholder,
    type = "text",
    isDisabled = false
  ) => {
    const isEditableByUser =
      currentUser.role === "User" || currentUser.role === "Moderator" || currentUser.role === "RO-User";
    const isEditable = isEditableByUser && !isDisabled;

    // Render toDate input only if duration is "Full Day"
    if (name === "toDate" && inputs.duration !== "Full Day") {
      return null;
    }

    return (
      <div key={name}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1">
          <input
            type={type}
            name={name}
            required
            onChange={handleChange}
            placeholder={placeholder}
            value={inputs[name]}
            readOnly={!isEditable}
            disabled={!isEditable}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    );
  };

  const renderTextArea = (
    name,
    label,
    placeholder,
    type = "text",
    isDisabled = false
  ) => {
    const isEditableByUser =
      currentUser.role === "User" || currentUser.role === "Moderator" || currentUser.role === "RO-User";
    const isEditable = isEditableByUser && !isDisabled;

    return (
      <div key={name}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1">
          <textarea
            name={name}
            required
            onChange={handleChange}
            placeholder={placeholder}
            value={inputs[name]}
            readOnly={!isEditable}
            disabled={!isEditable}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    );
  };

  const renderSelect = (name, label, options, isDisabled = false) => {
    const isEditableByUser =
      currentUser.role === "User" || currentUser.role === "Moderator" || currentUser.role === "RO-User";
    const isEditable = isEditableByUser && !isDisabled;

    return (
      <div key={name}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1 relative">
          <select
            name={name}
            required
            onChange={handleChange}
            value={inputs[name]}
            disabled={!isEditable}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const renderTextAreaAdmin = (
    name,
    label,
    placeholder,
    type = "text",
    isDisabled = false
  ) => {
    const isEditableByUser = currentUser.role === "Admin";
    const isEditable = isEditableByUser && !isDisabled;

    return (
      <div key={name}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1">
          <textarea
            name={name}
            required
            onChange={handleChange}
            placeholder={placeholder}
            value={inputs[name]}
            readOnly={!isEditable}
            disabled={!isEditable}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    );
  };

  const renderSelectAdmin = (name, label, options, isDisabled = false) => {
    const isEditableByUser = currentUser.role === "Admin";
    const isEditable = isEditableByUser && !isDisabled;

    return (
      <div key={name}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1 relative">
          <select
            name={name}
            required
            onChange={handleChange}
            value={inputs[name]}
            disabled={!isEditable}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Edit Leave Application
        </h2>
      </div>
      <div className="mt-8 sm:w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {inputs && Object.keys(inputs).length !== 0 ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {renderInput("name", "Name", "Enter Name", "text", true)}
                {renderInput(
                  "surname",
                  "Surname",
                  "Enter Surname",
                  "text",
                  true
                )}
                {renderInput("fromDate", "From", "Enter Date", "date", false)}
                {renderInput("toDate", "To", "Enter Date", "date", false)}
                <div>
                  {renderSelect(
                    "duration",
                    "Duration Of leave",
                    [
                      { value: "", label: "Select an option" },
                      { value: "Full Day", label: "Full Day" },
                      { value: "Half Day", label: "Half Day" },
                    ],
                    false
                  )}
                </div>
                {renderInput(
                  "days",
                  "No of Days",
                  "Enter No Of Days",
                  "text",
                  true
                )}
                {renderTextArea(
                  "description",
                  "Description / Summary",
                  "Enter Summary",
                  "text",
                  false
                )}
                {currentUser.role === "Admin" && (
                  <>
                    <div>
                      {renderSelectAdmin(
                        "status",
                        "Status",
                        [
                          { value: "", label: "Select an option" },
                          { value: "approved", label: "approved" },
                          { value: "rejected", label: "rejected" },
                        ],
                        false
                      )}
                    </div>
                    <div>
                      {renderTextAreaAdmin(
                        "history",
                        "Comments / History",
                        "Enter Comment",
                        "text",
                        false
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="submit"
                  className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Update
                </button>
                <Link to="/Leave">
                  <button className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Back
                  </button>
                </Link>
              </div>
            </form>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditLeave;
