<?php
include 'config.php';


$data = json_decode(file_get_contents('php://input'), true);
$query = $data['query'];

if ($conn->query($query) === TRUE) {
    echo json_encode(['message' => 'Table created successfully']);
} else {
    echo json_encode(['message' => 'Error creating table: ' . $conn->error]);
}

$conn->close();
