import React, { useState, lazy, Suspense } from "react";

// Lazy load components
const Detailed = lazy(() => import("./Detailed"));
const UserDetail = lazy(() => import("./UserDetail"));
const AssetNotes = lazy(()=> import("./AssetNotes"));
const RelatedDoc = lazy(()=> import("./RelatedDoc"));
const AMC = lazy(()=> import("./AMC"));
const Warranty = lazy(()=> import("./Warranty"));
const Connection = lazy(()=> import("./Connection"));
const Transfer = lazy(()=> import("./Transfer"));
const Depreciation = lazy(()=> import("./Depreciation"));
const VendorDetails = lazy(()=> import("./VendorDetails"));
const PAB = lazy(()=> import("./PAB"));
const Log = lazy(()=> import("./Log"));

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

  const [data, setData] = useState("Detailed View");

  // Function to render the selected component
  const renderComponent = () => {
    switch (data) {
      case "Detailed View":
        return <Detailed />;
      case "User Detail":
        return <UserDetail />;
      case "Asset Notes":
        return <AssetNotes />;
      case "Related Documents":
        return <RelatedDoc />;
      case "AMC":
        return <AMC />;
      case "Warranty":
        return <Warranty />;
      case "Connection":
        return <Connection />;
      case "Transfer":
        return <Transfer />;
      case "Depreciation":
        return <Depreciation />;
      case "Vendor Details":
        return <VendorDetails />;
      case "Planning and Budget":
        return <PAB />;
      case "Log":
        return <Log />;
    
      // Add other cases for different components
      default:
        return <div>Select a category</div>;
    }
  };

  return (
    <>
      <div className="flex w-full h-full bg-slate-200">
        <div className="md:p-4  w-full rounded-md flex gap-4">
          <div className="w-[20%] bg-white h-full rounded-md">
            {titles.map((title, i) => (
              <div key={i} className=" mt-2 px-4 p-1">
                <p
                  className={`text-sm md:text-base font-poppins border-b-2  hover:hover: hover:border-b-prime transition-all ease-in-out duration-500 cursor-pointer ${
                    title === data ? "text-red-500 " : "text-prime"
                  }`}
                  onClick={() => setData(title)}
                >
                  {title}
                </p>
              </div>
            ))}
          </div>
          <div className="w-[80%] bg-white h-full rounded-md">
            <div className="h-full p-2">
              <Suspense fallback={<div>Loading...</div>}>
                {renderComponent()}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleAsset;
