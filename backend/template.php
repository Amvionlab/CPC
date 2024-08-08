<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['type'])) {
    $type = $conn->real_escape_string($_GET['type']);
    $tableName = 'asset_' . $type;

    $sql = "SHOW COLUMNS FROM $tableName";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $columns = [];
        $excludeColumns = ['id', 'post_date', 'is_active'];

        while ($row = $result->fetch_assoc()) {
            if (!in_array($row['Field'], $excludeColumns)) {
                $columns[] = $row['Field'];
            }
        }

        echo json_encode(['type' => $type, 'columns' => $columns]);
    } else {
        echo json_encode(['error' => 'No columns found for the specified table.']);
    }
} else {
    echo json_encode(['error' => 'Invalid request.']);
}

$conn->close();
