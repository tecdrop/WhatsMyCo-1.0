/* WhatsMyCo */
/* Copyright (C) 2013 Aurelify */
/* www.aurelify.com */


/*jslint browser: true*/
/*global $, Modernizr, WhatsMyCo,  wmycoColorTools, pusher, BufCRC32, wmycoUrlTools */

WhatsMyCo.App = (function () {
	"use strict";
	
	var DEFAULTTEXT = "Anonymous.",
        $userText = $("#usertext"),
        lastUserText;

	/* Selects a new color from a CRC value and updates the UI */
	function updateColorFromCRC(crc, text) {
		var exactColorObj, baseColorObj, closestColorObj, closestColorName;

		// Get the exact RGBA color match from the CRC32 into a pusher.color object
		exactColorObj = pusher.color('packed_rgba', crc);

		// Get the base and closest pusher.color objects
		baseColorObj = pusher.color(exactColorObj.html('hex6'));
		closestColorName = exactColorObj.html('keyword');
		closestColorObj = pusher.color(closestColorName);
		
		// Select the new color and update the UI
		WhatsMyCo.UIUpdater.updateColor(exactColorObj, baseColorObj, closestColorObj, closestColorName, text, crc);
	}

	/* Calculates the CRC32 of a given text and update the color */
	function updateColorFromText(text) {
		var crc, directColor;
		
		if (!text) {
			text = $userText.val();
		}
	
		if (text === lastUserText) {
			return;
		}
		
		directColor = WhatsMyCo.Tools.getDirectColor(text);
		crc = directColor ? parseInt(directColor, 16) : BufCRC32.calculate(BufCRC32.Utf8Encode(text || DEFAULTTEXT));
		
		updateColorFromCRC(crc, text);
        WhatsMyCo.UIUpdater.updateFileName("");
		lastUserText = text;
	}
    
	function attachEvents() {
		var $fileUpload;
		
		$userText.on("input keyup", function () { updateColorFromText(this.value); });
        
		$(".color-variant.exact").on("mouseover", function () { WhatsMyCo.UIUpdater.updateColorVariant(0); });
		$(".color-variant.base").on("mouseover", function () { WhatsMyCo.UIUpdater.updateColorVariant(1); });
		$(".color-variant.closest").on("mouseover", function () { WhatsMyCo.UIUpdater.updateColorVariant(2); });

        $("#go-naked").click(function () { WhatsMyCo.UIUpdater.nakedMode(true); });
        $("#exit-naked").click(function () { WhatsMyCo.UIUpdater.nakedMode(false); });

		$("#copylist input").click(function () { $(this).select(); });
        
		// When the user selects a file to upload, start the Web Worker to upload the file and calculate its CRC
		$fileUpload = $("#file-upload");
		$fileUpload.change(function () { WhatsMyCo.FileColorCalculator.calculateFileColor($fileUpload); });

		$("#swatch-download").click(function () {
			var width, height, color;
			width = parseInt($("#swatch-width").val(), 10);
			height = parseInt($("#swatch-height").val(), 10);
			
			if ($.isNumeric(width) && $.isNumeric(height)) {
                try {
                    WhatsMyCo.ColorDownloader.downloadSwatch(
                        width,
                        height,
                        $("#copylist .rgba").val(),
                        $("#copylist .hex8").val(),
                        $('#swatch-canvas'),
                        $("#swatch-download-link"),
                        $("#swatch-download-window").html()
                    );
                } catch (e) {
                    WhatsMyCo.UIUpdater.showErrorOverlay("Failed to download the color swatch.", e.message);
                }
			}
		});
		
		$(".outdated-browser .cancel").click(function () {
			$(".outdated-browser").addClass("closed");
		});
		
		$userText.focus();
	}

	return {
        attachEvents: attachEvents,
		updateColorFromText: updateColorFromText
	};
    
}());

$(function () {
	"use strict";

    // Init the UI Updater
    WhatsMyCo.UIUpdater.init();
    
	// Attach event handlers
    WhatsMyCo.App.attachEvents();
    
    // On startup update the color from the contents of the User Text Area
    WhatsMyCo.App.updateColorFromText(null);
});

