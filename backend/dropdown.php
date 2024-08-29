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

$sqlLocations = "SELECT id, `name` FROM location WHERE is_active = 1";
$resultLocations = $conn->query($sqlLocations);

$locations = array();

if ($resultLocations->num_rows > 0) {
    while ($row = $resultLocations->fetch_assoc()) {
        $locations[] = array(
            "id" => $row["id"],
            "name" => $row["name"]
        );
    }
}

$sqlIpdetails = "SELECT id, `ip_from`, `ip_to`, `location_id` FROM ip_details WHERE is_active = 1";
$resultIpdetails = $conn->query($sqlIpdetails);

$Ipdetails = array();

if ($resultIpdetails->num_rows > 0) {
    while ($row = $resultIpdetails->fetch_assoc()) {
        $Ipdetails[] = array(
            "id" => $row["id"],
            "ip_from" => $row["ip_from"],
            "ip_to" => $row["ip_to"],
            "location_id" => $row["location_id"]

        );
    }
}
// Return the data as JSON
$response = array(
    "groups" => $groups,
    "types" => $types,
    "locations"=>$locations,
    "Ipdetails"=>$Ipdetails
);

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
