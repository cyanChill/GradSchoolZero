import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { GlobalProvider } from "./GlobalContext";

ReactDOM.render(
  <React.StrictMode>
    {/* Give access the GlobalContext to our whole app*/}
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
