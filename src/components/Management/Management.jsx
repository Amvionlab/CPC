import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";
import { faBell, faBroom, faComment } from "@fortawesome/free-solid-svg-icons";
import { baseURL } from "../../config.js";
import Tooltip from "@mui/material/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Management() {
  const [type, setType] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchGroup.php`);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        setType(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Optionally handle the error, e.g., by setting an error state
      }
    };
    fetchData();
  }, []);

  const data = type.map((val, i) => ({ id: i, value: 1, label: val.group }));
  return (
    <div className="lg:flex h-full flex-col p-1 gap-1 w-full lg:grid-cols-2 grid-cols-1 bg-second">
      <div className="p-4 w-full bg-box rounded-md flex flex-col">
        <div className="text-lg font-bold m-2">Asset Group</div>
        <div className="flex gap-2 flex-wrap">
          {type.map(
            (item, i) =>
              item.group && (
                <Link
                  to={`/management/${item.group}`}
                  key={i}
                  className="flex-1"
                >
                  <div className="m-2 group transform transition-transform duration-300 hover:scale-105 border-2 rounded-lg p-4 flex items-center justify-center cursor-pointer">
                    <p className="font-medium text-base text-prime text-center">
                      {item.group}
                    </p>
                  </div>
                </Link>
              )
          )}
        </div>
      </div>

      {/* Second and Third Divs: 50% Width Each */}
      <div className="flex gap-1">
        {/* First Div: 50% Width */}
        <div className="flex-1 p-6 bg-box rounded-md flex justify-center  items-center">
          <PieChart
            series={[
              {
                data,
                innerRadius: 50, // Adjust this value to control the size of the center space
                outerRadius: 150,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
                // paddingAngle: 50,
              },
            ]}
            height={300}
            width={500}
          />
        </div>

        {/* Second Div: 50% Width */}
        <div className="flex-1 p-6 bg-box rounded-md flex flex-col">
          <div className="flex items-center justify-between">
            <div className="relative inline-block">
              <FontAwesomeIcon icon={faBell} className="text-xl" />
              <div className="absolute -top-2 -right-2 bg-red-600 rounded-full h-5 w-5 flex items-center justify-center text-xs">
                <p className="text-white">1</p>
              </div>
            </div>
            <p className="font-medium text-xl px-2 overflow-hidden">
              Notifications
            </p>
            <Tooltip title="Clear All">
              <FontAwesomeIcon
                icon={faBroom}
                className="cursor-pointer transition-transform duration-300 transform hover:rotate-180"
              />
            </Tooltip>
          </div>

          <div className="scrollbar-thin p-4 mt-1 bg-box rounded-lg  transition-transform duration-500">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex text-xs items-center p-3 mb-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition duration-300"
              >
                <FontAwesomeIcon
                  icon={faComment}
                  className="text-blue-500 mr-3"
                />
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
