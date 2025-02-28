import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SideNavBar from '../Sidebar/Navbar';
import LeaveDetail from './LeaveDetail';
import axios from 'axios';
import API_BASE_URL from "../../config";

const ViewLeave = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/Leave/showOneApplicationLeave/${id}`,
          { hwithCredentials:true,}
        );
        console.log('API Response:', response);
        setProduct(response.data[0]);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <SideNavBar />
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mb-4">
            {product && (
              <h1 className="text-2xl mt-8 font-semibold text-center">
                Leave Application of {product.name} {product.surname}
              </h1>
            )}
          </div>

          {product && <LeaveDetail product={product} />}
        </div>
      </div>
    </>
  );
};

export default ViewLeave;
