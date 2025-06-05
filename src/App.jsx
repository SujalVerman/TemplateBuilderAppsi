import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TemplatePage from "./TemplatePage";
import WebsiteBuilder from "./WebsiteBuilder";

export default function App() {
  return (
    <Router>
      <div>
        <nav className="flex space-x-4  bg-green-300 p-4 rounded-br-full rounded-bl-full top-0 z-50 drop-shadow-lg sticky">
          <Link to="/" className="text-white ml-12 text-xl border p-2 font-mono border-green-300 bg-green-500 rounded-xl hover:scale-105 duration-300">Templates</Link>
          <Link to="/builder" className="text-white text-xl border p-2 font-mono border-green-300 bg-green-500 rounded-xl hover:scale-105 duration-300">Website Builder</Link>
        </nav>
        <Routes>
          <Route path="/" element={<TemplatePage />} />
          <Route path="/builder" element={<WebsiteBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}
