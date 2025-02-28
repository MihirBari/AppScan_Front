import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import API_BASE_URL from "../../config";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AddEmployes = () => {
  const initialInputs = {
    contacts: [], // Initialize contacts array for multiple contacts
  };

  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const [inputs, setInputs] = useState(initialInputs);
  const [err, setError] = useState(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newContacts = [...inputs.contacts];
    if (!newContacts[index]) {
      newContacts[index] = {};
    }
    newContacts[index][name] = value;
    setInputs((prev) => ({
      ...prev,
      contacts: newContacts,
    }));
  };

  const addContact = () => {
    setInputs((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {
          id: "",
          name: "",
          surname: "",
          designation: "",
          joining_date: "",
          last_date: "",
          status: "",
          DOB: "",
          team: "",
          personal_email: "",
        },
      ],
    }));
  };

  const removeContact = (index) => {
    const newContacts = [...inputs.contacts];
    newContacts.splice(index, 1);
    setInputs((prev) => ({
      ...prev,
      contacts: newContacts,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Log the data to verify the team format before sending
      console.log("Data being sent:", inputs);
  
      // Send data to backend
      await axios.post(`${API_BASE_URL}/api/Employes/addEmployes`, inputs,
{withCredentials:true,}
      );
      setInputs(initialInputs);
      toast.success("Contacts created successfully");
      navigate("/Employees");
    } catch (err) {
      console.error(err);
      setError(err.response);
      toast.error("Failed to create Contacts");
    }
  };

  const teamOptions = [
    { value: "BigFix", label: "BigFix" },
    { value: "SolarWinds", label: "SolarWinds" },
    { value: "Tenable", label: "Tenable" },
    { value: "Armis", label: "Armis" },
  ];

  const handleClose = () => {
    setInputs(initialInputs);
    navigate("/Employees");
  };

  const handleMultiSelectChange = (selectedOptions, index) => {
    const newContacts = [...inputs.contacts];
    if (!newContacts[index]) {
      newContacts[index] = {};
    }
    newContacts[index].team = selectedOptions.map((option) => option.value);
    setInputs((prev) => ({
      ...prev,
      contacts: newContacts,
    }));
  };

  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Add Employees
        </h2>
      </div>
      <div className="mt-8 sm:w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {inputs.contacts.map((contact, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact {index + 1}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="ml-2 text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:underline"
                      >
                        Remove
                      </button>
                    )}
                  </label>
                  <div className="grid grid-rows-3 gap-4">
                    <div>
                      <input
                        type="number"
                        name="id"
                        required
                        onChange={(e) => handleChange(e, index)}
                        placeholder="Enter Employee ID"
                        value={contact.id}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="name"
                        required
                        onChange={(e) => handleChange(e, index)}
                        placeholder="Enter Name Of Employee"
                        value={contact.name}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="surname"
                        required
                        onChange={(e) => handleChange(e, index)}
                        placeholder="Enter Surname Of Employee"
                        value={contact.surname}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="designation"
                        onChange={(e) => handleChange(e, index)}
                        placeholder="Enter Designation Of Employee"
                        value={contact.designation}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="joining_date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Joining Date
                      </label>
                      <div>
                        <input
                          type="Date"
                          name="joining_date"
                          required
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Enter Joining Date Of Employee"
                          value={contact.joining_date}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="last_date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Date
                      </label>
                      <div>
                        <input
                          type="Date"
                          name="last_date"
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Enter Last Date Of Employee"
                          value={contact.last_date}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Employee Status
                      </label>
                      <div>
                        <select
                          name="status"
                          required
                          onChange={(e) => handleChange(e, index)}
                          value={contact.status} // Set value attribute to contact.designation
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]" // Increase height here
                        >
                          <option value="" disabled selected>
                            Select Option
                          </option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="DOB"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Employee Date of Birth
                      </label>
                      <div>
                        <input
                          type="Date"
                          name="DOB"
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Enter Date Of birth Of Employee"
                          value={contact.DOB}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]"
                        />
                      </div>
                    </div>

                    <div>
                    <label
                      htmlFor="team"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Team
                    </label>
                    <div className="mt-1">
                      <Select
                        isMulti
                        name="team"
                        options={teamOptions}
                        onChange={(selectedOptions) =>
                          handleMultiSelectChange(selectedOptions, index)
                        }
                        value={teamOptions.filter((option) =>
                          contact.team.includes(option.value)
                        )}
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>

                    <div>
                      <label
                        htmlFor="personal_email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Employee Personal Email
                      </label>
                      <div>
                        <input
                          type="email"
                          name="personal_email"
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Enter Personal Email Of Employee"
                          value={contact.personal_email}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-[40px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addContact}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                + Add Contact
              </button>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="submit"
                className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create
              </button>

              <button
                type="button"
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
};

export default AddEmployes;
