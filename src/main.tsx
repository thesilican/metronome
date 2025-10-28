import "@fontsource/rubik/400.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "sanitize.css";
import { App } from "./components/App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
