<?
// http://phpfaq.ru/pdo

class PDO_DRIVER { 
	
	protected $pdo;
	
	public function __construct($pdo_connection)
	{
		$this->pdo = $pdo_connection;
	}
	
	public function query($QUERY, $PARAMS)
	{
		$PDO = $this->pdo;
		$res = $PDO->prepare($QUERY); 
		$res->execute($PARAMS);
		while ($row = $res->fetch(PDO::FETCH_ASSOC))
		{
			$result[] = $row;
		}
		return $result;
	}
	
	public function create($TABLE, $data)
	{
		$result    = array(); 
		$PDO       = $this->pdo;
		
		$arrFields = $this->getFields($data);
		$arrValues = $this->getValues($data); 

		$sql = "INSERT INTO ".$TABLE." SET ".$this->pdoSet($arrFields, $arrValues, $data);
		$result["status"]  = $PDO->prepare($sql)->execute($arrValues);
		$result["last_id"] = $PDO->lastInsertId();
		$result["created_row"] = $this->read($TABLE, $result["last_id"]); 

		return $result;
	}
	
	public function update($TABLE, $ID, $data)
	{
		$PDO       = $this->pdo;
		$arrFields = $this->getFields($data);
		$arrValues = $this->getValues($data);
		
		$sql = "UPDATE ".$TABLE." SET ".$this->pdoSet($arrFields, $arrValues, $data)." WHERE id = :id";
		$res = $PDO->prepare($sql);
		$arrValues["id"] = $ID;
		$result = $res->execute($arrValues);
		return $result;
	}

	public function delete($TABLE, $ID)
	{
		$PDO = $this->pdo;
		$res = $PDO->prepare("DELETE FROM ".$TABLE." WHERE id = ?");
		$result = $res->execute(array($ID));
		return $result;
	}	
	
	public function read($TABLE, $ID)
	{
		$PDO = $this->pdo;
		$res = $PDO->prepare("SELECT * FROM ".$TABLE." WHERE id = ?"); 
		$res->execute(array($ID));
		$result = $res->fetch(PDO::FETCH_ASSOC);
		return $result;
	}
	
	public function readAll($TABLE) 
	{
		$PDO   = $this->pdo; 
		$result = array();
		$res = $PDO->query('SELECT * FROM '.$TABLE);  
		while ($row = $res->fetch(PDO::FETCH_ASSOC))
		{
			$result[] = $row;
		}
		return $result;
	} 
	
	// clear table (not remove table) 
	public function truncateTable($TABLE){
		$PDO   = $this->pdo;
		$PDO->query('TRUNCATE '.$TABLE);
	}
	
	public function getCount($TABLE)
	{
		$PDO    = $this->pdo;
		$result = array();
		$res    = $PDO->query('SELECT count(*) FROM '.$TABLE); 
		$row    = $res->fetch(PDO::FETCH_NUM); 
		return $row[0];
	}

	// gets Fields Name from data array 
	public function getFields($data){
		$arrFields = array();
		foreach($data as $key=>$val){
			$arrFields[] = $key;
		}
		return $arrFields;
	}
	
	// gets Values from data array 
	public function getValues($data){
		$arrValues = array();
		foreach($data as $key=>$val){
			$arrValues[] = $val;
		}
		return $arrValues;
	}
	
	// Helper function it makes string for request  
	public function pdoSet($fields, &$values, $source = array()) {
		$set = '';
		$values = array(); 
		if (!$source) $source = &$_POST;
		foreach ($fields as $field) {
			if (isset($source[$field])) {
				$set.="`".str_replace("`","``",$field)."`". "=:$field, ";
				$values[$field] = $source[$field];
			}
		}
		return substr($set, 0, -2);
	}
}


?>