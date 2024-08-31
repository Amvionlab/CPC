import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../config.js';
import { FaFilter } from "react-icons/fa";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import axios from 'axios';

import ReactPaginate from 'react-paginate';
import html2canvas from 'html2canvas';
import { UserContext } from '../UserContext/UserContext.jsx';

const Form = () => {
  const [formData, setFormData] = useState({
    domain: "",
   
  });
  const [columnData, setColumnData] = useState([]);
  const { user } = useContext(UserContext);
  console.log('DashBoard context value:', user);
  const [ticketsPerPage, setTicketsPerPage] = useState(10); // default to 10 rows per page
  const [currentPage, setCurrentPage] = useState(0);
  let i=1;

  const [users, setUsers] = useState([]);
  const [table, setTable] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [attachment, setAttachment] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState({
    id: false,
    name: false,
  });

  const [showForm, setShowForm] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [tempColumnName, setTempColumnName] = useState("");
  const [addingNewColumn, setAddingNewColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [initialDialogState, setInitialDialogState] = useState({});
  const [columnType, setColumnType] = useState(''); // Initialize state
  const [previousColumnName, setPreviousColumnName] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [templateColumns, setTemplateColumns] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [inactiveColumns, setInactiveColumns] = useState([]);
  const [activeColumns, setActiveColumns] = useState([]);
  const [error, setError] = useState(null);
  
  const handleAddButtonClick = () => {
    setIsInputVisible(true); // Show the input field
};

  const handleEdit = (index) => {
    setEditingIndex(index);
    setTempColumnName(dialogContent[index]);
  };

  const handleSave = async () => {
    const updatedContent = [...dialogContent];
    updatedContent[editingIndex] = tempColumnName;

    const oldName = dialogContent[editingIndex];
    const name = tempColumnName;

    try {
        const typeResponse = await fetch(`${baseURL}/backend/fetchTicket_type.php`);
        if (!typeResponse.ok) throw new Error('Failed to fetch type');
        const { type } = await typeResponse.json();

        const columnsResponse = await fetch(`${baseURL}/backend/template.php`);
        if (!columnsResponse.ok) throw new Error('Failed to fetch columns');
        const { columns } = await columnsResponse.json();

        alert(`Type: ${type}\nOld Name: ${oldName}\nNew Name: ${name}`);

        const response = await fetch(`${baseURL}/backend/updateColumn.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ table: type, oldName, name }),
        });

        if (response.ok) {
            const addColumnResponse = await fetch(`${baseURL}/backend/addColumn.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, column_name: name }),
            });

            if (addColumnResponse.ok) {
                setDialogContent(updatedContent);
                toast.success("Column added and updated successfully");
            } else {
                throw new Error('Failed to add new column');
            }
        } else {
            throw new Error("Failed to update column name");
        }
    } catch (error) {
        console.error("Error:", error);
        toast.error("Error saving the column");
    }
    setEditingIndex(null);
};

const handleAdd = () => {
  setAddingNewColumn(true);
};
const handleTemplateSelection = (selectedType) => {
  setColumnType(selectedType);
};

const fetchTicketStatus = async (typeId) => {
  try {
      const response = await fetch(`${baseURL}/backend/fetchTicket_status.php?type_id=${typeId}`);
      const result = await response.json();
      if (!response.ok) {
          throw new Error(result.message || "Something went wrong");
      }
      // Process the result
      console.log(result.data);
      // Handle the data (e.g., set state)
  } catch (error) {
      console.error("Error fetching ticket status:", error);
  }
};

