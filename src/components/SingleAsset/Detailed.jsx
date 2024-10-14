import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../../config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPrint } from "@fortawesome/free-solid-svg-icons";
import Barcode from "react-barcode";

function Detailed() {
  const { group, type, tag } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePrint = () => {
    const printContent = document.getElementById("barcode-container").innerHTML;
    const printWindow = window.open("", "", "height=400,width=600");
    printWindow.document.write("<html><head><title>Print Barcode</title>");
    printWindow.document.write("</head><body >");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

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
          className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col"
        >
          <div className="p-2 shadow cursor-pointer border hover:border-flo rounded-md transition-transform transform hover:scale-95">
            <h3 className="text-sm font-bold text-prime capitalize text-center">
              {key.replace(/_/g, " ")}
            </h3>
            <p className="text-xs text-flo font-semibold m-1 text-center">
              {value}
            </p>
          </div>
        </div>
      ));
  };

  return (
    <div className="font-sui">
      <div className="flex font-bold justify-between items-center mb-3">
        <h1 className="text-lg">Detailed View</h1>
        <div className="flex">
          <button
            onClick={openModal}
            className="flex text-xs items-center px-3 py-1 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform mr-3"
          >
            View Barcode
          </button>
          <button className="flex text-xs items-center px-3 py-1 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform">
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Edit
          </button>
        </div>
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

      {/* Modal using Tailwind CSS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-box p-3 rounded-md shadow-lg max-w-xs w-full">
            <div id="barcode-container" className="text-center">
              <h3 className="font-bold mb-2">Barcode</h3>
              {data && data.tag && (
                <div className="flex justify-center items-center">
                  <Barcode value={data.tag} />
                </div>
              )}
            </div>
            <div className="mt-3 flex justify-end font-semibold text-xs">
              <button
                onClick={handlePrint}
                className="mr-2 px-3 py-1  text-second hover:text-box  bg-prime rounded border transition-colors"
              >
                <FontAwesomeIcon icon={faPrint} className="mr-1" />
                Print
              </button>
              <button
                onClick={closeModal}
                className="px-3 py-1 bg-gray-300 text-black hover:text-box rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detailed;
