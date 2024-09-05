import { PieChart } from "@mui/x-charts";
import { baseURL } from "../../config.js";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const AssetType = () => {
  const { allData } = useFetch(`${baseURL}/backend/fetchType.php`);

  const { group } = useParams();

  const data = [
    { id: 0, value: 10, label: "Series A" },
    { id: 1, value: 15, label: "Series B" },
    { id: 2, value: 20, label: "Series C" },
  ];

  const filteredData = allData.filter((data) => data.group == group);

  return (
    <div className="lg:flex flex-col p-4 gap-4 w-full h-screen font-poppins lg:grid-cols-2 grid-cols-1 bg-slate-200">
      <div className="p-4 bg-white/80 w-full lg:w-full rounded-md flex-col flex border-r-2">
        <div className="text-base font-medium">
          <Link
            className="text-red-600 hover:underline"
            to={`/management/${group}`}
          >
            Asset Group
          </Link>
          /Asset Type
        </div>

        <div className="flex gap-6 flex-wrap">
          {filteredData.map((item) => (
            <Link to={`/management/${item.group}/${item.type}`}>
              <div className="m-2 w-40 group transform transition-transform duration-300 hover:scale-105 bg-second shadow-md rounded-lg p-4 flex items-center justify-center cursor-pointer">
                <p className="font-medium text-base text-gray-700 text-center">
                  {item.type}
                </p>
              </div>
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
