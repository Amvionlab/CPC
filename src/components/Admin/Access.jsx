import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { baseURL } from "../../config.js";
import { UserContext } from "../UserContext/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Select,
  MenuItem,
} from "@mui/material"; // Import necessary MUI components
import "./Access.css";

const Form = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchAccess.php`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleToggle = async (userId, field, currentValue) => {
    const newValue = currentValue === "1" ? "0" : "1";
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, [field]: newValue } : user
      )
    );

    try {
      const response = await fetch(`${baseURL}/backend/updateAccess.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          field: field,
          value: newValue,
        }),
      });

      if (!response.ok) {
        toast.error("Update failed");
      } else {
        toast.success("Update successful");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Update failed");
    }
  };

  const handleDropdownChange = async (userId, newValue) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, area_access: newValue } : user
      )
    );

    try {
      const response = await fetch(`${baseURL}/backend/updateAccess.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          field: "area_access",
          value: newValue,
        }),
      });

      if (!response.ok) {
        toast.error("Update failed");
      } else {
        toast.success("Update successful");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Update failed");
    }
  };

  return (
    <div className="bg-second w-full text-xs mx-auto p-1 lg:overflow-y-hidden h-full ticket-scroll">
      <div className="bg-box p-4 h-full w-full rounded-lg font-medium">
        <h2 className="text-2xl font-bold text-prime mb-5">Access Matrix</h2>
        <TableContainer>
          <Table className="min-w-full" aria-label="simple table">
            <TableHead>
              <TableRow>
                {[
                  "Id",
                  "Name",
                  "Area Access",
                  "Dashboard",
                  "Inventory",
                  "Asset Add",
                  "Add",
                  "Transfer",
                  "Scrap",
                  "Asset LifeCycle",
                  "Report",
                  "Setup",
                  "Active",
                ].map((header, index) => (
                  <TableCell key={index} align="center" sx={{ padding: '10px', fontSize: '14px' }}>
                    <p className="font-bold">{header}</p>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-gray-100 bg-box text-fontadd text-center font-medium"
                >
                  <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>{user.id}</TableCell>
                  <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>{user.name}</TableCell>
                  <TableCell align="center" sx={{ padding: '4px', fontSize: '12px' }}>
                    <Select
                      value={user.area_access}
                      onChange={(e) => handleDropdownChange(user.id, e.target.value)}
                      variant="standard"
                      sx={{
                        minWidth: 100,
                        fontSize: '12px',
                        '& .MuiSelect-root': {
                          border: 'none',
                        },
                        '&:before': {
                          borderBottom: 'none',
                        },
                        '&:after': {
                          borderBottom: 'none',
                        },
                        '&:hover:not(.Mui-disabled):before': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <MenuItem value="0">None</MenuItem>
                      <MenuItem value="1">All</MenuItem>
                      <MenuItem value="2">Location</MenuItem>
                      <MenuItem value="3">Branch</MenuItem>
                    </Select>

                  </TableCell>
                  {["dashboard", "inventory", "assetadd", "add", "transfer", "scrap", "alc", "report", "setup", "is_active"].map((field) => (
                    <TableCell key={field} align="center" sx={{ padding: '4px', fontSize: '12px' }}>
                      <Switch className="text-flo"
                        checked={user[field] === "1"}
                        onChange={() => handleToggle(user.id, field, user[field])}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Form;
