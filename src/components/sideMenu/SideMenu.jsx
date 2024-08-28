import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faForward,
  faCheckCircle,  // Approval
  faSyncAlt,      // Lifecycle (Alternative: faLifeRing)
  faFileAlt,      // Report
  faWrench,
  faTachometerAlt  // Setup
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";  // Import useLocation
import logo from "../../image/S1.svg";
import sampatName from "../../image/S2.svg";

const SideMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();  // Get the current path

  const menuItems = [
    { title: "Dashboard", icon: faTachometerAlt, to: "/dashboard" },
    { title: "Asset Inventory", icon: faBox, to: "/management" },
    { title: "Approval Handling", icon: faCheckCircle, to: "#" },
    { title: "Assets Lifecycle", icon: faSyncAlt, to: "#" },
    { title: "Reports", icon: faFileAlt, to: "#" },
    { title: "Setup Wizard", icon: faWrench, to: "/setup" },
  ];

  const handleMouseEnter = (title) => {
    setHoveredItem(title);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div className={isExpanded ? "sb-expanded" : ""}>
      <aside
        className="relative inset-y-0 z-50 h-full text-sui left-0 py-4 px-2 bg-prime transition-all duration-500 ease-in-out"
        style={{ width: isExpanded ? "12rem" : "4.5rem" }}
      >
        <nav className="h-full">
          <ul className="flex flex-col h-full gap-3">
            <li className="">
              <Link
                to="/"
                className={`${
                  isExpanded ? "justify-start" : "justify-center"
                } flex items-center transition-none whitespace-nowrap gap-2 p-2 pr-3 hover:text-prime text-white text-lg rounded-lg active:bg-white focus-visible:bg-white`}
              >
                <img
                  src={logo}
                  width="40px"
                  height="50px"  // Set a fixed height
                  alt="Logo"
                  style={{ minWidth: "40px", minHeight: "50px", textAlign: "center" }}
                />
                {isExpanded && (
                  <img
                    className=""
                    src={sampatName}
                    alt="Sampat Name"
                    style={{
                      minWidth: "110px",
                      height: "40px",  
                    }}
                  />
                )}
              </Link>
            </li>

            {menuItems.map(({ title, icon, to }) => (
              <li key={title}>
                <Link
                  to={to}
                  onMouseEnter={() => handleMouseEnter(title)}
                  onMouseLeave={handleMouseLeave}
                  className={`${
                    isExpanded ? "justify-start" : "justify-center"
                  } flex items-center whitespace-nowrap gap-2 p-3 m-1 mr-2 rounded-lg transition-all duration-500 ease-in-out 
                    ${location.pathname === to ? "bg-white text-prime" : "hover:bg-white hover:text-prime text-white"}`}
                >
                  <FontAwesomeIcon
                    className="text-md"
                    icon={icon}
                    style={{ minWidth: "24px", textAlign: "center" }}
                  />
                  {!isExpanded && hoveredItem === title && (
                    <p className="absolute z-50 left-20 p-1 rounded-md text-sm bg-purple-500 text-white">
                      {title}
                    </p>
                  )}
                  {isExpanded && (
                    <p className="text-xs font-medium transition-all duration-500 ease-in-out" style={{ minWidth: "100px" }}>
                      {title}
                    </p>
                  )}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="#"
                className={`${
                  isExpanded ? "justify-start" : "justify-center"
                } flex items-center gap-2 p-3 m-1 mt-10 mr-2 text-white rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white`}
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                <FontAwesomeIcon
                  className="transition-all duration-300 text-sm"
                  icon={faForward}
                  style={{
                    minWidth: "24px",
                    textAlign: "center",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
                {isExpanded && (
                  <p className="text-xs font-medium transition-opacity" style={{ minWidth: "100px" }}>
                    Collapse
                  </p>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SideMenu;
