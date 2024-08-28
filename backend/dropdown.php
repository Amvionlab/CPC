<?php
include 'config.php'; // Include your database connection settings

// Fetch active groups
$sqlGroups = "SELECT id, `group` FROM asset_group WHERE is_active = 1";
$resultGroups = $conn->query($sqlGroups);

$groups = array();

if ($resultGroups->num_rows > 0) {
    while ($row = $resultGroups->fetch_assoc()) {
        $groups[] = array(
            "id" => $row["id"],
            "group" => $row["group"]
        );
    }
}

// Fetch active types
$sqlTypes = "SELECT asset_type.type, asset_type.group_id, asset_group.group AS group_name FROM asset_type JOIN asset_group ON asset_type.group_id = asset_group.id WHERE asset_type.is_active = 1";
$resultTypes = $conn->query($sqlTypes);

$types = array();

if ($resultTypes->num_rows > 0) {
    while ($row = $resultTypes->fetch_assoc()) {
        $types[] = array(
            "type" => $row["type"],
            "group_id" => $row["group_id"],
            "group" => $row["group_name"],
        );
    }
}

// Return the data as JSON
$response = array(
    "groups" => $groups,
    "types" => $types
);

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
