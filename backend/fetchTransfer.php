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
        $sql = "SELECT * FROM transfer WHERE `tag`='$tag' AND `is_active`=1";
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
elseif ($action == 'all') {
 
        $sql = "SELECT * FROM transfer WHERE `status`=1 AND `is_active`=1";
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
 
} elseif ($action == 'add') {
    // Handle adding a new note
    // Retrieve the request payload
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if the required fields are provided
    if (isset($data['tag']) && isset($data['fromLocation']) && isset($data['toLocation'])) {
        $tag = $conn->real_escape_string($data['tag']);
        $notes = $conn->real_escape_string($data['notes']);
        $user = $conn->real_escape_string($data['user']);
        $from = $conn->real_escape_string($data['fromLocation']);
        $to = $conn->real_escape_string($data['toLocation']);

        // Prepare the SQL insert statement
        $sql = "INSERT INTO transfer (tag, from_location , to_location, description, request_on, request_by, status, is_active) VALUES ('$tag', '$from', '$to', '$notes', NOW(), '$user', 1, 1)";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Note added successfully."]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        
        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "Tag and note are required."]);
    }
}
elseif ($action == 'approve') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id']) && isset($data['user'])) {
        $id = $conn->real_escape_string($data['id']);
        $user = $conn->real_escape_string($data['user']);

        // Prepare the SQL update statement
        $sql = "UPDATE transfer 
                SET approved_by='$user', approved_on=NOW(), status=2 
                WHERE id='$id'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Transfer approved successfully."]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        
        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "ID and user are required."]);
    }
}

elseif ($action == 'reject') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id']) && isset($data['user'])) {
        $id = $conn->real_escape_string($data['id']);
        $user = $conn->real_escape_string($data['user']);

        // Prepare the SQL update statement
        $sql = "UPDATE transfer 
                SET rejected_by='$user', rejected_on=NOW(), is_active=0
                WHERE id='$id'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Transfer Rejected successfully."]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        
        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "ID and user are required."]);
    }
} else {
    echo json_encode(["error" => "Invalid action. Use 'fetch' or 'add'."]);
}
