import React, { useState } from "react";
import "./manage.css";
import { PieChart } from "@mui/x-charts";
import {
  faBell,
  faChevronDown,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Management() {
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);

  const data = [
    { id: 0, value: 10, label: "Series A" },
    { id: 1, value: 15, label: "Series B" },
    { id: 2, value: 20, label: "Series C" },
  ];

  const toggleNotifications = () => {
    setIsNotificationsVisible(!isNotificationsVisible);
  };

  return (
    <div className="lg:flex p-4 w-full h-screen font-poppins lg:grid-cols-2 grid-cols-1">
      {/* Sidebar */}
      <div className="p-4 h-full bg-slate-300 w-full lg:w-2/4 rounded-md flex justify-center border-r-2">
        <div className="grid grid-cols-2 gap-4 h-fit text-xl mt-5 w-full">
          <p className="p-2 w-full border text-center rounded-lg bg-white text-violet-500 cursor-pointer">
            IT
          </p>
          <p className="p-2 text-center w-full border rounded-lg bg-white cursor-pointer">
            Non-IT
          </p>
          <p className="p-2 w-full border text-center rounded-lg bg-white text-violet-500 cursor-pointer">
            IT
          </p>
          <p className="p-2 text-center w-full border rounded-lg bg-white cursor-pointer">
            Non-IT
          </p>
          <p className="p-2 w-full border text-center rounded-lg bg-white text-violet-500 cursor-pointer">
            IT
          </p>
          <p className="p-2 text-center w-full border rounded-lg bg-white cursor-pointer">
            Non-IT
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-slate-300 rounded-md">
        <div className="flex mb-4">
          <div className="m-2">
            <PieChart
              series={[
                {
                  data,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              height={300}
              width={600}
            />
          </div>
        </div>
        <div className="w-full md:w-2/4 flex flex-col gap-2 h-full px-4 py-4 overflow-hidden">
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleNotifications}
          >
            <div className="relative inline-block">
              <FontAwesomeIcon
                icon={faBell}
                className="duration-1000 animate-shake text-xl"
              />
              <div
                style={{ borderRadius: "100%" }}
                className="absolute -top-3 -right-2 bg-red-500 px-1  flex items-center justify-center text-xs"
              >
                <p className="text-white text-sm">1</p>
              </div>
            </div>

            <p className="font-poppins font-medium text-xl px-2 overflow-hidden">
              Notifications
            </p>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`transition-transform duration-300 ${
                isNotificationsVisible ? "rotate-180" : ""
              }`}
            />
          </div>
          <div
            className={`scrollbar-thin overflow-y-scroll p-4 bg-second rounded-md shadow-lg transition-transform duration-500 ${
              isNotificationsVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              1
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              2
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              3
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              4
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              5
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              6
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              7
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              8
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              9
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              10
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              11
            </p>
            <p className="border-b border-gray-500 py-2 flex items-center">
              <FontAwesomeIcon icon={faComment} className="mr-2" /> Notification
              12
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Management;
