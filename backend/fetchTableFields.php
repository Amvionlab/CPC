<?php
include 'config.php';

// Initialize response array
$response = array('success' => false, 'inactive_columns' => [], 'active_columns' => []);

// Process the request
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Fetch columns where is_active = 0
    $inactiveQuery = "SELECT table_fields.column_name, table_fields.type_id, asset_type.type AS type FROM table_fields JOIN asset_type ON asset_type.id=table_fields.type_id WHERE table_fields.is_active = 0";
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
    $activeQuery = "SELECT table_fields.column_name, table_fields.type_id, asset_type.type AS type FROM table_fields JOIN asset_type ON asset_type.id=table_fields.type_id WHERE table_fields.is_active = 1";
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
