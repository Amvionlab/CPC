<?php
// Include the database configuration file
require_once 'config.php';

// Get the input data from the request
$data = json_decode(file_get_contents('php://input'), true);
$table = isset($data['table']) ? $data['table'] : '';
$name = isset($data['name']) ? $data['name'] : '';

// Validate inputs
if (empty($table) || empty($name)) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing fields. Please provide type and name.']);
    exit();
}

// Dynamically determine the table name based on the type
$tableName = 'asset_' . strtolower($table);

// Check the connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Prepare the SQL query to drop the column
$sql = "ALTER TABLE `$tableName` DROP COLUMN `$name`";

// Execute the query
if ($conn->query($sql) === TRUE) {
    echo json_encode(['message' => 'Column deleted successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error deleting column: ' . $conn->error]);
}

// Close the database connection
$conn->close();
?>
