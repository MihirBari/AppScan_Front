import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import Modal from "react-modal";
import { AuthContext } from "../../context/AuthContext";

Modal.setAppElement("#root");
const EditContact = ({ isOpen, onClose,customerId  }) => {
  const initialInputs = {
    customer_entity: "",
    name: "",
    designation: "",
    phone:"",
    email:"",
  };
  const { currentUser } = useContext(AuthContext);
  const [inputs, setInputs] = useState(initialInputs);
  const [err, setError] = useState(null);
  const [typeOptions, setTypeOptions] = useState([]);

    // Inside EditContact component

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const fetchTypeOptions = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Contact/designation`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            },
          }
        );

        // Transform the response data to filter out empty designations
        const transformedOptions = response.data
          .filter((item) => item.designation && item.designation.trim() !== "")
          .map((item) => ({
            id: item.designation,
            name: item.designation,
          }));

        setTypeOptions(transformedOptions);
      } catch (error) {
        console.error("Error fetching type options:", error);
      }
    };
    
    const fetchSeller = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Contact/showOneContact/${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            },
          }
        );
        console.log(customerId)
        const sellerData = response.data[0];
     if (sellerData) {
          setInputs({
            customer_entity: sellerData.customer_entity || '',
            name: sellerData.name || '',
            designation: sellerData.designation || '',
            phone: sellerData.phone || '',
            email: sellerData.email || '',
          });
        } else {
          console.error("Contact data is undefined");
          setError("Contact data is undefined");
          toast.error("Failed to fetch Contact details");
        }
      } catch (err) {
        console.error(err);
        setError(err.response);
        toast.error("Failed to fetch seller details");
      }
    };
  
    // Fetch data when the component mounts
    fetchSeller();
    fetchTypeOptions()
  }, [customerId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/Contact/editContact/${customerId}`, inputs,
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      setInputs(initialInputs);
      toast.success("Updated successfully");
      onClose()
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update seller");
    }
  };

  const handleClose = async() => {
    onClose()
  }

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    style={{
      overlay: {
        zIndex: 9999,
      },
      content: {
        height: "80%",
        width:"50%",
        margin: "auto",
      },
    }}
  >
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Edit Contact
        </h2>
      </div>
      <div className="mt-8 sm:w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
         
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>{renderInput("customer_entity", "Name Of Customer Entity", "Name Of Customer Entity")} </div>
              <div> {renderInput("name", "Name Of Customer", "Name Of Customer")}</div>
              <div> {renderSelect("designation", "Designation ",typeOptions )}</div>
                  <div> {renderInput("phone", "Phone Number", "Phone Number","number")}</div>
                  <div> {renderInput("email", "E-Mail", " E-Mail")}</div>
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
                className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Back
                </button>
              
            </div>
          </form>

        </div>
      </div>
    </div>
    </Modal>
  );

  function renderInput(name, label, placeholder, type = "text") {
    return (
      <div key={name}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
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
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    );
  }

  function renderSelect(name, label, options) {
    return (
      <>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 relative">
          <select
            name={name}
            required
            onChange={handleChange}
            value={inputs[name]}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>
              Select an option
            </option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
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
}

export default EditContact;
