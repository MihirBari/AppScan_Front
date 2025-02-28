import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const initialInputs = {
    name: "",
    surname:"",
    email: "",
    password: "",
    role:" "
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [err, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/getOneUserData/${id}`,
        {  headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          }
        }
        );
        const userData = response.data[0]; // Access the first element in the array
       // console.log("Fetched User Data:", userData);
  
        setInputs({
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          role: userData.role,
        });
      } catch (err) {
        console.error(err);
        setError(err.response);
        toast.error("Failed to fetch user details");
      }
    };
  
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/user/editUser/${id}`, inputs,
        {  headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        }
      }
      );
      setInputs(initialInputs);
      toast.success("User updated successfully");
      navigate("/user");
    } catch (err) {
      console.error(err);
      setError(err.response);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Edit User
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderInput("name", "Name", "Enter your Name",true)}
              </div>
              <div>
                {renderInput("surname", "Surname", "surname",true)}
              </div>
              <div>
                {renderInput("email", "Email", "Enter your E-mail")}
              </div>
              <div>
                {renderInput("password", "Password", "Enter your Password")}
              </div>
              <div>
                {renderSelect("role", "Role", [
                    { value: "Admin", name: "Admin" },
                    { value: "Moderator", name: "Moderator" },
                    { value: "User", name: "User" },
                    { value: "RO-User", name: "RO-User" },
                  ])}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              {renderButton("Update")}
              <Link to="/user">
                {renderButton("Back")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  function renderInput(name, label, placeholder,readOnly=false) {
    return (
      <>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <input
            type={name === 'password' ? 'password' : 'text'} // Set type to 'password' for the password field
            name={name}
            autoComplete={name}
            readOnly={readOnly}
            required
            onChange={handleChange}
            placeholder={placeholder}
            value={inputs[name]}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </>
    );
  }

  function renderSelect(name, label, options) {
    return (
      <>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1 relative">
          <select
            name={name}
            onChange={handleChange}
            value={inputs[name]}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" label="Select an option" disabled />
            {options.map((option) => (
              <option key={option.value} value={option.value}>
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
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
        </div>
      </>
    );
  }

  function renderButton(label) {
    return (
      <button
        onClick={label === "Update" ? handleSubmit : undefined}
        className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        {label}
      </button>
    );
  }
};

export default EditUser;
