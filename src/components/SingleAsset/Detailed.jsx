import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  const displayData = (dataObj) => {
    return Object.entries(dataObj)
      .filter(([key]) => key !== 'id' && key !== 'is_active' && key !== 'post_date')
      .map(([key, value]) => (
        <div key={key} className="bg-white border shadow-md rounded-lg p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col m-2">
          <Link to={`/management/${value}`} className="flex-1">
            <div className="m-2 group transform transition-transform duration-300 hover:scale-105 bg-second shadow-md rounded-lg p-4 flex items-center justify-center cursor-pointer">
              <p className="font-medium text-base text-gray-700 text-center">
                {value}
              </p>
            </div>
          </Link>
        </div>
      ));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Detailed View</h1>

      {data ? (
        <div className="flex gap-1 flex-wrap">
          {Array.isArray(data) ? (
            data.map((item, index) => (
              <div key={index} className="flex flex-wrap w-full">
                {displayData(item)}
              </div>
            ))
          ) : (
            <div className="flex flex-wrap w-full">
              {displayData(data)}
            </div>
          )}
        </div>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
}

export default Detailed;
