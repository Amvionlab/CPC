// Setup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PinDropIcon from "@mui/icons-material/PinDrop"; // Location icon
import SecurityIcon from "@mui/icons-material/Security"; // Access Matrix icon
import AddBoxIcon from "@mui/icons-material/AddBox"; // Single Asset Add icon
import FileUploadIcon from "@mui/icons-material/FileUpload"; // Multiple Asset Import via CSV icon
import DevicesIcon from "@mui/icons-material/Devices"; // Asset Group icon
import CategoryIcon from "@mui/icons-material/Category"; // Asset Type icon
import LanguageIcon from "@mui/icons-material/Language"; // IP Details icon
import TemplateIcon from "@mui/icons-material/InsertDriveFile"; // Template icon
import PeopleIcon from "@mui/icons-material/People"; // Employee icon
import BusinessIcon from "@mui/icons-material/Business"; // Vendor icon
import PersonIcon from "@mui/icons-material/Person"; // User icon
import EmailIcon from "@mui/icons-material/Email"; // Email Config icon

function Setup() {
  const navigate = useNavigate();

  const buttons = [
    { title: "Access Matrix", sub: "User's Access Matrix", icon: <SecurityIcon />, path: "/setup/access" },
    { title: "Group", sub: "Asset Group", icon: <DevicesIcon />, path: "/setup/group" },
    { title: "Type", sub: "Asset Type and detail", icon: <CategoryIcon />, path: "/setup/type" },
    { title: "Location", sub: "Location Name", icon: <PinDropIcon />, path: "/setup/location" },
    { title: "IP Details", sub: "Location Name, IP details ( range ) ", icon: <LanguageIcon />, path: "/setup/ip_address" },
    { title: "Template", sub: "Template for Asset Types", icon: <TemplateIcon />, path: "/setup/template" },
    { title: "Asset Add", sub: "Single Asset Add", icon: <AddBoxIcon />, path: "/setup/asset_add" },
    { title: "Asset Import", sub: "Multiple Asset Import", icon: <FileUploadIcon />, path: "/setup/asset_import" },
    { title: "Employee", sub: "Employee's Name and Details", icon: <PeopleIcon />, path: "/setup/employee" },
    { title: "Vendor", sub: "Vendor's Name and Details", icon: <BusinessIcon />, path: "/setup/vendor" },
    { title: "User", sub: "Software Users", icon: <PersonIcon />, path: "/setup/user" },
    { title: "Email Config", sub: "Email Configuration and Setup", icon: <EmailIcon />, path: "/setup/smtp" },
  
  ];

  return (
    <div className="w-full h-full relative">
      <div className="h-full p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 bg-transparent">
        {buttons.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer flex flex-row p-4 gap-4 items-center bg-box border-2 border-box rounded-xl transition-transform hover:shadow-lg hover:border-prime"
            onClick={() => navigate(item.path)} 
          >
            <span className="text-flo text-4xl transition-transform transform group-hover:rotate-180 group-hover:scale-110 group-hover:translate-x-1 group-hover:text-prime motion-reduce:transform-none">
              {item.icon}
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-prime text-lg">{item.title}</span>
              <span className="text-gray-500 text-sm">{item.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Setup;
