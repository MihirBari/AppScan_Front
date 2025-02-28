import React, { useState } from "react";
import Modal from "react-modal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
Modal.setAppElement("#root");
const ExportTable = ({ data, isOpen, onRequestClose }) => {
  const [fileName, setFileName] = useState("");

  const handleDownload = (type) => {
    if (type === "excel") {
      downloadExcel();
    } else if (type === "pdf") {
      downloadPDF();
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    onRequestClose();
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
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
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
      {/* <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        style={{ margin: "20px" }}
        onClick={() => handleDownload("pdf")}
      >
        Download PDF
      </button> */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        style={{ margin: "20px" }}
        onClick={onRequestClose}
      >
        Close
      </button>
    </Modal>
  );
};

export default ExportTable;

