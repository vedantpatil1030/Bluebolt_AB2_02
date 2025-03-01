import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import Navbar from "./components/Navbar";

export default function App() {
  const [components, setComponents] = useState([]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar with UI Components */}
        <Sidebar setComponents={setComponents} />

        {/* Main Canvas Area */}
        <Canvas components={components} setComponents={setComponents} />
      </div>
    </div>
  );
}
