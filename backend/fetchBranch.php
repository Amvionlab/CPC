<?php
include 'config.php';
// Function to fetch users from database
    $sql = "SELECT *,location.name AS location_name  FROM branch JOIN location WHERE location.id=branch.location_id";
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
