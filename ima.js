var fs   = require('fs');
var PNG  = require('pngjs').PNG;
var jpeg = require('jpeg-js');

function ImaJS() { }

module.exports = ImaJS;

/**
 * Applies sobel filter to an image
 * @param {2d array} data The data
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
    grayscale(filename, (err, pixelArray) => {
        if (err) throw err;
        var edgeImage = edgeDetection(pixelArray, kernelX, kernelY);
        callback(null, edgeImage);
    });
}

/**
 * Applies prewitt filter to an image
 * @param {2d array} data The data
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
    grayscale(filename, (err, pixelArray) => {
        if (err) throw err;
        var edgeImage = edgeDetection(pixelArray, kernelX, kernelY);
        callback(null, edgeImage);
    });
}

/**
 * Applies Scharr filter to an image
 * @param {2d array} data The data
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
    grayscale(filename, (err, pixelArray) => {
        if (err) throw err;
        var edgeImage = edgeDetection(pixelArray, kernelX, kernelY);
        callback(null, edgeImage);
    });
    //return edgeDetection(image, kernelX, kernelY);
}

ImaJS.prototype.custom = function(filename, kernelX, kernelY, callback) {
    // TODO
}

/**
 * Writes an image file to disk
 * @param {string} newFilename The filename 
 * @param {2d array} data The pixel data 
 * @param {function} callback The callback 
 */
ImaJS.prototype.writeFile = function(newFilename, data, callback) {
    var buffer = []
    for (i = 0; i < data.length; i++) {
        for (j = 0; j < data[0].length; j++) {
            buffer.push(Math.round(data[i][j]));
        }
    }
    var extension = getFileExtension(newFilename);
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
    } else if (extension === 'jpg' || extension === 'jpeg') {
        var rawImageData = {
            data: buffer,
            width: data.length,
            height: data[0].length
        };
        var jpegImageData = jpeg.encode(rawImageData, 100);
        if (callback) {
            fs.writeFile(newFilename, jpegImageData.data, (err) => {
                if (err) throw err;
                callback(null);
            });
        } else {
            fs.writeFileSync(newFilename, jpegImageData);
        }
    }
}

/**
 * Converts an image to grayscale
 * @param {string} filename The name of the file to be read
 * @param {function} callback The callback
 */
function grayscale(filename, callback) {
    if (filename) {
        getPixels(filename, function(err, pixels) {
            if (err) {
                callback(new Error("Error occurred while getting pixels", null));
            }
            var grayscaleArray = [];
            var nx = pixels[0].length;
            var ny = pixels.length;
            for (var i = -1; i < ny + 1; i++) {
                var grayscaleRow = [];
                for (var j = -1; j < nx + 1; j++) {
                    if (i == -1 || i == ny || j == -1 || j == nx) {
                        grayscaleRow.push(0);
                    } else {
                        grayscaleRow.push(
                            pixels[i][j][0] * 0.2126 + 
                            pixels[i][j][1] * 0.7152 +
                            pixels[i][j][2] * 0.0722
                        );
                    }
                }
                grayscaleArray.push(grayscaleRow);
            }
            callback(null, grayscaleArray);
        });
    } else {
        callback(new Error("Filename is null."), null);
    }
}

/**
 * Performs the edge detection on the image
 * @param {2d array} image The image pixels
 * @param {2d array} kernelX The X kernel 
 * @param {2d array} kernelY The Y kernel
 */
function edgeDetection(image, kernelX, kernelY) {
    var edgeArray = [];
    for (var x = 1; x < image.length - 1; x++) {
        var edgeRow = [];
        for (var y = 1; y < image[0].length - 1; y++) {
            var g = calculateGradients(image, x, y, kernelX, kernelY);
            edgeRow.push(g);
        }
        edgeArray.push(edgeRow);
    }
    return edgeArray;
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
    // TODO: switch to async
    var data = fs.readFileSync(filename);
    var extension = getFileExtension(filename);
    if (extension === 'png') {
        var png = new PNG();
        png.parse(data, function(err, img_data) {
            if (err) throw err;
            origArray = new Uint8Array(img_data.data);
            rgbaArray = getRGBAArray(origArray, png.width, png.height);
            callback(null, rgbaArray)
        });
    } else if (extension === 'jpg' || extension === 'jpeg') {
        var jpg = jpeg.decode(data, true);
        rgbaArray = getRGBAArray(jpg.data, jpg.width, jpg.height);
        callback(null, rgbaArray);
    } else {
        callback(new Error('ImaJS does not support this image format.'));
    }
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

// TODO: custom kernels
// TODO: move padding out of grayscale
// TODO: GIF support
// TODO: TIFF support