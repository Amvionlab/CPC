// Setup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security"; // Access Matrix icon
import DevicesIcon from "@mui/icons-material/Devices"; // Asset Group icon
import CategoryIcon from "@mui/icons-material/Category"; // Asset Type icon
import LanguageIcon from "@mui/icons-material/Language"; // IP Details icon
import TemplateIcon from "@mui/icons-material/InsertDriveFile"; // Template icon
import PeopleIcon from "@mui/icons-material/People"; // Employee icon
import BusinessIcon from "@mui/icons-material/Business"; // Vendor icon
import PersonIcon from "@mui/icons-material/Person"; // User icon
import EmailIcon from "@mui/icons-material/Email"; // Email Config icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
function Setup() {
  const navigate = useNavigate();

  const topics = {
    MAIN: [
      { title: "Access Matrix", sub: "User's Access Matrix", icon: <SecurityIcon />, path: "/setup/access" },
      { title: "Location", sub: "Location Name", icon: <LanguageIcon />, path: "/setup/location" },
      { title: "User", sub: "Software Users", icon: <PersonIcon />, path: "/setup/user" },
    ],
    ASSET: [
      { title: "Group", sub: "Asset Group", icon: <DevicesIcon />, path: "/setup/group" },
      { title: "Type", sub: "Asset Type and detail", icon: <CategoryIcon />, path: "/setup/type" },
      { title: "Template", sub: "Template for Asset Types", icon: <TemplateIcon />, path: "/setup/template" },
      { title: "Status", sub: "Asset Status and Sub status", icon: <CheckCircleIcon />, path: "/setup/status" },
      ],
    BASIC: [
      { title: "Employee", sub: "Employee's Name and Details", icon: <PeopleIcon />, path: "/setup/employee" },
      { title: "Vendor", sub: "Vendor's Name and Details", icon: <BusinessIcon />, path: "/setup/vendor" },
      { title: "Email Config", sub: "Email Configuration and Setup", icon: <EmailIcon />, path: "/setup/smtp" }
    ]
  };

  return (
    <div className="w-full h-full bg-second p-1 font-sui text-sm">
      <div className="h-full bg-box p-2">
      {Object.keys(topics).map((topic, index) => (
        <div key={topic} className="border-2 border-second rounded-lg bg-box p-4 mb-2">
          <h2 className="text-base font-bold text-prime mb-1">{topic}</h2>
          <div className="h-full p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
            {topics[topic].map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer flex flex-row p-4 gap-4 items-center bg-box border rounded-xl transition-transform hover:shadow "
                onClick={() => navigate(item.path)} 
              >
                <span
  className={`text-flo text-2xl transition-transform transform group-hover:translate-x-1  group-hover:scale-125`}
>
  {item.icon}
</span>

                <div className="flex flex-col transition-transform transform  group-hover:font-medium">
                  <span className="font-bold text-prime text-md group-hover:text-flo">{item.title}</span>
                  <span className="text-gray-500 text-xs">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
      </div>
  );
}

export default Setup;
