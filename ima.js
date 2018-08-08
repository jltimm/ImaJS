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