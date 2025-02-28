import React from "react";

import Table from "./tableUser";

const Maiin = () => {

  return (
    <>
      <div className="flex flex-col h-screen p-7">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-center">Users</h1>
        </div>
       
        <div className="flex-1 overflow-y-auto">
          <Table />
        </div>
      </div>
      
    </>
  );
};

export default Maiin;
