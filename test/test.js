var ImaJS = require('../ima.js');

function runTest() {
	var ima = new ImaJS();
	ima.sobel('./test_images/test-image1.jpg', (err, pixelArray) => {
		if (err) throw err;
		ima.writeFile('testout.png', pixelArray, (err) => {
			if (err) throw err;
		});
	});
}

runTest();