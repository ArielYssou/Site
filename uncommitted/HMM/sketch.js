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
	this.arc_pos = arc_pos; // p5 vector
	this.arc_length = arc_length; // In radians
	this.arc_weight = arc_weight;
	this.clr = clr;

	this.mag = this.arc_pos.mag()
	this.orientation = this.arc_pos.heading()

	this.biased_show = function() {
		p.push();
		p.noFill();
		p.stroke(this.clr);
		p.strokeWeight(this.arc_weight);
		p.arc(0.7 * this.arc_pos.x, 0.7 * this.arc_pos.y, this.mag, this.mag, this.orientation, this.orientation + this.arc_length);
		p.pop();
	}

	this.show = function() {
		p.push();
		p.noFill();
		p.stroke(this.clr);
		p.strokeWeight(this.arc_weight);
		p.arc(0, 0, this.mag, this.mag, this.orientation, this.orientation + this.arc_length);
		p.pop();
	}
}

function Sun(p, pos, radius, n_rays, ray_radius) {
	this.pos = pos;
	this.radius = radius;
	this.n_rays = n_rays;
	this.ray_radius = ray_radius;
	this.clr = "#f9d71c"
	this.ray_clw_bttn = '#fcea88'
	this.ray_clw_top = '#dbbb06'

	this.rays = new Array();
	for(var i = 0; i < n_rays; i += 1) {

		this.rays.push(
			new Ray(p,
				p.constructor.Vector.random2D().mult(p.random(radius,ray_radius)),
				p.random(0, p.TWO_PI / 5),
				p.random(),
				p.lerpColor(p.color(252, 234, 136), p.color(219, 187, 6), p.random())
			)
		);
	}

	this.show = function() {
		p.push();
		p.translate(this.pos.x, this.pos.y)

		for(var i = 0; i < this.rays.length; i += 1)
			this.rays[i].show();

		p.fill(this.clr)
		p.stroke(this.clr)
		p.ellipse(0, 0, this.radius, this.radius);
		p.pop();
	}
}

function bellDistr(p, x, height, center, deviation) {
	let ans  = height * p.exp(- ( (x - center) ** 2) / (2 * deviation ** 2) )
	return ans;
}

function peakDistr(x, height, center) {
	return height / (x - center + 0.0001)
}

function Spike(p, len, spikes, opening, clr) {
	this.len = len;
	this.spikes = spikes;
	this.opening = opening;
	this.clr = clr

	this.weight = 2
	this.positions = [];
	this.sizes_left = [];
	this.sizes_right = [];
	this.weights = [];

	for(var i = 1; i < this.spikes + 1; i += 1) {
		var size = i * (this.len / this.spikes);
		this.positions.push( size );

		// In real snowflakes, the spikes in the middle are way larger than the others
		// so to replicate this we drawn froma distr. of 1/x centered in the middle
		// A constant 0.001 is added to avoid divergence
		this.sizes_left.push(
			bellDistr(p,
				size,
				this.len / 4,
				this.len / 3,
				this.len / 4
			) * p.random(0.4, 1))
		this.sizes_right.push(this.sizes_left[this.sizes_left.length - 1] + p.random()) // small unsymetries for charm

		// The weights are almost of the same saze until the end of the spike
		this.weights.push(p.min(6, this.len / size))
	}

	this.show = function() {
		p.push();
		p.stroke(this.clr);
		p.strokeWeight(this.weight)
		p.line(0, 0, this.len, 0)
		for(var i = 0; i <  this.spikes; i += 1) {
			p.push();
			console.log(this.positions[i], 0);
			p.translate(this.positions[i], 0);
			p.rotate(this.opening);
			p.strokeWeight(this.weights[i]);
			p.line(0, 0, this.sizes_left[i], 0);
			p.rotate( -2 * this.opening) // Correct rotation and go to right
			p.line(0, 0, this.sizes_right[i], 0);
			p.pop(); // No futher corrections needed as we pop the draw
		}
		p.pop();
	}

	this.pertubate = function() {
		for(var i = 0; i <  this.spikes; i += 1) {
			this.sizes_left[i] += p.random()
			this.sizes_right[i] += p.random()
		}
	}
}

function Snowflake(p, pos, len, max_spikes, opening, angular_offset, clr = '#E1E7E4') {
	this.pos = pos;
	this.len = len;
	this.max_spikes = max_spikes
	this.opening = opening;
	this.angular_offset = angular_offset;
	this.clr = clr;

	this.spikes = [];
	this.spikes.push(
		new Spike(
			p,
			this.len,
			p.random(5, this.max_spikes),
			this.opening, 
			this.clr
		)
	)

	this.show = function() {
		p.push();
		p.translate(this.pos)
		p.rotate(this.angular_offset);
		for(var i = 0; i < 6; i += 1){
			p.rotate(p.TWO_PI / 6)
			this.spikes[0].show()
		}
		p.pop();
	}
}

var s = function( p ) { // p could be any variable name
	var sun = new Sun(p, p.createVector(150, 150), 50, 150, 200);
	var snow = new Snowflake(
		p,
		p.createVector(400, 150),
		100,
		15,
		-p.PI / 3,
		p.random(0, p.TWO_PI),
		'#E1E7E4'
	);

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(600, 300);
  };

  p.draw = function() {
		sun.show();
		snow.show();
		p.noLoop();
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
