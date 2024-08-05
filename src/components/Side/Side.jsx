import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChartSimple,
  faHouse,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext/UserContext';

const navItems = [
  { path: "/dashboard", icon: faHouse, label: "Dashboard", key: "dashboard" },
  { path: "/ticket", icon: faListCheck, label: "New Tickets", key: "ticket" },
  { path: "/analytics", icon: faChartSimple, label: "Analytics", key: "analytics" },
  { path: "/admin/access", icon: faChartSimple, label: "Access", key: "creation" },
  { path: "/admin/user", icon: faChartSimple, label: "User", key: "creation" },
  { path: "/admin/customer", icon: faChartSimple, label: "Customer", key: "creation" },
  { path: "/admin/department", icon: faChartSimple, label: "Department", key: "creation" },
  { path: "/admin/domain", icon: faChartSimple, label: "Domain", key: "creation" },
  { path: "/admin/subdomain", icon: faChartSimple, label: "Sub Domain", key: "creation" },
  { path: "/admin/location", icon: faChartSimple, label: "Branch", key: "creation" },
  { path: "/admin/sla", icon: faChartSimple, label: "SLA", key: "creation" },
  { path: "/admin/ticket_noc", icon: faChartSimple, label: "Ticket NOC", key: "creation" },
  { path: "/admin/ticket_status", icon: faChartSimple, label: "Ticket Status", key: "creation" },
  { path: "/admin/ticket_type", icon: faChartSimple, label: "Ticket Type", key: "creation" },
  { path: "/admin/ticket_service", icon: faChartSimple, label: "Ticket Service", key: "creation" },
];

const NavItem = ({ path, icon, label, isActive, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
    navigate(path);
  };

  return (
    <div
      className={`flex w-[70vw] sm:w-[50vw] md:w-[30vw] lg:w-[15vw] p-2 rounded-lg cursor-pointer ${
        isActive ? "bg-white text-flo font-medium" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-center items-center mr-8">
        <FontAwesomeIcon icon={icon} className="text-sm" />
      </div>
      <div className="text-sm lg:text-sm font-bold">{label}</div>
    </div>
  );
};

function Side({ open, setOpen }) {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const handleLinkClick = () => {
    console.log('handleLinkClick called');
    setOpen(prev => !prev);
  };

  return (
    <div
      className={`top-0 left-0 h-full bg-prime border-r-white border-r-[1px] border-t-[1px] border-b-[1px] transition-transform duration-300 ease-in-out relative translate-x-0 w-[17vw]`}
    >
      <div className="flex justify-end m-3 sm:hidden border-b-2 border-white pb-3">
        <FontAwesomeIcon
          className="text-2xl text-white"
          icon={faBars}
          onClick={handleLinkClick}
        />
      </div>
      <nav className="h-full">
        <div className="text-white mt-3 lg:mt-8 font-poppins flex flex-col justify-center items-center">
          {navItems.map(
            ({ path, icon, label, key }) =>
              user && user[key] === '1' && (
                <NavItem
                  key={path}
                  path={path}
                  icon={icon}
                  label={label}
                  isActive={location.pathname === path}
                  onClick={handleLinkClick}
                />
              )
          )}
        </div>
      </nav>
    </div>
  );
}

export default Side;
