import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import { baseURL } from "../../config.js";

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

  // Sorting state
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fieldsResponse = await fetch(`${baseURL}/backend/fetchTableFields.php?type=${type}`);
        const fieldData = await fieldsResponse.json();
        setAllData(fieldData);
        setColumns(fieldData.active_columns || []);

        const typeResponse = await fetch(`${baseURL}/backend/fetchTypedata.php?type=${type}`);
        const typedata = await typeResponse.json();
        setTypeData(typedata);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [type]);

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
      ? sortedData().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((_, index) => index + page * rowsPerPage)
      : [];
    setSelectedRows(newSelecteds);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelectedRows([]); // Clear selection on page change
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  if (!allData || !allData.active_columns) {
    return <p className="text-center text-red-600">Loading...</p>;
  }

  const columnsToShow = allData.active_columns.filter(column => column.type === type);

  return (
      <div className="w-full bg-white p-1 rounded-md h-full flex flex-col">
        <div className="w-full border-b h-10 flex text-sm justify-between items-center font-semibold mb-2">
          <div className="flex capitalize ml-4 text-xl font-semibold">
            <p>Asset Approval</p>
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
                <TableCell padding="checkbox" sx={{ padding: '1px', fontSize: '10px' }}>
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < typeData.length}
                    checked={selectedRows.length === typeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                
                

                <TableCell align="center" style={{ minWidth: 50, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('id')}>ID</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 50, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('tag')}>Tag</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 50, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('name')}>Name</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 50, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('manufacturer')}>Manufacturer</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 50, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('model')}>Model</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 125, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('serial_number')}>Serial Number</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 50, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('location')}>Location</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 125, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('user_name')}>User Name</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 125, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('asset_value')}>Asset Value</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 125, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('vendor_name')}>Vendor Name</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 130, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('purchase_date')}>Purchase Date</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 125, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('po_number')}>Po Number</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 100, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('amc_from')}>Amc From</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 100, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('amc_to')}>Amc To </button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 120, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('amc_interval')}>Amc Interval </button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 125, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('last_amc')}>Last Amc </button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 125, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('procure_by')}>Procure By</button>
                </TableCell>

                <TableCell align="center" style={{ minWidth: 125, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('warranty_upto')}>Warranty Upto</button>
                </TableCell>



                {columnsToShow.map((column, index) => (
                  <TableCell
                    className="capitalize text-nowrap"
                    key={index}
                    align="center"
                    style={{ minWidth: 120, fontWeight: "bold" }}
                    onClick={() => handleRequestSort(column.column_name)} 
                  >
                    {column.column_name.replace('_', ' ')} {orderBy === column.column_name ? (order === 'asc' ? '↑' : '↓') : ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedData()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex} selected={selectedRows.includes(rowIndex)}>
                    <TableCell padding="checkbox" sx={{ padding: '1px', fontSize: '10px' }}>
                      <Checkbox
                        checked={selectedRows.includes(rowIndex)}
                        onChange={() => toggleRowSelection(rowIndex)}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ padding: '2px', fontSize: '12px' }}>
                        {rowIndex + 1}
                    </TableCell>

                    {columnsToShow.map((column, colIndex) => (
                      <TableCell align="center" key={colIndex} sx={{ padding: '1px', fontSize: '12px' }}>
                        {row[column.column_name] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
  );
}

export default TypeTable;
