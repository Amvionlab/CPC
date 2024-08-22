import {
  faBell,
  faChevronDown,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PieChart } from "@mui/x-charts";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const AssetType = () => {
  const { allData } = useFetch(
    "http://localhost/AMS/backend/fetchTicket_type.php"
  );
  const { id } = useParams();

  const data = [
    { id: 0, value: 10, label: "Series A" },
    { id: 1, value: 15, label: "Series B" },
    { id: 2, value: 20, label: "Series C" },
  ];

  const filteredData = allData.filter((data) => data.group_id == id);

  return (
    <div className="lg:flex p-4 gap-4 w-full h-screen font-poppins lg:grid-cols-2 grid-cols-1 bg-slate-200">
      <div className="p-4 h-full bg-white/80 w-full lg:w-2/4 rounded-md flex-col flex border-r-2">
        <div className="text-base font-medium">
          <Link
            className="text-red-600 hover:underline"
            to={`/${id}/management`}
          >
            Asset Group
          </Link>
          /Asset Type
        </div>
        <div className="grid grid-cols-2 gap-4 h-fit text-xl mt-5 w-full">
          {filteredData.map((item, i) => (
            <Link
              to={`/${id}/${item.type
                .replace(/\s+/g, "")
                .toUpperCase()}/typetable`}
            >
              <p
                key={i}
                className="p-2 text-gray-700 border-gray-400  font-medium text-base text-center w-full  rounded-lg border-2 cursor-pointer"
              >
                {item.type}
              </p>
            </Link>
          ))}
        </div>
      </div>

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
      </div>
    </div>
  );
};

export default AssetType;
