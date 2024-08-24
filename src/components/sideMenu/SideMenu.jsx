import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faImages,
  faFolder,
  faDownload,
  faComment,
  faForward,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import logo from "../../image/sampat-logo.png";
import sampatName from "../../image/sampatName.png";

const SideMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { title: "Asset Management", icon: faThLarge, to: "/management" },
    { title: "Approval Management", icon: faImages, to: "#" },
    { title: "Assets Lifecycle", icon: faFolder, to: "#" },
    { title: "Reports", icon: faDownload, to: "#" },
    { title: "Setup", icon: faComment, to: "#" },
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
        style={{ width: isExpanded ? "12.5rem" : "5rem" }}
      >
        <nav className="h-full">
          <ul className="flex flex-col h-full gap-3">
          <li className="">
              <Link
                to="/"
                className={`${
                  isExpanded ? "justify-start " : "justify-center"
                } flex items-center transition-none whitespace-nowrap gap-1 p-2  hover:text-prime text-white text-lg rounded-lg  active:bg-white focus-visible:bg-white`}
              >
                {!isExpanded && <img src={logo} width="40px" alt="" />}

                {isExpanded && (
                  <img
                    className=""
                    src={sampatName}
                    alt=""
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
                    isExpanded ? "justify-start " : "justify-center"
                  } flex items-center whitespace-nowrap gap-1 p-3 m-1 mr-2 hover:bg-white hover:text-prime text-white text-sm rounded-lg transition-all duration-500 ease-in-out active:bg-white focus-visible:bg-white`}
                >
                  <FontAwesomeIcon className="text-md mr-2" icon={icon} />
                  {!isExpanded && hoveredItem === title && (
                    <p className="absolute z-50 left-20 px-2 rounded-md text-sm bg-prime text-white">
                      {title}
                    </p>
                  )}
                  {isExpanded && (
                    <p className="text-xs transition-opacity duration-1000">
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
                  } flex items-center gap-1 p-3 m-1 mr-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white`}
                  onClick={() => setIsExpanded((prev) => !prev)}
                >
                  <FontAwesomeIcon
                    className="transition-all duration-1000 text-md mr-2"
                    icon={faForward}
                    style={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />

                  {isExpanded && (
                    <p className="text-sm transition-opacity justify-right ">Collapse</p>
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
