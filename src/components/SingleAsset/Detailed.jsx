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

  // Assuming data is an object or an array of objects
  return (
    <div>
      <h1>Detailed View</h1>
      {data ? (
        <div>
          {/* Assuming data is an array of objects */}
          {Array.isArray(data) ? (
            data.map((item, index) => (
              <div key={index}>
                <h2>Item {index + 1}</h2>
                <pre>{JSON.stringify(item, null, 2)}</pre>
              </div>
            ))
          ) : (
            // If data is a single object
            <pre>{JSON.stringify(data, null, 2)}</pre>
          )}
        </div>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
}

export default Detailed;
