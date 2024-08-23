import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faImages,
  faFolder,
  faDownload,
  faComment,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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
        className="relative inset-y-0 h-full left-0 py-4 px-2 bg-prime transition-all duration-500 ease-in-out"
        style={{ width: isExpanded ? "12.5rem" : "5rem" }}
      >
        <nav className="h-full">
          <ul className="flex flex-col h-full gap-3">
            {menuItems.map(({ title, icon, to }) => (
              <li key={title}>
                <Link
                  to={to}
                  onMouseEnter={() => handleMouseEnter(title)}
                  onMouseLeave={handleMouseLeave}
                  className={`${
                    isExpanded ? "justify-start " : "justify-center"
                  } flex items-center whitespace-nowrap gap-1 p-3 m- hover:bg-white hover:text-prime text-white text-sm rounded-lg transition-all duration-500 ease-in-out active:bg-white focus-visible:bg-white`}
                >
                  <FontAwesomeIcon className="text-2xl" icon={icon} />
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
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className={`${
                  isExpanded ? "justify-start" : "justify-center"
                } flex items-center gap-1 p-2 text-white text-lg rounded-md transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white`}
              >
                <FontAwesomeIcon
                  className="transition-all duration-1000"
                  icon={faChevronRight}
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SideMenu;
