import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const EditCustomer = () => {
  const initialInputs = {
    customer_entity: "",
    email:"",
    address:"",
    city:"",
    state:"",
    website:""
  };

  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [inputs, setInputs] = useState(initialInputs);
  const [err, setError] = useState(null);
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  console.log("Inputs state:", inputs);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Contact/showOneCustomer/${id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`
            }
          }
        );
        const sellerData = response.data[0];
        console.log("Seller data:", sellerData); // Debugging
        if (sellerData) {
          setInputs({
            customer_entity: sellerData.customer_entity || '',
            email: sellerData.email || '',
            address: sellerData.address || '',
            city: sellerData.city || '',
            state: sellerData.state || '',
            website: sellerData.website || ''
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
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/Contact/editCustomer/${id}`,
        inputs, // Send the form data as the second argument
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      setInputs(initialInputs);
      toast.success("Updated successfully");
      navigate('/Customer');
    } catch (err) {
      console.error(err);
      toast.error("Failed to update seller");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Edit Contact
        </h2>
      </div>
      <div className="mt-8 sm:w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
         
          <form className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>{renderInput("customer_entity", "Name Of Customer Entity", "Name Of Customer Entity")} </div>
                  <div> {renderInput("email", "E-Mail", " E-Mail")}</div>
                  <div> {renderInput("address", "Address", " Address")}</div>
                  <div> {renderInput("city", "City", " City")}</div>
                  <div> {renderInput("state", "State", " State")}</div>
                  <div> {renderInput("website", "Website", " Website")}</div>
            </div>
  

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleSubmit}
                className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Update
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

};

export default EditCustomer;
