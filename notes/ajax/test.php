<?php 
header('Content-Type: application/json');  
include_once(realpath(__DIR__ . '/..')."/classes/TOOLS.php");
include_once(realpath(__DIR__ . '/..')."/classes/PDO_DRIVER.php");
include_once(realpath(__DIR__ . '/..')."/config.php");

$REST_API    = new PDO_DRIVER($pdo_connection);   

$echo = []; 
$echo["id"] = 34; 

try { 
    $resDelete  = []; 
    
    // Get Parent ID
    $SQL        = "SELECT id, parent_id FROM ".$t_items." WHERE id = :id";
    $ITEM       = $REST_API->query($SQL, ["id"=>$echo["id"]]);
    
    echo "<pre>";
    print_r($ITEM);
    echo "<pre>";
    
    // Delete Item by ID
    // $res = $REST_API->delete($t_items, $echo["id"]); 
//     if($res){  
        $resDelete  = [
            "id"        => $echo["id"], 
            "parent_id" => $ITEM[0]["parent_id"],
            "status"    => "ok",
        ];
//     } else {
//         $resDelete["status"] = "error";
//     }
} catch (Exception $e) {
    $resDelete["status"] = "error";
} 
echo json_encode($resDelete); 



/*
try {
    $PARAMS = ["parent_id"=>0];
    $SQL    = "SELECT id, name, parent_id
                     FROM ".$t_items."
                     WHERE parent_id = :parent_id
                     ORDER BY name ASC";
    $echo["items"]  = $REST_API->query($SQL, $PARAMS);
    $echo["status"] = "ok";
} catch (Exception $e) {
    $echo["status"] = "error";
} 
*/ 


