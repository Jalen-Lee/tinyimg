import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import Guide from './components/guide'

// import "./App.css";

function App() {


  return (
    <main id="tinyimg">
      <Guide/>
    </main>
  );
}

export default App;
