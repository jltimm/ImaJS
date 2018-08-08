var ImaJS = require('../ima.js');

function runTest() {
  var ima = new ImaJS();
  ima.grayscale('./test_images/test-image.png', function(err, pixelArray) {
    if (err) throw err;
    ima.writeFileSync('testout.png', pixelArray);
  });
}

runTest();