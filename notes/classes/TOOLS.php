<?
class TOOLS { 
	
	public static function logText($text, $color="red") {
		echo "<p style='padding:20px;color:".$color."'>".$text."</p>";
	}
	
	public static function GetTable($data) {
		$str_table = "";
		$str_table .= "<table class='table_distances table table-striped table-bordered'>";
		$str_table .= "<tr>";
		foreach($data[0] as $key=>$val) { $str_table .= "<th>".$key."</th>"; }
		$str_table .= "</tr>";
		foreach($data as $item){
			$str_table .= "<tr>";
			foreach($item as $key=>$value){
				if(is_array($value)){
					$str_table .= "<td>".GetTable($value)."</td>";
				} else {
					$str_table .= "<td>".$value."</td>";
				}
			}
			$str_table .= "</tr>";
		}
		$str_table .= "</table>";
		return $str_table;
	}
	
	public static function pre($data){
		echo "<pre>";
		if(is_array($data)){
			print_r($data);
		} else {
			var_dump($data);
		}
		echo "</pre>";
	}
	
	public static function clearNR($str){
		$result = $str;  
		$result = str_replace(array("\n", "\r"), "", $result); 
		return $result; 
	}

}
?>