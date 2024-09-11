<?php
include 'config.php';

// Fetch the 'tag' parameter from the query string
$tag = isset($_GET['tag']) ? $_GET['tag'] : '';

if ($tag) {
    // Sanitize the tag variable to prevent SQL injection if not using prepared statements
    $tag = $conn->real_escape_string($tag);

    // Prepare the SQL query using the sanitized tag
    $sql = "SELECT * FROM notes WHERE `tag`='$tag' AND `is_active`=1";

    $result = $conn->query($sql);

    $users = array();
    if ($result) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    } else {
        // Optionally, handle SQL errors
        echo json_encode(["error" => $conn->error]);
        exit;
    }

    $conn->close();

    echo json_encode($users);
} else {
    echo json_encode(["error" => "tag parameter is required."]);
}

