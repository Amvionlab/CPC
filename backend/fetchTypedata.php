<?php
include 'config.php';

// Fetch the 'type', 'location', and 'branch' parameters from the query string
$type = isset($_GET['type']) ? $_GET['type'] : '';
$location = isset($_GET['location']) ? $_GET['location'] : '';
$branch = isset($_GET['branch']) ? $_GET['branch'] : '';

if ($type) {
    // Sanitize the type, location, and branch variables to prevent SQL injection
    $type = $conn->real_escape_string($type);
    $location = $conn->real_escape_string($location);
    $branch = $conn->real_escape_string($branch);

    // Prepare the base SQL query for the asset table
    $sql = "SELECT * FROM asset_$type";

    // Check if location is provided
    if ($location) {
        // Fetch all equivalent 'id's for the specified location from the 'branch' table
        $branchIds = [];
        $locationSql = "SELECT id FROM branch WHERE location_id = '$location'";
        $locationResult = $conn->query($locationSql);

        if ($locationResult) {
            while($row = $locationResult->fetch_assoc()) {
                $branchIds[] = $row['id'];
            }
        }

        // If there are matching branch IDs for the location, apply them as filters
        if (!empty($branchIds)) {
            $branchIdsStr = implode(',', $branchIds);
            $sql .= " WHERE  branch IN ($branchIdsStr)";
        } else {
            // If no matching branch IDs, return an empty result set
            echo json_encode([]);
            $conn->close();
            exit;
        }
    } elseif ($branch) {
        // If only branch is provided, use it as the filter
        $sql .= " WHERE branch = '$branch'";
    }

    $result = $conn->query($sql);

    $users = array();
    if ($result) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    } else {
        // Handle SQL errors
        echo json_encode(["error" => $conn->error]);
        exit;
    }

    $conn->close();

    echo json_encode($users);
} else {
    echo json_encode(["error" => "Type parameter is required."]);
}
