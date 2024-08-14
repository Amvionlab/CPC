import React from "react";
import "./manage.css";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";

function Management() {
  const data = [
    { id: 0, value: 10, label: "Series A" },
    { id: 1, value: 15, label: "Series B" },
    { id: 2, value: 20, label: "Series C" },
  ];

  return (
    <div className="flex p-4 w-full h-screen font-poppins">
      {/* Sidebar */}
      <div className="p-4 h-full bg-slate-300 w-2/4 rounded-md flex justify-center border-r-2">
        <div className="grid grid-cols-2 gap-4 h-fit text-xl mt-5">
          <p className="p-2 border rounded-lg bg-white text-violet-500 cursor-pointer">
            IT
          </p>
          <p className="p-2 border rounded-lg bg-white cursor-pointer">
            Non-IT
          </p>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-slate-300  rounded-md">
        <div className="flex mb-4 border-b-4">
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
        <div className="w-full flex gap-2 ">
          <p className="font-poppins font-medium text-xl px-2">
            Notifications:
          </p>
          <div>
            <p>Notification 1</p>
            <p>Notification 1</p>
            <p>Notification 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Management;
