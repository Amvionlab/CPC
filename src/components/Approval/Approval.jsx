import React, { useState, lazy, Suspense, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPaperPlane , faClipboardCheck,  faForward
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from '@mui/system';

const AssetApproval = lazy(() => import("./AssetApproval"));
const TransferApproval = lazy(() => import("./TransferApproval"));

const PurpleTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'purple',
    color: 'white',
    fontSize: '0.875rem',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: 'purple',
  },
});

function SingleAsset() {
  const menuItems = [
      { title: "Asset", icon: faClipboardCheck, component: <AssetApproval /> },
      { title: "Transfer", icon: faPaperPlane, component: <TransferApproval /> }
  ];

  const getInitialData = () => {
    const savedTitle = sessionStorage.getItem("selectedTab");
    return menuItems.find(item => item.title === savedTitle) || menuItems[0];
  };

  const [data, setData] = useState(getInitialData);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    sessionStorage.setItem("selectedTab", data.title);
  }, [data]);

  return (
    <div className="flex h-full bg-second p-1 gap-1">
      <div className="bg-box overflow-y-auto overflow-x-hidden">
        <aside
          className={`transition-all duration-500 bg-white text-prime ${isExpanded ? "w-48" : "w-16"}`}
          style={{ minWidth: isExpanded ? "8rem" : "2rem", position: "relative" }}
        >
          <nav className="flex flex-col gap-2 text-base mt-2">
            {menuItems.map(({ title, icon, component }) => (
              <div 
                key={title} 
                className="group ml-2" 
              >
                {isExpanded && (
                <button
                  onClick={() => setData({ title, component })}
                  className={`flex items-center pl-3 rounded-md transition-all duration-500
                    ${data.title === title ? "bg-prime text-box" : "hover:bg-prime hover:text-box"}`}
                  style={{
                    height: '35px',
                    minWidth: isExpanded ? "130px" : "35px",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center"
                  }}
                >
                 
                    <FontAwesomeIcon 
                      icon={icon} 
                      className="mr-2"
                      style={{ width: '24px', textAlign: "center" }}
                    />
                  {isExpanded && (
                    <span className="text-sm font-medium" style={{ width: '105px', textAlign: "left", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}> 
                      {title}
                    </span>
                  )}
                </button>
                )}

            {!isExpanded && (
               <PurpleTooltip 
               title={title} 
               placement="right" 
               arrow 
             >
                <button
                  onClick={() => setData({ title, component })}
                  className={`flex items-center pl-3 rounded-md transition-all duration-500
                    ${data.title === title ? "bg-prime text-box" : "hover:bg-prime hover:text-box"}`}
                  style={{
                    height: '35px',
                    minWidth: isExpanded ? "130px" : "35px",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center"
                  }}
                >
                 
                    <FontAwesomeIcon 
                      icon={icon} 
                      className="mr-2"
                      style={{ width: '24px', textAlign: "center" }}
                    />
                </button>
              </PurpleTooltip>
              )}
              </div>
            ))}
          </nav>

          <div className="ml-2 mt-10 flex items-center justify-between p-1 rounded-md ">
            <button 
              onClick={() => setIsExpanded(prev => !prev)}
              className="flex items-center justify-start p-2 rounded-md text-flo hover:text-purple-500 transition-colors duration-300"
            >
              <FontAwesomeIcon 
                icon={faForward} 
                style={{ width: '26px', textAlign: "center", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} 
              />
              {isExpanded && <span className="text-sm font-medium ml-1" style={{ width: '130px', textAlign: "left", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>Collapse</span>}
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
