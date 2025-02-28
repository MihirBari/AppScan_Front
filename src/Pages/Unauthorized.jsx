import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{textAlign:'center', margin:'100px'}}>
      <h1>Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <p>Contact <b>MIHIR BARI</b>😎😎</p>
      {/* <Link to="/Profile">
      <button
        className="group relative w-[100px] h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
           >
            Back to CRM
          </button>
      </Link> */}
    </div>
  );
};

export default Unauthorized;
