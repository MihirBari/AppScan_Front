import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import { AuthContext } from "../../context/AuthContext";
import { Loader } from "../loader";

const Main = () => {
  const [restDetails, setRestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchLeaveDetails = async () => {
      try {


        const restDetailResponse = await axios.post(`${API_BASE_URL}/api/user/RestDetail`, {
          name: currentUser.name,
          surname: currentUser.surname,
          withCredentials:true
        });
        setRestDetails(restDetailResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching leave details:", error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchLeaveDetails();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <Loader /> ;
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center p-7">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center mb-6">Summary</h1>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">User Information</h2>
          <p className="text-lg mb-2"><span className="font-bold">Name:</span> {currentUser.name} {currentUser.surname}</p>
          <p className="text-lg mb-2"><span className="font-bold">Email:</span> {currentUser.email}</p>
          <p className="text-lg mb-2"><span className="font-bold">Team:</span> {currentUser.team}</p>
          {restDetails && (
            <>
              <p className="text-lg mb-2"><span className="font-bold">Designation:</span> {restDetails.designation}</p>
              <p className="text-lg mb-2"><span className="font-bold">Joining Date:</span> {formatDate(restDetails.joining_date)}</p>
              <p className="text-lg mb-2"><span className="font-bold">DOB:</span> {formatDate(restDetails.DOB)}</p>
              <p className="text-lg mb-2"><span className="font-bold">Holidays :</span> {(restDetails.holidays_taken)} / 12</p>
            </>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default Main;
