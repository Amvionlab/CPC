<?php
include 'config.php';

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $typename = $_POST['type'];
    
    // Insert data into 'ticket_type' table
    $sql = "INSERT INTO asset_type (type, is_active) VALUES ('$typename', '1')";

    if ($conn->query($sql) === TRUE) {
        // Create a new table based on the asset_template
        $createTableSql = "CREATE TABLE asset_" . $conn->real_escape_string($typename) . " LIKE asset_template";
        
        if ($conn->query($createTableSql) === TRUE) {
            $response = array('success' => true, 'message' => 'Ticket Status and associated table created successfully.');
        } else {
            $response = array('success' => false, 'message' => 'Error creating table: ' . $conn->error);
        }
    } else {
        $response = array('success' => false, 'message' => 'Error: ' . $conn->error);
    }

    echo json_encode($response);
} else {
    $response = array('success' => false, 'message' => 'Invalid request method.');
    echo json_encode($response);
}

$conn->close();
