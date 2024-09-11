import React, { useState } from 'react';

function AssetNotes() {
  const [showPopup, setShowPopup] = useState(false);

  // Function to handle the Add Note button click
  const togglePopup = () => {
    setShowPopup(!showPopup); // Toggle the visibility of the popup
  };

  return (
    <div>
      <div>
        <button 
          className='bg-prime text-white p-2 font-poppins rounded-md flex gap-2 float-right m-5' 
          onClick={togglePopup} // Toggle the popup on button click
        >
          <span> + </span> Add Note
        </button>
      </div>
      
      {/* Popup form */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-96">
            <h2 className="text-xl font-semibold mb-4">Add a New Note</h2>
            
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Note</label>
                <textarea
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-prime"
                  rows="4"
                  placeholder="Enter description here..."
                />
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={togglePopup} // Close the popup
                >
                  Cancel
                </button>
                
                <button 
                  type="submit"
                  className="bg-prime text-white px-4 py-2 rounded-md"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table section */}
      <div className='font-poppins'>
  <table className="border-collapse border border-slate-400 w-full table-fixed shadow-lg">
    <thead className='bg-prime text-white'>
      <tr>
        <th className="border border-slate-400 p-3 text-left">ID</th>
        <th className="border border-slate-400 p-3 text-left">Notes</th>
        <th className="border border-slate-400 p-3 text-left">Date</th>
       
      </tr>
    </thead>
    <tbody className='bg-gray-100'>
      <tr className='hover:bg-gray-200 transition duration-300 ease-in-out'>
        <td className="border border-slate-400 p-3 text-sm">1</td>
        <td className="border border-slate-400 p-3 text-sm">Number</td>
        <td className="border border-slate-400 p-3 text-sm">Number</td>
        
      </tr>
      <tr className='bg-white hover:bg-gray-200 transition duration-300 ease-in-out'>
        <td className="border border-slate-400 p-3 text-sm">2</td>
        <td className="border border-slate-400 p-3 text-sm">Number</td>
        <td className="border border-slate-400 p-3 text-sm">Number</td>
        
      </tr>
      <tr className='hover:bg-gray-200 transition duration-300 ease-in-out'>
        <td className="border border-slate-400 p-3 text-sm">3</td>
        <td className="border border-slate-400 p-3 text-sm">Number</td>
        <td className="border border-slate-400 p-3 text-sm">Number</td>
        
      </tr>
      <tr className='bg-white hover:bg-gray-200 transition duration-300 ease-in-out'>
        <td className="border border-slate-400 p-3 text-sm">4</td>
        <td className="border border-slate-400 p-3 text-sm">Number</td>
        <td className="border border-slate-400 p-3 text-sm">Number</td>
        
      </tr>
      <tr className='hover:bg-gray-200 transition duration-300 ease-in-out'>
        <td className="border border-slate-400 p-3 text-sm">5</td>
        <td className="border border-slate-400 p-3 text-sm">Number</td>
        <td className="border border-slate-400 p-3 text-sm">Number</td>
        
      </tr>
    </tbody>
  </table>
</div>

    </div>
  );
}

export default AssetNotes;
