var fs = require('fs');
var PNG = require('pngjs').PNG;

function ImaJS() {
    
}

module.exports = ImaJS;

/**
 * Converts an image to black and white and returns an RGBA array
 * @param {string} fileName The name of the file to be read
 * @param {function} callback The callback
 */
ImaJS.prototype.convertToBlackAndWhite = function(filename, callback) {
    if (filename) {
        getPixels(filename, function(err, pixels) {
            if (err) {
                callback(new Error("Error occurred while getting pixels", null));
            }
            var bwArray = [];
            var nx = pixels[0].length;
            var ny = pixels.length;
            for (var i = 0; i < nx; i++) {
                bwRow = [];
                for (var j = 0; j < ny; j++) {
                    bwRow.push({
                        r: pixels[i][j][0] * 0.299,
                        g: pixels[i][j][1] * 0.587,
                        b: pixels[i][j][2] * 0.114,
                        a: pixels[i][j][3]
                    });
                }
                bwArray.push(bwRow);
            }
            callback(null, bwArray);
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
    buffer = []
    for (i = 0; i < data[0].length; i++) {
        for (j = 0; j < data.length; j++) {
            buffer.push(Math.round(data[i][j].r));
            buffer.push(Math.round(data[i][j].g));
            buffer.push(Math.round(data[i][j].b));
            buffer.push(Math.round(data[i][j].a));
        }
    }
    var image = new PNG({width: data[0].length, height: data.length});
    image.data = Buffer.from(buffer);
    var dataToWrite = PNG.sync.write(image);
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