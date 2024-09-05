<?php
include 'config.php';

// Initialize response array
$response = array('success' => false, 'inactive_columns' => [], 'active_columns' => []);

// Process the request
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Get type from query parameters
    $type = isset($_GET['type']) ? $_GET['type'] : null;

    // Fetch inactive columns that match the specified type
    $inactiveQuery = "SELECT table_fields.id, table_fields.column_name, table_fields.type_id, asset_type.type AS type 
                      FROM table_fields 
                      JOIN asset_type ON asset_type.id = table_fields.type_id 
                      WHERE table_fields.is_active = 0 AND asset_type.type = ?";
    
    $stmt = $conn->prepare($inactiveQuery);
    $stmt->bind_param("s", $type);
    $stmt->execute();
    $inactiveResult = $stmt->get_result();

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

    // Fetch active columns that match the specified type
    $activeQuery = "SELECT table_fields.id, table_fields.column_name, table_fields.type_id, asset_type.type AS type 
                    FROM table_fields 
                    JOIN asset_type ON asset_type.id = table_fields.type_id 
                    WHERE table_fields.is_active = 1 AND asset_type.type = ?";
    
    $stmt = $conn->prepare($activeQuery);
    $stmt->bind_param("s", $type);
    $stmt->execute();
    $activeResult = $stmt->get_result();

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
