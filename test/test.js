var ImaJS = require('../ima.js');

function runTest() {
	var ima = new ImaJS();
	ima.sobel('./test_images/test-image.png', (err, pixelArray) => {
		if (err) throw err;
		ima.writeFileSync('testout.png', pixelArray);
	});
}

runTest();