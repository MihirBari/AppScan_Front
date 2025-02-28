import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import FilterModal from "./FilterModal";
import ExportTable from "./ExportTable";
import { Loader } from "../loader";
import { AuthContext } from "../../context/AuthContext";
import { FaFilter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [exportModalIsOpen, setExportModalIsOpen] = useState(false);
  const [aggregates, setAggregates] = useState({});
  const [filters, setFilters] = useState({
    type: "",
    licenseType: "",
    licenseFrom: "",
    licenseTo: "",
  });

const navigate = useNavigate();


  const calculateAggregates = (data) => {
    const totalEntity = new Set(data.map((user) => user.customer_entity)).size;
    const totalLicenseType = new Set(data.map((user) => user.License_type))
      .size;
    const totalType = new Set(data.map((user) => user.type)).size;
    const totalValue = data.reduce((acc, user) => acc + user.value, 0);

    return {
      TotalEntity: totalEntity,
      TotalLicenseType: totalLicenseType,
      TotalType: totalType,
      TotalValue: totalValue,
    };
  };

  const onApplyFilters = (filteredData) => {
    setFilteredUsers(filteredData);
    setAggregates(calculateAggregates(filteredData));
    setFilterModalIsOpen(false);
  };

  const initialFilters = {
    type: "",
    LicenseType: "",
    licenseFrom: "",
    licenseTo: "",
  };

  const handleCiFilterClick = () => {
    setFilterModalIsOpen(true);
  };

  const handleRowClick = (userId) => {
    navigate(`/Summary/view/${userId}`); // Redirect to the desired page
  };

  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Opportunity/showOpportunity`,
          {
            signal: signal,
            params: filters,
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            },
          }
        );
        setUsers(response.data.products);
        const initialAggregates = calculateAggregates(response.data.products);
        setAggregates(initialAggregates);
        setFilteredUsers(response.data.products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
        setLoading(false);
      }
      return () => {
        controller.abort(); // Cancel the request if the component unmounts
      };
    };

    fetchOpportunities();
  }, [filters, currentUser]);

  const formatIndianNumber = (value) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  return (
    <>
      <div className="h-screen flex-1 p-7">
        <div>
          <h1 className="text-2xl font-semibold text-center">Summary</h1>
        </div>
        <div style={{ float: "right" }}>
          <FaFilter
            size={40}
            style={{ marginLeft: "25px" }}
            onClick={handleCiFilterClick}
            color="black"
          />
          <FilterModal
            isOpen={filterModalIsOpen}
            onClose={() => setFilterModalIsOpen(false)}
            onApplyFilters={onApplyFilters}
            filters={filters}
            resetFilters={() => setFilters(initialFilters)}
          />
          {/* <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleExportClick}
        >
          Export
        </button> */}
          <ExportTable
            data={filteredUsers}
            isOpen={exportModalIsOpen}
            onRequestClose={() => setExportModalIsOpen(false)}
          />
        </div>

        <div>
          {loading ? (
            <Loader />
          ) : users.length === 0 ? (
            <div className="text-xl font text-center">Please add details.</div>
          ) : (
            <div>
              <div
                style={{
                  overflowX: "auto",
                  width: "100%",
                  backgroundColor: "#ffff",
                }}
              >
                <table className="table-auto" style={{ width: "100%" }}>
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th
                        className="border px-4 py-2"
                        style={{ border: " solid #000000" }}
                      >
                        Entity
                      </th>
                      <th
                        className="border px-4 py-2"
                        style={{ border: " solid #000000" }}
                      >
                        Opportunity Type
                      </th>
                      <th
                        className="border px-4 py-2"
                        style={{ border: " solid #000000" }}
                      >
                        License Type
                      </th>
                      <th
                        className="border px-4 py-2"
                        style={{ border: " solid #000000" }}
                      >
                        Status
                      </th>
                      <th
                        className="border px-4 py-2"
                        style={{ border: " solid #000000" }}
                      >
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#ffff" }}>
                    {Array.isArray(users) &&
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td
                            className="border px-4 py-2"
                            style={{ border: " solid #000000" }}
                            onClick={() => handleRowClick(user.id)} 
                          >
                            {user.customer_entity}
                          </td>
                          <td
                            className="border px-4 py-2"
                            style={{ border: " solid #000000" }}
                          >
                            {user.type}
                          </td>
                          <td
                            className="border px-4 py-2"
                            style={{ border: " solid #000000" }}
                          >
                            {user.License_type}
                          </td>
                          <td
                            className="border px-4 py-2"
                            style={{ border: " solid #000000" }}
                          >
                            {user.status}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              border: " solid #000000",
                            }}
                            className="border px-4 py-2"
                          >
                            {formatIndianNumber(user.value)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table className="table-auto" style={{ width: "100%" }}>
                  <tbody>
                    <tr
                      style={{ textAlign: "center", backgroundColor: "#ffff" }}
                    >
                      <th className="px-4 py-2">Total Customer</th>
                      <th className="px-4 py-2">Total Licenses</th>
                      {/* <th className="px-4 py-2">Total License Type</th> */}
                      <th className="px-4 py-2">Total Value</th>
                    </tr>
                    <tr
                      style={{ textAlign: "center", backgroundColor: "#ffff" }}
                    >
                      <td
                        className="border px-4 py-2"
                        style={{ border: " solid #000000" }}
                      >
                        {aggregates.TotalEntity}
                      </td>
                      <td
                        className="border px-4 py-2"
                        style={{ border: " solid #000000" }}
                      >
                        {aggregates.TotalType}
                      </td>
                      {/* <td className="border px-4 py-2">{aggregates.TotalLicenseType}</td> */}
                      <td
                        className="border px-4 py-2"
                        style={{ border: " solid #000000" }}
                      >
                        {formatIndianNumber(aggregates.TotalValue)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
