function setup() {
	myWidth = document.getElementById("testPost").offsetWidth;
	myHeight = document.getElementById("testPost").offsetHeight;
	let canvas = createCanvas(myWidth, myHeight);
	canvas.parent('testPost');
};

function draw() {
	background(0);
	fill(255);
	rect(width/2, height/2, 0.1 * width, 0.1 * height);
};

function windowResized() {
	myWidth = document.getElementById("testPost").offsetWidth
	myHeight = document.getElementById("testPost").offsetHeight
	resizeCanvas(myWidth, myHeight);
};
