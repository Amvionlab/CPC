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

    $branchName = trim($_POST['name']); // Trim to avoid accidental spaces
    $locationId = trim($_POST['location']); // Get location ID from dropdown
    $active = "1";

    // Check if the branch name already exists in the 'branch' table
    $checkSql = "SELECT id FROM branch WHERE name = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("s", $branchName);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        // Branch already exists
        $response = array('success' => false, 'message' => 'Branch already exists.');
        echo json_encode($response);
    } else {
        // Insert the new branch into the 'branch' table with the selected location ID
        $sql = "INSERT INTO branch (name, location_id, is_active) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $branchName, $locationId, $active);

        if ($stmt->execute()) {
            $response = array('success' => true, 'message' => 'Branch added successfully.');
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
