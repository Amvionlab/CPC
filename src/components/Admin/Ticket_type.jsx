import React, { useState, useEffect } from "react";
import axios from 'axios';
import { baseURL } from '../../config.js';

const TableCreator = () => {
  const [columns, setColumns] = useState([]);
  const [tableExists, setTableExists] = useState(false);

  useEffect(() => {
    // Check if the table already exists and fetch its structure
    fetchTableStructure();
  }, []);

  const fetchTableStructure = async () => {
    try {
      const response = await axios.get(`${baseURL}/backend/get_table_structure.php`);
      if (response.data.exists) {
        console.log("if",response);
        setTableExists(true);
        setColumns(response.data.columns);
      } else {
        setTableExists(false);
        console.log("else",response);
        setColumns([{
          name: '',
          type: 'INT',
          length: '',
          primaryKey: false,
          autoIncrement: false,
          notNull: false,
          unique: false,
          defaultValue: '',
        }]);
      }
    } catch (error) {
      console.error('Error fetching table structure:', error);
    }
  };

  const handleAddColumn = () => {
    setColumns([
      ...columns,
      {
        name: '',
        type: 'INT',
        length: '',
        primaryKey: false,
        autoIncrement: false,
        notNull: false,
        unique: false,
        defaultValue: '',
      },
    ]);
  };

  const handleRemoveColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  };

  const handleChange = (index, event) => {
    const { name, value, checked, type } = event.target;
    const newColumns = [...columns];
    newColumns[index][name] = type === 'checkbox' ? checked : value;
    setColumns(newColumns);
  };

  const handleSubmit = async () => {
    const tableName = 'asset_fields';
    if (!tableName) return;

    try {
        // Fetch the existing table structure
        const tableStructureResponse = await axios.get(`${baseURL}/backend/get_table_structure.php`, {
            params: { tableName }
        });

        const existingColumns = tableStructureResponse.data.exists ? tableStructureResponse.data.columns : [];
        const existingColumnNames = existingColumns.map(col => col.name);

        let sql = '';

        columns.forEach((col, index) => {
            const { name, type, length, primaryKey: pk, autoIncrement, notNull, unique, defaultValue } = col;

            if (!name) return;

            if (existingColumnNames.includes(name)) {
                // Column already exists, check for changes
                const existingCol = existingColumns.find(ec => ec.name === name);
                if (
                    existingCol.type !== type ||
                    existingCol.length !== length ||
                    existingCol.primaryKey !== pk ||
                    existingCol.autoIncrement !== autoIncrement ||
                    existingCol.notNull !== notNull ||
                    existingCol.unique !== unique ||
                    existingCol.defaultValue !== defaultValue
                ) {
                    // Generate ALTER statement to modify column
                    sql += `ALTER TABLE ${tableName} MODIFY ${name} ${type}`;
                    if (length) sql += `(${length})`;
                    if (notNull) sql += ' NOT NULL';
                    if (autoIncrement) sql += ' AUTO_INCREMENT';
                    if (unique) sql += ' UNIQUE';
                    if (defaultValue) sql += ` DEFAULT '${defaultValue}'`;
                    sql += ';\n';
                }
            } else {
                // Column does not exist, add it
                sql += `ALTER TABLE ${tableName} ADD ${name} ${type}`;
                if (length) sql += `(${length})`;
                if (notNull) sql += ' NOT NULL';
                if (autoIncrement) sql += ' AUTO_INCREMENT';
                if (unique) sql += ' UNIQUE';
                if (defaultValue) sql += ` DEFAULT '${defaultValue}'`;
                sql += ';\n';
            }
        });

        // Handle primary key separately since MySQL only allows one PRIMARY KEY constraint per table
        const existingPrimaryKey = existingColumns.find(col => col.primaryKey);
        const newPrimaryKey = columns.find(col => col.primaryKey);

        if (newPrimaryKey && (!existingPrimaryKey || existingPrimaryKey.name !== newPrimaryKey.name)) {
            if (existingPrimaryKey) {
                sql += `ALTER TABLE ${tableName} DROP PRIMARY KEY;\n`;
            }
            sql += `ALTER TABLE ${tableName} ADD PRIMARY KEY (${newPrimaryKey.name});\n`;
        }

        if (sql) {
            // Execute the generated SQL to update the table
            alert(sql)
            const response = await axios.post(`${baseURL}/backend/alter.php`, { query: sql });
            alert(response.data.message);
            fetchTableStructure(); // Refresh the table structure after changes
        } else {
            alert('No changes detected, table is already up-to-date.');
        }
    } catch (error) {
        console.error('Error checking or altering table:', error);
        alert('Error checking or altering table.');
    }
};


  return (
    <div>
      <h1>MySQL Table Creator</h1>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Column Name</th>
            <th className="border border-gray-300 p-2">Data Type</th>
            <th className="border border-gray-300 p-2">Length</th>
            <th className="border border-gray-300 p-2">Primary Key</th>
            <th className="border border-gray-300 p-2">Auto Increment</th>
            <th className="border border-gray-300 p-2">Not Null</th>
            <th className="border border-gray-300 p-2">Unique</th>
            <th className="border border-gray-300 p-2">Default Value</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  name="name"
                  value={col.name}
                  onChange={(e) => handleChange(index, e)}
                  className="border p-1"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <select
                  name="type"
                  value={col.type}
                  onChange={(e) => handleChange(index, e)}
                  className="border p-1"
                >
                  <option value="INT">INT</option>
                  <option value="VARCHAR">VARCHAR</option>
                  <option value="TEXT">TEXT</option>
                  <option value="DATE">DATE</option>
                  <option value="FLOAT">FLOAT</option>
                  {/* Add more data types as needed */}
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  name="length"
                  value={col.length}
                  onChange={(e) => handleChange(index, e)}
                  className="border p-1"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  name="primaryKey"
                  checked={col.primaryKey}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  name="autoIncrement"
                  checked={col.autoIncrement}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  name="notNull"
                  checked={col.notNull}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  name="unique"
                  checked={col.unique}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  name="defaultValue"
                  value={col.defaultValue}
                  onChange={(e) => handleChange(index, e)}
                  className="border p-1"
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <button onClick={() => handleRemoveColumn(index)} className="bg-red-500 text-white px-2 py-1">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleAddColumn} className="bg-blue-500 text-white px-4 py-2 mr-2">Add Column</button>
      <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2">Generate SQL and Create Table</button>
    </div>
  );
};

export default TableCreator;
