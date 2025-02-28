import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AddCustomer = () => {
  const initialInputs = {
    customer_entity: "",
    address: "",
    city: "",
    state: "",
    email:"",
    website: "",
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [err, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
  
  };

  const { currentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if required fields are filled
    const requiredFields = ["customer_entity", "address", "city", "state"]
    for (const field of requiredFields) {
      if (!inputs[field]) {
        toast.error(`Please fill in the ${field.replace(/_/g, ' ')} field.`);
        return;
      }
    }

    try {
      // Send data to backend
      await axios.post(`${API_BASE_URL}/api/Contact/addCustomer`, 
        inputs,
        {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        }
      }
      );
      setInputs(initialInputs);
      toast.success("Customer created successfully");
      navigate("/Customer");
    } catch (err) {
      console.error(err);
      setError(err.response);
      toast.error("Customer Already Exists");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Add Contact
        </h2>
      </div>
      <div className="mt-8 sm:w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="customer_entity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name Of Customer Entity
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="customer_entity"
                    required
                    onChange={handleChange}
                    placeholder="Name Of Customer Entity"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={inputs.customer_entity}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="address"
                    required
                    onChange={handleChange}
                    placeholder="Address"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="city"
                    required
                    onChange={handleChange}
                    placeholder="City"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="state"
                    required
                    onChange={handleChange}
                    placeholder="State"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  E - mail
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="email"
                    required
                    onChange={handleChange}
                    placeholder="E - mail"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    name="website"
                    required
                    onChange={handleChange}
                    placeholder="Website"
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
              <Link to="/Customer">
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

export default AddCustomer;
