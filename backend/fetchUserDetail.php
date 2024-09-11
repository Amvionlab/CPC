<?php
// Include database configuration
include 'config.php';

// Set the content-type to JSON
header('Content-Type: application/json');

// Extract parameters from the query string
$group = urldecode($_GET['group']);
$type = urldecode($_GET['type']);
$tag = $_GET['tag'];

// Initialize variables
$emp_id = null;
$userDetails = null;

// Get the ID from the tag (assuming tag format "DESK0001" where "0001" is the ID)
$id = (int) filter_var($tag, FILTER_SANITIZE_NUMBER_INT);

// Construct the dynamic table name based on type
$tableName = "asset_" . strtolower($type);

try {
    // Prepare the query to fetch the details from the respective table
    $query = "SELECT emp_id FROM $tableName WHERE tag = :tag LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':tag', $tag, PDO::PARAM_INT);
    $stmt->execute();

    // Fetch the result
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        // Extract the emp_id from the result
        $emp_id = $result['emp_id'];

        // Prepare the query to fetch user details from the employee table
        if ($emp_id) {
            $query = "SELECT * FROM employee WHERE employee_id = :emp_id LIMIT 1";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':emp_id', $emp_id, PDO::PARAM_INT);
            $stmt->execute();

            // Fetch user details
            $userDetails = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }

    // Output the user details as JSON
    if ($userDetails) {
        echo json_encode($userDetails);
    } else {
        echo json_encode(['error' => 'No user details found.']);
    }
} catch (PDOException $e) {
    // Return an error message in JSON format
    echo json_encode(['error' => 'Error fetching data: ' . $e->getMessage()]);
}
?>
