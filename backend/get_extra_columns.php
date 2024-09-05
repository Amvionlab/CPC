<?php
include 'config.php'; // Database connection

header('Content-Type: application/json');

// Check if POST data is received
$type = $_POST['type'] ?? '';
if (empty($type)) {
    echo json_encode(['message' => 'Type is required']);
    exit;
}

// Convert type to lowercase and concatenate with 'asset_'
$table_name = 'asset_' . strtolower($type);

// Fetch default columns from asset_template
$sql = "SHOW COLUMNS FROM asset_template";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(['message' => 'Error fetching default columns']);
    exit;
}

$default_columns = [];
while ($row = $result->fetch_assoc()) {
    $default_columns[] = $row['Field'];
}

// Fetch columns from the type-specific table
$sql = "SHOW COLUMNS FROM $table_name";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(['message' => 'Error fetching extra columns']);
    exit;
}

$extra_columns = [];
while ($row = $result->fetch_assoc()) {
    if (!in_array($row['Field'], $default_columns)) {
        $extra_columns[] = $row['Field'];
    }
}

echo json_encode([
    'default_columns' => $default_columns,
    'extra_columns' => $extra_columns
]);
?>
