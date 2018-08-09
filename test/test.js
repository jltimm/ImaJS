var ImaJS = require('../ima.js');

function runTest() {
	var ima = new ImaJS();
  	ima.grayscale('./test_images/test-image.png', function(err, pixelArray) {
    	if (err) throw err;
		var sobel = ima.sobel(pixelArray);
		console.log(sobel);
    	ima.writeFileSync('testout.png', sobel);
  	});
}

runTest();