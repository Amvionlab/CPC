import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';

function UserDetail() {
  const { group, type, tag } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Decode the parameters to handle special characters
    const decodedGroup = decodeURIComponent(group);
    const decodedType = decodeURIComponent(type);
    const decodedTag = decodeURIComponent(tag);
    
    // Construct the URL with decoded values
    const url = `${baseURL}//backend/fetchUserDetail.php?group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        console.log(result); // Log the fetched user data
        setUserData(result); // Set the user data to state
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [group, type, tag]);

  return (
    <div>
      <h1>User Details</h1>
      <pre>{userData ? JSON.stringify(userData, null, 2) : 'Loading data...'}</pre>
    </div>
  );
}

export default UserDetail;
