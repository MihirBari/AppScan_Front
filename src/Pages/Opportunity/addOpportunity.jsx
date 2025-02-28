import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import Select from "react-select";
import { AuthContext } from "../../context/AuthContext";

const AddOpportunity = () => {
  const initialInputs = {
    customer_entity: "",
    name: "",
    description: "",
    type: "",
    License_type: "",
    value: "",
    closure_time: "",
    status: "",
    period: "",
    license_from: "",
    license_to: "",
    pdf: null,
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [customerEntities, setCustomerEntities] = useState([]);
  const [nameOptions, setNameOptions] = useState([]);
  const [err, setError] = useState(null);
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);


  useEffect(() => {
    const fetchCustomerEntities = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Contact/customerentity`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`
            }
          }
        );
        setCustomerEntities(response.data);
      } catch (error) {
        console.error("Error fetching customer entities:", error);
      }
    };

    fetchCustomerEntities();
  }, []);

  const fetchName = async (customerEntity) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Opportunity/name`,
        { customer_entity: customerEntity }
      );
      setNameOptions(response.data);
    } catch (error) {
      console.error("Error fetching names:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "customer_entity") {
      fetchName(value);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 50 * 1024 * 1024; // 50 MB

    if (file && file.size > maxSize) {
      toast.error("File size exceeds the maximum limit of 50 MB.");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputs((prev) => ({
          ...prev,
          pdf: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSelectChange = (selectedOption) => {
    setInputs((prev) => ({
      ...prev,
      customer_entity: selectedOption.value,
    }));
    fetchName(selectedOption.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to backend
      await axios.post(`${API_BASE_URL}/api/Contact/addContact`, inputs, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
      setInputs(initialInputs);
      toast.success("Opportunity created successfully");
      navigate("/Opportunity");
    } catch (err) {
      console.error(err);
      setError(err.response);
      toast.error("Opportunity Already Exists");
    }
  };

  const customerEntityOptions = customerEntities.map((entity) => ({
    value: entity.customer_entity,
    label: entity.customer_entity,
  }));

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Add Opportunity
        </h2>
      </div>
      <div className="mt-8  sm:w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="customer_entity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name Of Customer Entity
                </label>
                <div className="mt-1">
                  <Select
                    options={customerEntityOptions}
                    onChange={handleSelectChange}
                    value={customerEntityOptions.find(
                      (option) => option.value === inputs.customer_entity
                    )}
                    placeholder="Select Customer Entity"
                    className="basic-single"
                    classNamePrefix="select"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1 relative">
                  <select
                    name="name"
                    onChange={handleChange}
                    value={inputs.name}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      Select Name
                    </option>
                    {nameOptions.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M14.707 7.293a1 1 0 00-1.414 0L10 10.586 6.707 7.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Opportunity Description
                </label>
                <div className="mt-1 relative">
                  <textarea
                    type="text"
                    name="description"
                    required
                    onChange={handleChange}
                    value={inputs.description}
                    placeholder="Opportunity Description"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Opportunity Type
                </label>
                <div className="mt-1 relative">
                  <select
                    name="type"
                    required
                    onChange={handleChange}
                    value={inputs.type}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    <option value="BigFix">BigFix</option>
                    <option value="SolarWinds">SolarWinds</option>
                    <option value="Services">Services</option>
                    <option value="Tenable">Tenable</option>
                    <option value="Armis">Armis</option>
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

              <div>
                <label
                  htmlFor="License_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  License Type
                </label>
                <div className="mt-1 relative">
                  <select
                    name="License_type"
                    required
                    onChange={handleChange}
                    value={inputs.License_type}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    <option value="New">New</option>
                    <option value="Renewal">Renewal</option>
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

              <div>
                <label
                  htmlFor="value"
                  className="block text-sm font-medium text-gray-700"
                >
                  Opportunity Value
                </label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    name="value"
                    required
                    onChange={handleChange}
                    value={inputs.value}
                    placeholder="Opportunity Value"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="closure_time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Opportunity Closure Time
                </label>
                <div className="mt-1 relative">
                  <input
                    type="date"
                    name="closure_time"
                    required
                    onChange={handleChange}
                    value={inputs.closure_time}
                    placeholder="Opportunity Closure Time"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="period"
                  className="block text-sm font-medium text-gray-700"
                >
                  Comment
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="period"
                    onChange={handleChange}
                    value={inputs.period}
                    placeholder="License Period"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Opportunity Status
                </label>
                <div className="mt-1 relative">
                  <select
                    name="status"
                    required
                    onChange={handleChange}
                    value={inputs.status}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    <option value="Quotation Done">Quotation Done</option>
                    <option value="Demo Done">Demo Done</option>
                    <option value="POC Done">POC Done</option>
                    <option value="Progress Sub">Progress Sub</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
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

              {inputs.status === "Won" && (
                <>
                  <div>
                    <label
                      htmlFor="license_from"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Opportunity License From
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="date"
                        name="license_from"
                        required
                        onChange={handleChange}
                        value={inputs.license_from}
                        placeholder="Opportunity License From"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="license_to"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Opportunity License To
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="date"
                        name="license_to"
                        required
                        onChange={handleChange}
                        value={inputs.license_to}
                        placeholder="Opportunity License To"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="pdf"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload PDF
                </label>
                <div className="mt-1 relative">
                  <input
                    type="file"
                    name="pdf"
                    onChange={(e) => handlePdfChange(e)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="submit"
                className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create
              </button>
              <Link to="/Opportunity">
                <button className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
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

export default AddOpportunity;
