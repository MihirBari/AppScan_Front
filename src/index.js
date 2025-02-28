import React from "react";
import ReactDOM from "react-dom/client";  // Correct import
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

const root = document.getElementById("root") || document.createElement("div");
const reactRoot = ReactDOM.createRoot(root);  // Creating root using ReactDOM from react-dom/client

reactRoot.render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </Router>
  </React.StrictMode>
);
