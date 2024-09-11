<?php
include 'config.php';
header('Content-Type: application/json');

// Determine the operation based on the 'action' parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'fetch') {
    $tag = isset($_GET['tag']) ? $_GET['tag'] : '';

    if ($tag) {
        $tag = $conn->real_escape_string($tag);
        $sql = "SELECT * FROM documents WHERE `tag`='$tag' AND `is_active`=1";
        $result = $conn->query($sql);

        $notes = array();
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $notes[] = $row;
            }
        } else {
            echo json_encode(["error" => $conn->error]);
            exit;
        }

        $conn->close();
        echo json_encode($notes);
    } else {
        echo json_encode(["error" => "tag parameter is required."]);
    }
} elseif ($action == 'upload') {
    if (isset($_FILES['userfile']) && is_uploaded_file($_FILES['userfile']['tmp_name'])) {
        $tag = isset($_POST['tag']) ? $_POST['tag'] : '';

        if ($tag) {
            $tag = $conn->real_escape_string($tag);
            $target_directory = "../src/document/"; // Specify your upload directory
            $tag_directory = $target_directory . $tag . '/'; // Directory named after the tag

            // Check if the directory exists, if not, create it
            if (!is_dir($tag_directory)) {
                mkdir($tag_directory, 0777, true); // Create directory with permissions
            }
            $uni=uniqid();
            $filename = basename($_FILES['userfile']['name']);
            $target_file = $tag_directory . $uni . '_' . $filename;

            // Move uploaded file to the target directory
            if (move_uploaded_file($_FILES['userfile']['tmp_name'], $target_file)) {
                // Store the path relative to src/document/ in the database
                $relative_path = "/src/document/" . $tag . '/' . $uni . '_' . $filename; // Save the relative path

                // Prepare the SQL insert statement
                $sql = "INSERT INTO documents (tag, name, path, is_active) VALUES ('$tag', '$filename', '$relative_path', 1)";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(["success" => true, "message" => "File uploaded successfully."]);
                } else {
                    echo json_encode(["success" => false, "error" => $conn->error]);
                }
            } else {
                echo json_encode(["success" => false, "error" => "File upload failed."]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "Tag parameter is required."]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "No file uploaded."]);
    }
} else {
    echo json_encode(["error" => "Invalid action. Use 'fetch' or 'upload'."]);
}
