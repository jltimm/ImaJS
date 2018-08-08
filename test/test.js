var ImaJS = require('../ima.js');

function runTest() {
  var ima = new ImaJS();
  ima.convertToBlackAndWhite('./test_images/test-image.png', function(err, pixelArray) {
    if (err) throw err;
    console.log(pixelArray);
  });
}

runTest();