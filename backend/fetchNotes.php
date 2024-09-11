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
        $sql = "SELECT * FROM notes WHERE `tag`='$tag' AND `is_active`=1";
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
} elseif ($action == 'add') {
    // Handle adding a new note
    // Retrieve the request payload
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if the required fields are provided
    if (isset($data['tag']) && isset($data['notes'])) {
        $tag = $conn->real_escape_string($data['tag']);
        $notes = $conn->real_escape_string($data['notes']);

        // Prepare the SQL insert statement
        $sql = "INSERT INTO notes (tag, notes, post_date, is_active) VALUES ('$tag', '$notes', NOW(), 1)";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Note added successfully."]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        
        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "Tag and note are required."]);
    }
} else {
    echo json_encode(["error" => "Invalid action. Use 'fetch' or 'add'."]);
}
