import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faThLarge,
  faImages,
  faFolder,
  faDownload,
  faComment,
  faCog,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const SideMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={isExpanded ? "sb-expanded" : ""}>
      <aside
        className="relative inset-y-0 left-0 p-4 bg-gradient-to-b from-blue-300 via-purple-400 to-pink-400 transition-all duration-500 ease-in-out"
        style={{ width: isExpanded ? "12.5rem" : "5rem" }}
      >
        <nav className="h-full ">
          <ul className="flex flex-col  h-full gap-5">
            <li>
              <a
                href="#"
                className="flex items-center gap-2.5 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white"
              >
                <FontAwesomeIcon icon={faHome} />
                <span
                  className={`text-lg transition-opacity duration-300  ${
                    isExpanded ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  Dashboard
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2.5 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white"
              >
                <FontAwesomeIcon icon={faThLarge} />
                <span
                  className={`text-lg transition-opacity duration-300 ${
                    isExpanded ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  Explore
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2.5 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white"
              >
                <FontAwesomeIcon icon={faImages} />
                <span
                  className={`text-lg transition-opacity duration-300 ${
                    isExpanded ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  Slideshow
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2.5 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white"
              >
                <FontAwesomeIcon icon={faFolder} />
                <span
                  className={`text-lg transition-opacity duration-300 ${
                    isExpanded ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  Collections
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2.5 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span
                  className={`text-lg transition-opacity duration-300 ${
                    isExpanded ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  Downloads
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2.5 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white"
              >
                <FontAwesomeIcon icon={faComment} />
                <span
                  className={`text-lg transition-opacity duration-300 ${
                    isExpanded ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  Messages
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2.5 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white"
              >
                <FontAwesomeIcon icon={faCog} />
                <span
                  className={`text-lg transition-opacity duration-300 ${
                    isExpanded ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  Settings
                </span>
              </a>
            </li>
            <li className="">
              <a
                href="#"
                className="flex items-center gap-2.5 p-2 text-white text-lg rounded-lg transition-all duration-500 ease-in-out hover:bg-white hover:text-purple-500 active:bg-white focus-visible:bg-white"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                <FontAwesomeIcon
                  className="transition-all duration-700"
                  icon={faChevronRight}
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
                <span
                  className={`text-base transition-opacity duration-300 ${
                    isExpanded ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  Collapse
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SideMenu;
