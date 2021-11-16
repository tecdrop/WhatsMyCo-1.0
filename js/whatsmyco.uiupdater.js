
/*global $, WhatsMyCo */

WhatsMyCo.UIUpdater = (function () {
	"use strict";

	/* jQuery DOM selections cached as variables */
	var $body, $shareLinks, $userText, $colorVariants, $colorVariantSwatches, $colorVariantInfos,
		$rgbList, $copyBoxes, $searchLinks, $permalink, $crc,
        $errorOverlay, $progressOverlay, $progressOverlayProgress,
        lastVariantIndex = 1;
    
	/************************************************************/
	/* PRIVATE METHODS											*/
	/************************************************************/

	/* Updates the body color and the text/contrast colors */
	function setBodyColor(colorObj) {
		// Set the new body background color
		$body.css("background-color", colorObj.html());
		
		// $userText.css("background-color", colorObj.alpha(1).html());

		// Change the body class to signal if it's a dark background color
		// This will change text, border and shadow colors for various elements on page
		$body.toggleClass("dark-color", WhatsMyCo.Tools.isDarkColor(colorObj));
	}
	
	/* Updates the RGBA List */
	function updateRGBAList(colorObj) {
		$rgbList.filter(".red").html(colorObj.red());
		$rgbList.filter(".green").html(colorObj.green());
		$rgbList.filter(".blue").html(colorObj.blue());
		$rgbList.filter(".alpha").html(colorObj.alpha8());
	}

	/* Updates the copy section with the values and formats of the current color */
	function updateCopySection(colorObj) {
        colorObj = colorObj.alpha(colorObj.alpha().toFixed(2));
		$copyBoxes.filter(".hex").val(colorObj.html('hex6'));
		$copyBoxes.filter(".hex8").first().val("#" + colorObj.html('hex6').slice(1) + ("0" + colorObj.alpha8().toString(16)).slice(-2));
		$copyBoxes.filter(".rgb").val(colorObj.html('rgb'));
		$copyBoxes.filter(".rgba").val(colorObj.html('rgba'));
		$copyBoxes.filter(".hsl").val(colorObj.html('hsl'));
		$copyBoxes.filter(".hsla").val(colorObj.html('hsla'));
		$copyBoxes.filter(".hsv").val(colorObj.hsv());
		$copyBoxes.filter(".hsva").val(colorObj.hsv() + "," + colorObj.alpha());
	}

	/* Updates the search section by inserting the color hex code into the search links */
	function updateSearchSection(colorObj) {
		$searchLinks.attr("href", function () {
			var color = colorObj.html("hex6");
			return $(this).data("whatsmyco-baseurl") +
				($(this).data("whatsmyco-noencode") ? color : encodeURIComponent(color));
		});
	}
	
	/* Updates the permalink */
	function updateSharePermalinks(text) {
		var permalink, $facebookLink;

		// Update the permalink
		permalink = $permalink.data("whatsmyco-baseurl") + encodeURIComponent(text);
		$permalink.attr("href", permalink).html(permalink);
		
		// Update the Facebook share button link
		$facebookLink = $shareLinks.filter(".facebook");
		$facebookLink.attr("href", $facebookLink.data("whatsmyco-baseurl") + encodeURIComponent(permalink));
	}
    
    function toggleOverlay($overlay, showOrHide) {
        $body.toggleClass("covered", showOrHide);
        $overlay.toggleClass("opened", showOrHide);
        if (showOrHide) {
            $overlay.css("background-color", "rgba(" + $rgbList.filter(".red").html() + ", " + $rgbList.filter(".green").html() +
                ", " + $rgbList.filter(".blue").html() + ", 0.95)");
        }
    }

	/************************************************************/
	/* PUBLIC METHODS											*/
	/************************************************************/

	/* (Public) Init the UI Updater: cache jQuery DOM selections */
	function init() {
		$body = $("body");
		$shareLinks = $(".share-link");
		$userText = $("#usertext");
		$colorVariants = $(".color-variant");
		$colorVariantSwatches = $(".color-variant .swatch");
		$colorVariantInfos = $(".color-variant .info");

		$rgbList = $(".rgb-list li");
		$copyBoxes = $("#copylist input");
		$searchLinks = $(".search-link");
		$permalink = $("#the-permalink");
		$crc = $("#current-crc");
        
        $errorOverlay = $("#error-overlay");
        $progressOverlay = $("#file-progress-overlay");
        $progressOverlayProgress = $progressOverlay.find("progress");
        
        $errorOverlay.find(".continue").click(function () { toggleOverlay($errorOverlay, false); });
        $progressOverlay.find(".cancel").click(function () { toggleOverlay($progressOverlay, false); });
        
	}

	/* (Public) Selects a new color variant (exact, base, or closest), and updates the UI */
	function updateColorVariant(variantIndex) {
        
        // If this color variant was already updated, exit now
        if (variantIndex === lastVariantIndex) {
            return;
        }
        lastVariantIndex = variantIndex;
        
		// Get the color of the current variant
        var $variant = $colorVariants.eq(variantIndex),
            colorObj = $variant.data("whatsmyco-color");
        
		// Update the body color and the text/contrast colors
		setBodyColor(colorObj);

		// Show the selection around the current color type swatch
		$colorVariants.removeClass("selected");
		$variant.addClass("selected");

		// Update the RGBA List, the Save and Social sections
		updateRGBAList(colorObj);
		updateCopySection(colorObj);
		updateSearchSection(colorObj);
	}

	/* (Public) Select a new color, keep the previous color variant type, and update the UI */
	function updateColor(exactColorObj, baseColorObj, closestColorObj, closestColorName, text, crc) {
		// Update the color variants/swatches
		$colorVariantSwatches.eq(0).css("background-color", exactColorObj.html('rgba'));
		$colorVariants.eq(0).data("whatsmyco-color", exactColorObj);
		$colorVariantSwatches.eq(1).css("background-color", baseColorObj.html('hex6'));
		$colorVariants.eq(1).data("whatsmyco-color", baseColorObj);
		$colorVariantSwatches.eq(2).css("background-color", closestColorObj.html());
		$colorVariants.eq(2).data("whatsmyco-color", closestColorObj);

		// Update the color infos
		$colorVariantInfos.filter(".alpha").html(((1 - exactColorObj.alpha()) * 100).toFixed(0) + "%");
		$colorVariantInfos.filter(".hex").html(exactColorObj.html('hex6'));
		$colorVariantInfos.filter(".closestweb").html(closestColorName);
		$colorVariantInfos.filter(".exactweb").html(baseColorObj.hex6() === closestColorObj.hex6() ? "exact" : "closest");

		// Update the currently selected color swatch
        var savedLastVariantIndex = lastVariantIndex;
        lastVariantIndex = -1;
		updateColorVariant(savedLastVariantIndex);
		
		// Update the permalink
		updateSharePermalinks(text);
		
		// Update the current CRC
		$crc.html(crc.toString(16));
	}

    function updateUserText(text) {
		$userText.val(text);
	}
    
	function updateFileName(text) {
        $("#file-color .filename").html(text).attr("title", text);
        $("#file-color").toggleClass("opened", text !== "");
	}
    
    // Clear the value of the File Upload element to let the user reselect the same file
    function clearFileUpload() {
		//$("#file-upload").val("");
		$("#usertext-section form")[0].reset();
    }
    
    /* (Public) Enables or disables the naked mode */
    function nakedMode(enable) {
        $body.toggleClass("naked", enable);
    }
    
    /* (Public) Shows or hides the modern browser overlay */

    function showErrorOverlay(error, message) {
        $errorOverlay.find(".error").html(error);
        $errorOverlay.find(".message dd").html(message);
        toggleOverlay($errorOverlay, true);
    }
    
    function showProgressOverlay(fileName, fileSize, done) {
        $progressOverlay.find(".filename").html(fileName);
        $progressOverlay.find(".filesize").html(fileSize);
        $progressOverlayProgress.val(0);
        if (done) {
            $progressOverlay.find(".cancel").off("click").click(done);
        }

        toggleOverlay($progressOverlay, true);
    }
    
    function updateProgress(progress) {
		switch (progress.key) {
        case "size":
            $progressOverlayProgress.attr("max", progress.value);
			break;
		case "progress":
            $progressOverlayProgress.val(progress.value);
			break;
		}
    }
    
    function hideProgressOverlay() {
        toggleOverlay($progressOverlay, false);
    }

	/************************************************************/
	/* RETURNS													*/
	/************************************************************/
	
	return {
		init: init,
		updateColor : updateColor,
		updateColorVariant : updateColorVariant,
		updateUserText: updateUserText,
        updateFileName: updateFileName,
        clearFileUpload: clearFileUpload,
        nakedMode: nakedMode,
        showErrorOverlay: showErrorOverlay,
        showProgressOverlay: showProgressOverlay,
        updateProgress: updateProgress,
        hideProgressOverlay: hideProgressOverlay
	};

}());