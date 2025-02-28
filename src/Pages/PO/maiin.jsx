import React, { useContext, useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import "./style.css";
import FilterModal from "./filterModal.jsx";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext.jsx";
import { GrRevert } from "react-icons/gr";
import { FaCheck } from "react-icons/fa";
import { RxCircleBackslash } from "react-icons/rx";
import { FaFilter } from "react-icons/fa6";

const Main = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    designation: "",
    name: "",
  });
  const [popupAlerts, setPopupAlerts] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/opportunity/sendPo`,
          {
            withCredentials:true
          }
        );
        setAlerts(response.data.products);
        setFilteredUsers(response.data.products);
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    fetchAlerts();
  }, [filters, currentUser.accessToken]);

  useEffect(() => {
    const checkForPopupAlerts = () => {
      const alertsToPopup = alerts.filter(
        (alert) => alert.daysLeft === 1 && alert.acknowledge === "Yes"
      );
      setPopupAlerts(alertsToPopup);
    };

    checkForPopupAlerts();
  }, [alerts]);

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData);
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
    designation: "",
    name: "",
  };

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  const handleAlertClick = async (
    alert_entity,
    alert_description,
    alert_type,
    License_type
  ) => {
    console.log("clicked");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/opportunity/editAlertOpportunity`,
        {
          alert_entity,
          alert_description,
          alert_type,
          License_type,
        },
        {
          withCredentials:true
        }
      );

      const { id } = response.data; 

      window.location.href = `/Opportunity/view/${id}`; // Redirect to the new URL
    } catch (error) {
      console.error("Error editing alert opportunity:", error);
    }
  };

  const handleCorrectAlert = async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/opportunity/editedPOopportunity`,
        { id },
        {
          withCredentials:true
        }
      );
      if (response.status === 200) {
        console.log("Alert marked as correct.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error marking alert as correct:", error);
    }
  };

  const handleVisibleAlert = async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/opportunity/noShowPo`,
        { id },
        {
          withCredentials:true
        }
      );
      if (response.status === 200) {
        console.log("Alert marked as correct.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error marking alert as correct:", error);
    }
  };

  // Function to handle "Revert" button click
  const handleRevertAlert = async (id) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/opportunity/revertPO`,
        { id },
        {
          withCredentials:true
        }
      );
      if (response.status === 200) {
        console.log("Alert reverted successfully.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error reverting alert:", error);
    }
  };

  return (
    <div className="h-screen flex-1 p-7">
      <h1 className="text-2xl font-semibold text-center">PO</h1>
      <div>
        <FaFilter
          size={40}
          style={{ marginLeft: "25px" }}
          onClick={handleCiFilterClick}
        />
        <FilterModal
          isOpen={filterModalIsOpen}
          onClose={() => setFilterModalIsOpen(false)}
          onApplyFilters={onApplyFilters}
          filters={filters}
          resetFilters={() => setFilters(initialFilters)}
        />
      </div>
      {alerts.length === 0 ? (
        <p className="text-xl p-7 text-center">No alerts present</p>
      ) : (
        <div className="alert-container">
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            filteredUsers.map((alert) => (
              <div
                key={alert.id}
                className={`alert-box ${
                  alert.edited === "Yes" ? "bg-green-200" : ""
                }`}
              >
                <h2>PO WON!!</h2>
                <p
                  onClick={() =>
                    handleAlertClick(
                      alert.alert_entity,
                      alert.alert_description,
                      alert.alert_type,
                      alert.License_type
                    )
                  }
                >
                  PO of <b>{alert.alert_entity}</b> for{" "}
                  {alert.alert_description} in {alert.alert_type}{" "}
                  {alert.License_type} was won
                </p>
                <div className="button-container">
                  <FaCheck
                    title="Bookmark"
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => handleCorrectAlert(alert.id)}
                  />

                  <RxCircleBackslash
                  title="Hide"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => handleVisibleAlert(alert.id)}
                  />

                  <GrRevert 
                  title="Revert"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                  onClick={() => handleRevertAlert(alert.id)} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xl p-7 text-center">
              No filtered alerts present
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
