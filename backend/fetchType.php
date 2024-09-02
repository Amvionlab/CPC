<?php
include 'config.php';
// Function to fetch users from database
    $sql = "SELECT asset_type.id, asset_type.type, asset_type.tag, asset_type.group_id, asset_group.group FROM asset_type JOIN asset_group ON asset_type.group_id = asset_group.id WHERE asset_type.is_active = 1";
    $result = $conn->query($sql);

    $users = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }

    $conn->close();
   


echo json_encode($users);
?>
