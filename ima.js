var fs = require('fs');
var getPixels = require('get-pixels');

function convertToBlackAndWhite(rgbaArray)
{

}

/**
 * Reads an image into the RGB pixel format
 * @param {the name of the file} fileName 
 */
function readImage(fileName, callback)
{
    getPixels(fileName, function(err, pixels)
    {
        var rgbaArray = [];
        if (err)
        {
            console.log("Bad image path");
            return;
        }
        var nx = pixels.shape[0];
        var ny = pixels.shape[1];
        for (var i = 0; i < nx; i++)
        {
            for (var j = 0; j < ny; j++)
            {
                rgbaArray.push({r: pixels.get(i, j, 0), g: pixels.get(i, j, 1), b: pixels.get(i, j, 2), a: pixels.get(i, j, 3)});
            }
        }
        callback(null, rgbaArray);
    });
}

function main()
{
    readImage("test_images/test-image.png", function(err, data)
    {
        if (err) throw err;
        console.log(data);
    });
}

main();