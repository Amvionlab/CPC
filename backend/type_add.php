<?php
include 'config.php';

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $uploadDir = 'D:/xampp/htdocs/TMS/src/photo/';
    $attachmentPath = '';

    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] == UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['attachment']['tmp_name'];
        $fileName = basename($_FILES['attachment']['name']); // Ensure file name is safe
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExtensions = array('pdf', 'jpg', 'jpeg', 'png');

        if (in_array($fileExtension, $allowedExtensions)) {
            $filePath = $uploadDir . $fileName;

            // Move the file to the specified directory
            if (move_uploaded_file($fileTmpPath, $filePath)) {
                $attachmentPath = 'src/photo/' . $fileName; // Storing relative path
            } else {
                $response = array('success' => false, 'message' => 'File upload failed.');
                echo json_encode($response);
                exit;
            }
        } else {
            $response = array('success' => false, 'message' => 'Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.');
            echo json_encode($response);
            exit;
        }
    }

    $type = trim($_POST['name']); // The type field, to be inserted into 'type' column
    $groupId = trim($_POST['dropdown']); // Dropdown value's id, to be inserted into 'group_id' column
    $active = "1";

    // Check if the type already exists in the 'asset_type' table
    $checkSql = "SELECT id FROM asset_type WHERE type = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("s", $type);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        // Type already exists
        $response = array('success' => false, 'message' => 'Type already exists.');
        echo json_encode($response);
    } else {
        // Insert the new type into the 'asset_type' table
        $sql = "INSERT INTO asset_type (type, group_id, is_active) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $type, $groupId, $active);

        if ($stmt->execute()) {
            $response = array('success' => true, 'message' => 'Type added successfully.');
            echo json_encode($response);
        } else {
            $response = array('success' => false, 'message' => 'Error: ' . $stmt->error);
            echo json_encode($response);
        }
    }

    $stmt->close();
} else {
    $response = array('success' => false, 'message' => 'Invalid request method.');
    echo json_encode($response);
}

$conn->close();
?>
