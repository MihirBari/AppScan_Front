import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const EditOpportunity = () => {
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
    user_name: "", // For sending currentUser's name
    user_surname: "", // For sending currentUser's surname
  };

  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(initialInputs);
  const [nameOptions, setNameOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [err, setError] = useState(null);


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Opportunity/showOneOpportunity/${id}`,
          {
            withCredentials:true}
        );
        const orderData = response.data[0];
       // console.log("Fetched Order Data:", orderData);
  
        // Adjust the timezone offset and convert to yyyy-MM-dd format
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          const timezoneOffset = date.getTimezoneOffset() * 60000;
          const adjustedDate = new Date(date.getTime() - timezoneOffset);
          return adjustedDate.toISOString().split("T")[0];
        };
  
        const fetchTypeOptions = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/api/Opportunity/product`,
              {withCredentials:true}
            );
            setTypeOptions(response.data);
          } catch (error) {
            console.error("Error fetching type options:", error);
          }
        };
  
        fetchTypeOptions(); // Call fetchTypeOptions to populate typeOptions
  
        setInputs({
          customer_entity: orderData.customer_entity,
          name: orderData.name,
          description: orderData.description,
          type: orderData.type,
          License_type: orderData.License_type,
          value: orderData.value,
          closure_time: formatDate(orderData.closure_time),
          status: orderData.status,
          period: orderData.period,
          license_from: formatDate(orderData.license_from),
          license_to: formatDate(orderData.license_to),
        });
      } catch (err) {
        console.error(err);
        setError(err.response);
        toast.error("Failed to fetch order details");
      }
    };
  
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (inputs.customer_entity) {
      fetchName(inputs.customer_entity);
    }
  }, [inputs.customer_entity]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setInputs((prev) => ({
      ...prev,
    
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchName = async (customerEntity) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Opportunity/name`,
          {
            withCredentials:true,
          customer_entity: customerEntity }
      );
      setNameOptions(response.data);
      //console.log(response.data);
    } catch (error) {
      console.error("Error fetching names:", error);
    }
  };

  console.log("Current User Name:", currentUser.name);
console.log("Current User Surname:", currentUser.surname);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await axios.put(`${API_BASE_URL}/api/Opportunity/editOpportunity/${id}`, {
        ...inputs,
        withCredentials:true,
        closure_time: inputs.closure_time
          ? new Date(inputs.closure_time).toISOString()
          : null,
        license_from: inputs.license_from
          ? new Date(inputs.license_from).toISOString()
          : null,
        license_to: inputs.license_to
          ? new Date(inputs.license_to).toISOString()
          : null,
        user_name: currentUser.name, // Add currentUser.name here
        user_surname: currentUser.surname, // Add currentUser.surname here
      },
      {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }}
    );
  
      setInputs(initialInputs);
      navigate("/Opportunity");
      toast.success("Opportunity updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.response);
      toast.error("Failed to update opportunity");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Edit Opportunity
        </h2>
      </div>
      <div className="mt-8 sm:w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 gap-4">
              <div>
                {renderInput(
                  "customer_entity",
                  "Customer Entity",
                  "Enter Customer Entity"
                )}
              </div>
              <div>{renderSelect("name", "Name", nameOptions)}</div>
              <div>
                {renderInput("description", "Description", "Enter description")}
              </div>
              <div>
                  {renderSelect("type", "Opportunity Type", typeOptions)}
                </div>
              <div>
                {renderSelect("License_type", "License Type", [
                  { value: "New", name: "New" },
                  { value: "Renewal", name: "Renewal" },
                ])}
              </div>
              <div>{renderInput("value", "Value", "Enter value")}</div>
              <div>
                {renderInput(
                  "closure_time",
                  "Closure Time",
                  "Closure Time",
                  "date"
                )}
              </div>
              <div>{renderInput("period", "Comment", "Comment")}</div>
              <div>
                {renderSelect("status", "Status", [
                  { value: "Quotation Done", name: "Quotation Done" },
                  { value: "Demo Done", name: "Demo Done" },
                  { value: "POC Done", name: "POC Done" },
                  { value: "Proposal Sub", name: "Proposal Sub" },
                  { value: "Won", name: "Won" },
                  { value: "Lost", name: "Lost" },
                ])}
              </div>

              {inputs.status === "Won" && (
                <>
                  <div>
                    {renderInput(
                      "license_from",
                      "License From",
                      "License From",
                      "date"
                    )}
                  </div>
                  <div>
                    {renderInput(
                      "license_to",
                      "License To",
                      "License To",
                      "date"
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              {renderButton("Update")}
              <Link to="/Opportunity">{renderButton("Back")}</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  function renderInput(name, label, placeholder, type = "text") {
    return (
      <>
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
        type={label === "Update" ? "submit" : "button"}
        className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        {label}
      </button>
    );
  }
};

export default EditOpportunity;
