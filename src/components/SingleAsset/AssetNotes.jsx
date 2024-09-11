import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';

function AssetNotes() {
  const [showPopup, setShowPopup] = useState(false);
  const { group, type, tag } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState(''); // State to handle new note input

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const decodedGroup = decodeURIComponent(group);
    const decodedType = decodeURIComponent(type);
    const decodedTag = decodeURIComponent(tag);
    
    const url = `${baseURL}/backend/fetchNotes.php?action=fetch&group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;
    
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

  const handleAddNote = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!newNote.trim()) return; // Don't add empty notes
    
    const noteData = {
      tag: tag,
      notes: newNote,
    };

    fetch(`${baseURL}/backend/fetchNotes.php?action=add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        // Reset the new note input and fetch updated data
        setNewNote('');
        togglePopup();
        // Optionally, you can re-fetch the notes or update state here to include the new note
        fetchNotes();
      } else {
        console.error('Failed to add note:', result.error);
      }
    })
    .catch(error => {
      console.error('Error adding note:', error);
    });
  };

  const fetchNotes = () => {
    const decodedGroup = decodeURIComponent(group);
    const decodedType = decodeURIComponent(type);
    const decodedTag = decodeURIComponent(tag);
    
    const url = `${baseURL}/backend/fetchNotes.php?action=fetch&group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        setData(result);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div>
      <div className="flex font-bold justify-between items-center mb-3">
        <h1 className="text-xl ">Asset Notes</h1>
        <button 
          className="flex text-xs items-center px-3 py-2 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform hover:scale-110"
          onClick={togglePopup}
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
            <form onSubmit={handleAddNote}>
              <div className="mb-4">
                <textarea
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-prime"
                  rows="4"
                  placeholder="Enter description here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
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
            {data.map(note => (
              <tr key={note.id} className='hover:bg-gray-200 transition duration-300 ease-in-out'>
                <td className="border border-slate-400 p-3 text-sm">{note.id}</td>
                <td className="border border-slate-400 p-3 text-sm">{note.notes}</td>
                <td className="border border-slate-400 p-3 text-sm">{new Date(note.post_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssetNotes;
