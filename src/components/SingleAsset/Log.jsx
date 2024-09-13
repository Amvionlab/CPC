import React from 'react'
import { MdDateRange } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";

function Log() {
  const timelineData = [
    {  log: 'Completed Task A', date: '12-09-2024' },
    {  log: 'Started Task B', date: '10-09-2024' },
    {  log: 'Reviewed Task C', date: '09-09-2024' },
    {  log: 'Reviewed Task C', date: '09-09-2024' },
    { log: 'Reviewed Task C', date: '09-09-2024' },
    { log: 'Started Task B', date: '10-09-2024' },
  ];

  return (
    
<div className='mx-auto p-0'>
 
<div className='text-3xl text-center font-poppins mt-4'><span>Log Details</span></div>
 {timelineData.map((item, index) => (

<div>
  <div className='flex gap-4 p-7'>
<span className='p-4 border-prime border-2 rounded-tl-md rounded-br-md flex items-center justify-center w-16 max-w-16'>{index + 1}</span>
<span className='flex gap-2 border-2 rounded-tl-md rounded-br-md p-4 shadow-md w-56 max-w-56'><MdDateRange size={20}/>{item.date}</span>
<span className='flex gap-2 border-prime border-2 shadow-md rounded-tl-lg rounded-br-md p-4 w-full font-semibold'><MdTaskAlt size={20}/>{item.log}</span>
</div>

</div>


))}
 </div>




  
  
  )
}

export default Log