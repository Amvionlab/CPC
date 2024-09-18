import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { baseURL } from '../../config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

function PAB() {
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

 

  return (
    <div className='font-sui'>
     <div className="flex font-bold justify-between items-center mb-3">
        <h1 className="text-lg ">Planning & Budget</h1>
      </div>

      {data.purchase_date}<br />
      {data.po_number}<br />
      {data.procure_by}<br />
      {data.asset_value}<br />
      {data.vendor_name}<br />
    </div>
  );
}

export default PAB;
