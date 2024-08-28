<?php
include 'config.php';

// Enable error reporting for debugging (optional)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $groupName = trim($_POST['name']); // Get the group name from the POST data
    $active = "1"; // Set is_active to 1

    // Check if the group name already exists in the 'asset_group' table
    $checkSql = "SELECT id FROM asset_group WHERE `group` = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("s", $groupName);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // Group already exists
        $response = array('success' => false, 'message' => 'Group already exists.');
        echo json_encode($response);
    } else {
        // Insert the new group into the 'asset_group' table
        $sql = "INSERT INTO asset_group (`group`, is_active) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $groupName, $active);

        if ($stmt->execute()) {
            $response = array('success' => true, 'message' => 'Group added successfully.');
            echo json_encode($response);
        } else {
            $response = array('success' => false, 'message' => 'Error: ' . $stmt->error);
            echo json_encode($response);
        }
    }

    $stmt->close();
} else {
    $response = array('success' => false, 'message' => 'Invalid request method.');
    echo json_encode($response);
}

$conn->close();
