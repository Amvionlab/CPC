<?php
require 'config.php'; // Database configuration

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $vendor_name = $_POST['vendor'];
    $vendor_id = $_POST['vendorid'];
    $gst = $_POST['gst'];
    $location = $_POST['location'];
    $contact_person = $_POST['contact'];
    $mobile_no = $_POST['mobile'] ?? ''; // Optional
    $email = $_POST['email'] ?? ''; // Optional
    $address = $_POST['address'] ?? ''; // Optional
    $state = $_POST['state'];
    $country = $_POST['country'] ?? ''; // Optional

    // Handle file upload
    $attachment_path = '';
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/'; // Set your upload directory
        $file_name = basename($_FILES['attachment']['name']);
        $target_file = $upload_dir . $file_name;

        // Move uploaded file to the target directory
        if (move_uploaded_file($_FILES['attachment']['tmp_name'], $target_file)) {
            $attachment_path = $target_file;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'File upload failed.']);
            exit;
        }
    }

    // Insert data into the database
    $sql = "INSERT INTO vendor_details (vendor_name, vendor_id, gst, location, contact_person, mobile_no, email, address, attachment_path, post_date, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssss', $vendor_name, $vendor_id, $gst, $location, $contact_person, $mobile_no, $email, $address, $attachment_path);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Vendor details added successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add vendor details.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
