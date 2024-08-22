<?php
include 'config.php';

// Initialize response array
$response = array('success' => false, 'inactive_columns' => [], 'active_columns' => []);

// Process the request
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Fetch columns where is_active = 0
    $inactiveQuery = "SELECT column_name, type_id FROM table_fields WHERE is_active = 0";
    $inactiveResult = $conn->query($inactiveQuery);

    if ($inactiveResult) {
        while ($row = $inactiveResult->fetch_assoc()) {
            $response['inactive_columns'][] = $row;
        }
    } else {
        $response['message'] = 'Error fetching inactive columns: ' . $conn->error;
        echo json_encode($response);
        $conn->close();
        exit;
    }

    // Fetch columns where is_active = 1
    $activeQuery = "SELECT column_name, type_id FROM table_fields WHERE is_active = 1";
    $activeResult = $conn->query($activeQuery);

    if ($activeResult) {
        while ($row = $activeResult->fetch_assoc()) {
            $response['active_columns'][] = $row;
        }
        $response['success'] = true;
        $response['message'] = 'Columns fetched successfully.';
    } else {
        $response['message'] = 'Error fetching active columns: ' . $conn->error;
    }

    echo json_encode($response);
} else {
    $response['message'] = 'Invalid request method.';
    echo json_encode($response);
}

$conn->close();
?>
