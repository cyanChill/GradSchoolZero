import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalProvider } from "./GlobalContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Give access the GlobalContext to our whole app*/}
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>
);
