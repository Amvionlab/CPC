<?php
// Include database configuration
include 'config.php'; // Ensure this file contains the $conn variable

// Get the POST input from the request
$data = json_decode(file_get_contents('php://input'), true);

// Validate and sanitize inputs
$table = isset($data['table']) ? $data['table'] : '';
$name = isset($data['name']) ? $data['name'] : '';
$type_id = isset($data['type_id']) ? $data['type_id'] : '';

// Validate inputs
if (empty($table) || empty($name)) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing fields. Please provide type and name.']);
    exit();
}

// Dynamically determine the table name based on the type
$tableName = 'asset_' . strtolower($table);

// Check if the column already exists
$checkSql = "SHOW COLUMNS FROM `$tableName` LIKE '$name'";
$result = $conn->query($checkSql);

if ($result->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['message' => 'Column already exists']);
    exit();
}

// Prepare the ALTER TABLE query to add the new column
$alterSql = "ALTER TABLE `$tableName` ADD `$name` VARCHAR(255)";

// Execute the query
if ($conn->query($alterSql) === TRUE) {
    $tfSql = "INSERT INTO table_fields (`column_name`, `type_id`, `is_active`) VALUES ('$name','$type_id','0')";
    if ($conn->query($tfSql) === TRUE) {
    echo json_encode(['message' => 'Column added successfully']);
    }
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Error adding column: ' . $conn->error]);
}

// Close the database connection
$conn->close();
?>
