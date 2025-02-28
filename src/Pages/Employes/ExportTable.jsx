import React, { useState } from "react";
import Modal from "react-modal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
Modal.setAppElement("#root");

const ExportTable = ({ data, isOpen, onClose }) => {
  const [fileName, setFileName] = useState("");

  const handleDownload = (type) => {
    if (type === "excel") {
      downloadExcel();
    } else if (type === "pdf") {
      downloadPDF();
    }
  };

  const downloadExcel = () => {
    // Format data including date fields
    const formattedData = data.map(row => ({
      ...row,
      joining_date: formatDate(row.joining_date),
      last_date: formatDate(row.last_date),
      DOB: formatDate(row.DOB),
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    onClose();
  };
  
  // Helper function to format dates
  const formatDate = (date) => {
    if (!date) return ""; // Handle case when date is null or undefined
    const formattedDate = new Date(date);
    if (formattedDate.getTime() === new Date("1970-01-01T00:00:00Z").getTime()) {
      return ""; // Handle case of default date (1970-01-01)
    }
    const day = String(formattedDate.getDate()).padStart(2, '0');
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const year = formattedDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const headers = Object.keys(data[0] || {});
    const rows = data.map(row => headers.map(header => row[header]));

    doc.autoTable({
      head: [headers],
      body: rows,
    });

    doc.save(`${fileName}.pdf`);
    onClose();
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
          height: "30%",
          width: "70%",
          margin: "auto",
        },
      }}
    >
      <h2>Export Options</h2>
      <label>
        File Name {" "}: {" "}
        <input
          type="text"
          style={{ border: "1px solid #000", padding: "5px", borderRadius: "5px" }}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </label>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        style={{ marginLeft: "10px" }}
        onClick={() => handleDownload("excel")}
      >
        Download Excel
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        style={{ margin: "20px" }}
        onClick={onClose}
      >
        Close
      </button>
    </Modal>
  );
};

export default ExportTable;
