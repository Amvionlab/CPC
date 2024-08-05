<?php
include 'config.php';

$tableName = 'asset_fields';

$sql = "SHOW COLUMNS FROM $tableName";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $columns = [];
    while ($row = $result->fetch_assoc()) {
        $columns[] = [
            'name' => $row['Field'],
            'type' => preg_replace('/\(\d+\)/', '', $row['Type']),
            'length' => preg_match('/\((\d+)\)/', $row['Type'], $match) ? $match[1] : '',
            'primaryKey' => $row['Key'] === 'PRI',
            'autoIncrement' => strpos($row['Extra'], 'auto_increment') !== false,
            'notNull' => $row['Null'] === 'NO',
            'unique' => $row['Key'] === 'UNI',
            'defaultValue' => $row['Default'],
        ];
    }
    echo json_encode(['exists' => true, 'columns' => $columns]);
} else {
    echo json_encode(['exists' => false]);
}

$conn->close();