import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../../config.js';
import { toast } from "react-toastify";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, IconButton } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { CSVLink } from 'react-csv';
import { UserContext } from "../UserContext/UserContext";

function Transfer() {
  const { group, type, tag } = useParams();
  const [data, setData] = useState([]);
  const [detdata, setdetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user } = useContext(UserContext);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/dropdown.php`);
        const data = await response.json();
        setdetData((prevData) => ({ ...prevData, locations: data.locations }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const decodedGroup = decodeURIComponent(group);
  const decodedType = decodeURIComponent(type);
  const decodedTag = decodeURIComponent(tag);

  useEffect(() => {
    const url = `${baseURL}/backend/fetchTransfer.php?action=all`;

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

    const durl = `${baseURL}/backend/fetchDetailedView.php?group=${decodedGroup}&type=${decodedType}&tag=${decodedTag}`;

    fetch(durl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        setdetData(result);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.toString());
      });
  }, [group, type, tag]);

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
    } else if (searchField === 'description') {
      return item.to_location.toLowerCase().includes(term);
    }

    return false;
  });

  const handleApprove = (id) => {
    // Implement your approve logic here
    console.log('Approved', id);
    toast.success(`Transfer ID ${id} approved.`);
  };

  const handleReject = (id) => {
    // Implement your reject logic here
    console.log('Rejected', id);
    toast.error(`Transfer ID ${id} rejected.`);
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
      <div className="flex justify-between items-center">
        <div className='flex font-medium'>
          <select
            value={searchField}
            className='text-xs border p-1 mr-2 rounded-md'
            onChange={(e) => setSearchField(e.target.value)}
            style={{ height: '30px' }}
          >
            <option value="all">All</option>
            <option value="id">ID</option>
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
            style={{ height: '30px', width: '100px' }}
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

      {/* Table section */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>ID</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Transfer From</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Transfer To</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Description</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Request By</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Request On</TableCell>
              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ padding: '2px' }}>
            {filterData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className="text-xs">
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.id}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.from_location}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.to_location}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.description}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>{row.request_by}</TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>
                    {isValidDate(row.request_on) ? new Date(row.request_on).toLocaleString() : ''}
                  </TableCell>
                  <TableCell align="center" sx={{ padding: '10px', whiteSpace: 'nowrap' }}>
                    <IconButton aria-label="approve" color="success" onClick={() => handleApprove(row.id)}>
                      <CheckCircle />
                    </IconButton>
                    <IconButton aria-label="reject" color="error" onClick={() => handleReject(row.id)}>
                      <Cancel />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Transfer;
