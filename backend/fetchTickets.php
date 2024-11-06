<?php 
include 'config.php'; 
$conn->set_charset("utf8");
// Fetch tickets
$sqlTickets = "SELECT `month`, `date_invoiced`, `document_no`, `bpartner_group`, `business_partner`, `prod_value`, `prod_name`, `invoiced_qty`, `line_amt`, `product_category`, `product_group`, `state`, `zone`, `division`, `am`, `territory`, `rm`, `buh`, `product_mapping`, `product_type`, `sap_code`, `product_grouping`, `vendor_name`, `parameter_sap`, `brand`, `product_division`, `document`, `revenue_account`, `cogs_account`, `year`, `customer_po_num`, `mapping_code`, `euroimmun_top_product`, `pack_size`, `aop_2024_mapping`, `territory_2023`, `buh_2023` FROM `sales_summary` ";

$result = $conn->query($sqlTickets);

if ($result->num_rows > 0) {
  $tickets = [];
  while($row = $result->fetch_assoc()) {
    $tickets[] = $row;
  }
  echo json_encode($tickets);
} else {
  echo json_encode(array("message" => "No tickets found"));
}

