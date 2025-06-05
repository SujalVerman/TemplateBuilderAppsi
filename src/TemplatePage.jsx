import React, { useState } from "react";
import { FaEye } from "react-icons/fa";

export default function TemplatePage() {
  const [hovered, setHovered] = useState(null);

  const templates = [
    {
      name: "Creative Agency",
      image: "/img1.jpg",
    },
    {
      name: "Personal Portfolio",
      image: "/img2.jpg",
    },
    {
      name: "Photography Studio",
      image: "https://colorlib.com/wp/wp-content/uploads/sites/2/photon-free-template.jpg",
    },
    {
      name: "Restaurant Landing",
      image: "/img3.jpg",
    },
    {
      name: "Web Hosting",
      image: "https://www.templateshub.net/uploads/hostingthumb.jpg",
    },
    {
      name: "App Startup",
      image: "https://colorlib.com/wp/wp-content/uploads/sites/2/appson-free-template.jpg",
    },
    {
      name: "SaaS Product",
      image: "https://www.templateshub.net/uploads/1575087015%20Stella%20Orre%20-%20Architecture%20And%20Interior%20HTML%20Template.jpg",
    },
    {
      name: "Travel Blog",
      image: "https://colorlib.com/wp/wp-content/uploads/sites/2/travelo-free-template.jpg",
    },
  ];
  const builder = () => {
    window.location.href = "/builder";
  }

  return (
    <div className="min-h-screen w-screen -ml-4 -mb-4 bg-[#f7f9fc] text-gray-800 px-6 py-20 font-sans">
      {/* Heading */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          🚀 Explore AI-Powered Templates
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Launch stunning websites in just a few clicks.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {templates.map((template, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            className={`relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
              hovered === idx ? "ring-2 ring-indigo-400/20" : ""
            }`}
          >
            <img
              src={template.image}
              alt={template.name}
              className="w-full h-52 object-cover"
              loading="lazy"
              onError={(e) => (e.target.src = "https://via.placeholder.com/400x300")}
            />

            <div className="p-5">
              <h2 className="text-xl font-semibold text-center text-gray-800">
                {template.name}
              </h2>

              <div className="mt-6 flex justify-center">
                <button onClick={builder} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-full shadow hover:from-indigo-600 hover:to-purple-600 transition-all duration-200">
                  <FaEye className="animate-pulse" />
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
