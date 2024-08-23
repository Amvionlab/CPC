import React, { useState } from "react";
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
import useFetch from "../hooks/useFetch";

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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    backgroundColor:
      personName.indexOf(name) === -1
        ? theme.palette.background.paper
        : theme.palette.primary.light,
    color:
      personName.indexOf(name) === -1
        ? theme.palette.text.primary
        : theme.palette.primary.contrastText,
  };
}

function TypeTable() {
  const { type, id } = useParams();

  const { allData } = useFetch(
    `http://localhost/AMS/backend/fetchTableFields.php`
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [columnIndex, setColunmIndex] = useState(8);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const newPersonName = typeof value === "string" ? value.split(",") : value;

    // Check if the new selection is adding or removing columns
    if (newPersonName.length > personName.length) {
      setColunmIndex((prevIndex) => prevIndex + 1);
    } else {
      setColunmIndex((prevIndex) => prevIndex - 1);
    }

    setPersonName(newPersonName);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Check if allData is available and contains the necessary properties
  if (!allData || !allData.active_columns) {
    return (
      <p className="text-center text-red-600">
        <FontAwesomeIcon icon={faTriangleExclamation} /> No data from {type}
      </p>
    );
  }

  // Filter active columns based on type_id
  const columnsToShow = allData.active_columns.filter(
    (column) => column.type_id === id
  );
  const inActiveColumns = allData.inactive_columns.filter(
    (column) => column.type_id === id
  );

  return (
    <div className="relative lg:flex p-4 gap-4 w-full h-screen font-poppins lg:grid-cols-2 grid-cols-1 bg-slate-200">
      <div className="w-full bg-white p-4 rounded-md">
        <div className="w-full flex justify-between items-center text-base font-medium mb-5">
          <div className="flex">
            <Link to={`/${id}/type`} className="text-red-500 hover:underline">
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
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput label="Add Column" />}
                MenuProps={MenuProps}
              >
                {inActiveColumns.map((column) => (
                  <MenuItem
                    key={column}
                    value={column}
                    style={getStyles(column.column_name, personName, theme)}
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
                  {columnsToShow.slice(0, columnIndex).map((column, index) => (
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
                  {columnsToShow
                    .slice(0, columnIndex)
                    .map((column, colIndex) => (
                      <TableCell
                        className="capitalize"
                        // key={colIndex}
                        align="center"
                      >
                        {/* {row[column.column_name] || "-"} */}
                        {"-"}
                      </TableCell>
                    ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={allData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
}

export default TypeTable;