/*************************************************************************
    WhatsMyCo
    Copyright (C) 2013 Aurelify
    http://whatsmy.co
    http://www.aurelify.com

    WhatsMyCo.FileColorCalculator
    Provides functionality to read a local file into browser memory,
    calculate its CRC, and show its matching color.
*************************************************************************/

/*global WhatsMyCo, Worker */

WhatsMyCo.FileColorCalculator = (function () {
	"use strict";
	
	var fileName, uploaderWorker;
    
    /**
     * Shows an error message overlay, after hiding the progress overlay.
     *
     * @param {string} message - The error message.
     */
    function showError(message) {
        WhatsMyCo.UIUpdater.hideProgressOverlay();
        WhatsMyCo.UIUpdater.showErrorOverlay(WhatsMyCo.AppStrings.fileColorError, message);
    }
    
    /**
     * Terminates the Web Worker and hides the progress overlay.
     */
	function doneWorker() {
        // Terminate the Web Worker to free up the huge memory space usually required by the file read buffers
        if (!!uploaderWorker) {
            uploaderWorker.terminate();
        }
        
        // Hide the progress overlay
        WhatsMyCo.UIUpdater.hideProgressOverlay();
	}

    /**
     * Handles Web Worker messages.
     *
     * @param {Object} e - The message object received from the Worker.
     */
	function workerMessage(e) {
		switch (e.data.key) {
        // Set the progress max to the size of the file
        case "size":
        // Show worker progress
		case "progress":
            WhatsMyCo.UIUpdater.updateProgress(e.data);
			break;
        // Update the color from the result crc
		case "crc":
            WhatsMyCo.UIUpdater.updateUserText(WhatsMyCo.AppStrings.uiUserColorPrefix + e.data.value.toString(16));
            WhatsMyCo.App.updateColorFromText(null);
			WhatsMyCo.UIUpdater.updateFileName(fileName);
			doneWorker();
			break;
        // Show the error thrown inside the worker
		case "error":
            showError(e.data.value);
			break;
		}
	}
    
    /**
     * Starts a Web Worker that reads a file and calculates its CRC and corresponding color.
     *
     * @public
     * @param {Object} $fileUpload - The file input jQuery object.
     */
    function calculateFileColor($fileUpload) {
		var file;
            
		try {
			file = $fileUpload[0].files[0];
			fileName = file.name;

			// Show the progress overlay
			WhatsMyCo.UIUpdater.showProgressOverlay(fileName, WhatsMyCo.Tools.prettySize(file.size), doneWorker);
			
			// Create and start the Web Worker            
			uploaderWorker = new Worker(WhatsMyCo.AppStrings.fileColorWorker);
			uploaderWorker.onmessage = workerMessage;
			uploaderWorker.postMessage(file);
		} catch (e) {
			// On error, show the error message
			showError(e.message);
		} finally {
			// Clear the value of the File Upload element to let the user reselect the same file
			WhatsMyCo.UIUpdater.clearFileUpload();
		}
    }
	
    /* Public Method(s) */
	return {
		calculateFileColor: calculateFileColor
	};
	
}());