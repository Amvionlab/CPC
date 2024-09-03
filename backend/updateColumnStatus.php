<?php
include 'config.php';

// Initialize response array
$response = array('success' => false, 'message' => '');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the ID is provided in the query parameters
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']); 
        
        // Prepare the statement to update the table_fields
        $query = "UPDATE table_fields SET `is_active` = '1' WHERE `id` = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id); // assuming id is an integer

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Column activated successfully.';
        } else {
            $response['message'] = 'Error activating column: ' . $stmt->error;
        }

        $stmt->close();
    } else {
        $response['message'] = 'ID not provided.';
    }
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
$conn->close();

