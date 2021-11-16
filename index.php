<?php

	//echo htmlspecialchars($_GET['f']);
	//$text = filter_input(INPUT_GET, "text", FILTER_SANITIZE_STRING);
	
	$text = filter_var($_SERVER[REQUEST_URI], FILTER_SANITIZE_STRING);
	$text = ltrim($text, '/');
	$text = urldecode($text);
	
	$crc = crc32($text);
	$crchex = substr("00000000".dechex($crc), -8);
	$crchex = substr($crchex, 0, 6)."ff";

	$homepage = file_get_contents("index.html");
	
	$patterns = array();
	$patterns[0] = '/<\/textarea>/i';
	$patterns[1] = '/<meta property="og:url" content="(.*)" \/>/i';
	$patterns[2] = '/<meta property="og:image" content="(.*)" \/>/i';
	$patterns[3] = '/<meta property="og:description" content="(.*)" \/>/i';
	$replacements = array();
	$replacements[3] = $text.'</textarea>';
	$replacements[2] = '<meta property="og:url" content="http://'.$_SERVER[HTTP_HOST].$_SERVER[REQUEST_URI].'" />';
	$replacements[1] = '<meta property="og:image" content="http://whatsmyco.aurelitec.com/share/colorswatch.php?color='.$crchex.'" />';
	$replacements[0] = '<meta property="og:description" content="That\'s the matching color for: '.$text.'" />';
	
	$homepage = preg_replace($patterns, $replacements, $homepage);

	echo $homepage;
	echo "<!-- php -->";
	
	// echo $_GET['text'];
	//echo $_SERVER[REQUEST_URI];
?>