import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Detailed() {
  // Get dynamic values from the URL
  const { group, type, tag } = useParams();
  
  // State to store fetched data
  const [data, setData] = useState(null);

  // Fetch data from the backend when the component is mounted
  useEffect(() => {
    // Decode the parameters to handle spaces and special characters
    const decodedGroup = decodeURIComponent(group); // e.g., "IT (IP)"
    const decodedType = decodeURIComponent(type);   // e.g., "DESKTOP"
    const decodedTag = decodeURIComponent(tag);     // e.g., "DESK0001"
    
    // Construct the URL with decoded values
    const url = `http://localhost/AMS/backend/fetchDetailedView.php?group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;
    
    // Fetch the data from the backend
    fetch(url)
      .then(response => response.json())
      .then(result => {
        console.log(result); // Log the fetched data
        setData(result);     // Set the data to state
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [group, type, tag]);

  return (
    <div>
      <h1>DetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedViewDetailedView</h1>
       </div>
  );
}

export default Detailed;
