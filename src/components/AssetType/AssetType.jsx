import { PieChart } from "@mui/x-charts";
import { baseURL } from "../../config.js";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Tooltip from "@mui/material/Tooltip";
import { BarChart } from '@mui/x-charts/BarChart';
const AssetType = () => {
  const { allData } = useFetch(`${baseURL}/backend/fetchType.php`);
  const [type, setType] = useState([]);
  const { group } = useParams();

  const filteredData = allData.filter((data) => data.group == group);
  const data = filteredData.map((val, i) => ({
    id: i,
    value: 1,
    label: val.type,
  }));
  const barData = filteredData.map((group) => ({
    x: group.type, // Use the group name for the x axis
    y: 1 // Assigning value of 1 for each group
  }));
  return (
    <div className="lg:flex h-full flex-col p-1 gap-1 w-full lg:grid-cols-2 grid-cols-1 bg-second">
      <div className="p-4 w-full bg-box rounded-md flex flex-col min-h-[25%]">
        <div className="text-base font-bold  m-2">
          <Link className="hover:underline" to="/management">
            Asset Group{" "}
          </Link>
          <Link
            className="text-prime hover:underline"
            to={`/management/${group}`}
          >
            / {group}
          </Link>
          &nbsp;/ Asset Type
        </div>

        <div className="h-full p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-2">
         {filteredData.map(
            (item, i) =>
              item.group && (
                <Link
                  to={`/management/${item.group}/${item.type}`}
                  key={i}
                  className="flex-1"
                >
                 <div className="group text-center cursor-pointer flex flex-row justify-center items-center p-4 gap-4 bg-box border rounded-xl transition-transform shadow-sm hover:shadow">
  <p className="text-flo text-sm font-bold transition-transform transform group-hover:translate group-hover:scale-110">
     {item.type}
                    </p>
                  </div>
                </Link>
              )
          )}
        </div>
      </div>

      <div className="flex gap-1 min-h-[75%]">
        {/* First Div: 50% Width */}
        <div className="flex-1 p-6 bg-box rounded-md flex justify-center  items-center">
        <PieChart
          
          series={[
            {
              data,
              innerRadius: 30,
    outerRadius: 140,
    paddingAngle: 5,
    cornerRadius: 5,
    startAngle: 35,
    endAngle: 360,
    cx: 150,
    cy: 150,
    highlightScope: { fade: 'global', highlight: 'item' },
        faded: { innerRadius: 30, additionalRadius: -5, color: 'gray' },
            },
          ]}
          height={300}
          width={500}
        />
        </div>

        {/* Second Div: 50% Width */}
        <div className="flex-1 p-6 bg-box rounded-md flex flex-col">
         
        <BarChart
  xAxis={[{ scaleType: 'band', data: barData.map((d) => d.x) }]}
  series={[
    {
      data: Array(barData.length).fill(10),
      highlightScope: { fade: 'global', highlight: 'item' },
      color: '#B800D8', 
      
    }
  ]}
  width={550}
  height={350}
  barLabel="value"
/>

        </div>
      </div>
    </div>
  );
};

export default AssetType;
