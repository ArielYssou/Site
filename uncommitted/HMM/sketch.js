function arrowTip(p, arrowSize, tip = 'simple') {
	if(tip == 'triangle') {
		p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
	} else if(tip == 'simple') {
		p.line(0, arrowSize / 2, arrowSize, 0);
		p.line(0, -arrowSize / 2, arrowSize, 0);
	} else if(tip == 'fancy') {
		p.beginShape();
		p.vertex(0, arrowSize / 2);
		p.quadraticVertex(arrowSize / 4, 0, arrowSize, 0);
		p.vertex(arrowSize, 0);
		p.endShape();

		p.beginShape();
		p.vertex(0, -arrowSize / 2);
		p.quadraticVertex(arrowSize / 4, 0, arrowSize, 0);
		p.vertex(arrowSize, 0);
		p.endShape();
	}
	else {
		// No tip
	}
}

function drawArrow(p, base, vec, clr = '#ffeabc', tip = 'simple') {
	vec = vec.copy().sub(base).copy();
  p.push();
  p.stroke(clr);
  p.strokeWeight(1.3);
	p.strokeCap(p.ROUND);
  p.fill(clr);
  p.translate(base.x, base.y);
  p.line(0, 0, vec.x, vec.y);
  p.rotate(vec.heading());

  let arrowSize = 7;
	p.translate(vec.mag() - arrowSize, 0);
	arrowTip(p, arrowSize, tip);

  p.pop();
}

function pathArrow(p, coords, clr = '#ffeabc', tip = 'simple') {
	let points = [];
	for(var i = 0; i < coords.length; i += 2) {
		points.push( p.createVector(coords[i], coords[i + 1]) );
	}

	p.push();
	p.stroke(clr);
	p.strokeWeight(3);
	p.strokeCap(p.ROUND);
	p.fill(clr);

	for(var i = 0; i < points.length - 1; i += 1) {
		p.push()

		let base = points[i].copy();
		let vec = points[i+1].copy().sub(base).copy();

		p.translate(base.x, base.y);
		p.line(
			0, 0,
			vec.x, vec.y
		);
		p.pop();
	}

	let end = points.length - 1;
	base = points[end - 1].copy();
	vec = points[end].copy().sub(base).copy();
	p.translate(base.x, base.y);
	p.line(
		0, 0,
		vec.x, vec.y
	);
	p.rotate(vec.heading());

  let arrowSize = 7;
	p.translate(vec.mag() - arrowSize, 0);
	arrowTip(p, arrowSize, tip);

	p.pop();
}

function curvedArrow(p, points, curvature = 20, clr = '#ffeabc', tip = 'fancy') {
	// Draws a arrow throught the list of given points with curved corners
	// INPUT:
	// 	p: P5.JS
	// 	points: p5.js.vector list
	
	let vertexes = [];
	for(var i = 0; i < points.length; i += 1) {
		if( (i - 1) >= 0 && (i + 1) < points.length ) { // top or head of arrow
			// Elbow start
			let delta = points[i].copy().sub(points[i-1])  
			let start = points[i-1].copy().add(delta.sub(delta.copy().setMag(curvature)));
			vertexes.push(
				{
					'point' : start,
					'type' : 'vertex'
				}
			);
			// Elbow control point
			vertexes.push(
				{
					'point' : points[i],
					'type' : 'anchor'
				}
			);
			// Elbow end
			vertexes.push(
				{
					'point' : points[i].copy().add(points[i + 1].copy().sub(points[i]).setMag(curvature)),
					'type' : 'vertex'
				}
			);
		} else {
			vertexes.push(
				{
					'point' : points[i],
					'type' : 'vertex'
				}
			);
		}
	}
	p.push();
	p.stroke(clr);
	p.strokeWeight(1.3);
	p.strokeCap(p.ROUND);
	p.noFill();

	p.beginShape()
	for(var i = 0; i < vertexes.length; i += 1) {
		if( vertexes[i].type == 'vertex' ) {
			p.vertex(vertexes[i].point.x, vertexes[i].point.y);
		} else if (vertexes[i].type == 'anchor') {
			p.quadraticVertex(
				vertexes[i].point.x, vertexes[i].point.y,
				vertexes[i+1].point.x, vertexes[i+1].point.y
			);
		}
	}
	p.endShape()
	p.fill(clr);

	let end = points.length - 1;
	base = points[end - 1].copy();
	vec = points[end].copy().sub(base).copy();
	p.translate(base.x, base.y);
	p.rotate(vec.heading());

  let arrowSize = 7;
	p.translate(vec.mag() - arrowSize, 0);
	arrowTip(p, arrowSize, tip);

	p.pop();
}

// ############################################################
function Ray(p, arc_pos, arc_length, arc_weight, clr) {
	this.arc_pos = arc_pos; # p5 vector
	this.arc_length = arc_length; # In radians
	this.arc_weight = arc_weight;
	this.clr = clr;

	this.mag = this.arc_pos.mag()
	this.orientation = this.pos.heading()

	this.show = function() {
		p.push();
		p.noFill();
		p.stroke(this.clr);
		p.strokeWeight(this.arc_weight);
		p.arc(this.pos.x, this.pos.y, this.mag, this.mag, this.orientation, this.orientation + this.arc_length);
		p.pop();
	}
}
function Sun(p, pos, radius, n_rays, ray_radius) {
	this.pos = pos;
	this.radius = radius;
	this.n_rays = n_rays;
	this.ray_radius = ray_radius;
	this.clr = "#ffffff"

	this.rays = new Array();
	for(var i = 0; i < n_rays; i += 1) {
		this.rays.push(
			new Ray(p,
				p.random(radius, ray_radius) * p.random2D(),
				p.random(0, p.TWO_PI / 3),
				clr)
		);
	}

	this.show = function() {
		p.push();

		for(var i = 0; i < this.rays.length; i += 1)
			this.rays[i].show();

		p.translate(this.pos.x, this.pos.y)
		p.fill(this.clr)
		p.stroke(this.clr)
		p.ellipse(0, 0, this.radius, this.radius);
		p.pop();
	}
}

var s = function( p ) { // p could be any variable name

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(400, 300);
  };

  p.draw = function() {
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
