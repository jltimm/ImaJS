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
        getPixels(fileName, function(err, img, pixels)
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
                    var rOrig = pixels[i][j][0];
                    var gOrig = pixels[i][j][1];
                    var bOrig = pixels[i][j][2];
                    sepiaRow.push(
                    {
                        r: (rOrig * .393) + (gOrig * .769) + (bOrig * .189),
                        g: (rOrig * .349) + (gOrig * .686) + (bOrig * .168),
                        b: (rOrig * .272) + (gOrig * .534) + (bOrig * .131),
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
        getPixels(fileName, function(err, img, pixels)
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
        rgbaArray = []
        row = []
        for (i = 0; i < (png.width * png.height * 4); i+=4)
        {
            rgba = [origArray[i], origArray[i+1], origArray[i+2], origArray[i+3]]
            row.push(rgba)
            if (row.length == png.width)
            {
                rgbaArray.push(row)
                row = []
            }
        }
        callback(null, png, rgbaArray)
    });
}

function main()
{
    convertToBlackAndWhite("test_images/test-image.png", function(err, data)
    {
        if (err) throw err;
        console.log(data);
    });
}

main();