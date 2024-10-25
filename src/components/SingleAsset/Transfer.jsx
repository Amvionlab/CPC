import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';
import { toast } from "react-toastify";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { LocalShipping, Cancel, AssignmentTurnedIn } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import { Tooltip, tooltipClasses, styled } from "@mui/material";
import { UserContext } from "../UserContext/UserContext";

function Transfer() {
  const [showPopup, setShowPopup] = useState(false);
  const { group, type, tag } = useParams();
  const [data, setData] = useState([]);
  const [detdata, setdetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user } = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');

  const PurpleTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'purple',
      color: 'white',
      fontSize: '0.875rem',
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: 'purple',
    },
  });

  const [toLocation, setToLocation] = useState('');

  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/dropdown.php`);
        const data = await response.json();
        if (data) {
          setBranches(data.branches || []);
          
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBranch();
  }, []);

  const getBranchNameById = (id) => {
    const branch = branches.find((branch) => branch.id === id);
    return branch ? branch.name : '-';
  };


  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "Transfer From", key: "from_location" },
    { label: "Transfer To", key: "to_location" },
    { label: "Description", key: "description" },
    { label: "Request By", key: "request_by" },
    { label: "Request On", key: "request_on" },
    { label: "Approved By", key: "approved_by" },
    { label: "Approved On", key: "approved_on" },
    { label: "Transfer By", key: "transfer_by" },
    { label: "Transfer On", key: "transfer_on" },
    { label: "Received By", key: "received_by" },
    { label: "Received On", key: "received_on" }
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
  const [locations, setLocations] = useState([]); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/dropdown.php`);
        const data = await response.json();
        setLocations(data.locations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


  const fetchAndUpdateData = async () => {
    try {
      const url = `${baseURL}/backend/fetchTransfer.php?action=fetch&group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);

      const durl = `${baseURL}/backend/fetchDetailedView.php?group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;
      const detailedResponse = await fetch(durl);
      if (!detailedResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const detailedResult = await detailedResponse.json();
      setdetData(detailedResult);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.toString());
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndUpdateData();
  }, [group, type, tag]);

  const handleAddNote = (e) => {
    e.preventDefault();
    
    if (!newNote.trim()) return;

    const noteData = {
      tag: tag,
      notes: newNote,
      fromLocation: detdata.location,
      toLocation: toLocation,
      user: user.firstname
    };
    fetch(`${baseURL}/backend/fetchTransfer.php?action=add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        setToLocation('');
        setNewNote('');
        togglePopup();
        fetchAndUpdateData();
        toast.success("Transfer Request Added");
      } else {
        console.error('Failed to add note:', result.error);
      }
    })
    .catch(error => {
      console.error('Error adding note:', error);
    });
  };

  function isValidDate(dateString) {
    return dateString && !dateString.startsWith('0000-00-00') && !isNaN(new Date(dateString).getTime());
  }
  
  const filterData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
  
    if (searchField === 'all') {
      return (
        item.id.toString().toLowerCase().includes(term) ||
        item.from_location.toLowerCase().includes(term) ||
        item.to_location.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.request_by.toLowerCase().includes(term) ||
        (isValidDate(item.request_on) && new Date(item.request_on).toLocaleString().toLowerCase().includes(term)) ||
        item.approved_by.toLowerCase().includes(term) ||
        (isValidDate(item.approved_on) && new Date(item.approved_on).toLocaleString().toLowerCase().includes(term)) ||
        item.transfer_by.toLowerCase().includes(term) ||
        (isValidDate(item.transfer_on) && new Date(item.transfer_on).toLocaleString().toLowerCase().includes(term)) ||
        item.received_by.toLowerCase().includes(term) ||
        (isValidDate(item.received_on) && new Date(item.received_on).toLocaleString().toLowerCase().includes(term))
      );
    } else if (searchField === 'id') {
      return item.id.toString().toLowerCase().includes(term);
    }  else if (searchField === 'from_location') {
      return item.from_location.toLowerCase().includes(term);
    } else if (searchField === 'to_location') {
      return item.to_location.toLowerCase().includes(term);
    } else if (searchField === 'description') {
      return item.to_location.toLowerCase().includes(term);
    } else if (searchField === 'request_by') {
      return item.request_by.toLowerCase().includes(term);
    }else if (searchField === 'request_on' && isValidDate(item.request_on)) {
      return new Date(item.request_on).toLocaleString().toLowerCase().includes(term);
    }else if (searchField === 'approved_by') {
      return item.approved_by.toLowerCase().includes(term);
    } else if (searchField === 'approved_on' && isValidDate(item.approved_on)) {
      return new Date(item.approved_on).toLocaleString().toLowerCase().includes(term);
    } else if (searchField === 'transfer_by') {
      return item.transfer_by.toLowerCase().includes(term);
    } else if (searchField === 'transfer_on' && isValidDate(item.transfer_on)) {
      return new Date(item.transfer_on).toLocaleString().toLowerCase().includes(term);
    } else if (searchField === 'received_by') {
      return item.received_by.toLowerCase().includes(term);
    } else if (searchField === 'received_on' && isValidDate(item.received_on)) {
      return new Date(item.received_on).toLocaleString().toLowerCase().includes(term);
    }
  
    return false;
  });

  const handleConfirm = async () => {
    if (selectedAction === 'out') {
      handleOut(selectedId);
    } else if (selectedAction === 'reject') {
      handleReject(selectedId);
    }
    else if (selectedAction === 'receive') {
      handleReceive(selectedId);
    }
    handleClose();
  };

  const handleOpen = (action, id) => {
    setSelectedAction(action);
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAction(null);
    setSelectedId(null);
  };
  
  const handleOut = async (id) => {
    const payload = {
      id,
      user: user.firstname,
    };

    try {
      const response = await fetch(`${baseURL}/backend/fetchTransfer.php?action=ofd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Transfer ID ${id} marked as out for delivery by ${user.firstname}.`);
        fetchAndUpdateData(); // Refetch data to get the updated list
      } else {
        toast.error(`Failed to mark Transfer ID ${id} as out for delivery. ${result.error || ''}`);
      }
    } catch (error) {
      console.error('Error marking transfer as out for delivery:', error);
      toast.error('An error occurred while marking the transfer as out for delivery.');
    }
  };

  const handleReject = async (id) => {
    const payload = {
      id,
      user: user.firstname,
    };

    try {
      const response = await fetch(`${baseURL}/backend/fetchTransfer.php?action=reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Transfer ID ${id} rejected by ${user.firstname}.`);
        fetchAndUpdateData(); // Refetch data to get the updated list
      } else {
        toast.error(`Failed to reject Transfer ID ${id}. ${result.error || ''}`);
      }
    } catch (error) {
      console.error('Error rejecting transfer:', error);
      toast.error('An error occurred while rejecting the transfer.');
    }
  };

  const handleReceive = async (id) => {
    const payload = {
      id,
      user: user.firstname,
    };

    try {
      const response = await fetch(`${baseURL}/backend/fetchTransfer.php?action=receive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Transfer ID ${id} marked as received by ${user.firstname}.`);
        fetchAndUpdateData(); // Refetch data to get the updated list
      } else {
        toast.error(`Failed to mark Transfer ID ${id} as received. ${result.error || ''}`);
      }
    } catch (error) {
      console.error('Error receiving transfer:', error);
      toast.error('An error occurred while marking the transfer as received.');
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  const filteredLocations = locations.filter(location => location.name !== detdata.location); 
  return (
    <div>
      <div className="flex font-bold justify-between items-center mb-3">
        <h1 className="text-xl ">Asset Transfer</h1>
        <button 
          className="flex text-xs items-center px-3 py-2 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform hover:scale-110"
          onClick={togglePopup}
        >
          <span> + </span> New Transfer
        </button>
      </div>

      {/* Search bar and dropdown */}
      <div className="flex justify-between items-center">
        <div className='flex font-medium'>
        
        <select 
          value={searchField} 
          className='text-xs border p-1 mr-2 rounded-md'
          onChange={(e) => setSearchField(e.target.value)} 
          style={{ height: '30px'}}
        >
          <option value="all">All</option>
          <option value="id">ID</option>
          <option value="from_location">Transfer From</option>
          <option value="to_location">Transfer To</option>
          <option value="description">Description</option>
          <option value="request_by">Request By</option>
          <option value="request_on">Request On</option>
          <option value="approved_by">Approved By</option>
          <option value="approved_on">Approved On</option>
          <option value="transfer_by">Transfer By</option>
          <option value="transfer_on">Transfer On</option>
          <option value="received_by">Received By</option>
          <option value="received_on">Received On</option>
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
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-2/6">
            <h2 className="text-xl font-semibold mb-4">New Transfer</h2>
            <form onSubmit={handleAddNote}>
              <div className='flex gap-4'>
                <div className="mb-4 w-1/2">
                  <label>From</label>
                  <input
                    value={detdata.location}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="w-full px-3 py-2 border text-xs rounded-lg"
                    disabled
                  />
                </div>
                <div className="mb-4 w-1/2 gap-2">
                  <label>To</label>
                  <select
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                    required
                  >
                    <option value="">Select Location</option>
                    {filteredLocations.map((location) => (
                      <option key={location} value={location.name}>{location.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <textarea
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-prime"
                  rows="4"
                  placeholder="Enter description here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  required
                />
              </div>
             
              <div className="flex justify-end">
                <button 
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={togglePopup}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-prime text-white px-4 py-2 rounded-md"
                >
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table section */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>ID</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Transfer From</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Transfer To</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Description</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Request By</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Request On</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Approved By</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Approved On</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Transfer By</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Transfer On</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Received By</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Received On</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap',fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ padding: '2px' }}>
            {filterData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className="text-xs">
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.id}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>
            {getBranchNameById(row.from_location)}
          </TableCell>
          <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>
            {getBranchNameById(row.to_location)}
          </TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.description}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.request_by}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>
                    {isValidDate(row.request_on) ? new Date(row.request_on).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.approved_by}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>
                    {isValidDate(row.approved_on) ? new Date(row.approved_on).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.transfer_by}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>
                    {isValidDate(row.transfer_on) ? new Date(row.transfer_on).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.received_by}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>
                    {isValidDate(row.received_on) ? new Date(row.received_on).toLocaleString() : ''}
                  </TableCell>

          <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>
          {row.status === '2' && (
            
              <PurpleTooltip 
                title="Out for Delivery" 
                placement="bottom" 
                arrow 
              >
                <IconButton aria-label="Out for Delivery" color="secondary" onClick={() => handleOpen('out', row.id)}>
                  <LocalShipping />
                </IconButton>
              </PurpleTooltip>
              )}
              {(row.status === '2' || row.status === '1') && (
              <PurpleTooltip 
                title="Reject" 
                placement="bottom" 
                arrow 
              >
                <IconButton aria-label="Reject" color="error" onClick={() => handleOpen('reject', row.id)}>
                  <Cancel />
                </IconButton>
              </PurpleTooltip>
           
          )}
          {(row.status === '3' && !(row.to_location == user.branch)) && (
                      'Not Received'
                    )}
          {((row.status === '3') && (row.to_location == user.branch)) && (  // Assuming status '3' implies ready to receive
                      <PurpleTooltip 
                        title="Receive" 
                        placement="bottom" 
                        arrow 
                      >
                        <IconButton aria-label="Receive" color="success" onClick={() => handleReceive(row.id)}>
                          <AssignmentTurnedIn />
                        </IconButton>
                      </PurpleTooltip>
                    )}
                    {(row.status === '4') && (
                      'Completed'
                    )}

        </TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedAction} transfer ID {selectedId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Transfer;
