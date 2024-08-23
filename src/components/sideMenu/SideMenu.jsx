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
import logo from "../../image/sampat-logo.png";
import sampatName from "../../image/sampatName.png";
const SideMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        style={{ zIndex: 9999, position: "relative" }} // Added position: "relative"
        className={isExpanded ? "sb-expanded" : ""}
      >
        <aside
          className="relative top-0 inset-y-0 h-full left-0 px-2 bg-prime transition-all duration-500 ease-in-out"
          style={{ width: isExpanded ? "12.5rem" : "5rem" }}
        >
          <nav className="h-full">
            <ul className="flex flex-col h-full gap-3">
              <li className="">
                <Link
                  to="/"
                  className={`${
                    isExpanded ? "justify-start " : "justify-center"
                  } flex items-center whitespace-nowrap gap-1 p-2  hover:text-prime text-white text-lg rounded-lg transition-all duration-500 ease-in-out active:bg-white focus-visible:bg-white`}
                >
                  {!isExpanded && <img src={logo} width="40px" alt="" />}

                  {isExpanded && (
                    <img
                      className="transition-opacity duration-1000"
                      src={sampatName}
                      alt=""
                    />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/management"
                  onMouseEnter={() => setShow("Asset Management")}
                  onMouseLeave={() => setShow(false)}
                  className={`${
                    isExpanded ? "justify-start " : "justify-center"
                  } flex items-center whitespace-nowrap gap-1 p-2 hover:bg-white hover:text-prime text-white text-lg rounded-lg transition-all duration-500 ease-in-out active:bg-white focus-visible:bg-white`}
                >
                  <FontAwesomeIcon className="text-2xl" icon={faThLarge} />
                  {!isExpanded && show === "Asset Management" && (
                    <p className="absolute z-50  left-14 px-2 rounded-sm text-sm bg-prime text-white">
                      Asset Management
                    </p>
                  )}

                  {isExpanded && (
                    <p className="text-xs transition-opacity duration-1000">
                      Asset Management
                    </p>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  onMouseEnter={() => setShow("Approval Management")}
                  onMouseLeave={() => setShow(false)}
                  className={`${
                    isExpanded ? "justify-start " : "justify-center"
                  } flex items-center whitespace-nowrap gap-1 p-2 hover:bg-white hover:text-prime text-white text-lg rounded-lg transition-all duration-500 ease-in-out active:bg-white focus-visible:bg-white`}
                >
                  <FontAwesomeIcon className="text-2xl" icon={faImages} />
                  {!isExpanded && show === "Approval Management" && (
                    <p className="absolute z-50 left-14 bg-prime text-white border-1 border-black px-2 rounded-sm text-sm hover:text-white">
                      Approval Management
                    </p>
                  )}
                  {isExpanded && (
                    <p className="text-xs transition-opacity duration-1000">
                      Approval Management
                    </p>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  onMouseEnter={() => setShow("Assets Lifecycle")}
                  onMouseLeave={() => setShow(false)}
                  className={`${
                    isExpanded ? "justify-start " : "justify-center"
                  } flex items-center whitespace-nowrap gap-1 p-2 hover:bg-white hover:text-prime text-white text-lg rounded-lg transition-all duration-500 ease-in-out active:bg-white focus-visible:bg-white`}
                >
                  <FontAwesomeIcon className="text-2xl" icon={faFolder} />
                  {!isExpanded && show === "Assets Lifecycle" && (
                    <p className="absolute z-50 left-14 bg-prime px-2 rounded-sm text-sm text-white">
                      Assets Lifecycle
                    </p>
                  )}

                  {isExpanded && (
                    <p className={`text-xs transition-all duration-1000`}>
                      Assets Lifecycle
                    </p>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  onMouseEnter={() => setShow("Reports")}
                  onMouseLeave={() => setShow(false)}
                  className={`${
                    isExpanded ? "justify-start " : "justify-center"
                  } flex items-center whitespace-nowrap gap-1 p-2 hover:bg-white hover:text-prime text-white text-lg rounded-lg transition-all duration-500 ease-in-out active:bg-white focus-visible:bg-white`}
                >
                  <FontAwesomeIcon className="text-2xl" icon={faDownload} />
                  {!isExpanded && show === "Reports" && (
                    <p className="absolute z-50 left-14 bg-prime px-2 rounded-sm text-sm text-white">
                      Reports
                    </p>
                  )}

                  {isExpanded && (
                    <p className="text-xs transition-opacity duration-1000">
                      Reports
                    </p>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  onMouseEnter={() => setShow("Setup")}
                  onMouseLeave={() => setShow(false)}
                  className={`${
                    isExpanded ? "justify-start " : "justify-center"
                  } flex items-center whitespace-nowrap gap-1 p-2 hover:bg-white hover:text-prime text-white text-lg rounded-lg transition-all duration-500 ease-in-out active:bg-white focus-visible:bg-white`}
                >
                  <FontAwesomeIcon className="text-2xl" icon={faComment} />
                  {!isExpanded && show === "Setup" && (
                    <p className="absolute z-50 left-14 bg-prime text-white px-2 rounded-sm text-sm ">
                      Setup
                    </p>
                  )}

                  {isExpanded && (
                    <p className="text-xs transition-opacity duration-1000">
                      Setup
                    </p>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
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
                    <p className="text-base transition-opacity duration-1000"></p>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
};

export default SideMenu;
