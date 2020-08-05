// ############################################################
function Node(p, x, y, radius, facecolor = null, edgecolor = "#ffffff") {
	// A constructor function for regular neurons representaed by circles
	this.pos = p.createVector(x, y);
	this.radius = radius;
	this.facecolor = facecolor;
	this.edgecolor = edgecolor;

	this.show = function() {
		p.push();
		if(this.facecolor) {
			p.fill(this.facecolor);
		} else {
			p.noFill();
		}

		p.stroke(this.edgecolor);
		p.ellipse(this.pos.x, this.pos.y, 2 * this.radius, 2 * this.radius);
		p.pop();
	};

}

function Layer(p, x, y, width, height, total_nodes = 0) {
	// DOCSTRING
	this.pos = p.createVector(x, y);
	this.width = width;
	this.height = height;
	this.total_nodes = total_nodes;
	this.nodes = [];

	this.show = function() {
		for(var i = 0; i < this.nodes.length; i += 1) {
			this.nodes[i].show();
		}
	};
}

function Dense(p, x, y, width, height, total_nodes = 0) {
	// DOCSTRING
	Layer.call(this, p, x, y, width, height, total_nodes);

	this.radius = this.width / 2;
	if(total_nodes * (2 * this.radius) > this.height) {
		this.radius = (0.95 * this.height) / ( 2 * total_nodes);
	};

	this.center = this.pos.x + this.radius;
	this.offset = (this.height - (total_nodes * (2 * this.radius))) / (total_nodes + 1);

	this.nodes = [];
	this.input_anchors = [];
	this.output_anchors = [];

	let posy = this.pos.y + this.radius + this.offset;
	for(var i = 0; i < total_nodes; i += 1) {
		this.nodes.push(new Node(p, this.pos.x, posy, this.radius));
		this.input_anchors.push(p.createVector(this.pos.x - this.radius, posy));
		this.output_anchors.push(p.createVector(this.pos.x + this.radius, posy));
		posy +=  2 * this.radius + this.offset;
	}
}

function Network(p) {
	this.layers = [];

	this.add = function(layer) {
		this.layers.push(layer); // Add check
	}

	this.draw_connections = function() {
		p.push();
		p.strokeWeight(0.7)
		p.stroke('#F')
		for(var layer = 0; layer < this.layers.length - 1; layer += 1) {
			for(var pos1 = 0; pos1 < this.layers[layer].output_anchors.length; pos1 += 1) {
				for(var pos2 = 0; pos2 < this.layers[layer + 1].input_anchors.length; pos2 += 1) {
					p.line(
						this.layers[layer].output_anchors[pos1].x,
						this.layers[layer].output_anchors[pos1].y,
						this.layers[layer + 1].input_anchors[pos2].x,
						this.layers[layer + 1].input_anchors[pos2].y,
						);
				}
			}
		}
		p.pop();
	}

	this.show = function() {
		this.draw_connections();
		for(var i = 0; i < this.layers.length; i += 1) {
			this.layers[i].show();
		}
	}
}

