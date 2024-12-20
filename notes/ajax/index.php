<?php
include_once(realpath(__DIR__ . '/..')."/classes/TOOLS.php");
include_once(realpath(__DIR__ . '/..')."/classes/PDO_DRIVER.php");
include_once(realpath(__DIR__ . '/..')."/config.php");

if($_REQUEST["data_type"] != "html"){
    header('Content-Type: application/json');
}

$REST_API          = new PDO_DRIVER($pdo_connection);  

$echo              = []; 
$echo["cmd"]       = $_REQUEST["cmd"];
$echo["id"]        = $_REQUEST["id"];
$echo["name"]      = $_REQUEST["name"];
$echo["text"]      = $_REQUEST["text"];
$echo["parent_id"] = $_REQUEST["parent_id"]; // from tree

if(empty($echo["cmd"])) {
    $echo["status"] = "emptyCMD";
    echo json_encode($echo);
    die();
}

switch($echo["cmd"]) {
    // ENTER PASS
    case "enter": // OK
        $echo["status"] = "ok";
        break;
        
    case "inc_main_tools":     // OK
        include_once(realpath(__DIR__ . '/..')."/ajax/includes/main_tools.php");
        die();
        break;
        
    case "inc_main_container": // OK
        include_once(realpath(__DIR__ . '/..')."/ajax/includes/main_container.php");
        die();
        break;
        
    case "inc_navbar_tools":   // OK
        include_once(realpath(__DIR__ . '/..')."/ajax/includes/navbar_tools.php"); 
        die();
        break;
        
    case "list":  // OK
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
        break;
        
    case "add":    // OK
        try {
            $data  = ["name"=>$echo["name"], "text"=> "", "parent_id"=>$echo["id"]];
            $res = $REST_API->create($t_items, $data);
            if($res["last_id"] > 0){
                $echo["last_id"] = $res["last_id"];
                $echo["status"] = "ok";
            } else {
                $echo["status"] = "error";
            }
        } catch (Exception $e) {
            $echo["status"] = "error";
        }
        break;
        
    case "edit":   // OK
        try {
            $data = ["name"=>$echo["name"]];
            $res  = $REST_API->update($t_items, $echo["id"], $data);
            if($res){
                $echo["status"] = "ok";
            } else {
                $echo["status"] = "error";
            }
        } catch (Exception $e) {
            $echo["status"] = "error";
        }
        break;
        
    case "delete":  // OK 
        try {
            $resDelete  = []; 
            
            // Get Parent ID 
            $SQL        = "SELECT id, parent_id FROM ".$t_items." WHERE id = :id"; 
            $ITEM       = $REST_API->query($SQL, ["id"=>$echo["id"]]); 
            $parent_id  = $ITEM[0]["parent_id"]; 
            
            // Delete Item by ID 
            $res = $REST_API->delete($t_items, $echo["id"]);
            if($res){ 
                $resDelete  = [
                    "cmd"       => $echo["cmd"],
                    "id"        => $echo["id"],
                    "parent_id" => $parent_id,
                    "status"    => "ok",
                ]; 
            } else {
                $resDelete["status"] = "error";
            }
        } catch (Exception $e) {
            $resDelete["status"] = "error"; 
        }
        echo json_encode($resDelete);
        die(); 
        break; 
        
    case "save":     // OK
        try {
            $res = $REST_API->update($t_items, $echo["id"], ["text"=>$echo["text"]]);
            if($res) {
                $echo["status"] = "ok";
            } else {
                $echo["status"] = "error";
            }
        } catch (Exception $e) {
            $echo["status"] = "error";
        }
        break;
        
    case "get_note":   // OK !  
        $SQL = "SELECT id, name, parent_id
              FROM ".$t_items."
              WHERE parent_id = :parent_id
              ORDER BY name ASC";
        
        try {
            $res = $REST_API->read($t_items, $echo["id"]);
            if($res["id"]>0){
                $echo["text"]   = $res["text"];
                $echo["items"]  = $REST_API->query($SQL, ["parent_id"=>$echo["id"]]);
                $echo["status"] = "ok";
            } else {
                $echo["status"] = "error";
            }
        } catch (Exception $e) {
            $echo["status"] = "error";
        }
        break;
        
    // TREE NAV
        
    case "get_node":   // OK! 
        
        if($echo["id"]=="#"){
            $PARAMS = ["parent_id"=>0];
        } else {
            $PARAMS = ["parent_id"=>$echo["id"]];
        }
        $SQL = "SELECT id, name, parent_id
              FROM ".$t_items."
              WHERE parent_id = :parent_id
              ORDER BY name ASC";
        
        $echo["items"]  = $REST_API->query($SQL, $PARAMS);
        
        $treeItems = [];
        foreach($echo["items"] as $ITEM){
            
            $SQL_CHILDREN = "SELECT id, name, parent_id
                           FROM ".$t_items."
                           WHERE parent_id = :parent_id
                           ORDER BY name ASC";
            
            $hasChildren = false;
            $iconClass   = "file file-txt"; 
            
            if(count( $REST_API->query($SQL_CHILDREN, ["parent_id"=>$ITEM["id"]]) )>0){
                $hasChildren = true;
                $iconClass   = "file file-notes";
                $iconClass   = "folder";
            }
            
            $treeItems[] = [
                "id"       => $ITEM["id"],
                "text"     => $ITEM["name"],
                "children" => $hasChildren,
                'type'     => "folder",
                "icon"     => $iconClass
            ];
        }
        // EXAMPLE 
        // echo '[{"text":"root","children":[{"text":"Ustawa 1333","children":true,"id":"Ustawa 1333","icon":"folder"},{"text":"test","children":true,"id":"test","icon":"folder"}],"id":"\/","icon":"folder","state":{"opened":true,"disabled":true}}]';
        echo json_encode($treeItems); 
        die();
        break;
        
    case "move_node": // OK 
        $moveResult = []; 
        try {
            $data = ["parent_id"=>$echo["parent_id"]];
            $res  = $REST_API->update($t_items, $echo["id"], $data);
            if($res){
                $moveResult = [
                    "status"    => "ok",
                    "id"        => $echo["id"],
                    "parent_id" => $echo["parent_id"]
                ];
            } else {
                $moveResult["status"] = "error";
            }
        } catch (Exception $e) {
            $moveResult["status"] = "error"; 
        }
        echo json_encode($moveResult); 
        die();
        break;
        
        // OTHERS
    default:
        $echo["status"] = "error";
        $echo["log"]    = "unknown_cmd"; 
        break;
}

/* 
 // FOR DEBUG
 $echo["fields"] = [
 "id"  =>  $noteID, 
 ]; 
 */
 
echo json_encode($echo);
