var fs = require('fs');
var getPixels = require('get-pixels');

function readImage(fileName)
{
    getPixels(fileName, function(err, pixels)
    {
        if (err)
        {
            console.log("Bad image path");
            return;
        }
        console.log("Got pixels", pixels.shape.slice());
        console.log(pixels);
    });    
}

function main()
{
    readImage("test_images/test-image.png");
}

main();