const handleSaveNewColumn = async () => {
  try {
    // Sanitize the new column name
    let sanitizedColumnName = newColumnName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    alert(`Type: ${table}\nNew Column Name: ${sanitizedColumnName}`);

    const columnsResponse = await fetch(`${baseURL}/backend/template.php`);
    if (!columnsResponse.ok) {
      throw new Error('Failed to fetch columns');
    }
    const { columns } = await columnsResponse.json();

    // Post the sanitized column name to addColumn.php
    const response = await fetch(`${baseURL}/backend/addColumn.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ table: table, name: sanitizedColumnName }),
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response result:', result);

    if (response.ok) {
      setDialogContent([...dialogContent, sanitizedColumnName]);
      setNewColumnName(''); // Reset the input field value
      setIsInputVisible(false); // Hide the input field after saving
      toast.success("Column added successfully");

    } else {
      throw new Error(result.message || "Failed to add new column");
    }
  } catch (error) {
    console.error("Error adding new column:", error);
    toast.error("Error adding new column");
  }
  setIsInputVisible(false);
};

const handleClose = () => {
  setNewColumnName(''); // Reset input value
  setIsInputVisible(false); // Hide input field
};

const handleDelete = async (index) => {
  const columnToDelete = dialogContent[index];

  // Confirm deletion
  if (window.confirm(`Are you sure you want to delete the column "${columnToDelete}"?`)) {
    try {
      const response = await fetch(`${baseURL}/backend/deleteColumn.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: table, // Assuming `selectedType` is the current type
          name: columnToDelete,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Handle successful deletion
        const newDialogContent = dialogContent.filter((_, i) => i !== index);
        setDialogContent(newDialogContent);
        alert(result.message);
      } else {
        // Handle errors
        alert(result.message || 'Failed to delete the column. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting column:', error);
      alert('Failed to delete the column. Please try again.');
    }
  }
};

  const handleCancel = () => {
    setEditingIndex(null);
    setNewColumnName(''); 
    setIsInputVisible(false);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditValue(dialogContent[index].value);
  };

  const handleSaveClick = () => {
    const updatedContent = [...dialogContent];
    updatedContent[editingIndex].value = editValue;
    setDialogContent(updatedContent);
    setEditingIndex(null);
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchTicket_type.php`);
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
  
        // Optionally, set default type or handle type selection
        if (data.length > 0) {
          setSelectedType(data[0].type); // Example: Set first type as default
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
  
    fetchTypes();
  }, [baseURL]);
  
  useEffect(() => {
    if (!selectedType) return; // Skip if no type is selected
  
    const fetchColumns = async () => {
      try {
        // Fetch columns for the selected type
        const templateResponse = await axios.get(`${baseURL}/backend/template.php?type=${selectedType}`);
        const columns = templateResponse.data.columns || [];
        setDialogContent(columns);
  
        // Fetch columns from asset_template.php
        const assetTemplateResponse = await axios.get(`${baseURL}/backend/asset_template.php`);
        const templateColumns = assetTemplateResponse.data.template_columns || [];
        setTemplateColumns(templateColumns);
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    };
  
    fetchColumns();
  }, [selectedType]);

  useEffect(() => {
    const loadColumns = async () => {
        try {
            const response = await fetch(`${baseURL}/backend/fetchTableFields.php`);
            const result = await response.json();
            
            if (response.ok && result.success) {
                setInactiveColumns(result.inactive_columns);
                setActiveColumns(result.active_columns);
            } else {
                throw new Error(result.message || "Failed to fetch columns.");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    loadColumns();
}, []);


  const navigate = useNavigate();
  const handleChange = (e) => {
    setTempColumnName(e.target.value);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
    const fileExtension = file ? file.name.split(".").pop().toLowerCase() : "";

    if (file && allowedExtensions.includes(fileExtension)) {
      setAttachment(file);
      setAttachmentError("");
    } else {
      setAttachment(null);
      setAttachmentError(
        "Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed."
      );
    }
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
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    if (attachment) {
      form.append("attachment", attachment);
    }

    try {
      const response = await fetch(`${baseURL}/backend/ticket_type_add.php`, {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }
      setSubmissionStatus({ success: true, message: result.message });
      toast.success("Asset Type added");
      location.reload();
    } catch (error) {
      setSubmissionStatus({
        success: false,
        message:
          "There was a problem with your fetch operation: " + error.message,
      });
    }
  };

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

  const handleTemplateClick = async (type) => {
    try {
      // Set the table type to dynamically change the table
      setTable(type);
  
      // Fetch the columns for the selected type from template.php
      const response = await fetch(`${baseURL}/backend/template.php?type=${type}`);
      const textResponse = await response.text();
  
      // Debugging: Log the raw response
      console.log("Raw response:", textResponse);
  
      // Parse the response as JSON
      const data = JSON.parse(textResponse);
  
      // Debugging: Log the parsed data to ensure it's correct
      console.log("Parsed data:", data);
  
      // Check if the response is okay and contains the columns
      if (response.ok && data.columns) {
        // Fetch the columns from asset_template.php
        const assetTemplateResponse = await fetch(`${baseURL}/backend/asset_template.php?type=${type}`);
        const assetTemplateData = await assetTemplateResponse.json();
  
        // Get the columns that should have disabled buttons
        const templateColumns = assetTemplateData.template_columns || [];
  
        // Set the dialog content with the columns
        setDialogContent(data.columns);
        setTemplateColumns(templateColumns); // Save template columns to state
        setShowDialog(true);
      } else {
        throw new Error(data.message || "Failed to fetch columns");
      }
    } catch (error) {
      console.error("Error fetching column data:", error.message, error);
    }
  };

  const exportCSV = () => {
    // Get table headers
    const tableHeaders = Array.from(document.querySelectorAll(".header span"))
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
    link.setAttribute("download", "Asset_type.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  const exportExcel = () => {
    const table = document.querySelector('.filter-table');
    if (!table) return;
  
    // Extract table headers
    const headers = Array.from(document.querySelectorAll(".header span")).map(header => header.textContent.trim());
  
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
    XLSX.writeFile(workbook, 'Ticket_type.xlsx');
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
      pdf.save('Asset_type.pdf');
  
      // Remove the cloned table from the document
      document.body.removeChild(tableClone);
    });
  };
  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);

  return (
    <div className="bg-second max-h-5/6 max-w-4/6 text-xs mx-auto p-1 lg:overflow-y-hidden h-auto ticket-scroll">
      
      {showForm && (
        <div className="max-w-5xl m-2 mb-4 bg-box p-3 rounded-lg font-mont " >
          <div className="ticket-table mt-2">
            <form onSubmit={handleSubmit} className="space-y-4 text-label">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
                <div className="font-mont font-semibold text-2xl mb-4">
                  Asset Type Details:
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Name
                  </label>
                  <input
                    type="text"
                    name="type"
                    placeholder="Enter Asset Type Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="flex-grow text-xs bg-second border p-1 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-[0_0_6px_#5fdd33]"
                  />
                  <button
                  type="submit"
                  className="ml-5 bg-prime font-mont font-semibold text-md text-white py-2 px-8 rounded-md shadow-md focus:outline-none"
                >
                  Submit
                </button>
                </div>
                
                
              </div>
             
            </form>
          </div>
          </div>
        )}
       
      <div className="max-w-5xl m-2 bg-box p-3 rounded-lg font-mont">
       <div className="flex justify-end flex-wrap space-x-2 mt-4">
          <button
            onClick={exportCSV}
            className="bg-flo font-mont font-semibold text-sm text-white py-1 px-4 rounded-md shadow-md focus:outline-none"
          >
            CSV
          </button>
          <button
            onClick={exportExcel}
            className="bg-flo font-mont font-semibold text-sm text-white py-1 px-4 rounded-md shadow-md focus:outline-none"
          >
            Excel
          </button>
          <button
            onClick={exportPDF}
            className="bg-flo font-mont font-semibold text-sm text-white py-1 px-4 rounded-md shadow-md focus:outline-none"
          >
            PDF
          </button>
        </div>

        {/* Table displaying fetched user data */}
        <div className="ticket-table mt-8">
          <h2 className="text-2xl font-bold text-prime mb-4"><span>Asset Type Data </span><span className="items-end"><button
          onClick={() => setShowForm(!showForm)}
          className="bg-prime font-mont font-semibold text-sm text-white py-2 px-8 rounded-md shadow-md focus:outline-none"
        >
          {showForm ? "Close" : "+ Add Asset Type"}
        </button></span></h2>
        <label htmlFor="rowsPerPage" className="text-sm font-medium text-gray-700">
            Rows per page:
          </label>
          <input
            type="number"
            id="rowsPerPage"
            placeholder={ticketsPerPage}
            onChange={handleRowsPerPageChange}
            className="w-16 px-1 py-1 border rounded text-gray-900"
            min="0"
          />
        

        <table className=" min-w-full bg-second rounded-lg overflow-hidden filter-table">
  <thead className="bg-prime text-white">
    <tr>
      {["Id", "type", "Tag", "Group", "Action"].map((header, index) => (
        <td key={index} className="w-1/4 py-2 px-4">
          <div className="flex items-center justify-left">
          <div className="header flex">
            <span>{header}</span>
            <FaFilter
              className="cursor-pointer ml-3"
              onClick={() => setShowFilter(prevState => ({
                ...prevState,
                [header.toLowerCase().replace(" ", "")]: !prevState[header.toLowerCase().replace(" ", "")]
              }))}
            />
          </div>
        </div>
        {showFilter[header.toLowerCase().replace(" ", "")] && (
          <div className="mt-2 bg-prime p-2 rounded shadow-md filter">
            <select
              onChange={(e) => handleFilterChange(e, header.toLowerCase().replace(" ", ""), e.target.value)}
              className="mb-2 p-1 border text-prime rounded w-full"
            >
              <option value="contain">Contains</option>
              <option value="not contain">Does Not Contain</option>
              <option value="equal to">Equal To</option>
              <option value="more than">More Than</option>
              <option value="less than">Less Than</option>
            </select>
            <input
              type="text"
              placeholder="Enter value"
              onChange={(e) => handleFilterChange(e, header.toLowerCase().replace(" ", ""), filters[header.toLowerCase().replace(" ", "")]?.type || "contain")}
              className="p-1 border rounded text-prime w-full"
            />
          </div>
        )}

        </td>
      ))}
    </tr>
  </thead>
  <tbody>
  {filteredUsers
              .slice(currentPage * ticketsPerPage, (currentPage + 1) * ticketsPerPage)
              .map((user, index) => (
                <tr key={user.id}>
                  <td>{i++}</td>
                  <td>{user.type}</td>
  <button
    className="bg-prime text-white py-1 px-4 rounded-md shadow-md"
    onClick={() => handleTemplateClick(user.type)}
  >
    Template
  </button>
      </tr>
    ))}
  </tbody>
</table>
        </div>
         {/* Pagination Controls */}
         <div className="pagination mt-4 flex gap-2 justify-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={Math.ceil(filteredUsers.length / ticketsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination-container"}
            pageClassName={"pagination-page"}
            pageLinkClassName={"pagination-link"}
            previousClassName={"pagination-previous"}
            nextClassName={"pagination-next"}
            breakClassName={"pagination-break"}
            activeClassName={"pagination-active"}
          />
          </div>
      </div>
    
      {showDialog && (
  <div className="dialog-overlay">
    <div className="dialog">
      <h3>Template Columns</h3>
      <button className="close-button" onClick={() => setShowDialog(false)}>X</button>
      <button className="add-button" onClick={handleAddButtonClick}>Add</button>
      <div className="dialog-content">
        <table className="dialog-table">
          <tbody>
            {dialogContent.map((column, index) => (
              <tr key={index}>
                <th>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={tempColumnName}
                      onChange={handleChange}
                      autoFocus
                    />
                  ) : (
                    <span>{column}</span>
                  )}
                </th>
                <td>
                  <div className="button-group">
                    {editingIndex === index ? (
                      <>
                        <button className="save-button" onClick={handleSave}>Save</button>
                        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-button"
                          onClick={() => templateColumns.includes(column)
                            ? toast.success("Default values cannot be Edited")
                            : handleEdit(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => templateColumns.includes(column)
                            ? toast.success("Default values cannot be Deleted")
                            : handleDelete(index)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {isInputVisible && (
              <tr>
                <th>
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    autoFocus
                    placeholder="Enter column name (VARCHAR)"
                  />
                </th>
                <td>
                  <div className="button-group">
                    <button className="save-button" onClick={handleSaveNewColumn}>Save</button>
                    <button className="cancel-button" onClick={() => setIsInputVisible(false)}>Cancel</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

<style jsx>{`
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dialog {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 1000px;
    position: relative;
    max-height: 80%;
    display: flex;
    flex-direction: column;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: transparent;
    font-size: 16px;
    cursor: pointer;
  }
  .dialog-content {
    flex: 1;
    overflow-y: auto;
  }
  .dialog-table {
    width: 100%;
    border-collapse: collapse;
  }
  .dialog-table th, .dialog-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  .dialog-table th {
    background-color: #f4f4f4;
  }
  .button-group {
    display: flex;
    gap: 8px; /* Adds spacing between buttons */
  }
  .edit-button {
  background-color: #2196F3; /* Original blue background */
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease; /* Smooth transition on hover */
}

.edit-button:hover {
  background-color: #1976D2; /* Darker blue on hover */
}

  .delete-button {
  background-color: #ff4d4d; /* Red background */
  color: white; /* White text */
  border: none; /* Remove default border */
  padding: 8px 16px; /* Padding for the button */
  border-radius: 4px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
  font-size: 14px; /* Font size */
  transition: background-color 0.3s ease; /* Smooth transition on hover */
}

.delete-button:hover {
  background-color: #e60000; /* Darker red on hover */
}

  .add-button {
  position: absolute;
  top: 10px;
  right: 50px; /* Adjust this value to align with the 'X' button */
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
  .save-button {
    background-color: #4CAF50; /* Blue background for the save button */
    border: none;
    color: white;
    padding: 5px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
  }
`}</style>

  </div>
);
};


export default Form;
