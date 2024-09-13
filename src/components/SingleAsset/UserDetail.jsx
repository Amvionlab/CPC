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
    `${baseURL}/backend/fetchUserDetail.php?group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`
  );

  // Define the keys to exclude
  const excludedKeys = ["photo", "id", "is_active", "post_date", "attachment"];

  return (
    <div>
      <h1 className="font-bold text-lg mb-1">User Details</h1>
      <div className="flex justify-center mb-2">
        <img
          src={allData?.photo || avatar}
          className="md:w-[150px] object-contain"
          alt="User avatar"
        />
      </div>

      <div className="flex flex-wrap w-full">
        {allData &&
          Object.entries(allData)
            .filter(([key]) => !excludedKeys.includes(key)) // Exclude undesired keys
            .map(([key, value], i) => (
              <div
                key={i}
                className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col"
              >
                <div className="p-3 border-r border-b border-l border-gray-300 hover:border-flo rounded-full transition-transform transform hover:scale-110 hover:z-10">
                  <h3 className="text-sm font-bold text-flo capitalize">
                    {key.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold m-1 text-center">
                    {value || "N/A"}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default UserDetail;
