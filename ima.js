var fs   = require('fs');
var PNG  = require('pngjs').PNG;
var jpeg = require('jpeg-js');
var bmp = require('bmp-js');

function ImaJS() { }

module.exports = ImaJS;

/**
 * Applies sobel filter to an image
 * @param {string} filename The filename
 * @param {function} callback The callback
 */
ImaJS.prototype.sobel = function(filename, callback) {
    var kernelX = [
        [1, 0, -1],
        [2, 0, -2],
        [1, 0, -1]
    ];
    var kernelY = [
        [ 1,  2,  1],
        [ 0,  0,  0],
        [-1, -2, -1]
    ];
    getEdgeImage(filename, kernelX, kernelY, (err, edgeImage) => {
        if (err) throw err;
        callback(null, edgeImage);
    });
}

/**
 * Applies prewitt filter to an image
 * @param {string} filename The filename
 * @param {function} callback The callback
 */
ImaJS.prototype.prewitt = function(filename, callback) {
    var kernelX = [
        [-1, 0, 1],
        [-1, 0, 1],
		[-1, 0, 1],
    ];
    var kernelY = [
        [-1, -1, -1],
		[ 0,  0,  0],
		[ 1,  1,  1],
    ];
    getEdgeImage(filename, kernelX, kernelY, (err, edgeImage) => {
        if (err) throw err;
        callback(null, edgeImage);
    });
}

/**
 * Applies Scharr filter to an image
 * @param {string} filename The filename
 * @param {function} callback The callback
 */
ImaJS.prototype.scharr = function(filename, callback) {
    var kernelX = [
        [ -3, 0,  3],
		[-10, 0, 10],
		[ -3, 0,  3],
    ];
    var kernelY = [
        [-3, -10, -3],
		[ 0,   0,  0],
		[ 3,  10,  3],
    ];
    getEdgeImage(filename, kernelX, kernelY, (err, edgeImage) => {
        if (err) throw err;
        callback(null, edgeImage);
    });
}

/**
 * Applies roberts cross to an image
 * @param {string} filename The filename
 * @param {function} callback The callback
 */
ImaJS.prototype.roberts = function(filename, callback) {
    var kernelX = [
        [1,  0],
        [0, -1]
    ];
    var kernelY = [
        [ 0, 1],
        [-1, 0]
    ];
    getEdgeImage(filename, kernelX, kernelY, (err, edgeImage) => {
        if (err) throw err;
        callback(null, edgeImage);
    });
}

/**
 * Applies a custom filter to an image
 * @param {string} filename The filename 
 * @param {2d array} kernelX The X kernel 
 * @param {2d array} kernelY The Y kernel
 * @param {function} callback The callback
 */
ImaJS.prototype.custom = function(filename, kernelX, kernelY, callback) {
    if (kernelX.length === kernelX[0].length
     && kernelY.length === kernelY[0].length
     && kernelX.length === kernelY[0].length
     && kernelX.length !== 3) {
        getEdgeImage(filename, kernelX, kernelY, (err, edgeImage) => {
            if (err) throw err;
            callback(null, edgeImage);
        });
     } else {
         // TODO: make these more clear.
        callback(new Error('There are problems with your input kernels. Kernels must be 3x3.'), null);
     }
}

/**
 * Writes an image file to disk
 * @param {string} newFilename The filename 
 * @param {2d array} data The pixel data 
 * @param {function} callback The callback 
 */
ImaJS.prototype.writeFile = function(newFilename, data, callback) {
    var extension = getFileExtension(newFilename);
    var isJpeg = (extension === 'jpeg' || extension === 'jpg');
    var isBmp = (extension === 'bmp');
    var buffer = getBuffer(data, isJpeg, isBmp);
    if (extension === 'png') {
        var image = new PNG({width: data[0].length, height: data.length});
        image.data = buffer;
        var dataToWrite = PNG.sync.write(image, {inputColorType: 0});
        if (callback) {
            fs.writeFile(newFilename, dataToWrite, (err) => {
                if (err) throw err;
                callback(null);
            });
        } else {
            fs.writeFileSync(newFilename, dataToWrite);
        }
    } else if (isJpeg) {
        var rawImageData = {
            data: buffer,
            width: data[0].length,
            height: data.length
        };
        var jpegImageData = jpeg.encode(rawImageData, 100);
        if (callback) {
            fs.writeFile(newFilename, jpegImageData.data, (err) => {
                if (err) throw err;
                callback(null);
            });
        } else {
            fs.writeFileSync(newFilename, jpegImageData.data);
        }
    } else if (isBmp) {
        var rawImageData = {
            data: buffer,
            width: data[0].length,
            height: data.length
        };
        var rawData = bmp.encode(rawImageData);
        if (callback) {
            fs.writeFile(newFilename, rawData.data, (err) => {
                if (err) throw err;
                callback(null);
            })
        } else {
            fs.writeFileSync(newFilename, rawData.data);
        }
    }
}

/**
 * 
 * @param {2d array} data The pixel data
 * @param {boolean} isJpeg True if writing to jpeg
 * @param {boolean} isBmp True if writing to bmp
 */
