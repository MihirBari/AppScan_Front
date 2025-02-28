import React, { useContext, useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import "./style.css";
import { FaFilter } from "react-icons/fa6";
import { FaExclamationTriangle } from "react-icons/fa";
import FilterModal from "./filterModal.jsx";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { AuthContext } from "../../context/AuthContext.jsx";

const Main = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    customerEntity: "",
    status: "",
  });
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const savedTabIndex = localStorage.getItem("selectedTabIndex");
    if (savedTabIndex !== null) {
      setSelectedTabIndex(parseInt(savedTabIndex, 10));
    }
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/opportunity/sendAlert`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            }
          }
        );
        setAlerts(response.data.products);
        setFilteredUsers(response.data.products);
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    };

    fetchAlerts();
  }, [filters]);

  const acknowledgeAlert = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/Opportunity/acknowledge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`
        },
        body: JSON.stringify({ id }),
      });

      window.location.reload(); // Reload the page after acknowledgment
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const Remind = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/Opportunity/reminder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`
        },
        body: JSON.stringify({ id }),
      });

      window.location.reload(); // Reload the page after acknowledgment
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const PoLost = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/Opportunity/PoLost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`
        },
        body: JSON.stringify({ id }),
      });

      window.location.reload(); // Reload the page after PO lost
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData);
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
    customerEntity: "",
    status: "",
  };

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  const filterAlerts = (alerts, daysLeftRange) => {
    return alerts.filter(
      (alert) =>
        alert.daysLeft >= daysLeftRange[0] && alert.daysLeft <= daysLeftRange[1]
    );
  };

  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
    localStorage.setItem("selectedTabIndex", index);
  };

  const handleAlertClick = async (
    alert_entity,
    alert_description,
    alert_type,
    License_type
  ) => {
    console.log("clicked")
    try {
      const response = await axios.post(`${API_BASE_URL}/api/opportunity/editAlertOpportunity`, {
        alert_entity,
        alert_description,
        alert_type,
        License_type,
      });
      
      const { id } = response.data; // Assuming the backend returns an object with the id
  
      window.location.href = `/Opportunity/view/${id}`; // Redirect to the new URL
    } catch (error) {
      console.error("Error editing alert opportunity:", error);
    }
  };
  
  
  return (
    <div className="h-screen flex-1 p-7 ">
      <h1 className="text-2xl font-semibold text-center">Alerts</h1>
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
      <Tabs selectedIndex={selectedTabIndex} onSelect={handleTabChange}>
        <TabList>
          <Tab>Urgent</Tab>
          <Tab>Warning</Tab>
          <Tab>Reminder</Tab>
        </TabList>

        <TabPanel>
          {filterAlerts(filteredUsers, [0, 15]).length === 0 ? (
            <p className="text-xl p-7 text-center">No urgent alerts present</p>
          ) : (
            <div className="alert-container">
              {filterAlerts(filteredUsers, [0, 15]).map((alert) => (
                <div key={alert.id} className="alert-box shadow ">
                  <h2>
                    Urgent
                    {alert.acknowledge === "No" && (
                      <FaExclamationTriangle className="warning-icon" />
                    )}
                  </h2>
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
                    Opportunity for <b>{alert.alert_entity}</b> for{" "}
                    {alert.alert_description} in {alert.alert_type} for{" "}
                    <b>{alert.License_type} License Type</b> expiring in{" "}
                    <b>{alert.daysLeft} days</b> on {alert.license_to}
                  </p>
                  <div className="button-container">
                    <button
                      className="po-received-button"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      PO Won
                    </button>
                    <button
                      className="po-lost-button"
                      onClick={() => PoLost(alert.id)}
                    >
                      PO Lost
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabPanel>
        <TabPanel>
          {filterAlerts(filteredUsers, [16, 30]).length === 0 ? (
            <p className="text-xl p-7 text-center">No warning alerts present</p>
          ) : (
            <div className="alert-container">
              {filterAlerts(filteredUsers, [16, 30]).map((alert) => (
                <div key={alert.id} className="alert-box shadow ">
                  <h2>Warning</h2>
                  <p>
                    Opportunity for <b>{alert.alert_entity}</b> for{" "}
                    {alert.alert_description} in {alert.alert_type} for{" "}
                    <b>{alert.License_type} License Type</b> expiring in{" "}
                    <b>{alert.daysLeft} days</b> on {alert.license_to}
                  </p>
                  <div className="button-container">
                  <button
                    className="po-received-button"
                    onClick={() => Remind(alert.id)}
                  >
                    Remind Me Later
                  </button>
                  <button
                      className="po-received-button"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      PO Won
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabPanel>
        <TabPanel>
          {filterAlerts(filteredUsers, [31, 45]).length === 0 ? (
            <p className="text-xl p-7 text-center">No reminder alerts present</p>
          ) : (
            <div className="alert-container">
              {filterAlerts(filteredUsers, [31, 45]).map((alert) => (
                <div key={alert.id} className="alert-box shadow ">
                  <h2>Reminder</h2>
                  <p>
                    Opportunity for <b>{alert.alert_entity}</b> for{" "}
                    {alert.alert_description} in {alert.alert_type} for{" "}
                    <b>{alert.License_type} License Type</b> expiring in{" "}
                    <b>{alert.daysLeft} days</b> on {alert.license_to}
                  </p>
                  <button
                    className="po-received-button"
                    onClick={() => Remind(alert.id)}
                  >
                    Remind Me Later
                  </button>
                </div>
              ))}
            </div>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Main;
