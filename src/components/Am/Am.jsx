import React, { useContext, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { baseURL } from "../../config.js";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  Paper,
  TableSortLabel,
  FormControl,
  OutlinedInput,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { UserContext } from "../UserContext/UserContext.jsx";
import Chart from "react-google-charts";
import { PieChart } from "@mui/x-charts";

function Reports() {
  const [tickets, setTickets] = useState([]);
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [ticketsPerPage, setTicketsPerPage] = useState(50);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("bpartner_group");
  const [selectedLabels, setSelectedLabels] = useState([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const csvData = filteredTickets.map((ticket) => ({
    Id: ticket.id,
    Type: ticket.type,
    SLA: ticket.sla,
    Status: ticket.status,
    Service: ticket.service,
    Department: ticket.department,
    Assignees: ticket.assignees,
    Domain: ticket.domain,
    SubDomain: ticket.subdomain,
    Customer: ticket.customer,
    "Created At": ticket.post_date,
    "Created By": ticket.name,
    "Closed At": ticket.closed_date,
  }));

  const headers = [
    "month",
    "Date Invoiced",
    "bpartner group",
    "business partner",
    "prod value",
    "prod name",
    "invoiced qty",
    "line amt",
    "product category",
    "product group",
    "state",
    "zone",
    "division",
    "am",
    "territory",
    "rm",
    "buh",
    "product mapping",
    "product type",
    "sap code",
    "product grouping",
    "vendor name",
    "parameter sap",
    "brand",
    "product division",
    "document",
    "revenue account",
    "cogs account",
    "year",
    "customer po num",
    "mapping code",
    "euroimmun top product",
    "pack size",
    "aop 2024 mapping",
    "territory 2023",
    "buh 2023",
  ];

  useEffect(() => {
    const fetchTickets = async (value) => {
      try {
        let response;
        if (user && user.accessId === "3") {
          response = await fetch(
            `${baseURL}backend/fetchTickets.php?user=${user.userId}`
          );
        } else if (user && user.accessId === "5") {
          response = await fetch(
            `${baseURL}backend/fetchTickets.php?support=${user.userId}`
          );
        } else {
          response = await fetch(`${baseURL}backend/fetchTickets.php`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setTickets(data);
        } else {
          setTickets([]); // Ensure tickets is always an array
        }
        setFilteredTickets(data);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };
    fetchTickets();
  }, [user]);

  const handleFilterChange = (index) => (event) => {
    const {
      target: { value },
    } = event;
    const updatedLabels = [...selectedLabels];
    updatedLabels[index] = typeof value === "string" ? value.split(",") : value;
    setSelectedLabels(updatedLabels);
  };

  const groupDataByField = (field, data) => {
    const groupedData = {};
    data.forEach((ticket) => {
      const value = ticket[field] || "Empty";
      groupedData[value] = (groupedData[value] || 0) + 1;
    });
    return groupedData;
  };

  // Generate data for the selected filter based on filteredTickets
  const domainData = groupDataByField(selectedFilter, filteredTickets);
  // Ensure domainData is structured like { "Domain1": 10, "Domain2": 20 }
  // Function to wrap labels
  const wrapLabel = (label) => {
    const words = label.split(" ");
    return words.length > 100
      ? words.slice(0, 1).join(" ") + "\n" + words.slice(1).join(" ")
      : label;
  };

  const labelValue = Object.entries(domainData)

    .slice(0, 10)
    .map(([label]) => {
      return wrapLabel(label.length > 12 ? label.slice(0, 10) + "..." : label);
    });

  const pieChartData = Object.entries(domainData)
    // .slice(0, 100)
    .map(([label, value], index) => {
      return {
        label: labelValue[index],
        value,
      };
    });

  const pieChartOptions = {
    legend: { textStyle: { fontSize: 12 } },
    pieSliceText: "value",
    title: ` Ticket Distribution by ${selectedFilter}`,
    is3D: true,
    pieSliceTextStyle: { fontSize: 20 },
    titleTextStyle: { fontSize: 18, color: "#000" },
  };

  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setTicketsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //ascending

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (a[orderBy] < b[orderBy]) {
      return -1;
    }
    if (a[orderBy] > b[orderBy]) {
      return 1;
    }
    return 0;
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const sortedTickets = stableSort(
    filteredTickets,
    getComparator(order, orderBy)
  );

  useEffect(() => {
    // Filter by selected labels
    const filteredByLabels = tickets.filter((ticket) =>
      selectedLabels.every((labels, index) => {
        const field = [
          "date_invoiced",
          "bpartner_group",
          "business_partner",
          "prod_name",
          "state",
          "division",
          "territory",
          "rm",
          "buh",
          "vendor_name",
          "zone",
          "parameter_sap",
          "document",
          "customer_po_num",
          "aop_2024_mapping",
        ][index];
        return labels.length === 0 || labels.includes(ticket[field] || "");
      })
    );

    let filteredByDate = filteredByLabels;

    if (fromDate || toDate) {
      filteredByDate = filteredByLabels.filter((ticket) => {
        const ticketDate = ticket.date_invoiced;

        // Set defaults if fromDate or toDate is missing
        const start = fromDate || "1900-01-01";
        const end = toDate || "2100-01-01";

        return ticketDate >= start && ticketDate <= end;
      });
    }

    // Update state with filtered tickets
    setFilteredTickets(filteredByDate);
  }, [selectedLabels, tickets, fromDate, toDate]);

  return (
    <div className="flex h-full bg-second p-0.5 gap-0.5 font-serif">
      {/* Sidebar (20%) */}
      <div className="w-2/12 sticky top-0 h-full rounded bg-box p-2 overflow-y-auto">
  {selectedLabels.map((selectedLabel, index) => (
    <FormControl key={index} sx={{ my: 0.5, width: '100%' }} size="small"> {/* Add size="small" for consistency */}
      <Select
        multiple
        value={selectedLabel}
        onChange={handleFilterChange(index)}
        displayEmpty
        input={<OutlinedInput />}
        renderValue={(selected) =>
          selected.length === 0 ? (
            <span style={{ color: '#aaa' }}>
              {
                [
                  "date_invoiced",
                  "bpartner_group",
                  "business_partner",
                  "prod_name",
                  "state",
                  "division",
                  "territory",
                  "rm",
                  "buh",
                  "vendor_name",
                  "zone",
                  "parameter_sap",
                  "document",
                  "customer_po_num",
                  "aop_2024_mapping",
                ][index]
              }
            </span>
          ) : (
            selected.join(', ')
          )
        }
        sx={{
          fontSize: '0.75rem', // Adjust the font size
          padding: '16px', // Adjust padding for smaller appearance
          height: '30px', // Specific height for small size
          '& .MuiSelect-select': { // Target the inner select styles
            minHeight: '1.25rem', // Adjust minimum height for a smaller look
            padding: '5px', // Internal padding
          },
        }}
        MenuProps={{
          PaperProps: {
            style: { maxHeight: 30 * 4.5 + 2, width: 100 },
          },
        }}
      >
        {Object.entries(groupDataByField([
          "date_invoiced",
          "bpartner_group",
          "business_partner",
          "prod_name",
          "state",
          "division",
          "territory",
          "rm",
          "buh",
          "vendor_name",
          "zone",
          "parameter_sap",
          "document",
          "customer_po_num",
          "aop_2024_mapping",
        ][index], tickets)).map(([label]) => (
          <MenuItem key={label} value={label}>
            <Checkbox checked={selectedLabel.includes(label)} size="small" />
            <ListItemText primary={label} sx={{ fontSize: '0.8rem' }} /> {/* Adjust font size */}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ))}
</div>

      {/* Main Content Area (80%) */}
      <div className="w-11/12 overflow-auto">
        {/* First Row */}
        <div className="flex h-1/2 gap-0.5 mb-0.5">
          <div className="w-2/12 bg-box p-1 rounded gap-1">
          {[
             
             "bpartner_group",
             "business_partner",
             "prod_name",
             "state",
             "division",
             "territory",
             "rm",
             "buh",
             "vendor_name",
             "zone",
           ].map((item, index) => (
             <div
               key={index}
               onClick={() => setSelectedFilter(item.toLowerCase())}
               className={`py-1 px-2 text-xs break-words inline-block font-medium rounded cursor-pointer m-1 ${
                 item.toLowerCase() === selectedFilter
                   ? "bg-prime text-white"
                   : "bg-box text-black border border-black"
               }`}
             >
               <p className="capitalize text-nowrap">
                 {item.replaceAll("_", " ")}
               </p>
             </div>
           ))}
         </div>
         
          <div className="w-5/12 bg-box p-2 rounded">
          <div className="w-full flex-col justify-start items-center h-full rounded flex mb-2 p-1 overflow-hidden">
           <PieChart
             series={[
               {
                 data: pieChartData, // Pass the correctly formatted data
                 innerRadius: 50,
                 outerRadius: 150,
                 highlightScope: { faded: "global", highlighted: "item" },
                 faded: {
                   innerRadius: 40,
                   additionalRadius: 0,
                   color: "gray",
                 },
                 plugins: [
                   {
                     name: "legend",
                     options: {
                       labels: {
                         font: {
                           size: 10, // Set the desired font size for the legend here
                         },
                       },
                     },
                   },
                 ],
               },
             ]}
             height={450}
             width={500}
           />
            
          </div>
          </div>
          <div className="w-5/12 bg-box p-2 rounded">
          <div className="w-full flex-col justify-start items-center h-full rounded flex mb-2 p-1 overflow-hidden">
           <PieChart
             series={[
               {
                 data: pieChartData, // Pass the correctly formatted data
                 innerRadius: 50,
                 outerRadius: 150,
                 highlightScope: { faded: "global", highlighted: "item" },
                 faded: {
                   innerRadius: 40,
                   additionalRadius: 0,
                   color: "gray",
                 },
                 plugins: [
                   {
                     name: "legend",
                     options: {
                       labels: {
                         font: {
                           size: 10, // Set the desired font size for the legend here
                         },
                       },
                     },
                   },
                 ],
               },
             ]}
             height={450}
             width={500}
           />
            
          </div>
          </div>

        </div>
        
        {/* Second Row: Table */}
        <div className="bg-box p-2 rounded h-1/2 ">
        <div className="w-full border-b h-10 flex text-sm justify-between items-center font-medium mb-2">
              <div className="flex capitalize ml-1 mt-3 text-base">
                <p className="font-bold text-prime">Analytics</p>
              </div>
              <TablePagination
                component="div"
                sx={{
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    { fontSize: "10px" },
                  "& .MuiTablePagination-select": { fontSize: "10px" },
                  "& .MuiTablePagination-actions": { fontSize: "10px" },
                  minHeight: "30px",
                  ".MuiTablePagination-toolbar": {
                    minHeight: "30px",
                    padding: "0 8px",
                  },
                }}
                count={filteredTickets.length}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={ticketsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[10, 25, 50, 100, 500]}
              />
              <div className="flex gap-1">
                <CSVLink
                  data={csvData}
                  headers={headers}
                  filename={"tickets.csv"}
                  className="bg-box transform hover:scale-110 transition-transform duration-200 ease-in-out border-2 text-prime text-xs font-semibold py-1 px-3 rounded m-2"
                >
                  CSV
                </CSVLink>
              </div>
            </div>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
            <Table stickyHeader>
              <TableHead>
              <TableRow sx={{ backgroundColor: '#01AB86' }} className="capitalize text-base">
  {headers.map((header, index) => (
    <TableCell
      key={index}
      align="left"
      sx={{
        whiteSpace: 'nowrap',
        fontWeight: '300',
        fontSize: '14px',
        padding: '1px 3px',
        backgroundColor: '#01AB86', // Match the row color
        color: 'white',
      }}
    >
      <TableSortLabel
        active={orderBy === header.toLowerCase().replace(" ", "_")}
        direction={
          orderBy === header.toLowerCase().replace(" ", "_") ? order : "asc"
        }
        onClick={() => handleRequestSort(header.toLowerCase().replace(" ", "_"))}
        sx={{
          "&.Mui-active": { color: 'white' },
          "&:hover": { color: 'white' },
          "& .MuiTableSortLabel-icon": { color: 'white !important' },
        }}
      >
        {header}
      </TableSortLabel>
    </TableCell>
  ))}
</TableRow>
              </TableHead>
              <TableBody className="py-10">
                {sortedTickets.length === 0 ? (
                  <TableRow hover>
                    <TableCell colSpan={5} sx={{ padding: "2px 4px", fontSize: "10px", textAlign: "center" }}>No tickets available</TableCell>
                  </TableRow>
                ) : (
                  sortedTickets.slice(page * ticketsPerPage, page * ticketsPerPage + ticketsPerPage).map((ticket) => (
                    <TableRow key={ticket.id} hover>
                      {headers.map((header, idx) => (
                        <TableCell key={idx} align="left" sx={{ padding: '2px 4px', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', "&:hover": { whiteSpace: 'normal', backgroundColor: '#f5f5f5' } }}>
                          {header === "prod name"
                            ? (ticket.prod_name?.split(" ").slice(0, 3).join(" ") || "N/A") + (ticket.prod_name?.split(" ").length > 3 ? "..." : "")
                            : header === "business partner"
                            ? (ticket.business_partner?.split(" ").slice(0, 3).join(" ") || "N/A") + (ticket.business_partner?.split(" ").length > 3 ? "..." : "")
                            : header === "customer po num"
                            ? (ticket.customer_po_num?.split(" ").slice(0, 3).join(" ") || "N/A") + (ticket.customer_po_num?.split(" ").length > 3 ? "..." : "")
                            : ticket[header.toLowerCase().replaceAll(" ", "_")]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Reports;
