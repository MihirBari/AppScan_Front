import React from "react";
import { useNavigate } from "react-router-dom";
import TableOpportunity from "./tableOpportunity";
import { IoMdAddCircle } from "react-icons/io";
import OpportunityTable from "./opportunityTable";

const Main = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/addOpportunity");
  };

  return (
    <>
    <div className="flex flex-col h-screen p-7">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-center">Opportunity</h1>
      </div>
      <div className="flex justify-end mb-4">
      
        <IoMdAddCircle 
        size={40}
        onClick={handleAddClick}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <TableOpportunity />
        {/* <OpportunityTable /> */}
      </div>
    </div>
    
     </>
  );
};

export default Main;
