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
    <div className="bg-second max-h-5/6 w-full text-xs mx-auto p-2 pr-6 lg:overflow-y-hidden h-auto ticket-scroll">
      <div className=" m-2 bg-box p-5 w-full rounded-lg font-medium">
        {/* Table displaying fetched user data */}
        <div className="ticket-table mt-4">
          <h2 className="text-2xl font-bold text-prime mb-5">
            <span>Access Matrix </span>
          </h2>
          <div className="overflow-x-auto ">
          <table className="min-w-full border bg-second rounded-lg overflow-hidden filter-table mt-5">
            <thead className="bg-second border-2 border-prime  text-prime font-semibold font-poppins text-fontadd">
              <tr>
                {[
                  "Id",
                  "Name",
                  "Dashboard",
                  "Inventory",
                  "Add Approval",
                  "Transfer Approval",
                  "Asset LifeCycle",
                  "Report",
                  "Setup",
                  "Active",
                ].map((header, index) => (
                  <th key={index} className="min-w-20 p-4 text-center">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100 bg-box text-fontadd text-center font-medium">
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
                      value={user.inventory}
                      onChange={() =>
                        handleToggle(user.id, "inventory", user.inventory)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.add}
                      onChange={() =>
                        handleToggle(user.id, "add", user.add)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.transfer}
                      onChange={() =>
                        handleToggle(user.id, "transfer", user.transfer)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.alc}
                      onChange={() =>
                        handleToggle(user.id, "alc", user.alc)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.report}
                      onChange={() =>
                        handleToggle(user.id, "report", user.report)
                      }
                    />
                  </td>
                  <td className="border-t py-3 px-3 text-center">
                    <ToggleSwitch
                      value={user.setup}
                      onChange={() =>
                        handleToggle(user.id, "setup", user.setup)
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
    </div>
  );
};

export default Form;
