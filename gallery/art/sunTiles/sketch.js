function Tile(p, x, y, radius) {
	this.pos = p.createVector(x,y);
	this.radius = radius;

	// Choose a orientation: ne: north-east, nw:...
	this.orientation = p.random(['ne', 'nw', 'sw', 'se']);
	this.background = 55;
	this.circles = p.random([1, 2, 3]);

	this.radii = []
	for (var i = 0; i < this.circles; i += 1) {
		this.radii.push(p.random(0.3 * this.radius, 0.9 * this.radius));
	}
	this.radii[0] = this.radius; // Main circle should have same radius

	this.colors = p.shuffle(['#F39237', '#39A9DB', '#FDFBF0','#FFDA35'])
	this.show = function() {
		p.push();
		p.noStroke()
		p.translate(this.pos.x, this.pos.y);

		if (this.orientation == 'ne') {
			p.translate(0, this.radius);
			p.rotate(-p.HALF_PI);
		} else if (this.orientation == 'nw') {
			p.translate(this.radius, this.radius);
			p.rotate(-p.PI);
		} else if (this.orientation == 'sw') {
			p.translate(this.radius, 0);
			p.rotate(p.HALF_PI);
		}
		else {
			// pass: default orientation
		}

		//p.fill(this.background);
		p.noFill();
		p.rect(0, 0, this.radius, this.radius);

		for (var i = 0; i < this.circles; i += 1) {
			p.fill(this.colors[i])
			p.arc(0, 0, 2 * this.radii[i], 2 * this.radii[i], 0, p.HALF_PI)
		}
		p.pop()
	}

}

var s = function( p ) { // p could be any variable name
	var tiles = [];
	var scl = 20;

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(800, 400);
		let size = p.width / scl;

		for (var i = 0; i < scl; i += 1) {
			for (var j = 0; j < scl; j += 1) {
				tiles.push(new Tile(p, i * size, j * size, size));
			};
		};
  };

	p.draw = function() {
		//p.background(55);
		for (var i = 0; i < tiles.length; i += 1) {
			tiles[i].show();
		}
		p.noLoop()
  };

	p.windowResized = function() {
		mwidth = document.getElementById("c1").offsetWidth;
		/*mheight = document.getElementById("c1").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);

		// Don't forget to resize all positions as well
		x = mwidth / 2;
	};
};
var myp51 = new p5(s, 'c1');
