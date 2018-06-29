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
                for (var j = 0; j < ny; j++)
                {
                    bwArray.push(
                    {
                        r: pixels.get(i, j, 0) * 0.299,
                        g: pixels.get(i, j, 1) * 0.587,
                        b: pixels.get(i, j, 2) * 0.114,
                        a: pixels.get(i, j, 3)
                    });
                }
            }

            callback(null, bwArray);
        });
    } else
    {
        callback(new Error("Filename is null."), null);
    }
}

function main()
{
    convertToSepia("test_images/test-image.png", function(err, data)
    {
        if (err) throw err;
        console.log(data);
    });
}

main();