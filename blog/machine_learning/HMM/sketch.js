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

function arrow(p, base, vec, clr = '#ffeabc', tip = 'simple') {
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

function smoothArrow(p, points, curvature = 20, clr = '#ffeabc', tip = 'fancy') {
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

function arcArrow(p, center, radius, start_angle, final_angle, clr, tip = 'fancy') {
	p.push();
	p.noFill();
	p.stroke(clr);
	p.arc(
		center.x,
		center.y,
		radius,
		radius,
		start_angle,
		final_angle
	)

	let ending = p.fromAngle(final_angle)
	let arrowSize = 7;
	p.rotate(ending.heading());
	p.translate(radius, 0);
	p.rotate(-p.HALF_PI);
	arrowTip(p, arrowSize, tip);

	p.pop();
}

function curvedArrow(p, start, control, anchor, clr = '#ffeabc', tip = 'fancy') {
	p.push();
	p.stroke(clr);
	p.strokeWeight(2);
	p.noFill();
	p.beginShape();
	p.vertex(start.x, start.y);
	p.quadraticVertex(control.x, control.y, anchor.x, anchor.y);
	p.endShape();

	let ending = anchor.copy().sub(control)
	let arrowSize = 7;
	p.translate(anchor.x, anchor.y);
	p.rotate(ending.heading());
	arrowTip(p, arrowSize, tip);
	p.pop();
}

function bezierArrow(p, start, aux, control, anchor, clr = '#ffeabc', tip = 'fancy') {
	let arrowSize = 7;
	p.push();
	p.stroke(clr);
	p.strokeWeight(2);
	p.noFill();
	p.beginShape();
	p.vertex(start.x, start.y);
	p.bezierVertex(aux.x, aux.y, control.x, control.y, anchor.x, anchor.y);
	p.endShape();

	let ending = anchor.copy().sub(control)
	p.translate(anchor.x, anchor.y);
	p.rotate(ending.heading());
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

function Ring(p, inner_radius, outer_radius, clr, n_meshes, noise_amplitude, zoff) {
	this.inner_radius = inner_radius;
	this.outer_radius = outer_radius;
	this.clr = clr;
	this.zoff = zoff;
	this.noise_amplitude = noise_amplitude;

	this.dTheta = p.TWO_PI / n_meshes;
	this.noise_radius = outer_radius - inner_radius / 3

	this.points = []
	this.radii = []

	for(var theta = 0; theta < p.TWO_PI; theta += this.dTheta) {
		let xoff = p.map(p.cos(theta), -1, 1, 0, this.noise_amplitude)
		let yoff = p.map(p.sin(theta), -1, 1, 0, this.noise_amplitude)
		let r = p.map(
			p.noise(xoff, yoff, this.zoff),
			0, 1,
			this.outer_radius - this.noise_radius, this.outer_radius
		)

		this.radii.push( r );
		this.points.push(p.createVector(r * p.cos(theta), r * p.sin(theta)));
	}

	this.show = function() {
		p.push()
		p.stroke('#79271c')
		p.fill(this.clr)
		p.beginShape()
		for(var i = 0; i < this.points.length; i += 1) {
			p.vertex(this.points[i].x, this.points[i].y);
		}
		p.endShape(p.CLOSE);
		p.pop()
	}

	this.show_minimalist = function() {
		p.push()
		p.stroke('#79271c')
		p.fill(this.clr)
		p.circle(0,0, this.outer_radius)
		p.pop()

	}

	this.rescale = function(scl) {
		this.inner_radius *= scl;
		this.outer_radius *= scl;
		for(var i = 0; i < this.points.length; i += 1) {
			this.points[i].mult(scl);
		}
	}
}

function Tree(p, pos, max_radius = 150, sr = 7, mr = 14, lr = 28, br = 30) {
	this.pos = pos;
	this.max_radius = max_radius; // Max radius of tree

	this.rings = [];
	this.current_radius = 0;
	this.zoff = 0; // Noise offset
	this.z_inc = 0.02 // Noise increment

	this.codes = {
		0: 'small',
		1 : 'medium',
		2 : 'large',
		3 : 'bark',
	}

	this.colors = {
		'small': '#b95939',
		'medium':'#e78c4d',
		'large': '#fcc473',
		'bark': '#79271c',
	};

	this.radius = {
		'small': sr,
		'medium': mr,
		'large': lr,
		'bark' : br,
	}


	this.scale = function() {
		if(this.current_radius > this.max_radius) {
			// Scale all rings
			let scl = this.max_radius / this.current_radius;
			for(var i = 0; i < this.rings.length; i += 1) {
				this.rings[i].rescale(scl);
			}

			// Scale default radii
			for (var key of Object.keys(this.radius)) {
				this.radius[key] *= scl;
			}

			this.current_radius *= scl
		} else {
			//pass
		}
	}

	this.add = function(size_code) {
		let size = this.codes[size_code];
		let meshes = p.min(p.max(Math.floor(this.current_radius) ** 2, 20), 100)
		let noise_amplitude = p.map(this.current_radius, 0 ,this.max_radius, 0.1, 1.5)

		if( size == 'bark' ) {
			noise_amplitude = 1.5
		}

		this.rings.push(
			new Ring(
				p,
				this.current_radius,
				this.current_radius + this.radius[size],
				this.colors[size],
				meshes,
				noise_amplitude,
				this.zoff
			)
		)
		this.current_radius += this.radius[size]
		this.scale();
		this.zoff += this.z_inc;
	}

	this.show = function(style = 'normal') {
		p.push();
		p.translate(this.pos.x, this.pos.y);
		for(var i =  this.rings.length - 1; i > -1; i -= 1) {
			if(style == 'minimalist') {
				this.rings[i].show_minimalist()
			} else {
				this.rings[i].show()
			}
		}
		p.pop();
	}
}

function text_box(p, text, x, y, fontsize = 20) {
	p.push();
	p.strokeWeight(0.2);
	p.fill('#ffeabc')
	p.textSize(fontsize);
	p.textAlign(p.CENTER, p.CENTER)

	if(text.includes('_')){
		let annots = text.split('_');
		p.text(annots[0], x , y);

		p.textSize(fontsize * 0.5);
		p.textAlign(p.CENTER, p.TOP)
		p.text(
			annots[1],
			x + 1.5 * p.textWidth(annots[0]),
			y
		);
	} else {
		p.text(text, x, y);
	}
	p.pop();
}

var s = function( p ) { // p could be any variable name
	var tree;
	var sun;
	var snow;

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(800, 250);
  };

  p.draw = function() {
		tree = new Tree(p, p.createVector(400, p.height / 2), 120)
		for(var i = 0; i < 30; i += 1) {
			tree.add(p.random([0,1,2]))
		}
		tree.add(3);
		tree.show();

		sun = new Sun(p, p.createVector(200, p.height / 2), 50, 200, 200)
		sun.show()
		snow = new Snowflake(
			p,
			p.createVector(600, p.height / 2),
			100,
			15,
			-p.PI / 3,
			p.random(0, p.TWO_PI)
		) 
		snow.show()
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

var myp52 = new p5(s, 'c1');
