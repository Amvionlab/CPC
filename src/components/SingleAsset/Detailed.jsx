import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';

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
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
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

  // Function to filter out unwanted fields
  const displayData = (dataObj) => {
    return Object.entries(dataObj)
      .filter(([key]) => key !== 'id' && key !== 'is_active' && key !== 'post_date') // Exclude specific fields
      .map(([key, value]) => (
        <div key={key} className="bg-white border shadow-md rounded-lg p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col m-2">
          <h3 className="text-lg font-semibold font-poppinsx text-gray-800 capitalize">{key.replace(/_/g, ' ')}</h3>
          <p className="text-gray-600 text-sm mt-1 font-poppins">{value}</p>
        </div>
      ));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Detailed View</h1>

      {data ? (
        <div className="flex flex-wrap -m-2">
          {Array.isArray(data) ? (
            data.map((item, index) => (
              <div key={index}>
                {displayData(item)}
              </div>
            ))
          ) : (
            displayData(data)
          )}
        </div>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
}

export default Detailed;
