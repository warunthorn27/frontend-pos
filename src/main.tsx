import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { InventorySuccessToastProvider } from "./component/ui/toast/inventory-success-toast/provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <InventorySuccessToastProvider>
        <App />
      </InventorySuccessToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
