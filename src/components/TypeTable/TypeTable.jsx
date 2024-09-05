import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { baseURL } from "../../config.js";

function TypeTable() {
  const { type, group } = useParams();
  const [allData, setAllData] = useState(null);
  const [inactiveColumns, setInactiveColumns] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const [anchorElRemove, setAnchorElRemove] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${baseURL}/backend/fetchTableFields.php?type=${type}`);
      const data = await response.json();
      setAllData(data);
      setInactiveColumns(data.inactive_columns || []);
    };

    fetchData();
  }, [type]);

  useEffect(() => {
    const fetchTypeData = async () => {
      const response = await fetch(`${baseURL}/backend/fetchTypedata.php?type=${type}`);
      const data = await response.json();
      setTypeData(data);
    };

    fetchTypeData();
  }, [type]);

  const handleAddColumn = (columnId) => {
    const url = new URL(`${baseURL}/backend/updateColumnStatus.php`);
    url.searchParams.append("id", columnId);
    url.searchParams.append("act", "add");

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          return fetch(`${baseURL}/backend/fetchTableFields.php?type=${type}`);
        }
      })
      .then((response) => response.json())
      .then((data) => {
        setAllData(data);
        setInactiveColumns(data.inactive_columns || []);
        setAnchorElAdd(null);
      })
      .catch((error) => console.error("There was an error:", error));
  };

  const handleRemoveColumn = (columnId) => {
    const url = new URL(`${baseURL}/backend/updateColumnStatus.php`);
    url.searchParams.append("id", columnId);
    url.searchParams.append("act", "remove");

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          return fetch(`${baseURL}/backend/fetchTableFields.php?type=${type}`);
        }
      })
      .then((response) => response.json())
      .then((data) => {
        setAllData(data);
        setInactiveColumns(data.inactive_columns || []);
        setAnchorElRemove(null);
      })
      .catch((error) => console.error("There was an error:", error));
  };

  const handleClickAdd = (event) => {
    setAnchorElAdd(event.currentTarget);
  };

  const handleClickRemove = (event) => {
    setAnchorElRemove(event.currentTarget);
  };

  const handleCloseAdd = () => {
    setAnchorElAdd(null);
  };

  const handleCloseRemove = () => {
    setAnchorElRemove(null);
  };

  const toggleRowSelection = (rowIndex) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(rowIndex)
        ? prevSelectedRows.filter((index) => index !== rowIndex)
        : [...prevSelectedRows, rowIndex]
    );
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = typeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((_, index) => index + page * rowsPerPage);
      setSelectedRows(newSelecteds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelectedRows([]); // Clear selection on page change to simplify logic
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToCSV = () => {
    const headers = ["ID", ...columnsToShow.map(col => col.column_name)];
    const rows = typeData.map((row, index) =>
      [index + 1, ...columnsToShow.map(col => row[col.column_name] || "-")]
    );

    let csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${type}_data.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  if (!allData || !allData.active_columns) {
    return (
      <p className="text-center text-red-600">
        <FontAwesomeIcon icon={faTriangleExclamation} /> No data from {type}
      </p>
    );
  }

  const columnsToShow = allData.active_columns.filter(column => column.type === type);

  return (
    <div className="lg:flex p-1 gap-4 w-full h-full lg:grid-cols-2 grid-cols-1 bg-slate-200">
      <div className="w-full bg-white p-1 rounded-md h-full flex flex-col">
        <div className="w-full h-9 flex text-sm justify-between items-center font-semibold mb-3">
          <div className="flex capitalize">
            <Link
              to={`/management/${group}/${type}`}
              className="text-prime hover:underline capitalize "
            >
              ASSET TYP
            </Link>
            <p>E / {type}</p>
          </div>
          <div className="flex gap-1"> {/* Reduced gap between elements */}
  <TablePagination
    className="compact-pagination" // Use the compact pagination class
    rowsPerPageOptions={[5, 10, 25, 50, 100, 500, 1000]}
    component="div"
    count={typeData.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    size="small" // Ensure pagination is already smaller
  />
  </div>
  <div className="flex gap-1">
  <button
    onClick={exportToCSV}
    className="px-2 py-1 rounded border text-xs hover:shadow-md shadow-inner"
  >
    CSV
  </button></div>
  <div className="flex gap-2 mr-2">
  <button
    onClick={handleClickAdd}
    className="px-2 py-1 rounded border text-xs hover:shadow-md shadow-inner"
  >
    <FontAwesomeIcon icon={faPlus} />
  </button>
  <button
    onClick={handleClickRemove}
    className="px-2 py-1 rounded border text-xs hover:shadow-md shadow-inner"
  >
    <FontAwesomeIcon icon={faMinus} />
  </button>
  </div>


        </div>

        
          <TableContainer sx={{ maxHeight: "calc(100vh - 100px)" }}> {/* Adjust the value as necessary */}
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ padding: '1px', fontSize: '10px' }}>
                    <Checkbox
                      indeterminate={selectedRows.length > 0 && selectedRows.length < typeData.length}
                      checked={typeData.length > 0 && selectedRows.length === typeData.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell align="center" style={{ minWidth: 50, fontWeight: "bold" }}>
                    ID
                  </TableCell>
                  {columnsToShow.map((column, index) => (
                    <TableCell
                      className="capitalize"
                      key={index}
                      align="center"
                      style={{ minWidth: 120, fontWeight: "bold" }}
                    >
                      {column.column_name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {typeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                    <TableCell padding="checkbox" sx={{ padding: '1px', fontSize: '10px' }}> {/* Reduced padding */}
                      <Checkbox
                        checked={selectedRows.includes(rowIndex + page * rowsPerPage)}
                        onChange={() => toggleRowSelection(rowIndex + page * rowsPerPage)}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ padding: '2px', fontSize: '10px' }}> {/* Reduced padding */}
                      {rowIndex + 1 + page * rowsPerPage}
                    </TableCell>
                    {columnsToShow.map((column, colIndex) => (
                      <TableCell align="center" key={colIndex} sx={{ padding: '10px', fontSize: '12px' }}> {/* Reduced padding */}
                        {row[column.column_name] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>


            </Table>
          </TableContainer>

          
        

          <Menu
  anchorEl={anchorElAdd}
  open={Boolean(anchorElAdd)}
  onClose={handleCloseAdd}
>
  {inactiveColumns.length > 0 ? (
    inactiveColumns.map((column) => (
      <MenuItem
        key={column.id}
        onClick={() => handleAddColumn(column.id)}
      >
        {column.column_name}
      </MenuItem>
    ))
  ) : (
    <MenuItem disabled>
      Nothing
    </MenuItem>
  )}
</Menu>

<Menu
  anchorEl={anchorElRemove}
  open={Boolean(anchorElRemove)}
  onClose={handleCloseRemove}
>
  {columnsToShow.length > 0 ? (
    columnsToShow.map((column) => (
      <MenuItem
        key={column.id}
        onClick={() => handleRemoveColumn(column.id)}
      >
        {column.column_name}
      </MenuItem>
    ))
  ) : (
    <MenuItem disabled>
      Nothing
    </MenuItem>
  )}
</Menu>

      </div>
    </div>
  );
}

export default TypeTable;
