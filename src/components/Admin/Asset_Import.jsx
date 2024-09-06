import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../config.js';

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

    const [groups, setGroups] = useState([]);
    const [types, setTypes] = useState([]);
    const [defaultColumns, setDefaultColumns] = useState([]);
    const [extraColumns, setExtraColumns] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(''); 

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const response = await fetch(`${baseURL}/backend/dropdown.php`);
                const data = await response.json();
                if (data.groups) setGroups(data.groups);
                if (data.types) setTypes(data.types);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };
        fetchDropdownData();
    }, []);

    useEffect(() => {
        // Reset file when the component is unmounted (page reload or close)
        return () => {
            setFile(null);
            setFileName('');
        };
    }, []);

    useEffect(() => {
        if (formData.type) {
            const fetchColumns = async () => {
                try {
                    const response = await fetch(`${baseURL}/backend/get_extra_columns.php`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: new URLSearchParams({ type: formData.type }),
                    });

                    const result = await response.json();

                    // Exclude "id", "tag", and "post_date" fields
                    const excludeFields = ["id", "tag", "post_date"];
                    const filteredDefaultColumns = result.default_columns.filter(field => !excludeFields.includes(field));
                    const filteredExtraColumns = result.extra_columns.filter(field => !excludeFields.includes(field));

                    setDefaultColumns(filteredDefaultColumns);
                    setExtraColumns(filteredExtraColumns);
                } catch (error) {
                    console.error('Error fetching columns:', error);
                }
            };
            fetchColumns();
        }
    }, [formData.type]);

    const handleFieldSelection = (field) => {
        setSelectedFields((prevSelectedFields) =>
            prevSelectedFields.includes(field)
                ? prevSelectedFields.filter(f => f !== field)
                : [...prevSelectedFields, field]
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'group') {
            setFormData({
                ...formData,
                group: value,   
                type: '',      
            });
            setDefaultColumns([]);       
            setExtraColumns([]);         
            setSelectedFields([]);       
            setFile(null);               
            setIsDialogOpen(false);      
        } else if (name === 'type') {
            setFormData({
                ...formData,
                [name]: value,
            });

            setSelectedFields([]);   
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        if (selectedFile) {
            // Check if the selected file is a CSV
            const isCSV = selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv');
            
            if (isCSV) {
                setFile(selectedFile);  // Set the file state
                setFileName(selectedFile.name);  // Set the file name state
            } else {
                toast.error("Only CSV files are allowed.");
                setFile(null);
                setFileName("");  // Reset the file name
            }
        }
    }; 

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedFields([]);
    };

    const handleExportCSV = () => {
        if (selectedFields.length === 0) {
            toast.error("No fields selected for export.");
            return;
        }
        const templateType = formData.type || "TYPE_NOT_FOUND"; 

        const firstRow = `${templateType}`;
   
        const secondRow = selectedFields.join(",");
    
        const csvContent = firstRow + "\n" + secondRow + "\n";
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!file || !formData.type) {
            toast.error("Please select a type and upload a file.");
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append("type", formData.type);  // Send the selected type
        formDataToSend.append("file", file);  // Send the file
    
        try {
            const response = await fetch(`${baseURL}/backend/import_add.php`, {
                method: "POST",
                body: formDataToSend,
            });
    
            const result = await response.json();
    
            if (result.success) {
                toast.success("Data imported successfully.");
            
                // Reset all fields in formData to an empty string
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
                    group: "",
                    type: ""
                });
            }
             else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to import data.");
        }
    };             
    
    const filteredTypes = types.filter(type => type.group_id === formData.group);

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    return (
        <div className="bg-second max-h-5/6 max-w-4/6 text-xs mx-auto p-1 lg:overflow-y-hidden h-auto ticket-scroll">
            <div className="max-w-full mt-3 m-2 mb-4 p-2 bg-box rounded-lg font-mont">
                <div className="ticket-table mt-2">
                    <form onSubmit={handleSubmit} className="space-y-4 text-label">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 ml-10 pr-10 mb-0">
                            <div className="font-mont font-semibold text-2xl mb-4">
                                Asset Details:
                            </div>
                        </div>

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
                                    className="flex-grow text-xs bg-second border p-2 border-none rounded-md outline-none transition ease-in-out delay-150 focus:shadow-prime focus:shadow-sm"
                                >
                                    <option value="">Select Type</option>
                                    {filteredTypes.map((type) => (
                                        <option key={type.type} value={type.type}>
                                            {type.type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {formData.type && (
                            <div className="ml-10 pr-10 mt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <button
                                        type="button"
                                        onClick={handleOpenDialog}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md"
                                    >
                                        Template
                                    </button>

                                    <div className="flex flex-col items-start">
                                        <label
                                            htmlFor="file-upload"
                                            className="bg-gray-300 cursor-pointer text-black py-2 px-4 rounded-md shadow-md"
                                        >
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept=".csv"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            Attach File
                                        </label>
                                        {fileName && (
                                            <p className="text-xs text-gray-600 mt-1">{fileName}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-1 bg-prime font-mont font-semibold text-lg text-white py-2 px-8 rounded-md shadow-md focus:outline-none"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative z-10">
                        <h2 className="text-xl font-semibold mb-4 text-center">Template Fields</h2>
                        <div className="overflow-y-auto max-h-64">
                            <table className="min-w-full bg-box border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-2 text-center">Column Names </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...defaultColumns, ...extraColumns].map((field, index) => (
                                        <tr 
                                            key={field} 
                                            className={`cursor-pointer ${selectedFields.includes(field) ? 'bg-yellow-200' : ''}`} 
                                            onClick={() => handleFieldSelection(field)}
                                        >
                                            <td className="border border-gray-300 p-2 text-center">
                                                {field}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleCloseDialog}
                                className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Form;
