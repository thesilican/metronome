import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/App.tsx";
import "./index.css";
import "sanitize.css";
import "@fontsource/rubik/400.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
