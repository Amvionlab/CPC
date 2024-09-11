import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
      <div className="flex items-center mb-4">
      <TextField
          id="search-bar"
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ ml: 0, width: '300px' }}
          InputProps={{
            style: {
              height: '55px', 
            },
          }}
        />
        
        <FormControl variant="outlined" sx={{ ml: 2, minWidth: 120 }}>
          <InputLabel>Search Field</InputLabel>
          <Select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            label="Search Field"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="id">ID</MenuItem>
            <MenuItem value="notes">Notes</MenuItem>
            <MenuItem value="post_date">Date</MenuItem>
          </Select>
        </FormControl>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filterData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.notes}</TableCell>
                    <TableCell>{new Date(row.post_date).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default AssetNotes;
