import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Theme as RadixTheme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import './index.css';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement,{
  onCaughtError(error){
    console.log("React onCaughtError",error)
  },
  onUncaughtError(error){
    console.log("React onUncaughtError",error)
  }
}).render(
  <React.StrictMode>
    <RadixTheme>
      <App />
    </RadixTheme>
  </React.StrictMode>,
);
