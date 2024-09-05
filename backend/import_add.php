<?php
include 'config.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['type']) && isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $type = $_POST['type'];
        $file = $_FILES['file']['tmp_name'];

        // Determine the table name based on the selected type
        $tableName = 'asset_' . strtolower($type);

        // Open the CSV file
        if (($handle = fopen($file, 'r')) !== false) {
            // Read the first row to get the type
            $csvType = fgetcsv($handle)[0];
            if (strtolower($csvType) !== strtolower($type)) {
                echo json_encode(['success' => false, 'message' => 'CSV type does not match selected type.']);
                exit;
            }

            // Read the second row to get column names
            $columns = fgetcsv($handle);
            if ($columns === false) {
                echo json_encode(['success' => false, 'message' => 'Invalid CSV format.']);
                exit;
            }

            // Check if table exists
            $stmt = $pdo->prepare("SHOW TABLES LIKE ?");
            $stmt->execute([$tableName]);
            if ($stmt->rowCount() === 0) {
                echo json_encode(['success' => false, 'message' => 'Table does not exist.']);
                exit;
            }

            // Get columns from the table
            $stmt = $pdo->prepare("DESCRIBE $tableName");
            $stmt->execute();
            $tableColumns = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

            // Map CSV columns to table columns
            $columnMapping = [];
            foreach ($columns as $column) {
                if (in_array($column, $tableColumns)) {
                    $columnMapping[] = $column;
                }
            }

            // Check if there are columns to insert data into
            if (empty($columnMapping)) {
                echo json_encode(['success' => false, 'message' => 'No matching columns found.']);
                exit;
            }

            // Prepare insert statement
            $placeholders = implode(',', array_fill(0, count($columnMapping), '?'));
            $columnsList = implode(',', $columnMapping);
            $insertStmt = $pdo->prepare("INSERT INTO $tableName ($columnsList) VALUES ($placeholders)");

            // Read the CSV file and insert data
            while (($row = fgetcsv($handle)) !== false) {
                if (count($row) < count($columns)) {
                    continue; // Skip rows with insufficient data
                }

                // Prepare row data for insertion based on column mapping
                $rowData = [];
                foreach ($columnMapping as $col) {
                    $index = array_search($col, $columns);
                    $rowData[] = isset($row[$index]) ? $row[$index] : null;
                }

                // Execute insert statement
                $insertStmt->execute($rowData);
            }

            fclose($handle);
            echo json_encode(['success' => true, 'message' => 'Data imported successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to open CSV file.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
