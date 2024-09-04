<?php
include 'config.php';

// Initialize response array
$response = array('success' => false, 'message' => '');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the ID and action type are provided in the query parameters
    if (isset($_GET['id']) && isset($_GET['act'])) {
        $id = intval($_GET['id']);
        $action = $_GET['act'];

        // Prepare the SQL statement based on action type
        if ($action === "add") {
            // Activate the column
            $query = "UPDATE table_fields SET `is_active` = 1 WHERE `id` = ?";
        } elseif ($action === "remove") {
            // Deactivate the column
            $query = "UPDATE table_fields SET `is_active` = 0 WHERE `id` = ?";
        } else {
            $response['message'] = 'Invalid action specified.';
            echo json_encode($response);
            exit;
        }

        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id); // assuming id is an integer

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = ($action === "add") ? 'Column activated successfully.' : 'Column deactivated successfully.';
        } else {
            $response['message'] = 'Error updating column: ' . $stmt->error;
        }

        $stmt->close();
    } else {
        $response['message'] = 'ID or action not provided.';
    }
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
$conn->close();
?>
