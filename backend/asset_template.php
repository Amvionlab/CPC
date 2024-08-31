<?php
include 'config.php';

$sql = "SHOW COLUMNS FROM asset_template";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $templateColumns = [];
    while ($row = $result->fetch_assoc()) {
        $templateColumns[] = $row['Field'];
    }
    echo json_encode(['template_columns' => $templateColumns]);
} else {
    echo json_encode(['error' => 'No columns found in asset_template.']);
}

$conn->close();
