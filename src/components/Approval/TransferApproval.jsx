import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';
import { toast } from 'react-toastify';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  TablePagination, IconButton, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Button, Checkbox 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { CSVLink } from 'react-csv';
import { UserContext } from '../UserContext/UserContext';
import { Tooltip, tooltipClasses } from '@mui/material';
import { styled } from '@mui/system';

function Transfer() {
  const { group, type, tag } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user } = useContext(UserContext);
  
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

  // Dialog states
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Mass action dialog states
  const [isMassActionOpen, setIsMassActionOpen] = useState(false);
  const [massActionType, setMassActionType] = useState(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');

  const headers = [
    { label: "ID", key: "id" },
    { label: "Transfer From", key: "from_location" },
    { label: "Transfer To", key: "to_location" },
    { label: "Description", key: "description" },
    { label: "Request By", key: "request_by" },
    { label: "Request On", key: "request_on" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}/backend/fetchTransfer.php?action=all`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.toString());
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function isValidDate(dateString) {
    return dateString && !dateString.startsWith('0000-00-00') && !isNaN(new Date(dateString).getTime());
  }

  const filterData = data.filter((item) => {
    const term = searchTerm.toLowerCase();

    if (searchField === 'all') {
      return (
        item.id.toString().toLowerCase().includes(term) ||
        item.tag.toLowerCase().includes(term) ||
        item.from_location.toLowerCase().includes(term) ||
        item.to_location.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.request_by.toLowerCase().includes(term) ||
        (isValidDate(item.request_on) && new Date(item.request_on).toLocaleString().toLowerCase().includes(term))
      );
    } else if (searchField === 'id') {
      return item.id.toString().toLowerCase().includes(term);
    } else if (searchField === 'request_by') {
      return item.request_by.toLowerCase().includes(term);
    } else if (searchField === 'request_on') {
      return item.request_on.toLowerCase().includes(term);
    } else if (searchField === 'from_location') {
      return item.from_location.toLowerCase().includes(term);
    } else if (searchField === 'to_location') {
      return item.to_location.toLowerCase().includes(term);
    } else if (searchField === 'tag') {
      return item.tag.toLowerCase().includes(term);
    }else if (searchField === 'description') {
      return item.to_location.toLowerCase().includes(term);
    }

    return false;
  });

  const handleConfirm = async () => {
    if (selectedAction === 'approve') {
      handleApprove(selectedId);
    } else if (selectedAction === 'reject') {
      handleReject(selectedId);
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

  const handleApprove = async (id) => {
    const payload = {
      id,
      user: user.firstname,
    };

    try {
      const response = await fetch(`${baseURL}/backend/fetchTransfer.php?action=approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Transfer ID ${id} approved by ${user.firstname}.`);
        fetchData();
      } else {
        toast.error(`Failed to approve Transfer ID ${id}. ${result.error || ''}`);
      }
    } catch (error) {
      console.error('Error approving transfer:', error);
      toast.error('An error occurred while approving the transfer.');
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
        fetchData(); // Refetch data to get the updated list
      } else {
        toast.error(`Failed to reject Transfer ID ${id}. ${result.error || ''}`);
      }
    } catch (error) {
      console.error('Error rejecting transfer:', error);
      toast.error('An error occurred while rejecting the transfer.');
    }
  };

  const sortedData = () => {
    return filterData; // Adjust this if you require actual sorting logic
  };

  const handleSelectAllClick = (event) => {
    const currentFilteredData = sortedData().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    if (event.target.checked) {
      const newSelecteds = currentFilteredData.map((n) => n.id);
      setSelectedRows(newSelecteds);
      return;
    }
    setSelectedRows([]);
  };

  const toggleRowSelection = (id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
  };

  const handleApproveSelected = async() => {
    console.log('Approving selected rows:', selectedRows);
    const payload = {
      selectedRows,
      user: user.firstname,
    };

    try {
      const response = await fetch(`${baseURL}/backend/fetchTransfer.php?action=approvesel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Selected Transfers are Approved.`);
        fetchData();
      } else {
        toast.error(`Failed to Approve Transfers. ${result.error || ''}`);
      }
    } catch (error) {
      console.error('Error approving transfer:', error);
      toast.error('An error occurred while approving the transfer.');
    }
    finally {
      setSelectedRows([]);
    }
  };

  const handleRejectSelected = async() => {
    console.log('Rejecting selected rows:', selectedRows);
    const payload = {
      selectedRows,
      user: user.firstname,
    };
    console.log(payload);
    try {
      const response = await fetch(`${baseURL}/backend/fetchTransfer.php?action=rejectsel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(`Selected Transfers are Rejected.`);
        fetchData();
      } else {
        toast.error(`Failed to Reject Transfers. ${result.error || ''}`);
      }
    } catch (error) {
      console.error('Error approving transfer:', error);
      toast.error('An error occurred while Rejecting the transfer.');
    }  
    finally {
      setSelectedRows([]);
    }
  };

  const handleMassActionConfirm = () => {
    if (massActionType === 'approve') {
      handleApproveSelected();
    } else if (massActionType === 'reject') {
      handleRejectSelected();
    }
    handleMassActionClose();
  };

  const handleMassActionOpen = (actionType) => {
    setMassActionType(actionType);
    setIsMassActionOpen(true);
  };

  const handleMassActionClose = () => {
    setIsMassActionOpen(false);
    setMassActionType(null);
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
        <h1 className="text-xl">Asset Transfer</h1>
      </div>

      {/* Search bar and dropdown */}
      <div className="w-full border-b h-10 flex text-sm justify-between items-center font-semibold mb-2">
         {selectedRows.length > 0 && (
          <div className="flex capitalize ml-4 text-xl font-semibold">
            <IconButton onClick={() => handleMassActionOpen('approve')} sx={{ color: 'green' }}>
              <CheckCircleIcon />
            </IconButton>
            <IconButton onClick={() => handleMassActionOpen('reject')} sx={{ color: 'red', ml: 1 }}>
              <CancelIcon />
            </IconButton>
          </div>
        )}
        <div className='flex font-medium'>
          <select
            value={searchField}
            className='text-xs border p-1 mr-2 rounded-md'
            onChange={(e) => setSearchField(e.target.value)}
            style={{ height: '30px', width: '75px' }}
          >
            
            <option value="all">All</option>
            <option value="tag">Tag</option>
            <option value="from_location">Transfer From</option>
            <option value="to_location">Transfer To</option>
            <option value="description">Description</option>
            <option value="request_by">Request By</option>
            <option value="request_on">Request On</option>
          </select>

          <input
            type="text"
            id="search-bar"
            placeholder="Search"
            className='text-xs border p-2 rounded-md'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ height: '30px', width: '150px' }}
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
          filename={`transfer-approvals.csv`}
          className="px-2 py-1 bg-second rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
        >
          CSV
        </CSVLink>
      </div>

      {/* Table section */}
      <TableContainer sx={{ maxHeight: "calc(100vh - 100px)" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ padding: '1px', fontSize: '12px' }}>
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                  checked={selectedRows.length > 0 && selectedRows.length === sortedData().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell align="center" sx={{ minWidth: 50, fontWeight: 600, fontSize: '12px' }}>
                ID
              </TableCell>
              {['Tag','Transfer From', 'Transfer To', 'Description', 'Request By', 'Request On', 'Action'].map((column) => (
                <TableCell
                  className="capitalize text-nowrap"
                  key={column}
                  align="center"
                  sx={{ minWidth: 120, fontWeight: 600, fontSize: '12px' }}
                >
                  {column.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ padding: '2px' }}>
            {filterData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} selected={selectedRows.includes(row.id)}>
                  <TableCell padding="checkbox" sx={{ padding: '1px', fontSize: '10px' }}>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{  padding: '1px', whiteSpace: 'nowrap' }}>{rowIndex + 1 + page * rowsPerPage}</TableCell>
                  <TableCell align="center" sx={{  padding: '1px', whiteSpace: 'nowrap' }}>{row.tag}</TableCell>
                  <TableCell align="center" sx={{  padding: '1px', whiteSpace: 'nowrap' }}>{row.from_location}</TableCell>
                  <TableCell align="center" sx={{  padding: '1px', whiteSpace: 'nowrap' }}>{row.to_location}</TableCell>
                  <TableCell align="center" sx={{  padding: '1px', whiteSpace: 'nowrap' }}>{row.description}</TableCell>
                  <TableCell align="center" sx={{  padding: '1px', whiteSpace: 'nowrap' }}>{row.request_by}</TableCell>
                  <TableCell align="center" sx={{  padding: '1px', whiteSpace: 'nowrap' }}>
                    {isValidDate(row.request_on) ? new Date(row.request_on).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="center" sx={{  padding: '1px', whiteSpace: 'nowrap' }}>
                    <PurpleTooltip 
                      title="Approve" 
                      placement="bottom" 
                      arrow 
                    >
                      <IconButton aria-label="approve" color="success" onClick={() => handleOpen('approve', row.id)}>
                        <CheckCircleIcon />
                      </IconButton>
                    </PurpleTooltip>
                    <PurpleTooltip 
                      title="Reject" 
                      placement="bottom" 
                      arrow 
                    >
                      <IconButton aria-label="reject" color="error" onClick={() => handleOpen('reject', row.id)}>
                        <CancelIcon />
                      </IconButton>
                    </PurpleTooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Single Confirmation Dialog */}
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

      {/* Mass Action Confirmation Dialog */}
      <Dialog open={isMassActionOpen} onClose={handleMassActionClose}>
        <DialogTitle>Confirm Mass Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {massActionType} {selectedRows.length} selected transfers?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMassActionClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleMassActionConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Transfer;
