import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { CSVLink } from 'react-csv';

function AssetNotes() {
  const [showPopup, setShowPopup] = useState(false);
  const { group, type, tag } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  const headers = [
    { label: "ID", key: "id" },
    { label: "Notes", key: "notes" },
    { label: "Date", key: "post_date" }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const decodedGroup = decodeURIComponent(group);
  const decodedType = decodeURIComponent(type);
  const decodedTag = decodeURIComponent(tag);
  useEffect(() => {
    
    
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
        setNewNote('');
        togglePopup();
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

  // Filter data based on search term and field
  const filterData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    
    if (searchField === 'all') {
      // Search across all fields
      return (
        item.id.toString().toLowerCase().includes(term) ||
        item.notes.toLowerCase().includes(term) ||
        new Date(item.post_date).toLocaleString().toLowerCase().includes(term)
      );
    } else if (searchField === 'post_date') {
      // Search in post_date field
      return new Date(item[searchField])
        .toLocaleString()
        .toLowerCase()
        .includes(term);
    } else {
      // Search in specific field (id or notes)
      return item[searchField].toString().toLowerCase().includes(term);
    }
  });

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

      {/* Search bar and dropdown */}
      <div className="flex justify-between items-center">
        <div className='flex font-medium'>
        
        <select 
          value={searchField} 
          className='text-xs border p-2 mr-2 rounded-md'
          onChange={(e) => setSearchField(e.target.value)} 
          style={{ height: '30px'}}
        >
          <option value="all">All</option>
          <option value="id">ID</option>
          <option value="notes">Notes</option>
          <option value="post_date">Date</option>
        </select>
        <input 
          type="text" 
          id="search-bar" 
          placeholder="Search" 
          className='text-xs border p-2 rounded-md'
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ height: '30px', width: '100px'}} 
        />
        </div>
       
        <TablePagination
          rowsPerPageOptions={[10, 25, 100, 500]}
          component="div"
          count={filterData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
         <CSVLink 
            data={filterData} 
            headers={headers}
            filename={`asset-notes-${decodedTag}.csv`}
            className="flex text-xs items-center px-3 py-1 bg-box border border-gray-400 font-bold shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform hover:scale-110"
          >
            CSV
          </CSVLink>
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
                  onClick={togglePopup}
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
     
        <TableContainer sx={{ maxHeight: 440 }} >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Notes</TableCell>
                <TableCell align="center">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ padding: '2px' }}>
              {filterData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className="text-xs">
                    <TableCell align="center" sx={{ padding: '10px' }}>{row.id}</TableCell>
                    <TableCell align="center" sx={{ padding: '10px' }}>{row.notes}</TableCell>
                    <TableCell align="center" sx={{ padding: '10px' }}>{new Date(row.post_date).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
  
    </div>
  );
}

export default AssetNotes;
