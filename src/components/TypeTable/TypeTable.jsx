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
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [inputValue, setInputValue] = useState("");
   const [filterText, setFilterText] = useState("");
  const [filteredValues, setFilteredValues] = useState([]);
  const [filteredData, setFilteredData] = useState(typeData)

  // Sorting state
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');

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

  useEffect(() => {
    if (selectedColumn && filterText) {
      const filtered = typeData.filter((item) =>
        item[selectedColumn]
          ?.toString()
          .toLowerCase()
          .includes(filterText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(typeData); // No filter applied, show all data
    }
  }, [selectedColumn, filterText, typeData]);

  useEffect(() => {
    // Fetch active columns when component mounts or type changes
    fetch(`${baseURL}/backend/fetchTableFields.php?type=${type}`)
      .then((response) => response.json())
      .then((data) => {
        // Extract column names
        const columnNames = data.map(item => ({
          id: item.id,
          name: item.column_name
        }));
        setColumns(columnNames || []);
      })
      .catch((error) => console.error("Error fetching columns:", error));
  }, [type]);

  const fetchActiveColumns = () => {
    fetch(`${baseURL}/backend/fetchTableFields.php?type=${type}`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the active columns are returned in 'data.active_columns'
        setColumns(data.active_columns || []);
        console.log(data.active_columns)
      })
      .catch((error) => console.error("Error fetching columns:", error));
  };

  // Call fetchActiveColumns on component mount
  useEffect(() => {
    fetchActiveColumns();
  }, []);

  const handleColumnChange = (event) => {
    setSelectedColumn(event.target.value);
    setInputValue(""); // Clear input value when column changes
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setFilterText(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = () => {
    return typeData.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

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

  const handleCloseRemove = (
  ) => {
    setAnchorElRemove(null);
  };

  const toggleRowSelection = (rowIndex) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(rowIndex)) {
        return prevSelectedRows.filter((index) => index !== rowIndex); // Deselect if already selected
      } else {
        return [...prevSelectedRows, rowIndex]; // Select if not selected
      }
    });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // Select all rows on current page
      const newSelecteds = sortedData()
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((_, index) => index + page * rowsPerPage);
      setSelectedRows(newSelecteds);
    } else {
      // Deselect all rows on current page
      setSelectedRows([]);
    }
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
        <div className="w-full border-b h-10 flex text-sm justify-between items-center font-semibold mb-2">
          <div className="flex capitalize ml-4">
            <Link
              to={`/management/${group}`}
              className="text-flo hover:underline capitalize"
            >
              {group}
            </Link>
            <p>&nbsp; / {type}</p> {/* Space before the slash */}
          </div>

          <div className="flex gap-1">
            <TablePagination
              className="compact-pagination"
              rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
              component="div"
              count={filteredData.length} // Use filteredData length
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>

          <div className="flex gap-1">
      <select className="border rounded">
        <option value="">Column Filter - All</option>
        {/* Loop through columns and display the 'column_name' */}
        {columns.map((column) => (
          <option key={column.id} value={column.column_name}>
            {column.column_name}
          </option>
        ))}
      </select>
      <input type="text" placeholder="Enter text" className="border rounded" />
    </div>
          <div className="flex gap-1">
            <button
              onClick={exportToCSV}
              className="px-2 py-1 bg-second rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              CSV
            </button>
          </div>

          <div className="flex gap-2 mr-4">
            <button
              onClick={handleClickAdd}
              className="px-2 py-1 bg-second rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              onClick={handleClickRemove}
              className="px-2 py-1 bg-second rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              <FontAwesomeIcon icon={faMinus} />
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
                    checked={selectedRows.length > 0 && selectedRows.length === typeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell align="center" style={{ minWidth: 50, fontWeight: "bold" }}>
                  <button onClick={() => handleRequestSort('id')}>ID</button>
                </TableCell>
                {columnsToShow.map((column, index) => (
                  <TableCell
                    className="capitalize"
                    key={index}
                    align="center"
                    style={{ minWidth: 120, fontWeight: "bold" }}
                    onClick={() => handleRequestSort(column.column_name)} // Allow sorting on other columns
                  >
                    {column.column_name} {orderBy === column.column_name ? (order === 'asc' ? '↑' : '↓') : ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedData()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => {
                  const currentRowIndex = rowIndex + page * rowsPerPage; // Calculate the current row index
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={currentRowIndex} selected={selectedRows.includes(currentRowIndex)}>
                      <TableCell padding="checkbox" sx={{ padding: '1px', fontSize: '10px' }}>
                        <Checkbox
                          checked={selectedRows.includes(currentRowIndex)}
                          onChange={() => toggleRowSelection(currentRowIndex)}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ padding: '2px', fontSize: '12px' }}>
                        {currentRowIndex + 1}
                      </TableCell>
                      {columnsToShow.map((column, colIndex) => (
                        <TableCell align="center" key={colIndex} sx={{ padding: '1px', fontSize: '12px' }}>
                          {row[column.column_name] || "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
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
