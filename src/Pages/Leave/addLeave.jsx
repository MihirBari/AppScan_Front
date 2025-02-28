import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AddLeave = () => {
  const { currentUser } = useContext(AuthContext);

  const initialInputs = {
    name: currentUser.name,
    surname: currentUser.surname,
    status: "request",
    fromDate: "",
    toDate: "",
    duration: "",
    days: "1",
    description: "",
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [holidays, setHolidays] = useState([]);
  const [err, setError] = useState(null);
  const navigate = useNavigate();
  const toDateRef = useRef(null);

  useEffect(() => {
    // Fetch holidays from the backend
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Holiday/holidays`,
          { headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          }}
        );
        const formattedHolidays = response.data.map(
          (holiday) => holiday.date.split("T")[0]
        );
        setHolidays(formattedHolidays);
        console.log("Holidays:", formattedHolidays);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHolidays();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newInputs = {
      ...inputs,
      [name]: type === "checkbox" ? checked : value,
    };
  
    if (name === "duration" && value === "Half Day") {
      // Reset toDate and days when duration changes to Half Day
      newInputs.toDate = "";
      newInputs.days = "1";
      if (toDateRef.current) {
        toDateRef.current.value = ""; // Reset the toDate input field
      }
    }
  
    if (name === "fromDate" && toDateRef.current) {
      toDateRef.current.value = value; // Set the default value of toDate to the fromDate
      newInputs.toDate = value; // Set toDate in state as well
    }
  
    // Calculate number of days if both fromDate and toDate are available
    if (newInputs.fromDate && newInputs.toDate && newInputs.duration === "Full Day") {
      const fromDate = new Date(newInputs.fromDate);
      const toDate = new Date(newInputs.toDate);
      let daysDifference = 0;
  
      for (let d = new Date(fromDate); d <= toDate; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        const formattedDate = d.toISOString().split("T")[0];
  
        if (day !== 0 && day !== 6 && !holidays.includes(formattedDate)) {
          daysDifference++;
        }
      }
  
      newInputs.days = daysDifference;
    }
  
    setInputs(newInputs); // Update the state with new inputs
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ["fromDate", "duration", "description"];

    for (const field of requiredFields) {
      if (!inputs[field]) {
        toast.error(`Please fill in the ${field.replace(/_/g, " ")} field.`);
        return;
      }
    }

    try {
      // Send data to backend
      await axios.post(`${API_BASE_URL}/api/Leave/addApplicationLeave`, inputs,
        { headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        }}
      );
      setInputs(initialInputs);
      toast.success("Leave Applied successfully");
      navigate("/Leave");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "An unexpected error occurred";
      console.error(err);
      setError(err.response);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Ask For Leave
        </h2>
      </div>
      <div className="mt-8 sm:w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    value={inputs.name}
                    readOnly
                    onChange={handleChange}
                    placeholder="Enter Your Name"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Surname
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="surname"
                    value={inputs.surname}
                    readOnly
                    onChange={handleChange}
                    placeholder="Enter Your Surname"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Leave Duration
                </label>
                <div className="mt-1 relative">
                  <select
                    name="duration"
                    required
                    value={inputs.duration}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day">Half Day</option>
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

              <div className="md:col-span-1">
                <label
                  htmlFor="fromDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  From Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="fromDate"
                    required
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {inputs.duration === "Full Day" && (
                <div className="md:col-span-1">
                <label
                  htmlFor="toDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  To Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="toDate"
                    ref={toDateRef} // Attach the ref to the toDate input
                    required
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              )}

              <div className="md:col-span-1">
                <label
                  htmlFor="days"
                  className="block text-sm font-medium text-gray-700"
                >
                  No Of Days
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="days"
                    value={inputs.days}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reason
                </label>
                <div className="mt-1">
                  <textarea
                    name="description"
                    autoComplete="current-password"
                    required
                    onChange={handleChange}
                    placeholder="Describe Your Reason"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleSubmit}
                className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create
              </button>
              <Link to="/Leave">
                <button
                  className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover
"
                >
                  Back
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeave;
