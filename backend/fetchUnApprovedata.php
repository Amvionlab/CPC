<?php
include 'config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'all') {
    $sql = "SELECT * FROM unapproved_assets WHERE is_active=1";

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

}
elseif ($action == 'approve') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id']) && isset($data['user'])) {
        $id = $conn->real_escape_string($data['id']);
        $user = $conn->real_escape_string($data['user']);

        // Prepare the SQL update statement
        $sql = "UPDATE unapproved_assets 
                SET action_by='$user', action_on=NOW(), is_active=2 
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
        $sql = "UPDATE unapproved_assets 
                SET action_by='$user', action_on=NOW(), is_active=2 
                WHERE id IN ($idList)";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Aseets approved successfully."]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
        
        $conn->close();
    } else {
        echo json_encode(["success" => false, "error" => "Selected rows and user are required."]);
    }
}
elseif ($action == 'reject') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id']) && isset($data['user'])) {
        $id = $conn->real_escape_string($data['id']);
        $user = $conn->real_escape_string($data['user']);

        // Prepare the SQL update statement
        $sql = "UPDATE unapproved_assets 
                SET action_by='$user', action_on=NOW(), is_active=0
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
        $sql = "UPDATE unapproved_assets 
        SET action_by='$user', action_on=NOW(), is_active=0 
        WHERE id IN ($idList)";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Assets Rejected successfully."]);
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
