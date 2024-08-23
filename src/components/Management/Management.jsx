import React, { useEffect, useState } from "react";
import "./manage.css";
import { PieChart } from "@mui/x-charts";
import {
  faBell,
  faChevronDown,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Link } from "react-router-dom";

function Management() {
  const data = [
    { id: 0, value: 10, label: "Series A" },
    { id: 1, value: 15, label: "Series B" },
    { id: 2, value: 20, label: "Series C" },
  ];
  const [type, setType] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/AMS/backend/fetchTicket_group.php"
        );
        setType(response.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="lg:flex p-4 gap-4 w-full h-screen font-poppins lg:grid-cols-2 grid-cols-1 bg-second">
      {/* Sidebar */}

      <div className="p-4 h-full bg-box w-full lg:w-2/4 rounded-md flex-col flex  border-r-2">
        <div className="text-base font-medium">Asset Group</div>
        <div className="grid grid-cols-2 gap-4 h-fit text-xl mt-5 w-full">
          {type.map(
            (item, i) =>
              item.group && (
                <Link to={`/${item.id}/type`}>
                  <p
                    key={i}
                    className="p-2 border-gray-400 font-medium text-base  text-gray-700  text-center w-full  rounded-lg border-2 cursor-pointer"
                  >
                    {item.group}
                  </p>
                </Link>
              )
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white/80 rounded-md">
        <div className="flex ">
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
              width={500}
            />
          </div>
        </div>
        <div className="w-full md:w-2/4 flex flex-col gap-2 h-full px-4 py-4 overflow-hidden">
          <div className="flex items-center ">
            <div className="relative inline-block">
              <FontAwesomeIcon
                icon={faBell}
                className="duration-1000  text-xl"
              />
              <div
                style={{ borderRadius: "100%" }}
                className="absolute -top-4 left-2 bg-[red] px-1  flex items-center justify-center text-xs"
              >
                <p className="text-white text-sm">1</p>
              </div>
            </div>

            <p className="font-poppins font-medium text-xl px-2 overflow-hidden">
              Notifications
            </p>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`transition-transform duration-300 `}
            />
          </div>
          <div
            className={`scrollbar-thin overflow-y-scroll p-4 border-2 rounded-md shadow-lg transition-transform duration-500 `}
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
