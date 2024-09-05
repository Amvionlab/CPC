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

const Form = () => {
  const [formData, setFormData] = useState({
    username: "",
    employee_id: "",
    password: ''
  });
  const { user } = useContext(UserContext);
  const [ticketsPerPage, setTicketsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  let i = 1;

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState({
    id: false,
    name: false,
    lastname: false,
  });

  const [showForm, setShowForm] = useState(false);
  const [access, setAccess] = useState([]);
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    const generatePassword = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      return password;
    };

    setFormData(prevState => ({
      ...prevState,
      password: generatePassword()
    }));
  }, []);

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchAccess.php`);
        const data = await response.json();
        setAccess(data);
      } catch (error) {
        console.error("Error fetching access:", error);
      }
    };

    const fetchEmployee = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchEmployees.php`);
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching access:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseURL}/backend/fetchUsers.php`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAccess();
    fetchUsers();
    fetchEmployee();
  }, []);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRowsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTicketsPerPage(!isNaN(value) && value >= 1 ? value : 1);
    setCurrentPage(0);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.body.classList.add('cursor-wait', 'pointer-events-none');
    
    // Create a new FormData object
    const form = new FormData();
    for (const key in formData) {
        // Append each form data key-value pair to the FormData object
        form.append(key, formData[key]);
    }

    // Log the form values before submission
    console.log("Form Values:");
    for (const [key, value] of form.entries()) {
        console.log(`${key}: ${value}`);
    }

    try {
        const response = await fetch(`${baseURL}/backend/user_add.php`, {
            method: "POST",
            body: form,
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }
        toast.success("User added");
        document.body.classList.remove('cursor-wait', 'pointer-events-none');
        window.location.reload();
    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error adding user. " + error.message);
        document.body.classList.remove('cursor-wait', 'pointer-events-none');
    }
};


  const pageCount = Math.ceil(filteredUsers.length / ticketsPerPage);

  const handleFilterChange = (e, field, type) => {
    const value = e.target.value.toLowerCase();
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
        filtered = filtered.filter((user) => {
          const fieldValue = user[field] || '';
          const fieldValueStr = fieldValue.toString().toLowerCase();
          if (type === "contain") return fieldValueStr.includes(value);
          if (type === "not contain") return !fieldValueStr.includes(value);
          if (type === "equal to") return fieldValueStr === value;
          if (type === "more than") return parseFloat(fieldValue) > parseFloat(value);
          if (type === "less than") return parseFloat(fieldValue) < parseFloat(value);
          return false;
        });
      }
    });
    setFilteredUsers(filtered);
  }, [filters, users]);

  const exportCSV = () => {
    const tableHeaders = Array.from(document.querySelectorAll(".header .head"))
      .map(header => header.textContent.trim());

    const tableData = Array.from(document.querySelectorAll("table tr")).map(row =>
      Array.from(row.querySelectorAll("td")).map(cell => cell.textContent.trim())
    );

    const filteredTableData = tableData.filter(row =>
      !row.some(cell => cell.includes("Contains") || cell.includes("Does Not Contain") || cell.includes("Equal To") || cell.includes("More Than") || cell.includes("Less Than"))
    );

    const csvContent = [
      tableHeaders.join(","),
      ...filteredTableData.map(row => row.join(","))
    ].join("\n");

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

    const headers = Array.from(document.querySelectorAll(".header .head")).map(header => header.textContent.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(row =>
      Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim())
    );

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

    const tableClone = table.cloneNode(true);
    tableClone.querySelectorAll('.filter').forEach(filter => filter.remove());

    tableClone.querySelectorAll('th, td').forEach(cell => {
      cell.style.textAlign = 'center';
    });

    document.body.appendChild(tableClone);

    html2canvas(tableClone).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('Analytics.pdf');

      document.body.removeChild(tableClone);
    });
  };

  const offset = currentPage * ticketsPerPage;
  const currentTickets = filteredUsers.slice(offset, offset + ticketsPerPage);

  return (
    <div className="bg-second max-h-5/6 max-w-4/6 text-xs mx-auto p-1 lg:overflow-y-hidden h-auto ticket-scroll">
      {showForm && (
        <div className="max-w-full mt-3 m-2 mb-4 p-2 bg-box rounded-lg font-mont">
          <div className="ticket-table mt-2">
            <form onSubmit={handleSubmit} className="space-y-4 text-label">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
                <div className="font-mont font-semibold text-2xl mb-4">
                  User Details:
                </div>
              </div>

              
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 ml-10 pr-10 mb-0">

              <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                  Employee Name<span className="text-red-600 text-md font-bold">*</span>
                  </label>
                  <select
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="selectbox flex-grow text-xs bg-second border p-3 border-none rounded-md outline-none focus:border-bgGray focus:ring-bgGray focus:shadow-prime focus:shadow-sm"
                  >
                    <option value="" className="custom-option">
                      Select Employee
                    </option>
                    {employee.map((employee) => (
                      <option
                        key={employee.id}
                        value={employee.id}
                        className="custom-option"
                        required
                      >
                        {employee.firstname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Username<span className="text-red-600 text-md font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="flex-grow text-xs bg-second border p-3 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
                  />
                </div>

                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    User Type<span className="text-red-600 text-md font-bold">*</span>
                  </label>
                  <select
                    name="usertype"
                    value={formData.usertype}
                    onChange={handleChange}
                    className="selectbox flex-grow text-xs bg-second border p-3 border-none rounded-md outline-none focus:border-bgGray focus:ring-bgGray focus:shadow-prime focus:shadow-sm"
                  >
                    <option value="" className="custom-option">
                      Select User Type
                    </option>
                    {access.map((access) => (
                      <option
                        key={access.id}
                        value={access.id}
                        className="custom-option"
                        required
                      >
                        {access.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="mt-1 bg-prime font-mont font-semibold text-lg text-white py-1 px-4 rounded-md shadow-md focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-1/2 m-2 bg-box p-5 rounded-lg font-mont">
        <div className="ticket-table mt-4">
          <h3 className="text-2xl font-bold text-prime mb-4 flex justify-between items-center">
            <span>
              User Data
              <button
                onClick={() => setShowForm(!showForm)}
                className="ml-4 bg-second hover:bg-prime hover:text-box font-mont font-bold text-sm text-black py-2 px-8 rounded-md shadow-md focus:outline-none"
              >
                {showForm ? "Close" : "+ Add User"}
              </button>
            </span>
            <span className="text-xs flex items-center gap-2">
              <label htmlFor="rowsPerPage" className="text-sm font-medium text-gray-700">
                Rows per page:
              </label>
              <input
                type="number"
                id="rowsPerPage"
                placeholder={ticketsPerPage}
                onChange={handleRowsPerPageChange}
                className="w-16 px-2 py-2 border-2 rounded text-gray-900 ml-2 mr-2"
                min="0"
              />
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
            </span>
          </h3>
          <div className="overflow-x-auto ">
          <table className="min-w-full border bg-second rounded-lg overflow-hidden filter-table mt-5">
            <thead className="bg-second border-2 border-prime text-prime font-semibold font-poppins text-fontadd">
              <tr>
                {["Id", "Employee ID", "Employee Name", "Username", "User Type", "Mobile", "Location"].map((header, index) => (
                  <td key={index} className="w-1/10 py-4 px-4">
                    <div className="flex items-center justify-left gap-2">
                      <div className="header flex">
                        <span className="head">{header}</span>
                        <span><FaFilter
                          className="cursor-pointer ml-1 mt-0.5"
                          onClick={() => setShowFilter(prevState => ({
                            ...prevState,
                            [header.toLowerCase().replace(" ", "")]: !prevState[header.toLowerCase().replace(" ", "")]
                          }))}
                        /></span>
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
              {currentTickets.map((userdet) => (
                <tr key={userdet.id} className="bg-box text-fontadd text-center font-medium">
                  <td className="border-t py-4 px-4">{(i++) + (offset)}</td>
                  <td className="border-t py-4 px-4" style={{ textAlign: 'center' }}>{userdet.employee_id}</td>
                  <td className="border-t py-4 px-4" style={{ textAlign: 'left' }}>{userdet.employee_name}</td>
                  <td className="border-t py-4 px-4" style={{ textAlign: 'left' }}>{userdet.username}</td>
                  <td className="border-t py-4 px-4" style={{ textAlign: 'left' }}>{userdet.typename}</td>
                  <td className="border-t py-4 px-4" style={{ textAlign: 'left' }}>{userdet.mobile}</td>
                  <td className="border-t py-4 px-4" style={{ textAlign: 'left' }}>{userdet.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        <div className="pagination mt-4 flex justify-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
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
    </div>
  );
};

export default Form;


