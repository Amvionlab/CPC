import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
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
import { baseURL } from "../../config.js";
import Barcode from "react-barcode"; // Ensure Barcode import

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
  const [filteredData, setFilteredData] = useState([]);

  // Sorting state
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fieldsResponse = await fetch(
          `${baseURL}/backend/fetchTableFields.php?type=${type}`
        );
        const fieldData = await fieldsResponse.json();
        setAllData(fieldData);
        setInactiveColumns(fieldData.inactive_columns || []);
        setColumns(fieldData.active_columns || []);
        const typeResponse = await fetch(
          `${baseURL}/backend/fetchTypedata.php?type=${type}`
        );
        const typedata = await typeResponse.json();
        setTypeData(typedata);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [type]);

  useEffect(() => {
    const filtered =
      selectedColumn === "" || selectedColumn === "All"
        ? typeData.filter((item) =>
            Object.values(item).some((value) =>
              value?.toString().toLowerCase().includes(filterText.toLowerCase())
            )
          )
        : typeData.filter((item) =>
            item[selectedColumn]
              ?.toString()
              .toLowerCase()
              .includes(filterText.toLowerCase())
          );

    setFilteredData(filtered);
  }, [selectedColumn, filterText, typeData]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const sortedData = () => {
    return filteredData.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const toggleColumnStatus = async (columnId, action) => {
    try {
      const url = new URL(`${baseURL}/backend/updateColumnStatus.php`);
      url.searchParams.append("id", columnId);
      url.searchParams.append("act", action);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const data = await response.json();
      if (data.success) {
        const fieldsResponse = await fetch(
          `${baseURL}/backend/fetchTableFields.php?type=${type}`
        );
        const fieldData = await fieldsResponse.json();
        setAllData(fieldData);
        setInactiveColumns(fieldData.inactive_columns || []);
      }
    } catch (error) {
      console.error("There was an error:", error);
    }
  };

  const handleAddColumn = (columnId) => {
    toggleColumnStatus(columnId, "add");
    setAnchorElAdd(null);
  };

  const handleRemoveColumn = (columnId) => {
    toggleColumnStatus(columnId, "remove");
    setAnchorElRemove(null);
  };

  const handleSelectAllClick = (event) => {
    const newSelecteds = event.target.checked
      ? sortedData()
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((_, index) => index + page * rowsPerPage)
      : [];
    setSelectedRows(newSelecteds);
  };

  const toggleRowSelection = (rowIndex) => {
    setSelectedRows(prev => 
      prev.includes(rowIndex)
        ? prev.filter(id => id !== rowIndex)
        : [...prev, rowIndex]
    );
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
    const headers = [
      "ID",
      ...columns.map((col) => col.column_name.replace("_", " ")),
    ];
    const rows = filteredData.map((row, index) => [
      index + 1,
      ...columns.map((col) => row[col.column_name] || "-"),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${type}_data.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintBarcodes = () => {
    const selectedTags = selectedRows.map(index => sortedData()[index].tag);
    console.log(selectedTags)
    // Open a new window and generate barcodes for print
    if (selectedTags.length > 0) {
      const printWindow = window.open("", "", "height=600,width=800");
      printWindow.document.write("<html><head><title>Print Barcodes</title></head><body>");
      selectedTags.forEach(tag => {
        printWindow.document.write(`<div style="margin: 20px; text-align: center;">`);
        printWindow.document.write(`<div>Tag: ${tag}</div>`);
        printWindow.document.write(`<div><img src="https://barcode.tec-it.com/barcode.ashx?data=${tag}&code=Code128" alt="Barcode for ${tag}" /></div>`);
        printWindow.document.write(`</div>`);
      });
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  
  if (!allData || !allData.active_columns) {
    return <p className="text-center text-red-600">Loading...</p>;
  }

  const columnsToShow = allData.active_columns.filter(
    (column) => column.type === type
  );

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
            <p>&nbsp; / {type}</p>
          </div>

          <div className="flex gap-1 items-center">
            <button
              onClick={handlePrintBarcodes}
              className="px-2 py-1 bg-second rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              Print Barcodes
            </button>

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
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              <option value="All">All</option>
              {columns.map((column) => (
                <option key={column.id} value={column.column_name}>
                  {column.column_name.replace("_", " ")}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter text"
              className="border rounded p-1 text-xs"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setFilterText(e.target.value);
              }}
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

          <div className="flex gap-2 mr-4">
            <button
              onClick={(e) => setAnchorElAdd(e.currentTarget)}
              className="px-2 py-1 bg-second rounded border text-xs shadow-md transform hover:scale-110 transition-transform duration-200 ease-in-out"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button
              onClick={(e) => setAnchorElRemove(e.currentTarget)}
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
                <TableCell
                  padding="checkbox"
                  sx={{ padding: "1px", fontSize: "10px" }}
                >
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < typeData.length
                    }
                    checked={
                      selectedRows.length ===
                      typeData.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      ).length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: 50, fontWeight: "bold" }}
                >
                  <button onClick={() => handleRequestSort("id")}>ID</button>
                </TableCell>
                {columnsToShow.map((column, index) => (
                  <TableCell
                    className="capitalize text-nowrap"
                    key={index}
                    align="center"
                    style={{ minWidth: 120, fontWeight: "bold" }}
                    onClick={() => handleRequestSort(column.column_name)}
                  >
                    {column.column_name.replace("_", " ")}{" "}
                    {orderBy === column.column_name
                      ? order === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedData()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={rowIndex}
                    selected={selectedRows.includes(rowIndex)}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{ padding: "1px", fontSize: "10px" }}
                    >
                      <Checkbox
                        checked={selectedRows.includes(rowIndex)}
                        onChange={() => toggleRowSelection(rowIndex)}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ padding: "2px", fontSize: "12px" }}
                    >
                      <Link
                        to={`/management/${group}/${type}/${row.tag}`}
                        className="text-flo hover:underline capitalize"
                      >
                        {rowIndex + 1}
                      </Link>
                    </TableCell>

                    {columnsToShow.map((column, colIndex) => (
                      <TableCell
                        align="center"
                        key={colIndex}
                        sx={{ padding: "1px", fontSize: "12px" }}
                      >
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
          onClose={() => setAnchorElAdd(null)}
        >
          {inactiveColumns.length > 0 ? (
            inactiveColumns.map((column) => (
              <MenuItem
                className="capitalize"
                key={column.id}
                onClick={() => handleAddColumn(column.id)}
              >
                {column.column_name.replace("_", " ")}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Nothing</MenuItem>
          )}
        </Menu>

        <Menu
          anchorEl={anchorElRemove}
          open={Boolean(anchorElRemove)}
          onClose={() => setAnchorElRemove(null)}
        >
          {columnsToShow.length > 0 ? (
            columnsToShow.map((column) => (
              <MenuItem
                className="capitalize"
                key={column.id}
                onClick={() => handleRemoveColumn(column.id)}
              >
                {column.column_name.replace("_", " ")}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Nothing</MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
}

export default TypeTable;
