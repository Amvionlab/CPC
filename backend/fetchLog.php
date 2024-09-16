<?php
include 'config.php';
header('Content-Type: application/json');

// Determine the operation based on the 'action' parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'fetch') {
    // Fetch the 'tag' parameter from the query string
    $tag = isset($_GET['tag']) ? $_GET['tag'] : '';

    if ($tag) {
        // Sanitize the tag variable to prevent SQL injection
        $tag = $conn->real_escape_string($tag);

        // Prepare the SQL query using the sanitized tag
        $sql = "SELECT * FROM log WHERE `tag`='$tag'";
        $result = $conn->query($sql);

        $notes = array();
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $notes[] = $row;
            }
        } else {
            // Handle SQL errors
            echo json_encode(["error" => $conn->error]);
            exit;
        }

        $conn->close();
        echo json_encode($notes);
    } else {
        echo json_encode(["error" => "tag parameter is required."]);
    }
}