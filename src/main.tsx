import "./i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import createAppMenu from "./utils/menu";
import App from "./App";
import "@radix-ui/themes/styles.css";
import useAppStore from "./store/app.store";

useAppStore.getState().loadSettings();
// createAppMenu();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
