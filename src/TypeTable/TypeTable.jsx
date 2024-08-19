import React from "react";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";

function TypeTable() {
  const { type } = useParams(); // Correctly destructuring `type`
  const { allData } = useFetch(
    `http://localhost/AMS/backend/fetchAllDetails.php?type=${type}`
  );

  // Ensure allData and its properties are defined before rendering
  if (!allData || !allData.columns || !allData.data) {
    return <p>Loading...</p>; // Handling the case when data is not yet loaded or missing
  }

  return (
    <div className="p-4 w-full">
      <p className="text-2xl font-bold mb-2">{type}</p>
      <div className="h-screen rounded-md  w-full">
        <table className="w-full bg-white">
          <thead>
            <tr>
              {allData.columns.slice(0, 8).map((header, i) => (
                <th className="text-left p-4 border-b capitalize" key={i}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allData.data.slice(0, 8).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {allData.columns.slice(0, 8).map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="text-center capitalize  p-2 border-b"
                  >
                    {row[column] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TypeTable;
