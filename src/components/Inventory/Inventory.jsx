import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";
import { baseURL } from "../../config.js";
import { Link } from "react-router-dom";
import { BarChart } from '@mui/x-charts/BarChart';

function Management() {
  const [type, setType] = useState([]);

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
      }
    };
    fetchData();
  }, []);

  const data = type.map((val, i) => ({ id: i, value: 10, label: val.group }));

  // Prepare data for BarChart
  const barData = type.map((group) => ({
    x: group.group, // Use the group name for the x axis
    y: 10 // Assigning value of 1 for each group
  }));

  return (
    <div className="lg:flex h-full flex-col p-1 gap-1 w-full lg:grid-cols-2 grid-cols-1 bg-second">
      <div className="p-4 w-full bg-box rounded-md flex flex-col min-h-[25%]">
        <div className="text-base font-bold m-2">Asset Group</div>
        <div className="h-full p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-2">
          {type.map(
            (item, i) =>
              item.group && (
                <Link
                  to={`/inventory/${item.group}`}
                  key={i}
                  className="flex-1"
                >
                  <div className="group text-center cursor-pointer flex flex-row justify-center items-center p-4 gap-4 bg-box border rounded-xl transition-transform shadow-sm hover:shadow">
                    <p className="text-flo text-sm font-bold transition-transform transform group-hover:translate group-hover:scale-110">
                      {item.group}
                    </p>
                  </div>
                </Link>
              )
          )}
        </div>
      </div>

      <div className="flex gap-1 min-h-[75%]">
        {/* Pie Chart Section */}
        <div className="flex-1 p-6 bg-box rounded-md flex justify-center items-center ">
          <PieChart
          
            series={[
              {
                data,
                innerRadius: 30,
      outerRadius: 140,
      paddingAngle: 5,
      cornerRadius: 5,
      startAngle: -45,
      endAngle: 290,
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

        {/* Bar Chart Section */}
        <div className="flex-1 p-6 bg-box rounded-md flex flex-col">
        <BarChart
  xAxis={[{ scaleType: 'band', data: barData.map((d) => d.x) }]}
  series={[
    {
      data: Array(barData.length).fill(10),
      highlightScope: { fade: 'global', highlight: 'item' },
      color: '#2E96FF', 
      
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
}

export default Management;
