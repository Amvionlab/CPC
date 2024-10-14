import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

// Define columns
const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "code", label: "ISO Code", minWidth: 100 },
  {
    id: "population",
    label: "Population",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "Size (km²)",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "density",
    label: "Density",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

// Function to create data rows
function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

// Sample data
const linkTo = [
  createData("India", "IN", 1324171354, 3287263),
  createData("China", "CN", 1403500365, 9596961),
  createData("Italy", "IT", 60483973, 301340),
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
];
const linkWith = [
  createData("United States", "US", 327167434, 9833520),
  createData("Canada", "CA", 37602103, 9984670),
  createData("Australia", "AU", 25475400, 7692024),
  createData("Germany", "DE", 83019200, 357578),
  createData("Ireland", "IE", 4857000, 70273),
];

function AssetConnections() {
  const [addLinkWith, setAddLinkWith] = useState(false);
  const [addLinkTo, setAddLinkTo] = useState(false);
  const [selectAsset, setSelectAsset] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [table, setTable] = useState("linkWith");
  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="asset-connections font-poppins inset-0 w-full">
      <div className="top flex justify-between items-center">
        <h1 className="font-semibold text-lg">Asset Connections (Links)</h1>
        <div className="capitalize flex gap-2 font-medium">
          <div className="p-2 bg-yellow-200 rounded-md cursor-pointer">
            <p>Asset Details</p>
          </div>
          <div
            className="p-2 bg-pink-200 rounded-md cursor-pointer"
            onClick={() => setAddLinkTo(!addLinkTo)}
          >
            <p>Add Link To</p>
          </div>

          <div
            className="p-2 bg-prime text-white rounded-md cursor-pointer"
            onClick={() => setAddLinkWith(!addLinkWith)}
          >
            <p>Add Link with</p>
          </div>
        </div>
      </div>

      {addLinkTo && (
        <div className="inset-0 absolute h-full w-full z-10 bg-black/30 flex justify-center items-center">
          <div className="h-[400px] w-[700px] bg-white rounded-md relative">
            <div
              className="absolute top-2 right-3 p-2 cursor-pointer text-black text-xl"
              onClick={() => setAddLinkTo(false)}
            >
              X
            </div>
            <div className="p-5">
              <div
                onClick={() => setSelectAsset(true)}
                className="cursor-pointer"
              >
                Select Asset
              </div>
            </div>
          </div>
        </div>
      )}

      {selectAsset && (
        <div className="inset-0 absolute h-full w-full bg-black/30 flex z-20 justify-center items-center">
          <div className="h-[300px] w-[600px] bg-white rounded-md relative">
            <div
              className="absolute top-2 right-3 p-2 text-black text-xl cursor-pointer"
              onClick={() => setSelectAsset(false)}
            >
              X
            </div>
          </div>
        </div>
      )}

      {addLinkWith && (
        <div className="inset-0 absolute h-full w-full z-10 bg-black/30 flex justify-center items-center">
          <div className="h-[400px] w-[700px] bg-white rounded-md relative">
            <div
              className="absolute top-2 right-3 p-2 text-black text-xl cursor-pointer"
              onClick={() => setAddLinkWith(false)}
            >
              X
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex gap-2 capitalize font-medium mb-2">
        <div
          className={`px-4 p-2  rounded-md ${
            table == "linkWith"
              ? "bg-prime text-white "
              : "bg-black text-white scale-75"
          }`}
          onClick={() => setTable("linkWith")}
        >
          <p className="cursor-pointer">Link With</p>
        </div>
        <div
          className={`px-4 p-2  rounded-md ${
            table == "linkTo"
              ? "bg-prime text-white "
              : "bg-black text-white scale-75"
          }`}
          onClick={() => setTable("linkTo")}
        >
          <p className="cursor-pointer">Link To</p>
        </div>
      </div>
      <div>
        <Paper sx={{ width: "100%", overflow: "hidden", p: 0 }}>
          <TableContainer sx={{ maxHeight: 270, p: 0 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, padding: "8px" }} // Decreased padding
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(table === "linkWith" ? linkWith : linkTo)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ padding: "8px" }}
                          >
                            {" "}
                            {/* Decreased padding */}
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={table === "linkWith" ? linkWith.length : linkTo.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ padding: "0 16px" }} // Adjusted padding
          />
        </Paper>
      </div>
    </div>
  );
}

export default AssetConnections;