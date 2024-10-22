import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../UserContext/UserContext';

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
        group: "",
        type: ""
        
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
  const [extraFields, setExtraFields] = useState([]);
  const [dynamicFields, setDynamicFields] = useState([]);

  const [showFilter, setShowFilter] = useState({
    id: false,
    name : false,
    lastname: false,
  });
  
  const handleImportClick = () => {
    navigate('/bulk_assetadd');
  };

  const [showForm, setShowForm] = useState(false);
  const [Access, setAccess] = useState([]);
  const [locations, setLocations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [types, setTypes] = useState([]);
  const [defaultFields, setDefaultFields] = useState([]);
 
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
}, [formData.group,formData.type]);

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

        // Set default and extra fields
        setDefaultFields(result.default_columns || []);
        setDynamicFields(result.extra_columns || []);
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

    if (name === 'group') {
        setFormData({
            group: value, // Keep the newly selected group
            type: '',
        });

        setDynamicFields([]); // Reset dynamic fields to an empty array or default columns if needed
    }
    else if ( value=='select') {
     
      setFormData({
          group: formData.group, 
          type: '', 
      });

     
      setDynamicFields([]); 
  }
    else {
       
        setFormData({
            ...formData,
            [name]: value,
        });
    }
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

    try {
        const response = await fetch(`${baseURL}/backend/asset_add.php`, {
            method: "POST",
            body: form,
        });

        const result = await response.json();

        console.log("Response:", result); // Log the response to check its format

        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }

        if (result.message === "Asset Already Exists") {
            setSubmissionStatus({ success: false, message: result.message });
            toast.error(result.message); // Display error message
        } else if (result.message === "Asset added successfully with tag.") {
            setSubmissionStatus({ success: true, message: result.message });
            toast.success(result.message); // Display success message
            location.reload(); // Reload the page to reflect changes
        } else {
            throw new Error("Unexpected response message.");
        }
    } catch (error) {
        setSubmissionStatus({
            success: false,
            message: "There was a problem with your fetch operation: " + error.message,
        });
        toast.error("There was a problem with your fetch operation: " + error.message); // Display error message
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

  return (
    <div className="bg-second  w-full h-full text-xs mx-auto p-1 lg:overflow-y-hidden ticket-scroll">
     
        <div className="w-full h-full p-2 bg-box rounded-lg " >
        <div className="flex font-bold justify-between items-center mb-3 p-3">
      <h1 className="text-lg">Single Asset Add</h1>
      <button
        onClick={handleImportClick}
        className="flex text-xs items-center px-3 py-2 bg-box border border-gray-400 shadow-inner text-prime rounded hover:shadow-md hover:border-prime transition-transform transform hover:scale-110"
      >
        <FontAwesomeIcon icon={faDownload} className="mr-2" />
        Bulk Import
      </button>
    </div>
          <div className="ticket-table mt-2">
            <form onSubmit={handleSubmit} className="space-y-4 text-label">
              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-3  ml-10 pr-10 mb-0">
              <div className="flex items-center mb-2 mr-4">
    <label className="text-sm font-semibold text-prime mr-2 w-32">
        Group
    </label>
    <select
        name="group"
        value={formData.group}
        onChange={handleChange}  // Attach the updated handleChange function here
        className="flex-grow text-xs border p-2  rounded-md outline-none transition ease-in-out delay-150 focus:shadow-sm"
    >
        <option value="">Select Group</option>
        {groups
        .filter(group => group.group) // Ensure that only groups with a name are shown
        .map((group) => (
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
                    className="flex-grow text-xs border p-2  rounded-md outline-none transition ease-in-out delay-150 focus:shadow-sm"
   >
                    <option value="select">Select Type</option>
                    {filteredTypes
                    .map((type) => (
                        <option key={type.type} value={type.type}>
                            {type.type}
                        </option>
                    ))}
                    </select>
                </div>

                  {/* <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Name<span className="text-red-600 text-md font-bold">*</span>
                  </label> */}
                  <input
                    type="hidden"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150 focus:shadow-sm"
                  />
               
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Manufacturer <span className="text-red-600 text-md font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="manufacturer"
                    placeholder="Enter Manufacturer Name"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    required
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Model <span className="text-red-600 text-md font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    placeholder="Enter Model Name"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Serial Number<span className="text-red-600 text-md font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="serial_number"
                    placeholder="Enter Serial No"
                    value={formData.serial_number}
                    onChange={handleChange}
                    required
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>
                <div className="flex items-center mb-2 mr-4">
                <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Location
                </label>
                <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="flex-grow text-xs border p-2  rounded-md outline-none transition ease-in-out delay-150 focus:shadow-sm"
                    >
                    <option value="">Select Location</option>
                    {locations
                    .filter(location => location.name) // Ensure that only locations with a name are shown
                    .map((location) => (
                        <option key={location.id} value={location.name}>
                        {location.name}
                        </option>
                    ))}
                </select>
                </div>
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    placeholder="Enter User Name"
                    value={formData.user_name}
                    onChange={handleChange}
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>
                <div className="flex items-center mb-2 mr-4">
                <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Asset Value
                </label>
                <input
                    type="number"
                    name="asset_value"
                    placeholder="Enter Asset Value"
                    value={formData.asset_value}
                    onChange={handleChange}
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                />
                </div>

                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Vendor Name<span className="text-red-600 text-md font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="vendor_name"
                    placeholder="Enter Vendor Name"
                    value={formData.vendor_name}
                    onChange={handleChange}
                    required
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>
               
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Purchase Date
                  </label>
                  <input
                    type="text"
                    name="purchase_date"
                    placeholder="Enter Purchase Date"
                    value={formData.purchase_date}
                    onChange={handleChange}
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    PO Number
                  </label>
                  <input
                    type="text"
                    name="po_number"
                    placeholder="Enter PO Number"
                    value={formData.po_number}
                    onChange={handleChange}
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    AMC From
                  </label>
                  <input
                    type="text"
                    name="amc_from"
                    placeholder="Enter Amc From Date"
                    value={formData.amc_from}
                    onChange={handleChange}
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    AMC To
                  </label>
                  <input
                    type="text"
                    name="amc_to"
                    placeholder="Enter AMC To Date"
                    value={formData.amc_to}
                    onChange={handleChange}
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>  
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    AMC - PMS
                  </label>
                  <input
                    type="text"
                    name="amc_interval"
                    placeholder="Enter AMC Interval Date"
                    value={formData.amc_interval}
                    onChange={handleChange}
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div> 
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Last AMC Visit
                  </label>
                  <input
                    type="text"
                    name="last_amc"
                    placeholder="Enter Last AMC Date"
                    value={formData.last_amc}
                    onChange={handleChange}
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Procure By
                  </label>
                  <input
                    type="text"
                    name="procure_by"
                    placeholder="Enter Procure By Date"
                    value={formData.procure_by}
                    onChange={handleChange}
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>  
                <div className="flex items-center mb-2 mr-4">
                  <label className="text-sm font-semibold text-prime mr-2 w-32">
                    Warranty Upto
                  </label>
                  <input
                    type="text"
                    name="warranty_upto"
                    placeholder="Enter Warranty Upto Date"
                    value={formData.warranty_upto}
                    onChange={handleChange}
                    className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
                  />
                </div>  
                
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-3 ml-10 pr-10 mb-0">
    {dynamicFields.map((field, index) => (
        <div key={field || index} className="flex items-center mb-2 mr-4">
            <label className="capitalize text-sm font-semibold text-prime mr-2 w-32">
                {field.replace('_', ' ')}
            </label>
            <input
                type="text"
                name={field}
                placeholder={`Enter ${field.replace('_', ' ')}`}
                value={formData[field]}
                onChange={handleChange}
                className="flex-grow text-xs  border p-2  rounded-md outline-none transition ease-in-out delay-150  focus:shadow-sm"
            />
        </div>
    ))}
</div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="mt-1 bg-prime font-semibold text-lg text-white py-2 px-8 rounded-md shadow-md focus:outline-none"
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