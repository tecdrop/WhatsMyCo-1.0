/*global location */

WhatsMyCo.Tools = (function () {
    "use strict";

	/* (Public) Gets the param section from a url */
	function getUrlParam() {
		return location.href.split(location.host)[1].replace(/^\//, '');
	}
	
	function getDirectColor(text) {
		var crcRe = /^\s*(color:)\s*([0-9A-Fa-f]{8})\s*$/,
            found = crcRe.exec(text);
		return found ? found[2] : null;
	}

	function isDarkColor(colorObject) {
		var yiq = ((colorObject.red() * 299) + (colorObject.green() * 587) + (colorObject.blue() * 114)) / 1000;
		return (yiq >= 128) ? false : true;
	}
	
    // Converts a file size to a more readable string.
	// (http://bgrins.github.com/filereader.js/)
    function prettySize(bytes) {
        var s = ['bytes', 'kb', 'MB', 'GB', 'TB', 'PB'], e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    }
    
	return {
		getUrlParam: getUrlParam,
		getDirectColor: getDirectColor,
		isDarkColor: isDarkColor,
        prettySize: prettySize
	};

}());