function getBuffer(data, isJpeg, isBmp) {
    var buffer = [];
    for (i = 0; i < data.length; i++) {
        for (j = 0; j < data[0].length; j++) {
            buffer.push(Math.round(data[i][j]));
            // pad buffer with 3 extra pixels to accomodate for JPEG
            if (isJpeg || isBmp) {
                for (k = 0; k <= 2; k++) {
                    if (k === 2 && !isBmp) {
                        buffer.push(255);
                    } else {
                        buffer.push(Math.round(data[i][j]));
                    }
                }
            }
        }
    }
    return buffer;
}

/**
 * Converts an image to grayscale
 * @param {string} filename The name of the file to be read
 * @param {function} callback The callback
 */
function grayscale(filename, callback) {
    if (filename) {
        getPixels(filename, (err, pixels) => {
            if (err) {
                callback(new Error('Error occurred while getting pixels', null));
            }
            var grayscaleArray = [];
            var nx = pixels[0].length;
            var ny = pixels.length;
            for (var i = 0; i < ny; i++) {
                var grayscaleRow = [];
                for (var j = 0; j < nx; j++) {
                    grayscaleRow.push(
                        pixels[i][j][0] * 0.2126 + 
                        pixels[i][j][1] * 0.7152 +
                        pixels[i][j][2] * 0.0722
                    );
                }
                grayscaleArray.push(grayscaleRow);
            }
            callback(null, grayscaleArray);
        });
    } else {
        callback(new Error('Filename is null.'), null);
    }
}

/**
 * Gets grayscale of an image, then calls edge detection function.
 * 
 * @param {string} filename The filename
 * @param {2D array} kernelX The X kernel
 * @param {2D array} kernelY The Y kernel
 * @param {function} callback The callback function
 */
function getEdgeImage(filename, kernelX, kernelY, callback) {
    grayscale(filename, (err, pixelArray) => {
        if (err) throw err;
        var edgeImage = edgeDetection(pixelArray, kernelX, kernelY);
        callback(null, edgeImage);
    });
}

/**
 * Performs the edge detection on the image
 * @param {2d array} image The image pixels
 * @param {2d array} kernelX The X kernel 
 * @param {2d array} kernelY The Y kernel
 */
function edgeDetection(image, kernelX, kernelY) {
    var copiedImage = JSON.parse(JSON.stringify(image));
    for (var x = 1; x < copiedImage.length - 1; x++) {
        for (var y = 1; y < copiedImage[0].length - 1; y++) {
            var g = calculateGradients(image, x, y, kernelX, kernelY);
            copiedImage[x][y] = g;
        }
    }
    return copiedImage;
}

/**
 * Calculates the gradients according to the kernels.
 * @param {2d array} image The array of pixels
 * @param {int} x The current x position
 * @param {int} y The current y position
 * @param {2d array} kernelX The x kernel
 * @param {2d array} kernelY The y kernel
 */
function calculateGradients(image, x, y, kernelX, kernelY) {
    var gx = 0.0;
    var gy = 0.0;
    for (var a = 0; a < kernelX.length; a++) {
        for (var b = 0; b < kernelY.length; b++) {
            var xn = x + a - 1;
            var yn = y + b - 1;
            gx += (kernelX[a][b] * image[xn][yn]);
            gy += (kernelY[a][b] * image[xn][yn]);
        }
    }
    var g = Math.round(Math.sqrt((gx * gx) + (gy * gy)));
    if (g > 255) {
        return 255;
    }
    return g;
}

/**
 * Returns the extension of the file.
 * @param {string} filename 
 */
function getFileExtension(filename) {
    return filename.toLowerCase().split('.').pop();
}

/**
 * Gets the pixels in a 2D array of RGBA values
 * @param {string} filename The filename
 * @param {function} callback The callback function 
 */
function getPixels(filename, callback) {
    fs.readFile(filename, (err, data) => {
        if (err) throw err;
        var extension = getFileExtension(filename);
        if (extension === 'png') {
            var png = new PNG();
            png.parse(data, (err, img_data) => {
                if (err) throw err;
                var origArray = new Uint8Array(img_data.data);
                var rgbaArray = getRGBAArray(origArray, png.width, png.height);
                callback(null, rgbaArray)
            });
        } else if (extension === 'jpg' || extension === 'jpeg') {
            var jpg = jpeg.decode(data, true);
            var rgbaArray = getRGBAArray(jpg.data, jpg.width, jpg.height);
            callback(null, rgbaArray);
        } else if (extension === 'bmp') {
            var bmpData = bmp.decode(data);
            var origArray = new Uint8Array(bmpData.data);
            var rgbaArray = getRGBAArray(origArray, bmpData.width, bmpData.height);
            callback(null, rgbaArray);
        } else {
            callback(new Error('ImaJS does not support this image format.'));
        }
    });
}

/**
 * Returns 2D RGBA array from uint8 array of pixels
 * @param {array} image The array of pixels
 * @param {int} width The width of the image
 * @param {int} height The height of the image
 */
function getRGBAArray(image, width, height) {
    var rgbaArray = [];
    var row = [];
    for (i = 0; i < (width * height * 4); i += 4) {
        row.push([image[i], image[i+1], image[i+2], image[i+3]]);
        if (row.length == width) {
            rgbaArray.push(row);
            row = [];
        }
    }
    return rgbaArray;
}

// TODO: GIF support
// TODO: TIFF support