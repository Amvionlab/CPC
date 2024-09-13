<?php
include 'config.php';
header('Content-Type: application/json');

$type = urldecode($_GET['type']);
$tag = $_GET['tag'];

// Initialize variables
$emp_id = null;
$userDetails = null;



$tableName = "asset_" . strtolower($type);

try {
    // Prepare the query to fetch the details from the respective table
   $query = "SELECT user_id FROM $tableName WHERE tag = ? AND is_active=1 LIMIT 1";
$stmt = $conn->prepare($query);

// Bind parameters (assuming $tag is an integer)
$stmt->bind_param("s", $tag);

// Execute the statement
$stmt->execute();

// Fetch the result
$result = $stmt->get_result()->fetch_assoc();

    if ($result) {
        // Extract the emp_id from the result
        $emp_id = $result['user_id'];
        if ($emp_id) {
            $query = "SELECT * FROM employee WHERE employee_id = ? AND is_active=1";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("s", $emp_id);
            $stmt->execute();

            $result = $stmt->get_result();
            $userDetails = $result->fetch_assoc();
            $stmt->close();
        }
    }

    // Output the user details as JSON
    if ($userDetails) {
        echo json_encode($userDetails);
    } else {
        echo json_encode(['Not Mapped' => 'No user details found.']);
    }
} catch (PDOException $e) {
    // Return an error message in JSON format
    echo json_encode(['error' => 'Error fetching data: ' . $e->getMessage()]);
}
?>
