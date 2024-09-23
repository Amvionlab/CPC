import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../../config.js";

function AMC() {
  const { group, type, tag } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const decodedGroup = decodeURIComponent(group);
    const decodedType = decodeURIComponent(type);
    const decodedTag = decodeURIComponent(tag);

    console.log("Decoded parameters:", {
      decodedGroup,
      decodedType,
      decodedTag,
    });

    const url = `${baseURL}/backend/fetchDetailedView.php?group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;

    console.log("Fetching URL:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Fetched data:", result);
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

  const { amc_from, amc_to, amc_interval } = data;
  console.log("AMC Details:", { amc_from, amc_to, amc_interval });

  const calculateIntervals = (start, end, intervalMonths) => {
    const intervals = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      intervals.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + intervalMonths);
    }
    return intervals;
  };

  const startDate = new Date(amc_from); // Format: 'mm-dd-yyyy'
  const endDate = new Date(amc_to); // Format: 'mm-dd-yyyy'
  const currentDate = new Date();

  const intervals = calculateIntervals(
    startDate,
    endDate,
    parseInt(amc_interval)
  );

  const handleIntervalClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="font-sui">
      <div className="flex font-bold justify-between items-center mb-3">
        <h1 className="text-xl">AMC Details</h1>
      </div>
      <div className="grid grid-cols-4 gap-x-12 gap-y-4 p-4">
        {intervals.map((interval, index) => {
          const intervalDate = interval;
          let backgroundColor = "";

          if (intervalDate < currentDate) {
            backgroundColor =
              "bg-red-200 hover:bg-red-300";
          } else if (
            intervalDate.getFullYear() === currentDate.getFullYear() &&
            intervalDate.getMonth() === currentDate.getMonth()
          ) {
            backgroundColor = "bg-white";
          } else {
            backgroundColor =
              "bg-green-200 hover:bg-green-300";
          }

          return (
            <div
              key={index}
              className={`p-4 ${backgroundColor} text-sm font-semibold shadow-sm
              hover:text-sm transition-all duration-700 text-center rounded-lg
              hover:rounded-3xl 
              cursor-pointer`}
              onClick={() => handleIntervalClick(intervalDate)}
            >
              <p>{intervalDate.toLocaleDateString()}</p>
              <p>{intervalDate.toLocaleDateString()}</p>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/4">
            <h2 className="text-lg font-bold">AMC Date Notes</h2>
            <p>Date: {selectedDate && selectedDate.toLocaleDateString()}</p>
            {/* Add additional content or logic here to fetch/display notes specific to the date */}
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AMC;
