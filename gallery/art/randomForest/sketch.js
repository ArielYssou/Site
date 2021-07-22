var leafShape(len, width, center, decay_pos

function Leaf(p, detail, len, clr1, clr2, edge_clr) {
	this.detail = detail;
	this.len = len;
	this.clr1 = clr1;
	this.clr2 = clr2;
	this.edge_clr = edge_clr;


	this.main_branch = new Array();
	this.upper_branch = new Array();
	this.lower_branch = new Array();

	var pos_x = 0;
	var pos_y = 0;
	var yoff =  0;
	var dx = this.len / this.detal; 
	for (var i = 0; i <= this.detail; i += 1) {
		this.main_branch.push(p.createVector(posx, posy + p.noise(yoff)))
		yoff += 0.03;
		posx += dx;
	}

	this.draw = function(p) {

	}
}

var s = function( p ) { // p could be any variable name

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(800, 400);
  };

	p.draw = function() {
		//p.background(55);
		let elements = 50

		for (var i = 0; i < elements; i += 1) {
			let prob_leaf = 0.7;
			let autum_prob = 0.5;

			var elem_pos = p.createVector(p.random(0, p.width), p.random(0, p.height))

			p.push()
			prob = p.random()
			if (p < prob_leaf) {
			}

			p.pop()
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
