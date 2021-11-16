/*global importScripts, onmessage, FileReaderSync, postMessage, BufCRC32 */

importScripts('/js/reuse/bufcrc32.js');

onmessage = function (e) {
    "use strict";
    
	// Declare and init the variables
	var file, reader, sliceSize, start, stop, crc;
	sliceSize = 25 * 1024 * 1024;
	start = 0;
	crc = 0;
    
    try {
        file = e.data;
        reader = new FileReaderSync();
        
        // Read the file in slices of 50MB
        postMessage({ key: "size", value: file.size });
		var slice = file.slice || file.webkitSlice || file.mozSlice;
        do {
            // Read the file slice synchronously into an ArrayBuffer
            stop = Math.min(start + sliceSize, file.size);
			
            var fileSlice = slice.call(file, start, stop);
            var buffer = reader.readAsArrayBuffer(fileSlice);
            
            // Update the CRC with the CRC of the ArrayBuffer
            crc = BufCRC32.getArrayBufferCRC(buffer, crc);
            
            // Move to the beginning of the next file slice
            start += sliceSize;
            
            postMessage({ key: "progress", value: start });
        } while (start < file.size);
    
        postMessage({ key: "crc", value: crc });
        
    } catch (err) {
        postMessage({ key: "error", value: err.message });
    }
};


