// Setup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PinDropIcon from "@mui/icons-material/PinDrop";

function Setup() {
  const navigate = useNavigate();

  const buttons = [
    { title: "Group", sub: "Group, Type Id", icon: <PinDropIcon />, path: "/setup/group" },
    { title: "Type", sub: "Type Name", icon: <PinDropIcon />, path: "/setup/type" },
    { title: "Location", sub: "Location, IP address", icon: <PinDropIcon />, path: "/setup/location" }
    // Add other buttons if needed
  ];

  return (
    <div className="w-full h-full relative">
      <div
        className="absolute h-[150px] w-[150px] rounded-full transition-transform ease-linear"
        style={{ top: "200px", left: "200px" }}
      ></div>

      <div className="h-full p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-transparent">
        {buttons.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer flex flex-row p-4 gap-4 items-center bg-white/30 backdrop-blur-[15px] border border-white/30 rounded-lg transition-transform hover:bg-blue-100/50 hover:shadow-lg hover:border-blue-500"
            onClick={() => navigate(item.path)} 
          >
            <span className="text-blue-500 text-3xl transition-transform transform group-hover:rotate-45 group-hover:scale-125 group-hover:translate-x-2">
              {item.icon}
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-lg">{item.title}</span>
              <span className="text-gray-500 text-sm">{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Setup;
