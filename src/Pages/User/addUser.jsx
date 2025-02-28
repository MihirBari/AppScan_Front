import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AddUser = () => {
  const navigate = useNavigate();
  const initialInputs = {
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "User"
  };
  const { currentUser } = useContext(AuthContext);
  const [inputs, setInputs] = useState(initialInputs);
  const [err, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if password field is empty
    if (!inputs.password) {
      toast.error("Password is required");
      return;
    }
  
    try {
      // Send data to backend
      await axios.post(`${API_BASE_URL}/api/user/addUser`, inputs,
        { withCredentials:true,
      }
      );
      setInputs(initialInputs);
      toast.success("User created successfully");
      navigate("/user");
    } catch (err) {
      console.error(err);
      setError(err.response);
      toast.error("Failed to create user");
    }
  }
  

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Add User
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
               First Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  placeholder="Enter your Name"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
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
                  required
                  onChange={handleChange}
                  placeholder="Enter your Name"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-Mail
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  onChange={handleChange}
                  placeholder="Enter your E-mail"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

              
            </div>
            <div className="flex justify-between items-center mt-4">
            <Link to="/user">      
              <button
                onClick={handleSubmit}
                className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create
              </button>
            </Link>
              <Link to="/user">
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

export default AddUser;
