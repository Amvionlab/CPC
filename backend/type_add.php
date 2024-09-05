<?php
include 'config.php';

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $typename = trim($_POST['name']); 
    $tag = trim($_POST['tag']);
    $groupId = trim($_POST['dropdown']);
    $active = "1";

    // Prepare statement to check if the type already exists
    $checkSql = "SELECT id FROM asset_type WHERE type = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("s", $typename);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $response = ['success' => false, 'message' => 'Type already exists.'];
        echo json_encode($response);
    } else {
        // Prepare the INSERT statement for asset_type
        $insertSql = "INSERT INTO asset_type (type, tag, group_id, is_active) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($insertSql);
        $stmt->bind_param("ssss", $typename, $tag, $groupId, $active);
        
        if ($stmt->execute()) {
            // Capturing the newly created ID
            $type_id = $stmt->insert_id;

            $columnsResult = $conn->query("SHOW COLUMNS FROM asset_template");
            if ($columnsResult) {
                while ($row = $columnsResult->fetch_assoc()) {
                    $column_name = $row['Field'];
                    if (!in_array($column_name, ['id', 'post_date', 'is_active'])) {
                        // Insert each column into the table_fields
                        $insertFieldSql = "INSERT INTO table_fields (type_id, column_name, is_active) VALUES (?, ?, ?)";
                        $stmt = $conn->prepare($insertFieldSql);
                        $stmt->bind_param("sss", $type_id, $column_name, $active);

                        if (!$stmt->execute()) {
                            $response = ['success' => false, 'message' => 'Error inserting into table_fields: ' . $stmt->error];
                            echo json_encode($response);
                            $stmt->close();
                            $conn->close();
                            exit;
                        }
                    }
                }
            }

            $result = $conn->query("SHOW CREATE TABLE asset_template");
$row = $result->fetch_assoc();
$createTableSql = $row['Create Table']; // This gets the full CREATE TABLE SQL

// Modify $createTableSql to replace 'asset_template' with 'asset_' plus the escaped $typename
$newTableName = 'asset_' . $conn->real_escape_string($typename);
$createTableSql = str_replace('CREATE TABLE `asset_template`', 'CREATE TABLE `' . $newTableName . '`', $createTableSql);
if ($conn->query($createTableSql) === TRUE) {
                $response = ['success' => true, 'message' => 'Associated table and table fields created successfully.'];
            } else {
                $response = ['success' => false, 'message' => 'Error creating table: ' . $conn->error];
            }
        } else {
            $response = ['success' => false, 'message' => 'Error: ' . $stmt->error];
        }

        echo json_encode($response);
        $stmt->close();
    }
} else {
    $response = ['success' => false, 'message' => 'Invalid request method.'];
    echo json_encode($response);
}

$conn->close();
