<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'config.php'; // Ensure your config file correctly sets up $conn for database connection

// Decode JSON data from request body
$data = json_decode(file_get_contents("php://input"), true);

// Check if data is received
if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit();
}

// Extract and sanitize input data
$mail = $data['mail'] ?? '';
$password = $data['password'] ?? '';
$host = $data['host'] ?? '';
$smtp = $data['smtp'] ?? '';
$port = $data['port'] ?? '';
$sender = $data['sender'] ?? '';

// Check if required fields are provided
if (empty($mail) || empty($password) || empty($host) || empty($port)) {
    echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
    exit();
}

// Check if the mail already exists in the database
$sql_check = "SELECT * FROM smtp WHERE username = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $mail);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

// If mail exists, return error message
if ($result_check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Mail ID already exists."]);
} else {
    // Prepare the SQL insert statement
    $sql_insert = "INSERT INTO smtp (username, password, host, smtpsecure, port, fromname, frommail, post_date) VALUES (?, ?, ?, ?, ?, ?,?, NOW())";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("sssssss", $mail, $password, $host, $smtp, $port, $sender, $mail);

    // Execute the insert statement
    if ($stmt_insert->execute()) {
        echo json_encode(["success" => true, "message" => "SMTP settings added successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error inserting data."]);
    }
}

// Close the prepared statements and connection
$stmt_check->close();
$stmt_insert->close();
$conn->close();
?>