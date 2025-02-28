import React from "react";
import { useNavigate } from "react-router-dom";
import TableEmploye from "./TableEmploye.jsx";
import { IoMdAddCircle } from "react-icons/io";

const Main = () => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/addEmployees");
  };

  return (
    <>
    <div className="flex flex-col h-screen p-7">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-center">EMPLOYEES</h1>
      </div>
      <div className="flex justify-end mb-4">
      <IoMdAddCircle 
        size={40}
        onClick={handleAddClick}
        />
      </div>
      <div className="flex-1 ">
        <TableEmploye />
      </div>
    </div>
    </>
  );
};

export default Main;
