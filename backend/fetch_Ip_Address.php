<?php
include 'config.php';
// Function to fetch users from database
    $sql = "SELECT 
    ip_details.*, 
    location.name AS location_name, 
    branch.name AS branch_name
FROM 
    ip_details 
JOIN 
    location ON location.id = ip_details.location_id
JOIN 
    branch ON branch.id = ip_details.branch_id;
";
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
