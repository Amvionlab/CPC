<?php
require_once 'config.php'; // Include your DB configuration

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['type'] ?? '';
    $file = $_FILES['file'] ?? null;

    if (empty($type) || !$file || $file['type'] !== 'text/csv') {
        echo json_encode(['success' => false, 'message' => 'Invalid type or file']);
        exit;
    }

    // Step 1: Select the respective table
    $tableName = 'asset_' . strtolower($type); // Assuming table is named like "asset_desktop", "asset_laptop", etc.

    // Step 2: Open the CSV file and read headers
    $csvFile = fopen($file['tmp_name'], 'r');
    if (!$csvFile) {
        echo json_encode(['success' => false, 'message' => 'Failed to open the file']);
        exit;
    }

    // Get the first row (headers)
    $headers = fgetcsv($csvFile);

    // Step 3: Fetch the column names from the respective table
    $query = "SHOW COLUMNS FROM $tableName";
    $result = $pdo->query($query);

    if (!$result) {
        echo json_encode(['success' => false, 'message' => 'Failed to retrieve table columns']);
        exit;
    }

    $columns = [];
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $columns[] = $row['Field'];
    }

    // Step 4: Match CSV headers with table columns
    $validColumns = array_intersect($headers, $columns);

    if (empty($validColumns)) {
        echo json_encode(['success' => false, 'message' => 'CSV headers do not match any table columns']);
        exit;
    }

    // Step 5: Prepare the INSERT query
    $placeholders = implode(', ', array_fill(0, count($validColumns), '?'));
    $insertQuery = "INSERT INTO $tableName (" . implode(', ', $validColumns) . ") VALUES ($placeholders)";
    $stmt = $pdo->prepare($insertQuery);

    // Step 6: Bulk insert data from CSV
    $rowCount = 0;
    while ($row = fgetcsv($csvFile)) {
        $data = [];
        foreach ($validColumns as $colIndex => $colName) {
            $data[] = $row[array_search($colName, $headers)];
        }

        if ($stmt->execute($data)) {
            $rowCount++;
        }
    }

    fclose($csvFile);

    echo json_encode(['success' => true, 'message' => "$rowCount rows inserted successfully"]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
