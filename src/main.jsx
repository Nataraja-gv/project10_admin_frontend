import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import { ToastContainer } from "react-toastify";
import Providers from "./lib/providers.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Providers>
      <App />
      <ToastContainer position="top-center" autoClose={2000} />
    </Providers>
  </BrowserRouter>
);
