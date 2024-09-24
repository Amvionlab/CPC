import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { baseURL } from "../../config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

function Detailed() {
  const { group, type, tag } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const decodedGroup = decodeURIComponent(group);
    const decodedType = decodeURIComponent(type);
    const decodedTag = decodeURIComponent(tag);

    const url = `${baseURL}/backend/fetchDetailedView.php?group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.toString());
        setLoading(false);
      });
  }, [group, type, tag]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  const displayData = (dataObj) => {
    return Object.entries(dataObj)
      .filter(
        ([key]) => key !== "id" && key !== "is_active" && key !== "post_date"
      )
      .map(([key, value]) => (
        <div
          key={key}
          className=" p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col "
        >
          <div className="p-2 border shadow-md cursor-pointer border-gray-300 hover:border-flo rounded-md transition-transform hover:border transform hover:scale-95 ">
            <h3 className="text-sm font-bold text-prime capitalize text-center">
              {key.replace(/_/g, " ")}
            </h3>
            <p className="text-xs text-gray-500 font-bold m-1 text-center">
              {value}
            </p>
          </div>
        </div>
      ));
  };

  return (
    <div className="font-sui">
      <div className="flex font-bold justify-between items-center mb-3">
        <h1 className="text-lg ">Detailed View</h1>
        <button className="flex text-xs items-center px-3 py-1 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform hover:scale-">
          <FontAwesomeIcon icon={faEdit} className="mr-2" />
          Edit
        </button>
      </div>

      {data ? (
        <div className="flex gap-1 flex-wrap">
          {Array.isArray(data) ? (
            data.map((item, index) => (
              <div key={index} className="flex flex-wrap w-full">
                {displayData(item)}
              </div>
            ))
          ) : (
            <div className="flex flex-wrap w-full">{displayData(data)}</div>
          )}
        </div>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
}

export default Detailed;
