<?php
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$query = $data['query'];

if ($conn->multi_query($query)) {
    do {
        /* store first result set */
        if ($result = $conn->store_result()) {
            while ($row = $result->fetch_row()) {
                printf("%s\n", $row[0]);
            }
            $result->free();
        }
    } while ($conn->next_result());
    echo json_encode(['message' => 'Table altered successfully']);
} else {
    echo json_encode(['message' => 'Error altering table: ' . $conn->error]);
}

$conn->close();