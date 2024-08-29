<?php
include 'config.php';

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $location_id = $_POST['location'];
    $from_ip = trim($_POST['from_ip']);
    $to_ip = trim($_POST['to_ip']);

    // Check if the IP details already exist
    $checkSql = "SELECT id FROM ip_details WHERE location_id = ? AND ip_from = ? AND ip_to = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("sss", $location_id, $from_ip, $to_ip);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        // IP details already exist
        $response = array('success' => false, 'message' => 'IP_Address already exists.');
        echo json_encode($response);
    } else {
        // Insert new record into the 'ip_details' table
        $sql = "INSERT INTO ip_details (location_id, ip_from, ip_to, is_active) VALUES (?, ?, ?, 1)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $location_id, $from_ip, $to_ip);

        if ($stmt->execute()) {
            $response = array('success' => true, 'message' => 'IP_Address added successfully.');
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
?>
