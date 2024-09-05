<?php
include 'config.php';

// Fetch the 'type' parameter from the query string
$type = isset($_GET['type']) ? $_GET['type'] : '';

if ($type) {
    // Sanitize the type variable to prevent SQL injection if not using prepared statements
    $type = $conn->real_escape_string($type);

    // Prepare the SQL query using the sanitized type
    $sql = "SELECT * FROM asset_$type";

    $result = $conn->query($sql);

    $users = array();
    if ($result) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    } else {
        // Optionally, handle SQL errors
        echo json_encode(["error" => $conn->error]);
        exit;
    }

    $conn->close();

    echo json_encode($users);
} else {
    echo json_encode(["error" => "Type parameter is required."]);
}

