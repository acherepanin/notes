<?php 

$TITLE = "[NOTES]"; 

$VER   = "1233"; 
$VER  .= time(); 

// ICONS: 
// https://icons.getbootstrap.com/  

?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Cousine:400,400i,700,700i&amp;subset=cyrillic,cyrillic-ext" rel="stylesheet"/>
  <link rel="stylesheet" href="css/fonts.css?v=<?=$VER?>">
  <link rel="stylesheet" href="css/bootstrap.min.css?v=<?=$VER?>">
  <link rel="stylesheet" href="js/fancybox/jquery.fancybox.css?v=<?=$VER?>">
  <link rel="stylesheet" href="js/jsTree/jstree.min.css?v=<?=$VER?>"> 
  <link rel="stylesheet" href="css/styles.css?v=<?=$VER?>">
  <title><?=$TITLE?></title>
</head>
<body>

  <header class="navbar" id="navbar">
    <form action="#" id="form_enter" method="post"> 
      <div class="block_enter"> 
        <div class="flex_block" id="block_enter_wrapper"> 
     	  <div class="block_pass">
     	 	<input type="password" name="pass" id="pass" value=""/>
     	 	<div id="pass_eye" class="pass_eye"></div>
     	  </div> 
     	  <button class="btn_enter" id="btn_enter">
     	 	<svg class="s_icon" fill="currentColor"> 
	  			<use xlink:href="img/bootstrap-icons.svg#power"/> 
	  		</svg>
     	  </button>
        </div>
        <button class="btn_reload" id="btn_reload">
     	  <svg class="s_icon" fill="currentColor">
	  		<use xlink:href="img/bootstrap-icons.svg#arrow-repeat"/> 
	  	  </svg>
     	</button>
      </div>
    </form>
    <div id="navbar_tools" class="navbar_tools"></div>
    <div class="status_container" id="status_container">
        <div class="status_loader" id="status_loader"></div>
    	<div class="status_text" id="status_text"></div>
    </div>
  </header>
  
  <div class="main_tools" id="main_tools"></div>
  <div class="main-container" id="main_container"></div>
  
  <script src="js/jquery.min.js"></script> 
  <script src="js/fancybox/jquery.fancybox.min.js"></script> 
  <script src="js/underscore.min.js"></script> 
  <script src="js/underscore.strings.js"></script> 
  <script src="js/handlebars-v2.0.0.js"></script> 
  <script src="js/keymaster.js"></script> 
  <script src="js/ace/ace.js"></script> 
  <script src="js/CryptoJS_v3.1.2/components/core-min.js"></script> 
  <script src="js/CryptoJS_v3.1.2/components/enc-utf16-min.js"></script> 
  <script src="js/CryptoJS_v3.1.2/components/enc-base64-min.js"></script> 
  <script src="js/CryptoJS_v3.1.2/rollups/md5.js"></script> 
  <script src="js/CryptoJS_v3.1.2/rollups/aes.js"></script> 
  <script src="js/jsTree/jstree.min.js?v=<?=$VER?>"></script> 
  <script src="js/main.js?v=<?=$VER?>"></script>
  
</body>
</html>
