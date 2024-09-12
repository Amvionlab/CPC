import React from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../../config.js";
import useFetch from "../../hooks/useFetch.js";
import avatar from "../../photo/avatar.png";

function UserDetail() {
  const { group, type, tag } = useParams();
  const decodedGroup = decodeURIComponent(group);
  const decodedType = decodeURIComponent(type);
  const decodedTag = decodeURIComponent(tag);
  const { allData } = useFetch(
    `${baseURL}//backend/fetchUserDetail.php?group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`
  );

  const title = [
    { label: "First Name", value: allData?.firstname },
    { label: "Last Name", value: allData?.lastname },
    { label: "Employee ID", value: allData?.employee_id },
    { label: "Department", value: allData?.department },
    { label: "Designation", value: allData?.designation },
    { label: "Authority ID", value: allData?.authority_id },
    { label: "Location", value: allData?.location },
    { label: "Mobile", value: allData?.mobile },
    { label: "Email", value: allData?.email },
    { label: "State", value: allData?.state },
    { label: "Country", value: allData?.country },
    { label: "Building", value: allData?.building },
    { label: "Block", value: allData?.block },
    { label: "Floor", value: allData?.floor },
  ];

  return (
    <div>
      <h1 className="font-bold text-lg mb-1">User Details</h1>
      <div className="flex justify-center h-full">
      
          <img
            src={allData?.photo || avatar}
            className="md:w-[150px] object-contain h-full"
            alt="User avatar"
          />
        </div>
      

        <div className="flex flex-wrap w-full">
          {title.map((item, i) => (
            
            <div key={i} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col ">
            <div className='p-3 border-r border-b border-l border-gray-300 hover:border-flo rounded-full transition-transform transform hover:scale-110 hover:z-10'>
               <h3 className="text-sm font-bold text-flo capitalize">{item.label.replace(/_/g, ' ')}</h3>
                <p className="text-xs text-gray-500 font-semibold m-1 text-center">
                {item.value || "N/A"}
                </p>
                </div>
          </div>
          ))}
        </div>
      </div>
   
  );
}

export default UserDetail;
