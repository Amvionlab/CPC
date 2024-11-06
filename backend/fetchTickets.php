<?php 
include 'config.php'; 
$conn->set_charset("utf8");
$cond = "1=1";
if (isset($_GET['user'])) {
    $id = intval($_GET['user']);
    $cond = "ticket.created_by = $id";
}
if (isset($_GET['support'])) {
    $id = intval($_GET['support']);
    // Use FIND_IN_SET to check if $id is in the assignees list
    $cond = "(FIND_IN_SET($id, ticket.assignees) OR ticket.created_by = $id)";
}
// Fetch tickets
$sqlTickets = "SELECT `month`, `date_invoiced`, `document_no`, `bpartner_group`, `business_partner`, `prod_value`, `prod_name`, `invoiced_qty`, `line_amt`, `product_category`, `product_group`, `state`, `zone`, `division`, `am`, `territory`, `rm`, `buh`, `product_mapping`, `product_type`, `sap_code`, `product_grouping`, `vendor_name`, `parameter_sap`, `brand`, `product_division`, `document`, `revenue_account`, `cogs_account`, `year`, `customer_po_num`, `mapping_code`, `euroimmun_top_product`, `pack_size`, `aop_2024_mapping`, `territory_2023`, `buh_2023` FROM `sales_summary` WHERE $cond ";

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

