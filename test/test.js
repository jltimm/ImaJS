var ImaJS = require('../ima.js');

function runTest() {
	var ima = new ImaJS();
	ima.roberts('./test_images/test-image2.png', (err, pixelArray) => {
		if (err) throw err;
		ima.writeFile('testout.png', pixelArray, (err) => {
			if (err) throw err;
		});
	});
}

runTest();