<?php
include 'config.php';

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $typename = $_POST['type'];

    // Insert data into 'asset_type' table
    $sql = "INSERT INTO asset_type (type, is_active) VALUES ('$typename', '1')";
    
    if ($conn->query($sql) === TRUE) {
        // Get the id of the newly inserted type
        $type_id = $conn->insert_id;

        // Fetch the column definitions from 'asset_template' excluding the specified columns
        $columnsResult = $conn->query("SHOW COLUMNS FROM asset_template");
        $createTableColumns = [];

        if ($columnsResult->num_rows > 0) {
            while ($row = $columnsResult->fetch_assoc()) {
                $column_name = $row['Field'];

                // Exclude specific columns from table creation
                if (in_array($column_name, ['id', 'tag', 'post_date', 'is_active'])) {
                    continue;
                }

                // Prepare the column definition for table creation
                $createTableColumns[] = "`$column_name` " . $row['Type'] . " " . ($row['Null'] === "NO" ? "NOT NULL" : "NULL") . 
                (!empty($row['Default']) ? " DEFAULT '" . $row['Default'] . "'" : "") .
                ($row['Extra'] ? " " . $row['Extra'] : "");
                
                // Insert the column_name and type_id into 'table_fields' table
                $insertFieldSql = "INSERT INTO table_fields (Type_id, column_name, is_active) VALUES ('$type_id', '$column_name', '1')";
                
                if (!$conn->query($insertFieldSql)) {
                    $response = array('success' => false, 'message' => 'Error inserting into table_fields: ' . $conn->error);
                    echo json_encode($response);
                    $conn->close();
                    exit;
                }
            }
        }

        // Create a new table with the filtered columns
        if (!empty($createTableColumns)) {
            $createTableSql = "CREATE TABLE asset_" . $conn->real_escape_string($typename) . " (" . implode(", ", $createTableColumns) . ")";
            
            if ($conn->query($createTableSql) === TRUE) {
                $response = array('success' => true, 'message' => 'Ticket Status, associated table, and table fields created successfully.');
            } else {
                $response = array('success' => false, 'message' => 'Error creating table: ' . $conn->error);
            }
        } else {
            $response = array('success' => false, 'message' => 'No columns available for table creation.');
        }
    } else {
        $response = array('success' => false, 'message' => 'Error: ' . $conn->error);
    }

    echo json_encode($response);
} else {
    $response = array('success' => false, 'message' => 'Invalid request method.');
    echo json_encode($response);
}

$conn->close();
?>
