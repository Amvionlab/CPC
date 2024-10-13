<?php
include 'config.php'; // Database connection

header('Content-Type: application/json');

// Fetch form data
$name = $_POST['name'] ?? '';
$manufacturer = $_POST['manufacturer'] ?? '';
$model = $_POST['model'] ?? '';
$serial_number = $_POST['serial_number'] ?? '';
$location = $_POST['location'] ?? '';
$user_name = $_POST['user_name'] ?? '';
$asset_value = $_POST['asset_value'] ?? '';
$vendor_name = $_POST['vendor_name'] ?? '';
$purchase_date = $_POST['purchase_date'] ?? '';
$po_number = $_POST['po_number'] ?? '';
$amc_from = $_POST['amc_from'] ?? '';
$amc_to = $_POST['amc_to'] ?? '';
$amc_interval = $_POST['amc_interval'] ?? '';
$last_amc = $_POST['last_amc'] ?? '';
$procure_by = $_POST['procure_by'] ?? '';
$warranty_upto = $_POST['warranty_upto'] ?? '';
$type = $_POST['type'] ?? '';

if (empty($type)) {
    echo json_encode(['message' => 'Type is required']);
    exit;
}

$table_name = 'asset_' . strtolower($type);

$template_columns = [];
$template_result = $conn->query("SHOW COLUMNS FROM asset_template");
if (!$template_result) {
    echo json_encode(['message' => 'Error fetching template columns']);
    exit;
}
while ($row = $template_result->fetch_assoc()) {
    $template_columns[] = $row['Field'];
}

// Fetch columns from the dynamically selected table
$type_columns = [];
$type_result = $conn->query("SHOW COLUMNS FROM `$table_name`");
if (!$type_result) {
    echo json_encode(['message' => 'Error fetching columns from type-specific table']);
    exit;
}
while ($row = $type_result->fetch_assoc()) {
    $type_columns[] = $row['Field'];
}

// Determine extra columns present in the type-specific table
$extra_columns = array_diff($type_columns, $template_columns);

// Prepare data for extra columns
$extra_data = [];
foreach ($extra_columns as $column) {
    if (isset($_POST[$column])) {
        $extra_data[$column] = $_POST[$column];
    }
}

// Check if asset already exists in the dynamically selected table
$sql = "SELECT * FROM `$table_name` WHERE manufacturer = ? AND model = ? AND serial_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $manufacturer, $model, $serial_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["message" => "Asset Already Exists"]);
} else {
    // Build the dynamic SQL insert statement
    $columns = array_merge([
        'name', 'manufacturer', 'model', 'serial_number', 'location', 
        'user_id', 'asset_value', 'vendor_name', 'purchase_date', 
        'po_number', 'amc_from', 'amc_to', 'amc_interval', 'last_amc', 
        'procure_by', 'warranty_upto', 'post_date', 'is_active'
    ], array_keys($extra_data));

    $placeholders = implode(', ', array_fill(0, count($columns), '?'));
    $column_names = implode(', ', $columns);
    $values = array_merge([
        $name, $manufacturer, $model, $serial_number, $location, 
        $user_name, $asset_value, $vendor_name, $purchase_date, 
        $po_number, $amc_from, $amc_to, $amc_interval, $last_amc, 
        $procure_by, $warranty_upto, date('Y-m-d H:i:s'), 1
    ], array_values($extra_data));

    $sql = "INSERT INTO `$table_name` ($column_names) VALUES ($placeholders)";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(['message' => 'Error preparing insert statement']);
        exit;
    }
    
    // Dynamically determine the parameter types based on the provided data
    $types = str_repeat('s', count($values)); // Assuming all are strings; modify as needed for other types
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        $inserted_id = $stmt->insert_id;

        // Fetch the tag for the selected type
        $tag_sql = "SELECT tag FROM asset_type WHERE type = ?";
        $tag_stmt = $conn->prepare($tag_sql);
        $tag_stmt->bind_param("s", $type);
        $tag_stmt->execute();
        $tag_result = $tag_stmt->get_result();

        if ($tag_result && $tag_row = $tag_result->fetch_assoc()) {
            $tag = $tag_row['tag'];
            $tagged_value = $tag . str_pad($inserted_id, 4, '0', STR_PAD_LEFT);

            // Update the type-specific table with the tag
            $update_sql = "UPDATE `$table_name` SET tag = ? WHERE id = ?";
            $update_stmt = $conn->prepare($update_sql);
            $update_stmt->bind_param("si", $tagged_value, $inserted_id);

            if ($update_stmt->execute()) {
                // Prepare to insert into unapproved_assets
                $unapproved_columns = [
                    'tag', 'name', 'manufacturer', 'model', 'serial_number', 'location',
                    'user_id', 'asset_value', 'vendor_name', 'purchase_date',
                    'po_number', 'amc_from', 'amc_to', 'amc_interval', 'last_amc',
                    'procure_by', 'warranty_upto', 'type', 'is_active'
                ];

                // Assuming unapproved_assets needs similar information plus 'type'
                $unapproved_values = [
                    $tagged_value, $name, $manufacturer, $model, $serial_number, $location,
                    $user_name, $asset_value, $vendor_name, $purchase_date,
                    $po_number, $amc_from, $amc_to, $amc_interval, $last_amc,
                    $procure_by, $warranty_upto, $type, 1
                ];

                $unapproved_placeholders = implode(', ', array_fill(0, count($unapproved_columns), '?'));
                $unapproved_column_names = implode(', ', $unapproved_columns);

                $unapproved_sql = "INSERT INTO unapproved_assets ($unapproved_column_names) VALUES ($unapproved_placeholders)";
                $unapproved_stmt = $conn->prepare($unapproved_sql);
                
                if (!$unapproved_stmt) {
                    echo json_encode(['message' => 'Error preparing unapproved_assets insert statement']);
                    exit;
                }
                
                $unapproved_types = str_repeat('s', count($unapproved_values));
                $unapproved_stmt->bind_param($unapproved_types, ...$unapproved_values);

                if ($unapproved_stmt->execute()) {
                    echo json_encode(["message" => "Asset added successfully with tag and copied to unapproved assets."]);
                } else {
                    echo json_encode(["message" => "Error inserting into unapproved assets: " . $unapproved_stmt->error]);
                }
            } else {
                echo json_encode(["message" => "Error updating tag: " . $update_stmt->error]);
            }
        } else {
            echo json_encode(["message" => "Error fetching tag for type"]);
        }
    } else {
        echo json_encode(["message" => "Error adding asset: " . $stmt->error]);
    }
}

$conn->close();
?>
