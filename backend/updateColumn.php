<?php
// Include database configuration
include 'config.php'; // Ensure this file contains the $conn variable

// Get the POST input from the request
$data = json_decode(file_get_contents('php://input'), true);

// Validate and sanitize inputs
$table = isset($data['table']) ? $data['table'] : '';
$oldName = isset($data['oldName']) ? $data['oldName'] : '';
$name = isset($data['name']) ? $data['name'] : '';

// Validate inputs
if (empty($table) || empty($oldName) || empty($name)) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing fields. Please provide table, oldName, and name.']);
    exit();
}

// Dynamically determine the table name based on the type
$tableName = 'asset_' . strtolower($table);

// Prepare the ALTER TABLE query to rename the column
$alterSql = "ALTER TABLE `$tableName` CHANGE `$oldName` `$name` VARCHAR(255)";

// Execute the query
if ($conn->query($alterSql) === TRUE) {
    echo json_encode(['message' => 'Column name updated successfully']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error updating column name: ' . $conn->error]);
}

// Close the database connection
$conn->close();
?>
