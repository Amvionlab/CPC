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
$sqlTypes = "SELECT asset_type.type, asset_type.tag, asset_type.group_id, asset_group.group AS group_name FROM asset_type JOIN asset_group ON asset_type.group_id = asset_group.id WHERE asset_type.is_active = 1";
$resultTypes = $conn->query($sqlTypes);

$types = array();

if ($resultTypes->num_rows > 0) {
    while ($row = $resultTypes->fetch_assoc()) {
        $types[] = array(
            "type" => $row["type"],
            "group_id" => $row["group_id"],
            "group" => $row["group_name"],
            "tag" => $row["tag"],
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

$sqlBranches = "SELECT id, `name`, `location_id` FROM branch WHERE is_active = 1";
$resultBranches = $conn->query($sqlBranches);

$branches = array();

if ($resultBranches->num_rows > 0) {
    while ($row = $resultBranches->fetch_assoc()) {
        $branches[] = array(
            "id" => $row["id"],
            "name" => $row["name"],
            "location_id" => $row["name"],
        );
    }
}

$sqlStatuses = "SELECT id, `name` FROM asset_status WHERE is_active = 1";
$resultStatuses = $conn->query($sqlStatuses);

$statuses = array();

if ($resultStatuses->num_rows > 0) {
    while ($row = $resultStatuses->fetch_assoc()) {
        $statuses[] = array(
            "id" => $row["id"],
            "name" => $row["name"]
        );
    }
}

$sqlIpdetails = "SELECT id, `ip_from`,`ip_to`, `branch_id`, `location_id` FROM ip_details WHERE is_active = 1";
$resultIpdetails = $conn->query($sqlIpdetails);

$Ipdetails = array();

if ($resultIpdetails->num_rows > 0) {
    while ($row = $resultIpdetails->fetch_assoc()) {
        $Ipdetails[] = array(
            "id" => $row["id"],
            "ip_from" => $row["ip_from"],
            "ip_to" => $row["ip_to"],
            "branch_id" => $row["branch_id"],
            "location_id" => $row["location_id"]

        );
    }
}



$sqlSubstatus = "SELECT id, `name`, `is_transfer`, `status_id` FROM asset_substatus WHERE is_active = 1";
$resultSubstatus = $conn->query($sqlSubstatus);

$Substatus = array();

if ($resultSubstatus->num_rows > 0) {
    while ($row = $resultSubstatus->fetch_assoc()) {
        $Substatus[] = array(
            "id" => $row["id"],
            "name" => $row["name"],
            "is_transfer" => $row["is_transfer"],
            "status_id" => $row["status_id"]
        );
    }
}

//Employee
$sqlEmpdetails = "SELECT `id`,`firstname` , `lastname`, `employee_id`, `department`, `designation`, `authority_id`, `branch`, `mobile`, `email`, `state`, `country`, `building`, `block`, `floor` FROM employee WHERE is_active = 1";
$resultEmpdetails = $conn->query($sqlEmpdetails);

$Empdetails = array();

if ($resultEmpdetails->num_rows > 0) {
    while ($row = $resultEmpdetails->fetch_assoc()) {
        $Empdetails[] = array(
            "id" => $row["id"],
            "firstname" => $row["firstname"],
            "lastname" => $row["lastname"],
            "employee_id" => $row["employee_id"],
            "department" => $row["department"],
            "designation" => $row["designation"],
            "authority_id" => $row["authority_id"],
            "branch" => $row["branch"],
            "mobile" => $row["mobile"],
            "email" => $row["email"],
            "state" => $row["state"],
            "country" => $row["country"],
            "building" => $row["building"],
            "block" => $row["block"],
            "floor" => $row["floor"]
        );
    }
}
// Return the data as JSON
$response = array(
    "groups" => $groups,
    "types" => $types,
    "locations"=>$locations,
    "branches"=>$branches,
    "statuses"=>$statuses,
    "substatuses"=>$Substatus,
    "Ipdetails"=>$Ipdetails,
    "Empdetails"=>$Empdetails
);

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
