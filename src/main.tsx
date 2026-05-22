import "@fontsource/rubik/400.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "sanitize.css";
import { App } from "./components/App.tsx";
import "./index.css";

const root = document.getElementById("root");
if (!root) {
	throw new Error("can't find root");
}
ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
