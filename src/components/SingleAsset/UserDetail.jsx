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
      <h1 className="font-semibold text-xl mb-10">User Details</h1>

      <div className="h-auto w-full flex gap-5">
        <div className="flex justify-start h-full ">
          <img
            src={allData?.photo || avatar}
            className="md:w-[200px] object-contain h-full"
            alt="User avatar"
          />
        </div>
        <div className="grid grid-cols-4 gap-7 w-full h-auto">
          {title.map((item, i) => (
            <div key={i} className="capitalize w-full space-y-2">
              <p className="text-base break-words">
                <strong> {item.label}</strong>: {item.value || "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
