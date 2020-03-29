function setup() {
	myWidth = document.getElementById("NAME_TAG").offsetWidth;
	myHeight = document.getElementById("NAME_TAG").offsetHeight;
	let canvas = createCanvas(myWidth, myHeight);
	canvas.parent('NAME_TAG');
};

function draw() {
	background(0);
	fill(255);
	rect(width/2, height/2, 0.1 * width, 0.1 * height);
};

function windowResized() {
	myWidth = document.getElementById("NAME_TAG").offsetWidth
	myHeight = document.getElementById("NAME_TAG").offsetHeight
	resizeCanvas(myWidth, myHeight);
};
