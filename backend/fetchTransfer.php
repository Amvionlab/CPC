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
elseif ($action == 'out') {
 
        $sql = "SELECT * FROM transfer WHERE (`status`=1) AND `is_active`=1";
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
 
} 

elseif ($action == 'in') {
 
    $sql = "SELECT * FROM transfer WHERE (`status`=3) AND `is_active`=1";
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

} 

elseif ($action == 'multiadd') {
    // Handle adding new notes
    // Retrieve the request payload
    $type = isset($_GET['type']) ? $_GET['type'] : '';
    $tableName = "asset_" . strtolower($type);

    $data = json_decode(file_get_contents('php://input'), true);

    // Check if the required fields are provided
    if (isset($data['tags']) && isset($data['toLocation'])) {
        $tagsArray = $data['tags'];
        $notes = $conn->real_escape_string($data['notes']);
        $user = $conn->real_escape_string($data['user']);
        $to = (int)$data['toLocation'];  // Cast to integer

        $allSuccess = true;  // To track overall success
        $errors = [];  // Array to collect errors

        foreach ($tagsArray as $tag) {
            $escapedTag = $conn->real_escape_string($tag);

            // Get the current location from the database
            $locationQuery = "SELECT branch FROM $tableName WHERE tag = '$escapedTag'";
            $result = $conn->query($locationQuery);

            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $from = (int)$row['branch'];  // Cast to integer

                // Prepare the INSERT statement
                $sql = "INSERT INTO transfer (tag, from_location, to_location, description, request_on, request_by, status, is_active) 
                        VALUES ('$escapedTag', '$from', '$to', '$notes', NOW(), '$user', 1, 1)";

                // Execute the INSERT statement
                if ($conn->query($sql) !== TRUE) {
                    $allSuccess = false;  // Update overall success if any query fails
                    $errors[] = "Error with tag $tag: " . $conn->error;  // Capture specific errors
                }
            } else { 
                $allSuccess = false;  // Update overall success if location query fails
                $errors[] = "No location found for tag $tag.";
            }
        }

        $conn->close();

        if ($allSuccess) {
            echo json_encode(["success" => true, "message" => "All notes added successfully."]);
        } else {
            echo json_encode(["success" => false, "errors" => $errors]);  // Return the errors array
        }

    } else {
        echo json_encode(["success" => false, "error" => "Tags and toLocation are required."]);
    }
}



elseif ($action == 'status') {
    // Retrieve the request payload
    $type = isset($_GET['type']) ? $_GET['type'] : '';
    $tableName = "asset_" . strtolower($type);

    $data = json_decode(file_get_contents('php://input'), true);

    // Check if the required fields are provided
    if (isset($data['tags']) && isset($data['status']) && isset($data['substatus'])) {
        $tagsArray = $data['tags'];
        $status = $conn->real_escape_string($data['status']);
        $user = $conn->real_escape_string($data['user']);
        $substatus = $conn->real_escape_string($data['substatus']);

        $allSuccess = true;  // To track overall success
        $errors = [];  // Array to collect errors

        foreach ($tagsArray as $tag) {
            $escapedTag = $conn->real_escape_string($tag);

            // Update the status and substatus for the given tag
            $sql = "UPDATE $tableName SET `status`='$status', `sub_status`='$substatus' WHERE `tag` = '$escapedTag'";

            // Execute the UPDATE statement
            if ($conn->query($sql) !== TRUE) {
                $allSuccess = false;  // Update overall success if any query fails
                $errors[] = "Error with tag $tag: " . $conn->error;  // Capture specific errors
            }
        }

        $conn->close();

        // Return response based on success of operations
        if ($allSuccess) {
            echo json_encode(["success" => true, "message" => "Status changed successfully."]);
        } else {
            echo json_encode(["success" => false, "errors" => $errors]);  // Return the errors array
        }

    } else {
        echo json_encode(["success" => false, "error" => "Tags, status, and substatus are required."]);
    }
}



elseif ($action == 'add') {
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
elseif ($action == 'approvesel') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['selectedRows']) && is_array($data['selectedRows']) && isset($data['user'])) {
        $ids = array_map([$conn, 'real_escape_string'], $data['selectedRows']);
        $user = $conn->real_escape_string($data['user']);

        // Convert IDs array into a comma-separated string
        $idList = "'" . implode("','", $ids) . "'";

        // Prepare the SQL update statement
        $sql = "UPDATE transfer 
                SET approved_by='$user', approved_on=NOW(), status=2 
                WHERE id IN ($idList)";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Transfers approved successfully."]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        
        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "Selected rows and user are required."]);
    }
}

elseif ($action == 'inapprove') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id']) && isset($data['user'])) {
        $id = $conn->real_escape_string($data['id']);
        $user = $conn->real_escape_string($data['user']);

        // Prepare the SQL update statement
        $sql = "UPDATE transfer 
                SET approved_by='$user', approved_on=NOW(), status=4 
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
elseif ($action == 'inapprovesel') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['selectedRows']) && is_array($data['selectedRows']) && isset($data['user'])) {
        $ids = array_map([$conn, 'real_escape_string'], $data['selectedRows']);
        $user = $conn->real_escape_string($data['user']);

        // Convert IDs array into a comma-separated string
        $idList = "'" . implode("','", $ids) . "'";

        // Prepare the SQL update statement
        $sql = "UPDATE transfer 
                SET approved_by='$user', approved_on=NOW(), status=4 
                WHERE id IN ($idList)";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Transfers approved successfully."]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        
        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "Selected rows and user are required."]);
    }
}


elseif ($action == 'receive') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id']) && isset($data['user'])) {
        $id = $conn->real_escape_string($data['id']);
        $user = $conn->real_escape_string($data['user']);

        // Prepare the SQL update statement
        $sql = "UPDATE transfer 
                SET received_by='$user', received_on=NOW(), status=5 
                WHERE id='$id'";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Transfer Received successfully."]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        
        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "ID and user are required."]);
    }
}

elseif ($action == 'ofd') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id']) && isset($data['user'])) {
        $id = $conn->real_escape_string($data['id']);
        $user = $conn->real_escape_string($data['user']);

        // Prepare the SQL update statement
        $sql = "UPDATE transfer 
                SET transfer_by='$user', transfer_on=NOW(), status=3 
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
} 
elseif ($action == 'rejectsel') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['selectedRows']) && is_array($data['selectedRows']) && isset($data['user'])) {
        $ids = array_map([$conn, 'real_escape_string'], $data['selectedRows']);
        $user = $conn->real_escape_string($data['user']);

        // Convert IDs array into a comma-separated string
        $idList = "'" . implode("','", $ids) . "'";

        // Prepare the SQL update statement
        $sql = "UPDATE transfer 
                SET rejected_by='$user', rejected_on=NOW(), is_active=0
                WHERE id IN ($idList)";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Transfers Rejected successfully."]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        
        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "Selected rows and user are required."]);
    }
}
else {
    echo json_encode(["error" => "Invalid action. Use 'fetch' or 'add'."]);
}
