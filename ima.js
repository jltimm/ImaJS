var fs = require('fs');
var path = require('path');
var PNG = require('pngjs').PNG;

/**
 * Converts an image to sepia and returns an RGBA array
 * @param {string} fileName The name of the file to be read
 * @param {function} callback The callback
 */
function convertToSepia(fileName, callback)
{
    if (fileName)
    {
        getPixels(fileName, function(err, pixels)
        {
            if (err)
            {
                callback(new Error("Error occurred while getting pixels", null));
            }

            var sepiaArray = [];
            var nx = pixels[0].length;
            var ny = pixels.length;

            for (var i = 0; i < nx; i++)
            {
                sepiaRow = [];
                for (var j = 0; j < ny; j++)
                {
                    var r = (pixels[i][j][0] * .393) + (pixels[i][j][1] * .769) + (pixels[i][j][2] * .189);
                    var g = (pixels[i][j][0] * .349) + (pixels[i][j][1] * .686) + (pixels[i][j][2] * .168);
                    var b = (pixels[i][j][0] * .272) + (pixels[i][j][1] * .534) + (pixels[i][j][2] * .131);
                    sepiaRow.push(
                    {
                        r: (r > 255 ? 255 : r),
                        g: (g > 255 ? 255 : g),
                        b: (b > 255 ? 255 : b),
                        a: pixels[i][j][3]
                    });
                }
                sepiaArray.push(sepiaRow);
            }

            callback(null, sepiaArray);
        });
    } else
    {
        callback(new Error("Filename is null"));
    }
}

/**
 * Converts an image to black and white and returns an RGBA array
 * @param {string} fileName The name of the file to be read
 * @param {function} callback The callback
 */
function convertToBlackAndWhite(fileName, callback)
{
    if (fileName)
    {
        getPixels(fileName, function(err, pixels)
        {
            if (err)
            {
                callback(new Error("Error occurred while getting pixels", null));
            }

            var bwArray = [];
            var nx = pixels[0].length;
            var ny = pixels.length;

            for (var i = 0; i < nx; i++)
            {
                bwRow = [];
                for (var j = 0; j < ny; j++)
                {
                    bwRow.push(
                    {
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
    } else
    {
        callback(new Error("Filename is null."), null);
    }
}

/**
 * Gets the pixels in a 2D array of RGBA values
 * @param {string} fileName The filename
 * @param {function} callback The callback function 
 */
function getPixels(fileName, callback)
{
    var data = fs.readFileSync('test_images/test-image.png');
    var png = new PNG();
    png.parse(data, function(err, img_data)
    {
        origArray = new Uint8Array(img_data.data);
        rgbaArray = [];
        row = [];
        for (i = 0; i < (png.width * png.height * 4); i+=4)
        {
            row.push([origArray[i], origArray[i+1], origArray[i+2], origArray[i+3]]);
            if (row.length == png.width)
            {
                rgbaArray.push(row);
                row = [];
            }
        }
        callback(null, rgbaArray)
    });
}

/**
 * Writes an image file to disk
 * @param {string} fileName The filename 
 * @param {2d array} data The pixel data 
 * @param {function} callback The callback 
 */
function writeToFile(fileName, newFileName, data, callback)
{
    buffer = []
    for (i = 0; i < data[0].length; i++)
    {
        for (j = 0; j < data.length; j++)
        {
            buffer.push(Math.round(data[i][j].r));
            buffer.push(Math.round(data[i][j].g));
            buffer.push(Math.round(data[i][j].b));
            buffer.push(Math.round(data[i][j].a));
        }
    }
    var image = new PNG({width: data[0].length, height: data.length});
    image.data = Buffer.from(buffer);
    var dataToWrite = PNG.sync.write(image);
    fs.writeFileSync(newFileName, dataToWrite)
}

function main()
{
    convertToSepia("test_images/test-image.png", function(err, data)
    {
        if (err) throw err;
        writeToFile("test.png", "testout.png", data, function(err)
        {
            if (err) throw err;
        });
    });
}

main();