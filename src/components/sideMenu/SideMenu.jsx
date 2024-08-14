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

  return (
    <div className={isExpanded ? "sb-expanded" : ""}>
      <aside
        className="relative inset-y-0 h-full left-0 py-4 px-2 bg-gradient-to-b from-blue-300 via-purple-400 to-pink-400 transition-all duration-500 ease-in-out"
        style={{ width: isExpanded ? "12.5rem" : "5rem" }}
      >
        <nav className="h-full">
          <ul className="flex flex-col h-full gap-3">
            <li>
              <Link
                to="/management"
                className={`${
                  isExpanded ? "justify-start" : "justify-center"
                } flex items-center  whitespace-nowrap gap-1 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white`}
              >
                <FontAwesomeIcon className="text-2xl" icon={faThLarge} />
                {isExpanded && (
                  <p className="text-xs transition-opacity duration-1000">
                    Asset Management
                  </p>
                )}
              </Link>
            </li>
            <li>
              <a
                href="#"
                className={`${
                  isExpanded ? "justify-start" : "justify-center"
                } flex items-center whitespace-nowrap gap-1 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white`}
              >
                <FontAwesomeIcon className="text-2xl" icon={faImages} />
                {isExpanded && (
                  <p className="text-xs transition-opacity duration-1000">
                    Approval Management
                  </p>
                )}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`${
                  isExpanded ? "justify-start" : "justify-center"
                } flex items-center gap-1 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white  whitespace-nowrap hover:text-purple-500 active:bg-white focus-visible:bg-white`}
              >
                <FontAwesomeIcon className="text-2xl" icon={faFolder} />
                {isExpanded && (
                  <p className={`text-xs transition-all duration-1000`}>
                    Assets Lifecycle
                  </p>
                )}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`${
                  isExpanded ? "justify-start" : "justify-center"
                } flex items-end gap-1 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white`}
              >
                <FontAwesomeIcon className="text-2xl" icon={faDownload} />
                {isExpanded && (
                  <p className="text-xs transition-opacity duration-1000">
                    Reports
                  </p>
                )}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`${
                  isExpanded ? "justify-start" : "justify-center"
                } flex items-center gap-1 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white`}
              >
                <FontAwesomeIcon className="text-2xl" icon={faComment} />
                {isExpanded && (
                  <p className="text-xs transition-opacity duration-1000">
                    Setup
                  </p>
                )}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`${
                  isExpanded ? "justify-start" : "justify-center"
                } flex items-center gap-1 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white`}
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                <FontAwesomeIcon
                  className="transition-all duration-1000"
                  icon={faChevronRight}
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
                {isExpanded && (
                  <p className="text-base transition-opacity duration-1000">
                    Collapse
                  </p>
                )}
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SideMenu;
