/**
 * Entry point of the DasakeMovies frontend application.
 * - Renders the root React component (`App`) into the DOM.
 * - Wraps the app with `BrowserRouter` for routing.
 * - Uses `React.StrictMode` to enable additional checks and warnings in development.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.scss";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
