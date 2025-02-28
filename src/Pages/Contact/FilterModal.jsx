import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import API_BASE_URL from "../../config";
import Select from "react-select";
Modal.setAppElement("#root");

const FilterModal = ({ isOpen, onClose, onApplyFilters, resetFilters }) => {
  const [city, setCity] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [customerEntity, setCustomerEntity] = useState([]);
  const [customerEntityOptions, setCustomerEntityOptions] = useState([]);
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCityOptions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/contact/city`, {
          withCredentials: true,
          signal,
        });
        setCityOptions(
          response.data.map((city) => ({ value: city.city, label: city.city }))
        );
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          setErrorMessage("Error fetching city options.");
        }
      }
    };

    fetchCityOptions();

    const fetchCustomerEntities = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/Contact/customerentity`,
          {
            withCredentials: true,
            signal,
          }
        );
        setCustomerEntityOptions(
          response.data.map((entity) => ({
            value: entity.customer_entity,
            label: entity.customer_entity,
          }))
        );
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          setErrorMessage("Error fetching customer entities.");
        }
      }
    };

    fetchCustomerEntities();

    return () => {
      controller.abort();
    };
  }, []);

  const applyFilters = async () => {
    try {
      const params = {};
      if (city.length > 0) {
        params.city = city.map((c) => c.value);
      }
      if (customerEntity.length > 0) {
        params.customerEntity = customerEntity;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/contact/showCustomer`,
        {
          withCredentials: true,
          params,
        }
      );

      onApplyFilters(response.data.products || response.data);

      localStorage.setItem(
        "customerFilter",
        JSON.stringify({
          city: city.map((c) => c.value),
          customerEntity,
        })
      );
    } catch (error) {
      setErrorMessage("Error applying filters.");
    }
  };

  const retrieveAndSetFilters = async () => {
    const storedFilters = localStorage.getItem("customerFilter");
    if (storedFilters) {
      const { city: storedCity, customerEntity: storedCustomerEntity } =
        JSON.parse(storedFilters);

      setCity(
        storedCity ? storedCity.map((c) => ({ value: c, label: c })) : []
      );
      setCustomerEntity(storedCustomerEntity || []);
      setShouldApplyFilters(true);
    }
  };

  useEffect(() => {
    retrieveAndSetFilters();
  }, []);

  useEffect(() => {
    if (shouldApplyFilters) {
      applyFilters();
      setShouldApplyFilters(false);
    }
  }, [shouldApplyFilters]);

  const handleResetFilters = () => {
    setCity([]);
    setCustomerEntity([]);
    resetFilters();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          zIndex: 9999,
        },
        content: {
          height: "50%",
          margin: "auto",
        },
      }}
    >
      <div className="filter-modal">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex flex-wrap">
          <Select
            isMulti
            options={customerEntityOptions}
            value={customerEntityOptions.filter((option) =>
              customerEntity.includes(option.value)
            )}
            onChange={(selectedOptions) =>
              setCustomerEntity(
                selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
              )
            }
            placeholder="Select Customer Entity"
            className="p-2 w-full md:w-1/4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
          />
          <Select
            isMulti
            options={cityOptions}
            value={city}
            onChange={(selectedOptions) => setCity(selectedOptions || [])}
            placeholder="Select City"
            className="p-2 w-full md:w-1/4 rounded border border-gray-300 focus:outline-none focus:border-blue-500 ml-2 m-2"
          />
        </div>

        <div className="mt-2">
          <button
            onClick={() => {
              applyFilters();
              onClose();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            style={{ marginLeft: "10px" }}
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            style={{ marginLeft: "10px" }}
          >
            Clear Filters
          </button>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;