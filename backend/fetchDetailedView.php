<?php
// Assuming config.php includes your DB connection details.
include 'config.php';

// Set the content-type to JSON
header('Content-Type: application/json');

// Extract type, group, and tag from the query parameters
$group = urldecode($_GET['group']); // e.g., IT
$type = urldecode($_GET['type']);   // e.g., DESKTOP
$tag = $_GET['tag'];                // e.g., DESK0001

// Get the ID from the tag (assuming tag format "DESK0001" where "0001" is the ID)
$id = (int) filter_var($tag, FILTER_SANITIZE_NUMBER_INT);

// Construct the dynamic table name based on type
$tableName = "asset_" . strtolower($type);

// Prepare the query to fetch the details from the respective table
$query = "SELECT * FROM $tableName WHERE id = :id LIMIT 1";

try {
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    // Fetch the result
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        // Output the result as JSON
        echo json_encode($result);
    } else {
        // If no result, output an empty array as JSON
        echo json_encode([]);
    }
} catch (PDOException $e) {
    // Return an error message in JSON format
    echo json_encode(['error' => 'Error fetching data: ' . $e->getMessage()]);
}
?>
