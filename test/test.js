var ImaJS = require('../ima.js');

function runTest() {
	var ima = new ImaJS();
	ima.sobel('./test_images/test-image3.bmp', (err, pixelArray) => {
		if (err) throw err;
		ima.writeFile('testout.jpg', pixelArray, (err) => {
			if (err) throw err;
		});
	});
}

runTest();