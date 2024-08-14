import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { baseURL } from "../../config.js";
import { UserContext } from "../UserContext/UserContext";
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

  const ToggleSwitch = ({ value, onChange }) => {
    return (
      <label className="switch">
        <input
          type="checkbox"
          className="input"
          checked={value === "1"}
          onChange={onChange}
        />
        <span className="slider"></span>
      </label>
    );
  };

  const handleToggle = async (userId, field, currentValue) => {
    const newValue = currentValue === "1" ? "0" : "1";

    // Update the state locally
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, [field]: newValue } : user
      )
    );

    // Send the update to the server
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

      if (response.ok) {
        toast.success("Update successful");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Update failed");
    }
  };

  return (
    <div className="bg-second max-h-5/6 w-full text-xs mx-auto p-1 lg:overflow-y-hidden h-auto ticket-scroll">
      <div className=" m-2 bg-box p-5 w-full rounded-lg font-medium">
        {/* Table displaying fetched user data */}
        <div className="ticket-table mt-8">
          <h2 className="text-2xl font-bold text-prime mb-5">
            <span>Access Matrix </span>
          </h2>
          <table className="min-w-full mb-5 p-2 bg-box rounded-lg overflow-hidden">
            <thead className="bg-prime text-white">
              <tr>
                {[
                  "Id",
                  "Name",
                  "Dashboard",
                  "Ticket Create",
                  "Analytics",
                  "Ticket Action",
                  "Single Ticket",
                  "Admin",
                  "Assign",
                  "Active",
                ].map((header, index) => (
                  <th key={index} className="w-1/10 p-3 text-center">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border-t py-3 px-3 text-center">{user.id}</td>
                  <td className="border-t py-3 px-3 text-center">
                    {user.name}
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.dashboard}
                      onChange={() =>
                        handleToggle(user.id, "dashboard", user.dashboard)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.ticket}
                      onChange={() =>
                        handleToggle(user.id, "ticket", user.ticket)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.analytics}
                      onChange={() =>
                        handleToggle(user.id, "analytics", user.analytics)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.ticketaction}
                      onChange={() =>
                        handleToggle(user.id, "ticketaction", user.ticketaction)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.singleticket}
                      onChange={() =>
                        handleToggle(user.id, "singleticket", user.singleticket)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.creation}
                      onChange={() =>
                        handleToggle(user.id, "creation", user.creation)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.assign}
                      onChange={() =>
                        handleToggle(user.id, "assign", user.assign)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.is_active}
                      onChange={() =>
                        handleToggle(user.id, "is_active", user.is_active)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Form;
