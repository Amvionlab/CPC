import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../config.js';
import { FaFilter } from "react-icons/fa";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

import ReactPaginate from 'react-paginate';
import html2canvas from 'html2canvas';
import { UserContext } from '../UserContext/UserContext';
import { ConstructionOutlined } from "@mui/icons-material";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    model: "",
    serial_number: "",
    location: "",
    user_name: "",
    asset_value: "",
    vendor_name: "",
    purchase_date: "",
    po_number: "",
    amc_from: "",
    amc_to: "",
    amc_interval: "",
    last_amc: "",
    procure_by: "",
    warranty_upto: "",
    type: "",
    group: "",
  });

  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);
  const [ticketsPerPage, setTicketsPerPage] = useState(10); // default to 10 rows per page
  const [currentPage, setCurrentPage] = useState(0);
  let i=1;

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState({ success: null, message: "" });
  const [attachmentError, setAttachmentError] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState({
    id: false,
    name : false,
    lastname: false,
 
  });

  const [showForm, setShowForm] = useState(false);
  const [Access, setAccess] = useState([]);
  const [locations, setLocations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [types, setTypes] = useState([]);
  const [extraFields, setExtraFields] = useState([]);
  const [dynamicFields, setDynamicFields] = useState([]);

 
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/dropdown.php`);
        const data = await response.json();
        if (data.locations && Array.isArray(data.locations)) {
          setLocations(data.locations);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
 
    fetchLocations();
   
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
        try {
            const response = await fetch(`${baseURL}/backend/dropdown.php`);
            const data = await response.json();
            if (data.groups) {
                setGroups(data.groups);
            } else {
                console.error('Groups data not found');
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    fetchGroups();
}, []);

useEffect(() => {
    const fetchDropdownData = async () => {
        try {
            const response = await fetch(`${baseURL}/backend/dropdown.php`);
            const data = await response.json();
            if (data.groups) {
                setGroups(data.groups);
            }
            if (data.types) {
                setTypes(data.types);
            }
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    fetchDropdownData();
}, []);

useEffect(() => {
  if (formData.type) {
    const fetchDynamicFields = async () => {
      try {
          const response = await fetch(`${baseURL}/backend/get_extra_columns.php`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({ type: formData.type }),
          });
  
          if (!response.ok) {
              // If the response is not OK, log the response text for debugging
              const text = await response.text();
              throw new Error("Network response was not ok: " + text);
          }
  
          // Attempt to parse JSON
          const result = await response.json();
  
          if (result.message) {
              // Handle errors from PHP script
              throw new Error(result.message);
          }
  
          setDynamicFields(result.fields || []);
      } catch (error) {
          console.error("Error fetching dynamic fields:", error);
          toast.error("Error fetching dynamic fields: " + error.message);
      }
  };
      fetchDynamicFields();
  }
}, [formData.type]);
 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
};
 
const handleRowsPerPageChange = (e) => {
  const value = parseInt(e.target.value, 10); // Parse the input value as an integer
  if (!isNaN(value) && value >= 1) {
    setTicketsPerPage(value);
    setCurrentPage(0); // Update state only if value is a valid number >= 1
  } else {
    setTicketsPerPage(1);
    setCurrentPage(0); // Default to 1 if input is cleared or set to invalid value
  }
};


  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach(key => {
        form.append(key, formData[key]);
    });

    try {
        const response = await fetch(`${baseURL}/backend/asset_add.php`, {
            method: "POST",
            body: form,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }

        if (result.message === "Asset Already Exists") {
            toast.error(result.message);
        } else if (result.message === "Asset added successfully.") {
            setFormData({
                name: "",
                manufacturer: "",
                model: "",
                serial_number: "",
                location: "",
                user_name: "",
                asset_value: "",
                vendor_name: "",
                purchase_date: "",
                po_number: "",
                amc_from: "",
                amc_to: "",
                amc_interval: "",
                last_amc: "",
                procure_by: "",
                warranty_upto: "",
                type: "",
                group: ""
            });
            toast.success(result.message);
        } else {
            throw new Error("Unexpected response message.");
        }
    } catch (error) {
        toast.error("There was a problem with your fetch operation: " + error.message);
    }
};

  const pageCount = Math.ceil(filteredUsers.length / ticketsPerPage);

  const filteredTypes = types.filter(type => type.group_id === formData.group);

  const handleFilterChange = (e, field, type) => {
    const value = e.target.value.toLowerCase(); // convert filter value to lowercase
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: { type, value }
    }));
  };

  useEffect(() => {
    let filtered = [...users];
    Object.keys(filters).forEach((field) => {
      const { type, value } = filters[field];
      if (value) {
        filtered = filtered.filter((ticket) => {
          const fieldValue = ticket[field];
 
          if (fieldValue == null) {
            if (type === "contain" || type === "equal to") return false;
            if (type === "not contain") return true; if (type === "more than" || type === "less than") return false;
          }
 
          const fieldValueStr = fieldValue.toString().toLowerCase();
          const valueStr = value.toLowerCase();
 
          if (type === "contain")
            return fieldValueStr.includes(valueStr);
          if (type === "not contain")
            return !fieldValueStr.includes(valueStr);
          if (type === "equal to")
            return fieldValueStr === valueStr;
          if (type === "more than")
            return parseFloat(fieldValue) > parseFloat(value);
          if (type === "less than")
            return parseFloat(fieldValue) < parseFloat(value);
          return true;
        });
      }
    });
    setFilteredUsers(filtered);
  }, [filters, users]);

  const exportCSV = () => {
    // Get table headers
    const tableHeaders = Array.from(document.querySelectorAll(".header .head"))
      .map(header => header.textContent.trim());
 
    // Get table data values
    const tableData = Array.from(document.querySelectorAll("table tr")).map(row =>
      Array.from(row.querySelectorAll("td")).map(cell => cell.textContent.trim())
    );
 
    // Filter out rows that contain filter content
    const filteredTableData = tableData.filter(row =>
      !row.some(cell => cell.includes("Contains") || cell.includes("Does Not Contain") || cell.includes("Equal To") || cell.includes("More Than") || cell.includes("Less Than"))
    );
 
    // Create CSV content
    const csvContent = [
      tableHeaders.join(","),
      ...filteredTableData.map(row => row.join(","))
    ].join("\n");
 
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
 
 

  const exportExcel = () => {
    const table = document.querySelector('.filter-table');
    if (!table) return;
 
    // Extract table headers
    const headers = Array.from(document.querySelectorAll(".header .head")).map(header => header.textContent.trim());
 
    // Extract table data values
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(row =>
      Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim())
    );
 
    // Filter out rows that contain filter content
    const filteredRows = rows.filter(row =>
      !row.some(cell => cell.includes("Contains") || cell.includes("Does Not Contain") || cell.includes("Equal To") || cell.includes("More Than") || cell.includes("Less Than"))
    );
 
    const data = [headers, ...filteredRows];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'Analytics.xlsx');
  };
 

  const exportPDF = () => {
    const table = document.querySelector('.filter-table');
    if (!table) return;
 
    // Create a copy of the table
    const tableClone = table.cloneNode(true);
 
    // Remove filter dropdowns and inputs from the cloned table
    tableClone.querySelectorAll('.filter').forEach(filter => filter.remove());
 
    // Center-align all table cell contents
    tableClone.querySelectorAll('th, td').forEach(cell => {
      cell.style.textAlign = 'center';
    });
 
    // Append the cloned table to the body (temporarily)
    document.body.appendChild(tableClone);
 
    // Use html2canvas to convert the cloned table to an image
    html2canvas(tableClone).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Analytics.pdf');
 
      // Remove the cloned table from the document
      document.body.removeChild(tableClone);
    });
  };
  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);
  console.log(currentTickets);

  return (
    <div className="bg-second max-h-5/6 max-w-4/6 text-xs mx-auto p-1 lg:overflow-y-hidden h-auto ticket-scroll">
     
        <div className="max-w-full mt-3 m-2 mb-4 p-2 bg-box rounded-lg font-mont " >
          <div className="ticket-table mt-2">
          <form onSubmit={handleSubmit} className="space-y-4 text-label">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
                <div className="font-mont font-semibold text-2xl mb-4">
                    Asset Details:
                </div>
            </div>

            {/* Group and Type Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
                <div className="flex items-center mb-2 mr-4">
                    <label className="text-sm font-semibold text-prime mr-2 w-32">
                        Group
                    </label>
                    <select
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        className="flex-grow text-xs bg-second border p-2 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
                    >
                        <option value="">Select Group</option>
                        {groups
                            .filter(group => group.group)
                            .map(group => (
                                <option key={group.id} value={group.id}>
                                    {group.group}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="flex items-center mb-2 mr-4">
                    <label className="text-sm font-semibold text-prime mr-2 w-32">
                        Type
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="flex-grow text-xs bg-second border p-2 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
                    >
                        <option value="">Select Type</option>
                        {filteredTypes
                            .map(type => (
                                <option key={type.type} value={type.type}>
                                    {type.type}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Static Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
                {Object.keys(formData)
                    .filter(key => !['group', 'type'].includes(key))
                    .map(key => (
                        <div className="flex items-center mb-2 mr-4" key={key}>
                            <label className="text-sm font-semibold text-prime mr-2 w-32">
                                {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                            </label>
                            <input
                                type={key === 'serial_number' || key === 'asset_value' ? 'number' : 'text'}
                                name={key}
                                placeholder={`Enter ${key.replace('_', ' ')}`}
                                value={formData[key]}
                                onChange={handleChange}
                                className="flex-grow text-xs bg-second border p-2 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
                            />
                        </div>
                    ))}
            </div>

            {/* Dynamic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
            {dynamicFields.map((field, index) => (
            <div key={field.name || index} className="flex items-center mb-2 mr-4">
                <label className="text-sm font-semibold text-prime mr-2 w-32">
                    {field.label}
                </label>
                <input
                    type={field.type || 'text'}
                    name={field.name}
                    placeholder={`Enter ${field.label}`}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="flex-grow text-xs bg-second border p-2 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
                />
            </div>
        ))}

            </div>

            <div className="flex justify-center">
                <button
                    type="submit"
                    className="mt-1 bg-prime font-mont font-semibold text-lg text-white py-2 px-8 rounded-md shadow-md focus:outline-none"
                >
                    Submit
                </button>
            </div>
        </form>
    </div>
          </div>
   
</div>

  );
};

export default Form;