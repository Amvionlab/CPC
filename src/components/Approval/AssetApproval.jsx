import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Checkbox } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { baseURL } from "../../config.js";
import { toast } from 'react-toastify';
import { UserContext } from '../UserContext/UserContext'; // Assuming you need the user context

function TypeTable() {
  const { type, group } = useParams();
  const [allData, setAllData] = useState(null);
  const [typeData, setTypeData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [filterText, setFilterText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Sorting state
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');

  // Assuming you use the context for user
  const { user } = useContext(UserContext);


  const fetchData = async () => {
    try {
      const typeResponse = await fetch(`${baseURL}/backend/fetchUnApprovedata.php?action=all`);
      const typedata = await typeResponse.json();
      setTypeData(typedata);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    

    fetchData();
  }, [type]);

  const [isMassActionOpen, setIsMassActionOpen] = useState(false);
  const [massActionType, setMassActionType] = useState(null);

  useEffect(() => {
    const filtered = selectedColumn === "" || selectedColumn === "All"
      ? typeData.filter(item =>
          Object.values(item).some(value =>
            value?.toString().toLowerCase().includes(filterText.toLowerCase())
          )
        )
      : typeData.filter(item =>
          item[selectedColumn]?.toString().toLowerCase().includes(filterText.toLowerCase())
        );

    setFilteredData(filtered);
  }, [selectedColumn, filterText, typeData]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const sortedData = () => {
    return filteredData.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSelectAllClick = (event) => {
    const newSelecteds = event.target.checked 
      ? sortedData().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => row.id)
      : [];
    setSelectedRows(newSelecteds);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelectedRows([]); // Clear selection on page change
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleConfirm = async () => {
    if (selectedAction === 'approve') {
      await handleApprove(selectedId);
    } else if (selectedAction === 'reject') {
      await handleReject(selectedId);
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
      const response = await fetch(`${baseURL}/backend/fetchUnApprovedata.php?action=approve`, {
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
      const response = await fetch(`${baseURL}/backend/fetchUnApprovedata.php?action=reject`, {
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

  const handleApproveSelected = async () => {
    console.log('Approving selected rows:', selectedRows);
    const payload = {
      selectedRows,
      user: user.firstname,
    };
  
    try {
      const response = await fetch(`${baseURL}/backend/fetchUnApprovedata.php?action=approvesel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        toast.success('Selected Transfers are Approved.');
        fetchData();
      } else {
        toast.error(`Failed to Approve Transfers. ${result.error || ''}`);
      }
    } catch (error) {
      console.error('Error approving transfer:', error);
      toast.error('An error occurred while approving the transfer.');
    } finally {
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
      const response = await fetch(`${baseURL}/backend/fetchUnApprovedata.php?action=rejectsel`, {
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
      toast.error('An error occurred while approving the transfer.');
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



  const exportToCSV = () => {
    const headers = ["ID", ...columns.map(col => col.column_name.replace('_', ' '))];
    const rows = filteredData.map((row, index) =>
      [index + 1, ...columns.map(col => row[col.column_name] || "-")]
    );

    let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${type}_data.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white p-1 rounded-md h-full flex flex-col">
      <div className="flex font-bold justify-between items-center mb-3">
        <h1 className="text-xl">Asset Approval</h1>
      </div>
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

        

        <div className="flex gap-1">
          <select 
            className="border rounded text-xs capitalize" 
            value={selectedColumn} 
            onChange={e => setSelectedColumn(e.target.value)}
          >
            <option value="All">All</option>
            {columns.map(column => (
              <option key={column.id} value={column.column_name}>
                {column.column_name.replace('_', ' ')}
              </option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Enter text" 
            className="border rounded p-1 text-xs" 
            value={inputValue} 
            onChange={e => { setInputValue(e.target.value); setFilterText(e.target.value); }} 
          />
        </div>
        <div className="flex gap-1">
          <TablePagination
            className="compact-pagination"
            rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={exportToCSV}
            className="px-2 py-1 bg-second rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
          >
            CSV
          </button>
        </div>
      </div>

      <TableContainer sx={{ maxHeight: "calc(100vh - 100px)" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ padding: '1px', fontSize: '12px' }}>
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < typeData.length}
                  checked={selectedRows.length === sortedData().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell align="center" sx={{ minWidth: 50, fontWeight: 600, fontSize: '12px' }}>
                <button onClick={() => handleRequestSort('id')}>ID</button>
              </TableCell>
              {['tag', 'name', 'manufacturer', 'model', 'serial_number', 'location', 'user_ID', 'asset_value', 'vendor_name', 'purchase_date', 'po_number', 'amc_from', 'amc_to', 'amc_interval', 'last_amc', 'procure_by', 'warranty_upto', 'Action'].map((column) => (
                <TableCell
                  className="capitalize text-nowrap"
                  key={column}
                  align="center"
                  sx={{ minWidth: 120, fontWeight: 600, fontSize: '12px' }}
                >
                  <button onClick={() => handleRequestSort(column)}>{column.replace(/_/g, ' ').toUpperCase()}</button>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex} selected={selectedRows.includes(row.id)}>
                  <TableCell padding="checkbox" sx={{ padding: '1px', fontSize: '12px' }}>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '2px', fontSize: '12px' }}>
                    {rowIndex + 1 + page * rowsPerPage}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.tag}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.name}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.manufacturer}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.model}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.serial_number}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.location}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.user_id}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.asset_value}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.vendor_name}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.purchase_date}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.po_number}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.amc_from}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.amc_to}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.amc_interval}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.last_amc}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.procure_by}</TableCell>
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>{row.warranty_upto}</TableCell>        
                  <TableCell align="center" sx={{ padding: '1px', fontSize: '12px' }}>
                    <IconButton onClick={() => handleOpen('approve', row.id)} sx={{ color: 'green' }}>
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpen('reject', row.id)} sx={{ color: 'red', ml: 1 }}>
                      <CancelIcon />
                    </IconButton>
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

export default TypeTable;
