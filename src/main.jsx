// main.jsx — The entry point. React starts here.
// It mounts the <App /> component into the <div id="root"> in index.html

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
