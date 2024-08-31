<?php
include 'config.php'; // Database connection

$name = $_POST['name'];
$manufacturer = $_POST['manufacturer'];
$model = $_POST['model'];
$serial_number = $_POST['serial_number'];
$location = $_POST['location'];
$user_name = $_POST['user_name'];
$asset_value = $_POST['asset_value'];
$vendor_name = $_POST['vendor_name'];
$purchase_date = $_POST['purchase_date'];
$po_number = $_POST['po_number'];
$amc_from = $_POST['amc_from'];
$amc_to = $_POST['amc_to'];
$amc_interval = $_POST['amc_interval'];
$last_amc = $_POST['last_amc'];
$procure_by = $_POST['procure_by'];
$warranty_upto = $_POST['warranty_upto'];

// Check if asset already exists
$sql = "SELECT * FROM assets WHERE manufacturer = ? AND model = ? AND serial_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $manufacturer, $model, $serial_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["message" => "Asset Already Exists"]);
} else {
    $sql = "INSERT INTO assets (name, manufacturer, model, serial_number, location, user_name, asset_value, vendor_name, purchase_date, po_number, amc_from, amc_to, amc_interval, last_amc, procure_by, warranty_upto, post_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssssssssssss", $name, $manufacturer, $model, $serial_number, $location, $user_name, $asset_value, $vendor_name, $purchase_date, $po_number, $amc_from, $amc_to, $amc_interval, $last_amc, $procure_by, $warranty_upto);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Asset added successfully."]);
    } else {
        echo json_encode(["message" => "Error adding asset: " . $stmt->error]);
    }
}

$conn->close();
?>
