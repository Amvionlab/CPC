import React, { useState, lazy, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye,
  faUser,
  faStickyNote,
  faFolderOpen,
  faClipboard,
  faFileContract,
  faLink,
  faExchangeAlt,
  faChartBar,
  faBuilding,
  faListAlt,
  faFileAlt,
  faForward
} from "@fortawesome/free-solid-svg-icons";

const Detailed = lazy(() => import("./Detailed"));
const UserDetail = lazy(() => import("./UserDetail"));
const AssetNotes = lazy(() => import("./AssetNotes"));
const RelatedDoc = lazy(() => import("./RelatedDoc"));
const AMC = lazy(() => import("./AMC"));
const Warranty = lazy(() => import("./Warranty"));
const Connection = lazy(() => import("./Connection"));
const Transfer = lazy(() => import("./Transfer"));
const Depreciation = lazy(() => import("./Depreciation"));
const VendorDetails = lazy(() => import("./VendorDetails"));
const PAB = lazy(() => import("./PAB"));
const Log = lazy(() => import("./Log"));

function SingleAsset() {
  const menuItems = [
    { title: "Detailed View", icon: faEye, component: <Detailed /> },
    { title: "User Detail", icon: faUser, component: <UserDetail /> },
    { title: "Asset Notes", icon: faStickyNote, component: <AssetNotes /> },
    { title: "Documents", icon: faFolderOpen, component: <RelatedDoc /> },
    { title: "AMC", icon: faClipboard, component: <AMC /> },
    { title: "Warranty", icon: faFileContract, component: <Warranty /> },
    { title: "Connection", icon: faLink, component: <Connection /> },
    { title: "Transfer", icon: faExchangeAlt, component: <Transfer /> },
    { title: "Depreciation", icon: faChartBar, component: <Depreciation /> },
    { title: "Vendor Details", icon: faBuilding, component: <VendorDetails /> },
    { title: "P&B", icon: faListAlt, component: <PAB /> },
    { title: "Log", icon: faFileAlt, component: <Log /> },
  ];

  const [data, setData] = useState(menuItems[0]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null); // State for hovered item

  return (
    <div className="flex h-full bg-second p-1 gap-1">
      <div className="bg-box overflow-y-auto overflow-x-hidden">
      <aside
        className={`transition-all duration-500 bg-white text-prime ${isExpanded ? "w-48" : "w-16"}`}
        style={{ minWidth: isExpanded ? "8rem" : "2rem" }}
      >
        <nav className="flex flex-col gap-2 text-base mt-2">
          {menuItems.map(({ title, icon, component }) => (
            <div 
              key={title} 
              className="group ml-2"
              onMouseEnter={() => setHoveredItem(title)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                onClick={() => setData({ title, component })}
                className={`flex items-center pl-3 rounded-md transition-all duration-500
                  ${data.title === title ? "bg-prime text-box" : "hover:bg-prime hover:text-box"}`}
                style={{
                  height: '35px',
                  // Fixed width for the button
                  minWidth: isExpanded ? "130px" : "35px",
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center"
                }}
              >
                <FontAwesomeIcon 
                  icon={icon} 
                  className="mr-2"
                  style={{ width: '24px', textAlign: "center" }} // Fixed width for icon
                />
                {isExpanded && (
                  <span className="text-sm font-medium" style={{ width: '105px', textAlign: "left", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}> 
                    {title}
                  </span>
                )}
              </button>
              {/* Tooltip for title (visible on hover in shrink state) */}
              {!isExpanded && hoveredItem === title && (
                <span className={`absolute left-full ml-2 -mt-9 p-1 rounded-md text-sm bg-purple-500 text-nowrap text-white transition-opacity`}>
                  {title}
                </span>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-2 mt-4 flex items-center justify-between p-1 rounded-md ">
          <button 
            onClick={() => setIsExpanded(prev => !prev)}
            className="flex items-center justify-start p-2 rounded-md text-flo hover:text-purple-500 transition-colors duration-300"
          >
            <FontAwesomeIcon 
              icon={faForward} 
              style={{ width: '26px', textAlign: "center", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} 
            />
            {isExpanded && <span className="text-sm font-medium ml-1" style={{ width: '130px', textAlign: "left", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>Collapse</span>}
          </button>
        </div>

      </aside>
      </div>

     
      <div className="flex-grow bg-white p-4 overflow-y-auto text-wrap w-full">
        <Suspense fallback={<div>Loading...</div>}>
          {data.component}
        </Suspense>
      </div>


    </div>
  );
}

export default SingleAsset;
