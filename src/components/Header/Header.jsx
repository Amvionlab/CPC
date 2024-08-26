import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  faBars,
  faBell,
  faGear,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserContext } from "../UserContext/UserContext";

function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [isInputVisible, setInputVisible] = useState(false);
  const handleIconClick = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleSettingsClick = () => {
    navigate("/password-change");
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const { user } = useContext(UserContext);

  return (
    <header className="border-b-2 shadow-md fixed shadow-gray-300 bg-second top-0 right-0 h-[8vh] w-full flex justify-between items-center">
      {/* Desktop Logo and Search */}
      <div className="hidden sm:flex items-center">
        <div
          className={`hidden sm:flex lg:flex absolute left-52 text-prime  p-2 rounded-full items-center justify-between transition-all duration-300 ${
            isInputVisible ? "w-[15vw] scale-80" : "w-10 scale-80"
          }`}
        >
          <FontAwesomeIcon
            className="text-xl text-prime cursor-pointer mr-2"
            icon={faSearch}
            onClick={() => setInputVisible(!isInputVisible)}
          />
          <div
            className={
              isInputVisible
                ? "p-1 rounded-full shadow-inner bg-box"
                : "bg-transparent"
            }
          >
            <input
              type="text"
              className={`bg-transparent text-prime outline-none text-xs ml-3 transition-all duration-1000 `}
              placeholder="Search Your Asset"
              style={{ transformOrigin: "left center" }} // Optional: To control the origin of the scale effect
              autoFocus={isInputVisible}
            />
          </div>
        </div>
      </div>

      {/* Desktop Icons for Settings, Notifications, and User */}
      <div className="text-white text-sm sm:flex gap-3 mr-2 my-auto hidden">
        {/* Settings */}
        <div
          title="Change Password"
          className="w-8 h-8 text-flo bg-box hover:bg-flo hover:text-box rounded-full shadow-inner  cursor-pointer flex items-center justify-center"
          onClick={handleSettingsClick}
        >
          <FontAwesomeIcon icon={faGear} />
        </div>
        {/* Notifications */}
        <div className="relative shadow-inner text-flo w-8 h-8 bg-box  hover:bg-flo hover:text-box rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faBell} />
          {/* <p className="absolute -top-1 -right-1 bg-flo text-black rounded-full w-4 h-4 flex items-center justify-center text-sm">
            3
          </p> */}
        </div>
        {/* User */}
        <div
          className="w-8 h-8 shadow-inner cursor-pointer text-flo bg-box hover:bg-flo hover:text-box rounded-full flex items-center justify-center"
          title="Log out"
          onClick={handleIconClick}
        >
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>
    </header>
  );
}

export default Header;
