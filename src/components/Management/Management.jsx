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
    <div className="flex p-3 flex-col w-full font-poppins bg-second">
      {/* First Div: Full Width */}
      <div className="p-4 w-full bg-box rounded-md flex flex-col border-b-2">
        <div className="text-base font-medium">Asset Group</div>
        <div className="flex gap-6 flex-wrap">
  {type.map(
    (item, i) =>
      item.group && (
        <Link to={`/${item.id}/type`} key={i} className="flex-1">
          <div className="m-2 group transform transition-transform duration-300 hover:scale-105 bg-second shadow-md rounded-lg p-4 flex items-center justify-center cursor-pointer">
            <p className="font-medium text-base text-gray-700 text-center">
              {item.group}
            </p>
          </div>
        </Link>
      )
  )}
</div>

      </div>

      {/* Second and Third Divs: 50% Width Each */}
      <div className="flex mt-6 gap-6">
  {/* First Div: 50% Width */}
  <div className="flex-1 p-4 bg-box rounded-md flex justify-center  items-center">
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

  {/* Second Div: 50% Width */}
  <div className="flex-1 p-5 bg-box rounded-md flex flex-col">
    <div className="flex items-center justify-between">
      <div className="relative inline-block">
        <FontAwesomeIcon icon={faBell} className="text-xl" />
        <div
          className="absolute -top-2 -right-2 bg-red-600 rounded-full h-5 w-5 flex items-center justify-center text-xs"
        >
          <p className="text-white">1</p>
        </div>
      </div>
      <p className="font-poppins font-medium text-xl px-2 overflow-hidden">
        Notifications
      </p>
      <FontAwesomeIcon
        icon={faChevronDown}
        className="cursor-pointer transition-transform duration-300 transform hover:rotate-180"
      />
    </div>

    <div className="scrollbar-thin p-5 mt-2 bg-second rounded-lg shadow-inner transition-transform duration-500">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center p-3 mb-2 bg-white border-b border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition duration-300"
        >
          <FontAwesomeIcon icon={faComment} className="text-blue-500 mr-3" />
          <p className="text-gray-700">Notification {i + 1}</p>
        </div>
      ))}
    </div>
  </div>
</div>


    </div>
  );
}

export default Management;