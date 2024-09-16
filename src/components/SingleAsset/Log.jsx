import React, { useEffect, useState, useContext  } from 'react';
import { useParams } from 'react-router-dom';
import { MdDateRange } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";
import { baseURL } from '../../config.js';
import { toast } from "react-toastify";

function Log() {
  const { group, type, tag } = useParams();
  const [timelineData, setData] = useState([]);
  const decodedGroup = decodeURIComponent(group);
  const decodedType = decodeURIComponent(type);
  const decodedTag = decodeURIComponent(tag);

  useEffect(() => {
    const url = `${baseURL}/backend/fetchLog.php?action=fetch&group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;
    
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

  return (
    
<div className='mx-auto p-0'>
<div className="flex font-bold justify-between items-center mb-3">
        <h1 className="text-xl ">Log Details</h1>
       
</div>

 {timelineData.map((item, index) => (

<div>
  <div className='flex gap-8 p-3 text-xs'>
<span className='p-2 border-prime border-2 rounded-tl-md rounded-br-md flex items-center justify-center w-16 max-w-16'>{index + 1}</span>
<span className='flex gap-2 border-prime border-2 rounded-tl-md rounded-br-md p-2 shadow-md w-64 max-w-64'><MdDateRange size={16}/>{item.post_date}</span>
<span className='flex gap-2 border-prime border-2 shadow-md rounded-tl-lg rounded-br-md p-2 w-full font-semibold'><MdTaskAlt size={20}/>{item.log}</span>
</div>

</div>


))}
 </div>




  
  
  )
}

export default Log