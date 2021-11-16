<?php

	define("MAX_WIDTH", 2000);
	define("MAX_HEIGHT", 2000);
	define("DEFAULT_WIDTH", 1200);
	define("DEFAULT_HEIGHT", 630);

	function splitRGBA($rgba) {
		if (preg_match_all("/[0-9a-fA-F]{2}/", $rgba, $rgbaArray) == 4) {
			$alpha7 = ((~((int)hexdec($rgbaArray[0][3]))) & 0xff) >> 1;
			return array("red" => hexdec($rgbaArray[0][0]), 
						 "green" => hexdec($rgbaArray[0][1]), 
						 "blue" => hexdec($rgbaArray[0][2]), 
						 "alpha7" => $alpha7);
		}
		
		return null;
	}

	function returnColorSwatch($rgba, $width, $height) {
	
		// Get the R, G, B, A7
		$rgbaArray = splitRGBA($rgba);
		if (!$rgbaArray) {
			return; // Bad RGBA Color ?
		}
		
		// Create the image
		$swatchImage = imagecreatetruecolor($width, $height);
		
		// Create the RGBA color
		$color = imagecolorallocatealpha($swatchImage, $rgbaArray["red"], $rgbaArray["green"], $rgbaArray["blue"], $rgbaArray["alpha7"]);
		
		// Fill the image with the color (alpha-enabled)
		imagefill($swatchImage, 0, 0, $color);
		imagesavealpha($swatchImage, TRUE);
		
		// Return the image with the correct image/png headers
		header('Content-type: image/png');
		imagepng($swatchImage);

		// Destroy the image to free memory
		imagedestroy($swatchImage);
	}

	// Get the "color" URL parameter
	$rgba = filter_input(INPUT_GET, 'color', FILTER_VALIDATE_REGEXP, 
		array("options" => array("regexp" => "/^([0-9a-fA-F]{8})$/")));
		
	// Get the "width" and "height" URL parameters
	$width = filter_input(INPUT_GET, 'width', FILTER_VALIDATE_INT, 
		array("options" => array("min_range" => 1, "max_range" => MAX_WIDTH, "default" => DEFAULT_WIDTH)));
	$height = filter_input(INPUT_GET, 'height', FILTER_VALIDATE_INT,
		array("options" => array("min_range" => 1, "max_range" => MAX_HEIGHT, "default" => DEFAULT_HEIGHT)));
		
	// Create and return the color swatch as a PNG image
	if ($rgba and $width and $height) {
		returnColorSwatch($rgba, $width, $height);
	}

?>