import React, { useState } from "react";

function SingleAsset() {
  const titles = [
    "Detailed View",
    "User Detail",
    "Asset Notes",
    "Related Documents",
    "AMC",
    "Warranty",
    "Connection",
    "Transfer",
    "Depreciation",
    "Vendor Details",
    "Planning and Budget",
    "Log",
  ];
  const details = [
    {
      category: "DetailedView",
      content: "DetailedView content",
    },
    {
      category: "UserDetail",
      content: "User Detail content",
    },
    {
      category: "AssetNotes",
      content: "Asset Notes content",
    },
    {
      category: "RelatedDocuments",
      content: "Related Documents content",
    },
    {
      category: "AMC",
      content: "AMC content",
    },
    {
      category: "Warranty",
      content: "Warranty content",
    },
    {
      category: "Connection",
      content: "Connection content",
    },
    {
      category: "Transfer",
      content: "Transfer content",
    },
    {
      category: "Depreciation",
      content: "Depreciation content",
    },
    {
      category: "VendorDetail",
      content: "Vendor Detail content",
    },
    {
      category: "PlanningandBudget",
      content: "Planning and Budget content",
    },
    {
      category: "Log",
      content: "Log content",
    },
  ];

  const [data, setData] = useState("DetailedView");
  const filtered = details.find(
    (item) => item.category.toLowerCase() === data.toLowerCase()
  );

  return (
    <>
      <div className="flex  p-4 gap-4 w-full h-auto bg-slate-200">
        <div className="md:p-4  w-full rounded-md flex gap-4">
          <div className="w-[20%] bg-white h-full rounded-md">
            {titles.map((title, i) => (
              <div className="py-1 mt-1 px-4">
                <p
                  className={`text-xs md:text-base font-poppins border-b-2 hover:border-b-prime transition-all ease-in-out duration-500 cursor-pointer     ${
                    title.split(" ").join("") == data
                      ? "text-red-500 "
                      : "text-prime"
                  }`}
                  onClick={() => setData(title.split(" ").join(""))}
                >
                  {title}
                </p>
              </div>
            ))}
          </div>
          <div className="w-[80%] bg-white h-full rounded-md">
            <div className="h-full p-2">
              {filtered ? filtered.content : "Select the category"}
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
}

export default SingleAsset;
