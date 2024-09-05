import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button"; // Button for adding/removing columns
import Menu from "@mui/material/Menu"; // Dropdown for adding/removing columns
import MenuItem from "@mui/material/MenuItem"; // Dropdown items
import { baseURL } from "../../config.js";

// TypeTable Component
function TypeTable() {
  const { type, group } = useParams();
  const [allData, setAllData] = useState(null);
  const [inactiveColumns, setInactiveColumns] = useState([]);
  const [anchorElAdd, setAnchorElAdd] = useState(null); // Anchor for add dropdown
  const [anchorElRemove, setAnchorElRemove] = useState(null); // Anchor for remove dropdown

  // Fetch data when component mounts or when 'type' changes
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${baseURL}/backend/fetchTableFields.php?type=${type}`
      );
      const data = await response.json();
      setAllData(data);
      setInactiveColumns(data.inactive_columns || []); // Initialize inactive columns
    };

    fetchData();
  }, [type]);

  const handleAddColumn = (columnId) => {
    const url = new URL(`${baseURL}/backend/updateColumnStatus.php`);
    url.searchParams.append("id", columnId);
    url.searchParams.append("act", "add"); // Adding the action type

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(`Column with ID ${columnId} activated successfully.`);
          // Refresh data after addition
          return fetch(`${baseURL}/backend/fetchTableFields.php?type=${type}`);
        } else {
          console.error("Error activating column: ", data.message);
        }
      })
      .then((response) => response.json())
      .then((data) => {
        setAllData(data);
        setInactiveColumns(data.inactive_columns || []);
        setAnchorElAdd(null); // Close the dropdown after action
      })
      .catch((error) => {
        console.error("There was an error during the fetch:", error);
      });
  };

  const handleRemoveColumn = (columnId) => {
    //alert(columnId)
    const url = new URL(`${baseURL}/backend/updateColumnStatus.php`);
    url.searchParams.append("id", columnId);
    url.searchParams.append("act", "remove"); // Adding the action type for removal

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(`Column with ID ${columnId} deactivated successfully.`);
          // Refresh data after removal
          return fetch(`${baseURL}/backend/fetchTableFields.php?type=${type}`);
        } else {
          console.error("Error deactivating column: ", data.message);
        }
      })
      .then((response) => response.json())
      .then((data) => {
        setAllData(data);
        setInactiveColumns(data.inactive_columns || []);
        setAnchorElRemove(null); // Close the dropdown after action
      })
      .catch((error) => {
        console.error("There was an error during the fetch:", error);
      });
  };

  const handleClickAdd = (event) => {
    setAnchorElAdd(event.currentTarget); // Set the anchor for the add dropdown
  };

  const handleClickRemove = (event) => {
    setAnchorElRemove(event.currentTarget); // Set the anchor for the remove dropdown
  };

  const handleCloseAdd = () => {
    setAnchorElAdd(null); // Close the add dropdown
  };

  const handleCloseRemove = () => {
    setAnchorElRemove(null); // Close the remove dropdown
  };

  if (!allData || !allData.active_columns) {
    return (
      <p className="text-center text-red-600">
        <FontAwesomeIcon icon={faTriangleExclamation} /> No data from {type}
      </p>
    );
  }

  const columnsToShow = allData.active_columns.filter(
    (column) => column.type === type
  );

  return (
    <div className="relative lg:flex p-4 gap-4 w-full h-screen font-poppins lg:grid-cols-2 grid-cols-1 bg-slate-200">
      <div className="w-full bg-white p-4 rounded-md">
        <div className="w-full flex justify-between items-center text-base font-medium mb-5">
          <div className="flex">
            <Link
              to={`/management/${group}/${type}`}
              className="text-red-500 hover:underline"
            >
              Asset Type
            </Link>
            <p>/{type}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleClickAdd}>
              <div className="px-2 py-1 rounded-full bg-gradient-to-b from-prime via-slate-700 to-slate-600">
                <FontAwesomeIcon icon={faPlus} color="white" />
              </div>
            </button>
            <div className="flex">
              <button onClick={handleClickRemove}>
                <div className="px-2 py-1 rounded-full bg-gradient-to-tr from-red-600 via-red-700 to-red-900">
                  <FontAwesomeIcon icon={faMinus} color="white" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
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
                <TableRow hover role="checkbox" tabIndex={-1}>
                  {columnsToShow.map((column, colIndex) => (
                    <TableCell
                      className="capitalize"
                      align="center"
                      key={colIndex}
                    >
                      {"-"} {/* Change to render actual data */}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Dropdown for inactive columns */}
        <Menu
          anchorEl={anchorElAdd}
          open={Boolean(anchorElAdd)}
          onClose={handleCloseAdd}
        >
          {inactiveColumns.map((column) => (
            <MenuItem
              key={column.id}
              onClick={() => handleAddColumn(column.id)}
            >
              {column.column_name}
            </MenuItem>
          ))}
        </Menu>

        {/* Dropdown for active columns to remove */}
        <Menu
          anchorEl={anchorElRemove}
          open={Boolean(anchorElRemove)}
          onClose={handleCloseRemove}
        >
          {columnsToShow.map((column) => (
            <MenuItem
              key={column.id}
              onClick={() => handleRemoveColumn(column.id)}
            >
              {column.column_name}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
}

export default TypeTable;
