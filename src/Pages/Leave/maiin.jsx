import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "./tableLeave";
import { IoMdAddCircle } from "react-icons/io";
import LeaveTable from "./LeaveTable";

const Maiin = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/addLeave");
  };

  return (
    <>
      <div className=" flex flex-col h-screen p-7">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-center">
            Leave Applications
          </h1>
        </div>
        <div className="flex justify-end mb-4">
          <IoMdAddCircle size={40} onClick={handleAddClick} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Table />
          {/* <LeaveTable /> */}
        </div>
      </div>
    </>
  );
};

export default Maiin;
