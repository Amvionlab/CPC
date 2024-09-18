import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { baseURL } from '../../config.js';


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



      
        <div className='text-center'>
        <i className="fa fa-user text-5xl" ></i>

             <h3 className="text-2xl">Procure By</h3>
              <p className=''>{data.procure_by}</p><br />
         </div>
<div className='grid grid-cols-2 gap-4'>
<div className='text-center '>
  <div className=' rounded-lg  '>
  <i className="fa fa-calendar text-5xl"></i>

             <h3 className="text-2xl mt-4">Purchase Date</h3>
              <p className=''>   {data.purchase_date}<br /></p><br />
              </div>
</div>
<div className='text-center '>
<div className=' rounded-lg '>
<i className="fa fa-file text-5xl"></i>

             <h3 className="text-2xl mt-4">Purchase Number</h3>
              <p className=''>      {data.po_number}<br /></p><br />
              </div>
</div>
<div className='text-center '>
<div className=' rounded-lg '>
<i className="fa fa-dollar text-5xl"></i>

             <h3 className="text-2xl mt-4">Asset Value</h3>
              <p className=''>   {data.asset_value}<br /></p><br />
              </div>
</div>
<div className='text-center '>
<div className=' rounded-lg '>
<i className="fa fa-user text-5xl"></i>

             <h3 className="text-2xl mt-4">Vendor Name</h3>
              <p className=''>       {data.vendor_name}<br /></p><br />
              </div>
</div>
</div>



        




   
   
      
      
  
    </div>
  );
}

export default PAB;
