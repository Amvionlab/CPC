<?php
include 'config.php';

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $typename = $_POST['type'];

    // Insert data into 'ticket_type' table
    $sql = "INSERT INTO asset_type (type, is_active) VALUES ('$typename', '1')";

    if ($conn->query($sql) === TRUE) {
        $response = array('success' => true, 'message' => 'Ticket Status added successfully.');
    } else {
        $response = array('success' => false, 'message' => 'Error: ' . $conn->error);
    }

    echo json_encode($response);
} else {
    $response = array('success' => false, 'message' => 'Invalid request method.');
    echo json_encode($response);
}

$conn->close();