var s = function( p ) { // p could be any variable name
	var nn = new Network(p);
	nn.add( new Dense(p, 50, 10, 40, 250, 3) );
	nn.add( new Dense(p, 150, 10, 40, 250, 5) );
	nn.add( new Dense(p, 250, 10, 40, 250, 5) );
	nn.add( new Dense(p, 350, 10, 40, 250, 1) );

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(400, 300);
  };

  p.draw = function() {
    p.background(0);
		nn.show();
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

function BlobsCloud(p, x, y, clr = '#ffffff') { 
	this.pos = p.createVector(x, y);
	this.clr = clr;

	let max_width = 50; // Max width of ellipses composing the cloud 
	let min_width = 40; // Min width of ellipses composing the cloud 
	let max_height = 40; // Max height of ellipses composing the cloud 
	let min_height = 30; // Min height of ellipses composing the cloud 

	let spread_x = 20;
	let spread_y = 10;

	let nblobs = p.random(5, 10); //Number of ellipses (blobs)

	//Creates the cloud
	this.blobs = []
	for(var i = 0; i < nblobs; i += 1) {
		this.blobs.push({
			pos: p.createVector(
				p.random(-spread_x, spread_x),
				p.random(-spread_y, spread_y)
			),
			a: p.random(min_width, max_width),
			b: p.random(min_height, max_height),
		});
	}

	// Geometric center of the cloud
	this.center = p.createVector(0, 0);
	for(var i = 0; i < this.blobs.length; i += 1) {
		this.center.add(this.blobs[i].pos);
	};
	this.center.div(this.blobs.length);
	

	this.draw = function() {
		p.push();
		p.translate(this.pos.x, this.pos.y);
		for(var i = 0; i < this.blobs.length; i += 1) {
			let x = this.blobs[i].pos.x;
			let y = this.blobs[i].pos.y;
			p.fill(255);
			p.noStroke();
			console.log(this.blobs[i].a)
			p.ellipse(x, y, this.blobs[i].a, this.blobs[i].b);
		};
		p.pop();
	}

}

function BezierCloud(p, x, y, clr = '#ffffff') {
	this.pos = p.createVector(x, y);
	this.clr = clr;

	this.len = p.random(30, 50); // Flat base
	//let anchors = p.random(5,10); // Number of anchors
	let anchors = 6; // Number of anchors

	let anchorAngles = [];
	let anchorRadius = [];
	for(var i = 0; i < anchors; i += 1) {
		anchorAngles.push( (i + 1) * p.TWO_PI/ anchors - p.random(p.TWO_PI / 10));
		anchorRadius.push( p.random(this.len - 10, this.len + 10) );
	}
	anchorAngles.sort()
	let aux1Angles = [p.random(anchorAngles[0])]
	let aux2Angles = [p.random(aux1Angles[0], anchorAngles[0])]
	let aux1Radius = [p.random(anchorRadius[0], anchorRadius[0] + 20)]
	let aux2Radius = [p.random(anchorRadius[0], anchorRadius[0] + 20)]

	for(var i = 1; i < anchors; i += 1) {
		aux1Angles.push(p.random(anchorAngles[i - 1], anchorAngles[i]))
		aux2Angles.push(p.random(aux1Angles[i], anchorAngles[i]))
		aux1Radius.push(p.random(anchorRadius[i], anchorRadius[i] + 20))
		aux2Radius.push(p.random(anchorRadius[i], anchorRadius[i] + 20))
	}
	console.log(anchorAngles)
	console.log(aux1Angles)
	console.log(aux2Angles)

	this.shape = function () {
		p.beginShape();
		p.vertex(2*this.len, 0);
		for(var i = 0; i < anchors; i += 1) {
			p.bezierVertex(
				2*aux1Radius[i] * p.cos(aux1Angles[i]),
				-aux1Radius[i] * p.sin(aux1Angles[i]),
				2*aux2Radius[i] * p.cos(aux2Angles[i]),
				-aux2Radius[i] * p.sin(aux2Angles[i]),
				2*anchorRadius[i] * p.cos(anchorAngles[i]),
				-anchorRadius[i] * p.sin(anchorAngles[i])
			)
		}
		//p.vertex(-this.len, 0);
		p.endShape();
	};

	this.draw = function() {
		p.push();
		p.fill(255);
		p.translate(this.pos.x, this.pos.y);
		this.shape();
		p.pop();
	};
}

function CartoonCloud(p, x, y, clr = '#ffffff') {
	this.pos = p.createVector(x, y);
	this.clr = clr;

	this.len = p.random(30, 50); // Flat base
	let left_anchor = p.createVector(-this.len, p.random(20, 30));
	let left_aux = p.createVector(-this.len + left_anchor.x, left_anchor.y / 2)
	let right_anchor = p.createVector(this.len, p.random(30, 40));
	let right_aux = p.createVector(this.len + right_anchor.x, right_anchor.y / 2)

	let openning = right_anchor.angleBetween(left_anchor);

	let anchors = 1; // Number of anchors

	let anchorAngles = [right_anchor.heading()];
	let anchorRadius = [right_anchor.mag()];
	for(var i = 0; i < anchors; i += 1) {
		anchorAngles.push( anchorAngles[i] + (openning/(anchors+1))  - p.random(p.PI/20));
		anchorRadius.push( p.random(0.99 * this.len, 1.1 * this.len) );
	}
	anchorAngles.push(left_anchor.heading())
	anchorRadius.push(left_anchor.mag())

	anchorAngles.sort()
	let auxAngles = [right_aux.heading()]
	let auxRadius = [right_aux.mag()]
	for(var i = 1; i < anchorAngles.length; i += 1) {
		auxAngles.push((anchorAngles[i - 1] + (anchorAngles[i]-anchorAngles[i-1]) / 2))
		auxRadius.push(p.random(anchorRadius[i] + 10, anchorRadius[i] + 20))
	}

	console.log(auxAngles)
	console.log(anchorAngles)

	this.shape = function () {
		p.beginShape();
		p.vertex(this.len, 0);
		for(var i = 0; i < anchorAngles.length; i += 1) {
			p.quadraticVertex(
				auxRadius[i] * p.cos(auxAngles[i]),
				-auxRadius[i] * p.sin(auxAngles[i]),
				anchorRadius[i] * p.cos(anchorAngles[i]),
				-anchorRadius[i] * p.sin(anchorAngles[i])
			)
		}
		p.quadraticVertex(left_aux.x, -left_aux.y, -this.len, 0)
		p.vertex(this.len, 0)
		p.endShape();
	};

	this.draw = function() {
		p.push();
		p.fill(255);
		p.strokeWeight(3)
		p.translate(this.pos.x, this.pos.y);
		this.shape();
		p.pop();
	};
}


// ############################################################
// Sketch Two
var t = function( p ) { 
	//var cloud = new BlobsCloud(p, 100, 100);
	var cloud = new CartoonCloud(p, 100, 100);

  p.setup = function() {
		var myWidth = document.getElementById("c2").offsetWidth;
		/*var myHeight = document.getElementById("c1").offsetHeight;*/

    p.createCanvas(myWidth, 200);
  };

  p.draw = function() {
		cloud.draw();
		p.noLoop();
  };

	p.windowResized = function() {
		mwidth = document.getElementById("c2").offsetWidth;
		/*mheight = document.getElementById("c2").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);
	};
};
var myp52 = new p5(t, 'c2');
