var fs = require('fs');
var PNG = require('pngjs').PNG;

function ImaJS() { }

module.exports = ImaJS;

/**
 * Converts an image to grayscale
 * @param {string} filename The name of the file to be read
 * @param {function} callback The callback
 */
ImaJS.prototype.grayscale = function(filename, callback) {
    if (filename) {
        getPixels(filename, function(err, pixels) {
            if (err) {
                callback(new Error("Error occurred while getting pixels", null));
            }
            var grayscaleArray = [];
            var nx = pixels[0].length;
            var ny = pixels.length;
            // TODO: 3 two arrays simultaneously: original, grayscale, edge
            for (var i = 0; i < nx; i++) {
                var grayscaleRow = [];
                for (var j = 0; j < ny; j++) {
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
        callback(new Error("Filename is null."), null);
    }
}

/**
 * Applies sobel filter to an image
 * @param {2d array} data The data
 * @param {function} callback The callback
 */
ImaJS.prototype.sobel = function(image) {
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
    var sobelArray = [];
    for (var x = 1; x < image.length-1; x++) {
        var sobelRow = [];
        for (var y = 1; y < image[0].length-1; y++) {
            var g = calculateGradients(image, x, y, kernelX, kernelY);
            sobelRow.push(g);
        }
        sobelArray.push(sobelRow);
    }
    return sobelArray;
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
	var gx = (kernelX[2][2] * image[x-1][y-1]) + (kernelX[2][1] * image[x-1][y]) + (kernelX[2][0] * image[x-1][y+1]) +
             (kernelX[1][2] * image[x][y-1]) + (kernelX[1][1] * image[x][y]) + (kernelX[1][0] * image[x][y+1]) +
             (kernelX[0][2] * image[x+1][y-1]) + (kernelX[0][1] * image[x+1][y]) + (kernelX[0][0] * image[x+1][y+1]);
    var gy = (kernelY[2][2] * image[x-1][y-1]) + (kernelY[2][1] * image[x-1][y]) + (kernelY[2][0] * image[x-1][y+1]) +
             (kernelY[1][2] * image[x][y-1]) + (kernelY[1][1] * image[x][y]) + (kernelY[1][0] * image[x][y+1]) +
             (kernelY[0][2] * image[x+1][y-1]) + (kernelY[0][1] * image[x+1][y]) + (kernelY[0][0] * image[x+1][y+1]);
    var g = Math.round(Math.sqrt((gx * gx) + (gy * gy)));
    if (g > 255) {
        return 255;
    }
    return g;
}

/**
 * Writes an image file to disk
 * @param {string} newFileame The filename 
 * @param {2d array} data The pixel data 
 * @param {function} callback The callback 
 */
ImaJS.prototype.writeFileSync = function(newFilename, data) {
    var buffer = []
    for (i = 0; i < data[0].length; i++) {
        for (j = 0; j < data.length; j++) {
            buffer.push(Math.round(data[i][j]));
        }
    }
    var image = new PNG({width: data[0].length, height: data.length});
    image.data = buffer;
    var dataToWrite = PNG.sync.write(image, {inputColorType: 0});
    fs.writeFileSync(newFilename, dataToWrite)
}

/**
 * Gets the pixels in a 2D array of RGBA values
 * @param {string} fileName The filename
 * @param {function} callback The callback function 
 */
function getPixels(fileName, callback) {
    var data = fs.readFileSync(fileName);
    var png = new PNG();
    png.parse(data, function(err, img_data) {
        if (err) throw err;
        origArray = new Uint8Array(img_data.data);
        rgbaArray = [];
        row = [];
        for (i = 0; i < (png.width * png.height * 4); i+=4) {
            row.push([origArray[i], origArray[i+1], origArray[i+2], origArray[i+3]]);
            if (row.length == png.width) {
                rgbaArray.push(row);
                row = [];
            }
        }
        callback(null, rgbaArray)
    });
}

// TODO: functionality for JPEG
// TODO: 