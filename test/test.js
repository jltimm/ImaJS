var ImaJS = require('../ima.js');

function runTest() {
	var ima = new ImaJS();
  	ima.grayscale('./test_images/test-image.png', function(err, pixelArray) {
    	if (err) throw err;
		var scharr = ima.scharr(pixelArray);
    	ima.writeFileSync('testout.png', scharr);
  	});
}

runTest();