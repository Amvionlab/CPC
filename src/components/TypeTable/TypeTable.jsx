import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { baseURL } from '../../config.js';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedColumns, theme) {
  return {
    fontWeight:
      selectedColumns.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    backgroundColor:
      selectedColumns.indexOf(name) === -1
        ? theme.palette.background.paper
        : theme.palette.primary.light,
    color:
      selectedColumns.indexOf(name) === -1
        ? theme.palette.text.primary
        : theme.palette.primary.contrastText,
  };
}

function TypeTable() {
  const { type, group } = useParams();
  const theme = useTheme();
  const [allData, setAllData] = useState(null); // State to hold fetched data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedColumns, setSelectedColumns] = useState([]);

  // Use useEffect to fetch data when the component mounts or the type changes
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${baseURL}/backend/fetchTableFields.php?type=${type}`);
      const data = await response.json();
      setAllData(data);
    };

    fetchData();
  }, [type]); // The effect runs when the component mounts or when 'type' changes

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const id = value; // Get the ID of the selected column
    // Update selected columns if not already selected
    if (!selectedColumns.includes(id)) {
      setSelectedColumns([...selectedColumns, id]);
      updateColumnStatus(id); // Call the function to update the column status
    }
  };

  const updateColumnStatus = (columnId) => {
    alert(columnId);

    // Create a URL with the id parameter
    const url = new URL(`${baseURL}/backend/updateColumnStatus.php`);
    url.searchParams.append('id', columnId); // Append the column ID as a query parameter

    fetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(`Column with ID ${columnId} activated successfully.`);
        // Reload data to reflect updates
        return fetch(`${baseURL}/backend/fetchTableFields.php?type=${type}`);
      } else {
        console.error("Error activating column: ", data.message);
      }
    })
    .then((response) => response.json())
    .then((data) => {
      setAllData(data); // Update the state with the new data after activation
    })
    .catch((error) => {
      console.error("There was an error during the fetch:", error);
    });
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

  const inActiveColumns = allData.inactive_columns.filter(
    (column) => column.type === type
  );

  return (
    <div className="relative lg:flex p-4 gap-4 w-full h-screen font-poppins lg:grid-cols-2 grid-cols-1 bg-slate-200">
      <div className="w-full bg-white p-4 rounded-md">
        <div className="w-full flex justify-between items-center text-base font-medium mb-5">
          <div className="flex">
            <Link to={`/management/${group}/${type}`} className="text-red-500 hover:underline">
              Asset Type
            </Link>
            <p>/{type}</p>
          </div>
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-name-label">Add Column</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={selectedColumns}
                onChange={handleChange}
                input={<OutlinedInput label="Add Column" />}
                MenuProps={MenuProps}
              >
                {inActiveColumns.map((column) => (
                  <MenuItem
                    key={column.id}
                    value={column.id}
                    style={getStyles(column.id, selectedColumns, theme)}
                  >
                    {column.column_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                    <TableCell className="capitalize" align="center" key={colIndex}>
                      {"-"} {/* Change this to render actual data */}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={allData.active_columns.length} 
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(+event.target.value);
              setPage(0);
            }}
          />
        </Paper>
      </div>
    </div>
  );
}

export default TypeTable;
