/*************************************************************************
    WhatsMyCo
    Copyright (C) 2013 Aurelify
    http://whatsmy.co
    http://www.aurelify.com

    WhatsMyCo.ColorDownloader
    Provides a method to create and download a color swatch image file.
*************************************************************************/

/*global window, WhatsMyCo */

WhatsMyCo.ColorDownloader = (function () {
    "use strict";
    
    /**
     * Creates the color swatch in memory, using a HTML5 canvas element.
     *
     * @param {string} rgba - The RGBA color code.
     * @param {number} width - The width of the swatch image.
     * @param {number} height - The height of the swatch image.
     * @param {Object} $canvas - The canvas element used to generate the color swatch.
     * @return {string} The data URL of the swatch image that was created.
     */
    function doCreateSwatch(rgba, width, height, $canvas) {
        // Resize the canvas to the values requested by the user
        $canvas.attr("width", width).attr("height", height);

        var dataURL = null,
            context = $canvas[0].getContext('2d');
        
        if (!context) {
            throw new Error(WhatsMyCo.AppStrings.colorDownloaderError);
        }
        
        // Clear the canvas (get rid of previous colors)
        context.clearRect(0, 0, width, height);
        
        // Fill the canvas with the current color (rgba)
        context.fillStyle = rgba;
        context.fillRect(0, 0, width, height);
        
        // Convert the canvas to a data URL
        dataURL = $canvas[0].toDataURL();
        
        return dataURL;
    }
    
    /**
     * Starts the download of the color swatch (if supported by the browser), or opens it in a new window.
     *
     * @param {string} dataURL - The data URL of the color swatch image.
     * @param {Object} $downloadLink - The download link element used to download the image.
     * @param {string} fileName - The file name that will be used to download the image.
     * @param {string} downloadWindow - The HTML contents of the download window.
     */
    function doDownloadSwatch(dataURL, $downloadLink, fileName, downloadWindow) {
        //if (typeof $downloadLink[0].download !== undefined) {
		if ("download" in $downloadLink[0]) {
            $downloadLink.attr("download", fileName).attr("href", dataURL);
            $downloadLink[0].click();
        } else {
            var newWindow = window.open();
            newWindow.document.write(downloadWindow.replace("{dataURL}", dataURL));
        }
    }
    
    /**
     * Creates and starts the download of a color swatch PNG image.
     *
     * @public
     * @param {number} width - The width of the color swatch.
     * @param {number} height - The height of the color swatch.
     * @param {string} rgba - The RGBA color code.
     * @param {string} hex8 - The HEX8 color code.
     * @param {Object} $canvas - The canvas element used to generate the color swatch.
     * @param {Object} $downloadLink - The download link element used to download the image.
     * @param {string} downloadWindow - The HTML contents of the download window.
     */
    function downloadSwatch(width, height, rgba, hex8, $canvas, $downloadLink, downloadWindow) {
        var dataURL, fileName;
        
        // Create the color swatch using HTML5 Canvas
        dataURL = doCreateSwatch(rgba, width, height, $canvas);
        
        fileName = "color-" + hex8 + "-" + width + "x" + height + ".png";
        doDownloadSwatch(dataURL, $downloadLink, fileName, downloadWindow);
    }
    
    /* Public Method(s) */
    return {
		downloadSwatch: downloadSwatch
	};
    
}());