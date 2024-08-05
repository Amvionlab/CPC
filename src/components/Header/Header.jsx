import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import sampatLogo from "../../image/sampatName.png";
import {
  faBars,
  faBell,
  faGear,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Side from "../Side/Side";
import { UserContext } from '../UserContext/UserContext';

function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleIconClick = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem('user');
    window.location.href = "/login";
  };

  const handleSettingsClick = () => {
    navigate("/password-change");
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const { user } = useContext(UserContext);
  console.log('DashBoard context value:', user);

  return (
    <header className="h-[10vh] bg-prime w-full flex justify-between items-center">
      {/* Desktop Logo and Search */}
      <div className="hidden sm:flex items-center">
        <img src={sampatLogo} className="w-[180px] ml-3" alt="Sampat Logo" />
        <div className="hidden sm:flex lg:flex absolute left-72 text-prime bg-box pt-2 pb-2 pl-5 pr-5 rounded-full w-[25vw] items-center justify-between">
          <input
            type="text"
            className="bg-transparent text-name font-poppins outline-none text-sm"
            placeholder="Search Your Asset"
          />
          <FontAwesomeIcon
            className="text-xl text-white md:ml-3 lg:text-flo"
            icon={faSearch}
          />
        </div>
      </div>

      {/* Desktop Icons for Settings, Notifications, and User */}
      <div className="text-white sm:flex gap-3 mr-10 mt-6 hidden">
        {/* Settings */}
        <div title="Change Password" className="w-8 h-8 text-flo bg-box hover:bg-flo hover:text-box rounded-full  cursor-pointer flex items-center justify-center" onClick={handleSettingsClick}>
          <FontAwesomeIcon
            icon={faGear}
             />
        </div>
        {/* Notifications */}
        <div className="relative text-flo w-8 h-8 bg-box  hover:bg-flo hover:text-box rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faBell} />
          {/* <p className="absolute -top-1 -right-1 bg-flo text-black rounded-full w-4 h-4 flex items-center justify-center text-sm">
            3
          </p> */}
        </div>
        {/* User */}
        <div 
          className="w-8 h-8 cursor-pointer text-flo bg-box hover:bg-flo hover:text-box rounded-full flex items-center justify-center"
          title="Log out" onClick={handleIconClick}
        >
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>

     
    </header>
  );
}

export default Header;
