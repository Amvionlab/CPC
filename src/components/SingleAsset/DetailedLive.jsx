import React from 'react';
import { Container, Box, Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Link } from '@mui/material';

const SectionData = [
  {
    title: 'System Info',
    rows: [
      ["Tag", "COM1001", "Computer Name", "DESKTOP-06"],
      ["Type", "Laptop", "Serial Number", "5G1HY33"],
      ["Manufacturer", "Dell Inc.", "Model", "Latitude 5400"],
      ["Domain", "WORKGROUP", "UUID", "6203ab3f-8c76-11ef-8478-e45e3796b726"],
      ["Location", "RAMCIDES", "Status", "Deployed"],
      ["Sub-Status", "In use", "IP", "192.168.1.111"],
      ["Last Sync Date", "2024-10-17 16:25:55", "Last Update By", "Agent"]
    ],
  },
  {
    title: 'Operating System',
    rows: [
      ["Name", "Windows", "Version", "11"],
      ["Architecture", "64bit", "Installed Time", "2023-10-19 10:25:23"],
      ["Kernel Version", "10.0.22631", "Last Boot Time", "2024-10-16 18:20:45"],
    ],
  },
  {
    title: 'License',
    rows: [
      ["Licence", "Windows 10 Pro", "Product ID", "00330-80000-00000-AA255"],
      ["Product Key", "TFNYK-KWQWV-4C693-G6987-PWF9C"],
    ],
  },
  {
    title: 'Processor',
    rows: [
      ["Processor", "Intel(R) Core(TM) i5-8265U CPU @ 1.60GHz", "Manufacturer", "GenuineIntel"],
      ["Max Clock (MHz)", "1800", "Current Clock (MHz)", "1600"],
      ["Number of cores", "4", "Number of threads", "8"],
      ["L2 Cache (kb)", "1024", "L3 Cache (kb)", "6144"],
    ],
  },
  {
    title: 'Memory',
    rows: [
      ["Memory", "RAM", "Size (GB)", "16"],
      ["Speed", "2667", "Manufacturer", "80CE000080CE"],
      ["Serial Number", "36BBB18D", "Part Number", "M471A2K43CB1-CTD"],
    ],
  },
  {
    title: 'Hard Drive',
    rows: [
      ["Hard Drive", ".PHYSICALDRIVE0", "Manufacturer", "(Standard disk drives)"],
      ["Model", "NVMe BC711 NVMe SK hy", "Interface", "SCSI"],
      ["Capacity", "476.94 GB", "Media", "Fixed hard disk media"],
    ],
  },
  {
    title: 'Volume',
    rows: [
      ["Volume", "Total Size", "Free Size", "Used Percentage"],
      ["C:", "97 GB", "4 GB", "95.88% Used"],
      ["D:", "190 GB", "93 GB", "51.05% Used"],
      ["E:", "190 GB", "28 GB", "85.26% Used"],
    ],
  },
  {
    title: 'Graphics Device',
    rows: [
      ["Graphics Device", "Manufacturer", "Version", "Video Mode Description", "Video Memory (MB)"],
      ["Intel(R) UHD Graphics 620", "Intel Corporation", "31.0.101.2127", "1920 x 1080 x 4294967296 colors", "1024"],
    ],
  },
  {
    title: 'Audio Device',
    rows: [
      ["Audio Device", "Manufacturer"],
      ["Realtek Audio", "Realtek"],
      ["Intel(R) Display Audio", "Intel(R) Corporation"],
    ],
  },
  {
    title: 'Installed Software',
    rows: [
      ["Software", "Publisher", "Version"],
      ["Git", "The Git Development Community", "2.45.2"],
      ["Microsoft SQL Server 2022 (64-bit)", "Microsoft Corporation", "0"],
      ["Apache NetBeans IDE 18", "Apache NetBeans", "18"],
      ["Microsoft Office Professional Plus 2013", "Microsoft Corporation", "15.0.4420.1017"],
      ["Google Chrome", "Google LLC", "129.0.6668.101"],
    ],
  },
];

const AssetDetails = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        {SectionData.map((section, index) => (
          <Paper variant="outlined" sx={{ p: 2, mb: 4 }} key={index}>
            <Typography variant="h6" gutterBottom>{section.title}</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  {section.rows.map((row, index) => (
                    <TableRow key={index}>
                      {row.map((cell, index) => (
                        <TableCell key={index}>
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody />
              </Table>
            </TableContainer>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default AssetDetails;
