var fs = require('fs');
var getPixels = require('get-pixels');

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
            var nx = pixels.shape[0];
            var ny = pixels.shape[1];

            for (var i = 0; i < nx; i++)
            {
                sepiaRow = [];
                for (var j = 0; j < ny; j++)
                {
                    var rOrig = pixels.get(i, j, 0);
                    var gOrig = pixels.get(i, j, 1);
                    var bOrig = pixels.get(i, j, 2);
                    sepiaRow.push(
                    {
                        r: (rOrig * .393) + (gOrig * .769) + (bOrig * .189),
                        g: (rOrig * .349) + (gOrig * .686) + (bOrig * .168),
                        b: (rOrig * .272) + (gOrig * .534) + (bOrig * .131),
                        a: pixels.get(i, j, 3)
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
            var nx = pixels.shape[0];
            var ny = pixels.shape[1];

            for (var i = 0; i < nx; i++)
            {
                bwRow = [];
                for (var j = 0; j < ny; j++)
                {
                    bwRow.push(
                    {
                        r: pixels.get(i, j, 0) * 0.299,
                        g: pixels.get(i, j, 1) * 0.587,
                        b: pixels.get(i, j, 2) * 0.114,
                        a: pixels.get(i, j, 3)
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

function convertArrayToBuffer(array)
{
    console.log(array[0].length);
}

function main()
{
    convertToSepia("test_images/test-image.png", function(err, data)
    {
        if (err) throw err;
        convertArrayToBuffer(data);
        //console.log(data);
    });

    fs.readFile("test_images/test-image.png", function(err, data)
    {
        if (err) throw err;
        console.log(data.length);
    });
}

main();