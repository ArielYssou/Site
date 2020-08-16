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
function Node(p, x, y, radius, facecolor = null, edgecolor = "#ffeabc", annot = '') {
	// A constructor function for regular neurons representaed by circles
	this.pos = p.createVector(x, y);
	this.radius = radius;
	this.facecolor = facecolor;
	this.edgecolor = edgecolor;
	this.annot = annot;

	this.show = function() {
		p.push();
		if(this.facecolor) {
			p.fill(this.facecolor);
		} else {
			p.noFill();
		}

		p.stroke(this.edgecolor);
		p.strokeWeight(1.5)
		p.ellipse(this.pos.x, this.pos.y, 2 * this.radius, 2 * this.radius);
		if(this.annot != '') {
			p.textSize(this.radius * -1.7);
			p.textAlign(p.CENTER, p.CENTER)
			p.text(this.annot, this.pos.x, this.pos.y);
		}
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

function Network(p, connection_style = '') {
	this.layers = [];
	this.connection_style = connection_style;

	this.add = function(layer) {
		this.layers.push(layer); // Add check
	}

	this.draw_connections = function() {
		p.push();
		p.strokeWeight(0.7)
		p.stroke('#ffeabc')
		for(var layer = 0; layer < this.layers.length - 1; layer += 1) {
			for(var pos1 = 0; pos1 < this.layers[layer].output_anchors.length; pos1 += 1) {
				for(var pos2 = 0; pos2 < this.layers[layer + 1].input_anchors.length; pos2 += 1) {
					drawArrow(
						p,
						this.layers[layer].output_anchors[pos1],
						this.layers[layer + 1].input_anchors[pos2],
						'#ffeabc',
						this.connection_style
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
	nn.add( new Dense(p, 50, 10, 40, 250, 3, 'input layer') );
	nn.add( new Dense(p, 150, 10, 40, 250, 5) );
	nn.add( new Dense(p, 250, 10, 40, 250, 5) );
	nn.add( new Dense(p, 350, 10, 40, 250, 1) );

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(400, 300);
  };

  p.draw = function() {
		nn.show();

		//Texts
		p.push();
		p.stroke('#ffeabc');
		p.fill('#ffeabc');
		p.textSize(12);
		p.textAlign(p.CENTER, p.CENTER)
		p.text('input layer', 50, 270);
		p.text('hidden layers', 200, 270);
		p.text('output layer',  350, 270);
		p.pop();

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
function Cell(p, x, y, width, height, radius, facecolor = null, edgecolor = "#ffeabc", annot = 'A') {
	// x, y = center positions
	Node.call(this, p, x, y, radius, facecolor, edgecolor); //Creates pos with (x, y)
	this.width = width;
	this.height = height;
	this.annot = annot;

	this.anchors = {
		'top' : p.createVector(x, y - (height / 2)),
		'left' : p.createVector(x - (width / 2), y ),
		'right' : p.createVector(x + (width / 2), y),
		'bottom' : p.createVector(x, y + (height / 2)),
	};

	this.show = function() {
		p.push();

		if(this.facecolor) {
			p.fill(this.facecolor);
		} else {
			p.noFill();
		}
		p.stroke(edgecolor);
		p.strokeWeight(1.5);

		p.rect(
			this.pos.x - (this.width / 2),
			this.pos.y - (this.height / 2),
			this.width,
			this.height,
			this.radius
		);

		if(this.annot != '') {
			p.strokeWeight(1);
			p.fill('#ffeabc')
			p.textSize(this.radius * -1.7);
			p.textAlign(p.CENTER, p.CENTER)
			p.text(this.annot, this.pos.x, this.pos.y);
		}

		p.pop();
	};
}

function recurrentLayer(p, x, y, width, height, index = '', arrow_style = 'fancy', folded = false) {
	Layer.call(this, p, x, y, width, height, 1); // 1 is the number of nodes, stored in 'total_nodes'
	this.input_anchors = [];
	this.output_anchors = [];

	// RNN have a single node, so there's no need for a loop
	if(folded) {
		//If fold there must be space for the recurring input arrow later on
		//so we just use half the width for the layer
		this.cell = new Cell(
			p,
			x + width / 2,
			y + height / 2,
			0.9 * (width / 2),
			0.8 * (width / 2),
			5
		);
	} else {
		this.cell = new Cell(
			p,
			x + width / 2,
			y + height / 2,
			0.9 * width,
			0.8 * width,
			5
		);
		this.input_anchors.push(this.cell.anchors.left);
		this.output_anchors.push(this.cell.anchors.right);
	}

	this.show = function() {
		p.push();
		// Draw arrows first so figures will be on top of then
		let radius = 20
		// Cell input
		inputNode = new Node(
			p,
			x + (this.width / 2),
			y + this.height - radius - 3,
			radius,
			facecolor = null,
			'#ffeabc',
			annot = 'x_'.concat(index)
		)

		drawArrow(
			p,
			p.createVector(x + (this.width / 2), y + this.height - 2 * radius - 3),
			this.cell.anchors.bottom,
			'#ffeabc',
			arrow_style
		);
		inputNode.show();

		// Cell Output
		outputNode = new Node(
			p,
			x + (this.width / 2),
			radius + 3,
			radius,
			facecolor = null,
			'#ffeabc',
			annot = 'h_'.concat(index)
		)
		drawArrow(
			p,
			this.cell.anchors.top,
			p.createVector(this.pos.x + this.width / 2, 2 * radius + 3),
			'#ffeabc',
			arrow_style
		);
		outputNode.show();

		if(folded){
			// Recurring input
			curvedArrow(
				p,
				[
					this.cell.anchors.right,
					p.createVector(
						this.pos.x + this.width,
						this.cell.anchors.right.y
					),
					p.createVector(
						this.pos.x + this.width,
						this.cell.anchors.right.y - 40
					),
					p.createVector(
						this.pos.x,
						this.cell.anchors.left.y - 40
					),
					p.createVector(
						this.pos.x,
						this.cell.anchors.left.y,
					),
					this.cell.anchors.left
				],
				curvature = 20
			)
		} else {
			// pass
		}

		this.cell.show();
		p.pop()
	}
}

/*
function empty_Layer(p, x, y, width, height) {
	Layer.call(this, p, x, y, width, height, 1); // 1 is the number of nodes, stored in 'total_nodes'
	this.input_anchors = [];
	this.output_anchors = [];
	this.show = function () {
		p.push();
		p.strokeWeight(1);
		p.fill('#ffeabc')
		p.textSize(2);
		p.textAlign(p.CENTER, p.CENTER)
		p.text('...', this.pos.x, this.pos.y + this.height);	
		p.pop()
	}
}
*/

var t = function( p ) { 
	var RNN = new Network(p, connection_style = 'fancy');
	RNN.add( new recurrentLayer(p, 50, 10, 80, 250, index = 't', 'fancy',  folded = true));
	RNN.add( new recurrentLayer(p, 200, 10, 40, 250, index = '0', 'fancy'));
	RNN.add( new recurrentLayer(p, 300, 10, 40, 250, index = '1', 'fancy'));
	//RNN.add( new empty_Layer(p, 350, 10, 50, 250));
	RNN.add( new recurrentLayer(p, 450, 10, 40, 250, index = 't', 'fancy'));

  p.setup = function() {
		var myWidth = document.getElementById("c2").offsetWidth;
    p.createCanvas(600, 400);
  };

  p.draw = function() {
		RNN.show();
		p.push()
		p.stroke('#ffeabc')
		p.strokeWeight(2)
		p.line(
			150, RNN.layers[0].height/2 + 5,
			165, RNN.layers[0].height/2 + 5  
		)
		p.line(
			150, RNN.layers[0].height/2 + 10,
			165, RNN.layers[0].height/2 + 10
		)
		p.strokeWeight(1);
		p.fill('#ffeabc')
		p.textSize(20);
		p.textAlign(p.CENTER, p.CENTER)
		p.text('...', 390, 150);
		p.pop()
		p.noLoop();
  };

	p.windowResized = function() {
		mwidth = document.getElementById("c2").offsetWidth;
		/*mheight = document.getElementById("c2").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);
	};
};
var myp52 = new p5(t, 'c2');




var t = function( p ) { 
	//var cloud = new BlobsCloud(p, 100, 100);
	var cloud = new CartoonCloud(p, 100, 100);

  p.setup = function() {
		var myWidth = document.getElementById("c3").offsetWidth;
		/*var myHeight = document.getElementById("c3").offsetHeight;*/

    p.createCanvas(myWidth, 200);
  };

  p.draw = function() {
		cloud.draw();
		p.noLoop();
  };

	p.windowResized = function() {
		mwidth = document.getElementById("c3").offsetWidth;
		/*mheight = document.getElementById("c3").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);
	};
};
var myp52 = new p5(t, 'c3');


