О<?
// CONFIG FILE

$db_host        = "localhost";
$db_name        = "notes";
$db_user        = "mililit";
$db_pass        = "8vkKr2)(0zc#";

$db_charset     = "utf8"; 

// ACCESS SETTINGS 

// hash => table 
$HASH_CONFIG = array(
    "b9517848044c6f7ff6f5bf9937d7e4ea"=>"items_alex", //Старое
    "46757c4cad03d890849dbac64857a5a4"=>"items_mililit", //Текущее
    "--------------------------------"=>"new_table",
); 

/*

 //////////////////////////////
 // SQL FOR CREATE NEW TABLE //
 //////////////////////////////
 
 CREATE TABLE IF NOT EXISTS `items` (
 `id` int(6) NOT NULL AUTO_INCREMENT,
 `name` text NOT NULL,
 `text` text NOT NULL,
 `parent_id` int(6) NOT NULL,
 PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4; 
 
*/

$t_items = $HASH_CONFIG[$_REQUEST["hash"]];

if(empty($t_items)){
    $echo["status"] = "errorPass";
    echo json_encode($echo);
    die();
}

try {
    
    $db_dsn = "mysql:host=$db_host;dbname=$db_name;charset=$db_charset";
    $dbopt  = array(
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_PERSISTENT => true
    );
    
    $pdo_connection = new PDO($db_dsn, $db_user, $db_pass, $dbopt);
    
    $pdo_connection->exec("set names ".$db_charset); // cp1251 || utf8 (Set charset for outlet data)
    
} catch (Exception $e) {
    
    $echo["status"] = "errorConnect";
    echo json_encode($echo);
    die;
    
}
