// Setup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PinDropIcon from "@mui/icons-material/PinDrop"; // location
import SecurityIcon from "@mui/icons-material/Security"; // For Access Matrix
import AddBoxIcon from "@mui/icons-material/AddBox"; // For Single Asset Add
import FileUploadIcon from "@mui/icons-material/FileUpload"; // For Multiple Asset Import via CSV
import DevicesIcon from "@mui/icons-material/Devices"; // For Asset Group
import CategoryIcon from "@mui/icons-material/Category"; // For Asset Type
import LanguageIcon from "@mui/icons-material/Language"; // For IP Details
import TemplateIcon from "@mui/icons-material/InsertDriveFile"; // For Template
import PeopleIcon from "@mui/icons-material/People"; // For Employee
import BusinessIcon from "@mui/icons-material/Business"; // For Vendor
import PersonIcon from "@mui/icons-material/Person"; // For User
import EmailIcon from "@mui/icons-material/Email"; // For Email Config

function Setup() {
  const navigate = useNavigate();

  const buttons = [
    { title: "Access Matrix", sub: "User's Access Matrix", icon: <SecurityIcon />, path: "/setup/access" },
    { title: "Group", sub: "Asset Group Name", icon: <DevicesIcon />, path: "/setup/group" },
    { title: "Type", sub: "Asset Type Name, Group Name", icon: <CategoryIcon />, path: "/setup/type" },
    { title: "Location", sub: "Location Name", icon: <PinDropIcon />, path: "/setup/location" },
    { title: "IP Details", sub: "Location Name, IP details ( range ) ", icon: <LanguageIcon />, path: "/setup/ip_address" },
    { title: "Template", sub: "Template for Asset Types", icon: <TemplateIcon />, path: "/setup/location" },
    { title: "Asset Add", sub: "Single Asset Add", icon: <AddBoxIcon />, path: "/setup/location" },
    { title: "Asset Import", sub: "Multiple Asset Import", icon: <FileUploadIcon />, path: "/setup/location" },
    { title: "Employee", sub: "Employee's Name and Details", icon: <PeopleIcon />, path: "/setup/employee" },
    { title: "Vendor", sub: "Vendor's Name and Details", icon: <BusinessIcon />, path: "/setup/location" },
    { title: "User", sub: "Software Users", icon: <PersonIcon />, path: "/setup/location" },
    { title: "Email Config", sub: "Location Name", icon: <EmailIcon />, path: "/setup/location" },
    // Add other buttons if needed
  ];

  return (
    <div className="w-full h-full relative">
      <div
        className="absolute h-[150px] w-[150px] rounded-full transition-transform ease-linear"
        style={{ top: "200px", left: "200px" }}
      ></div>

      <div className="h-full p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-transparent">
        {buttons.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer flex flex-row p-4 gap-4 items-center bg-box backdrop-blur-[15px] border border-white/30 rounded-lg transition-transform hover:shadow-lg hover:border-blue-500"
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
