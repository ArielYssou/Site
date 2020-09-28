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
			p.fill(this.edgecolor);
			p.strokeWeight(.5)
			p.textSize(this.radius * -1.7);
			p.textAlign(p.CENTER, p.CENTER)
			if(this.annot.includes('_')){
				let annots = this.annot.split('_');
				p.text(annots[0], this.pos.x - 1, this.pos.y);

				p.textSize(this.radius * 0.5);
				p.textAlign(p.CENTER, p.TOP)
				p.text(
					annots[1],
					this.pos.x + p.textWidth(annots[0]),
					this.pos.y
				);
			} else {
				p.text(annot, this.pos.x, this.pos.y);
			}
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
		p.strokeWeight(.5)
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
			p.fill(this.edgecolor);
			p.strokeWeight(.5)
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
			x + p.textWidth(annots[0]) + p.textWidth(annots[1]) / 1.5,
			y
		);
	} else {
		p.text(text, x, y);
	}
	p.pop();
}



var t = function( p ) { 
	var RNN = new Network(p, connection_style = 'fancy');
	RNN.add( new recurrentLayer(p, 50, 10, 100, 250, index = 't', 'fancy',  folded = true));
	RNN.add( new recurrentLayer(p, 200, 10, 50, 250, index = '0', 'fancy'));
	RNN.add( new recurrentLayer(p, 300, 10, 50, 250, index = '1', 'fancy'));
	//RNN.add( new empty_Layer(p, 350, 10, 50, 250));
	RNN.add( new recurrentLayer(p, 450, 10, 50, 250, index = 't', 'fancy'));

  p.setup = function() {
		var myWidth = document.getElementById("c2").offsetWidth;
    p.createCanvas(600, 300);
  };

  p.draw = function() {
		RNN.show();
		p.push()
		p.stroke('#ffeabc')
		p.strokeWeight(1.3)
		p.line(
			165, RNN.layers[0].height/2 + 5,
			175, RNN.layers[0].height/2 + 5  
		)
		p.line(
			165, RNN.layers[0].height/2 + 10,
			175, RNN.layers[0].height/2 + 10
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


// ### LSTM cell draw
function LstmCell(p, x, y, width, height, radius, detail_width=33, detail_height=23, output_size = 30, facecolor = null, edgecolor = '#ffeabc', annot = 'A') {
	Cell.call(this, p, x, y, width, height, radius, facecolor, edgecolor, annot);
	this.detail_width = detail_width;
	this.detail_height = detail_height;

	this.show = function() {
		p.push();
		if (this.facecolor) {
			p.fill(this.facecolor);
		} else {
			p.noFill();
		}

		p.stroke(this.edgecolor);
		p.strokeWeight(1.5);
		p.translate(this.pos.x, this.pos.y);
		p.rect(0, 0, this.width, this.height, this.radius);
		let top_level = 0.15 * this.height;
		let middle = 0.5 * this.height;
		let low_level = 0.90 * this.height;

		text_box(p, 'C_t-1', - p.textWidth('h_t-1'), top_level)
		text_box(p, 'h_t-1', - p.textWidth('h_t-1'), low_level)
		text_box(p, 'C_t', this.width + output_size +  p.textWidth('C_t'), top_level)
		text_box(p, 'h_t', this.width + output_size + p.textWidth('h_t'), low_level)

		// Cell state arrow
		curvedArrow(p,
			[
				p.createVector(0, top_level),
				p.createVector(this.width + output_size, top_level)
			]
		);
		//forget gate arrow
		curvedArrow(p,
			[
				p.createVector(0, low_level),
				p.createVector(0.15 * this.width, low_level),
				p.createVector(0.15 * this.width, top_level + this.detail_height / 2)
			]
		);
		// learn gate sigma curve
		curvedArrow(p,
			[
				p.createVector(0, low_level),
				p.createVector(0.3 * this.width, low_level),
				p.createVector(0.3 * this.width, middle),
				p.createVector(0.5 * this.width - this.detail_width /2, middle)
			]
		);
		// learn gate tanh curve
		curvedArrow(p,
			[
				p.createVector(0, low_level),
				p.createVector(0.5 * this.width, low_level),
				p.createVector(0.5 * this.width, top_level + this.detail_height / 2)
			]
		);
		// output gate sigma curve
		curvedArrow(p,
			[
				p.createVector(0, low_level),
				p.createVector(0.65 * this.width, low_level),
				p.createVector(0.65 * this.width, middle),
				p.createVector(0.80 * this.width - this.detail_width / 2, middle)
			]
		);
		// output gate tanh curve
		curvedArrow(p,
			[
				p.createVector(0, top_level),
				p.createVector(0.80 * this.width, top_level),
				p.createVector(0.80 * this.width, low_level),
				p.createVector(this.width + output_size, low_level)
			]
		);
		// output curve
		curvedArrow(p,
			[
				p.createVector(0, top_level),
				p.createVector(0.80 * this.width, top_level),
				p.createVector(0.80 * this.width, low_level),
				p.createVector(0.90 * this.width, low_level),
				p.createVector(0.90 * this.width, -output_size)
			]
		);
		// input curve
		curvedArrow(p,
			[
				p.createVector(0.05 * this.width, this.height + output_size),
				p.createVector(0.05 * this.width, low_level),
				p.createVector(0.15 * this.width, low_level)
			],
			curvature = 20, clr = '#ffeabc', tip = null
		);

		//  *** DETAILS ***
		// Operations
		p.textAlign(p.CENTER, p.CENTER);
		let details_level = 0.7 * this.height;
		let x = 0;
		let y = 0;
		let operation_clr = '#86CAE9'
		let layer_clr = '#FFE570'
		let text_clr = '#42403b'

		// Cell forget rate inclusion
		x = 0.15 * this.width
		y = top_level;
		p.fill(operation_clr)
		p.strokeWeight(1.5);
		p.ellipse(x, y, this.detail_height, this.detail_height);
		p.fill(text_clr)
		p.strokeWeight(0)
		p.text('x', x, y);

		// Cell learn rate inclusion
		x = 0.5 * this.width
		y = top_level;
		p.fill(operation_clr)
		p.strokeWeight(1.5);
		p.ellipse(x, y, this.detail_height, this.detail_height);
		p.fill(text_clr)
		p.strokeWeight(0)
		p.text('+', x, y);

		// Cell learn rate junction
		x = 0.5 * this.width
		y = middle;
		p.fill(operation_clr)
		p.strokeWeight(1.5);
		p.ellipse(x, y, this.detail_height, this.detail_height);
		p.fill(text_clr)
		p.strokeWeight(0)
		p.text('x', x, y);

		// Cell output junction
		x = 0.8 * this.width
		y = middle;
		p.fill(operation_clr)
		p.strokeWeight(1.5);
		p.ellipse(x, y, this.detail_height, this.detail_height);
		p.fill(text_clr)
		p.strokeWeight(0)
		p.text('x', x, y);

		// Cell tanh normalization
		x = 0.8 * this.width;
		y = 0.3 * this.height;
		p.fill(operation_clr)
		p.strokeWeight(1.5);
		p.ellipse(x, y, this.detail_width, this.detail_height);
		p.fill(text_clr)
		p.strokeWeight(0)
		p.text('tanh', x, y);

		// Forget layer
		x = 0.15 * this.width - this.detail_width / 2;
		y = details_level;
		p.fill(layer_clr)
		p.strokeWeight(1.5);
		p.rect(x, y, this.detail_width, this.detail_height);
		p.fill(text_clr)
		p.strokeWeight(0)
		p.text('σ', x + this.detail_width / 2, y + this.detail_height / 2);

		// Learn sigma layer
		x = 0.3 * this.width - this.detail_width / 2;
		y = details_level;
		p.fill(layer_clr)
		p.strokeWeight(1.5);
		p.rect(x, y, this.detail_width, this.detail_height);
		p.fill(text_clr)
		p.text('σ', x + this.detail_width / 2, y + this.detail_height / 2);

		// Learn tanh layer
		x = 0.5 * this.width - this.detail_width / 2;
		y = details_level;
		p.fill(layer_clr)
		p.strokeWeight(1.5);
		p.rect(x, y, this.detail_width, this.detail_height);
		p.fill(text_clr)
		p.strokeWeight(0)
		p.text('tanh', x + this.detail_width / 2, y + this.detail_height / 2);

		// Forget layer
		x = 0.65 * this.width - this.detail_width / 2;
		y = details_level;
		p.fill(layer_clr)
		p.strokeWeight(1.5);
		p.rect(x, y, this.detail_width, this.detail_height);
		p.fill(text_clr)
		p.strokeWeight(0)
		p.text('σ', x + this.detail_width / 2, y + this.detail_height / 2);

		// input cells
		let text = 'x_t'
		x = 0.05 * this.width;
		y = this.height + output_size + this.detail_height / 1.5;
		p.stroke(this.edgecolor);
		p.strokeWeight(1.5)
		p.fill('#F7B578');
		p.ellipse(x, y,  1.5 * this.detail_height, 1.5 * this.detail_height);
		p.fill(text_clr);
		p.strokeWeight(.5)
		p.textSize(this.radius * 1.5);
		p.textAlign(p.CENTER, p.CENTER)
		let annots = text.split('_');
		p.text(annots[0], x - 1, y);

		p.textSize(this.radius);
		p.textAlign(p.CENTER, p.TOP)
		p.text(
			annots[1],
			x + p.textWidth(annots[0]),
			y
		);

		// output cells
		text = 'h_t'
		x = 0.9 * this.width;
		y = 0 - output_size - this.detail_height / 1.5;
		p.stroke(this.edgecolor);
		p.strokeWeight(1.5)
		p.fill('#F7B578');
		p.ellipse(x, y,  1.5 * this.detail_height, 1.5 * this.detail_height);
		p.fill(text_clr);
		p.strokeWeight(.5)
		p.textSize(this.radius * 1.5);
		p.textAlign(p.CENTER, p.CENTER)
		annots = text.split('_');
		p.text(annots[0], x - 1, y);

		p.textSize(this.radius);
		p.textAlign(p.CENTER, p.TOP)
		p.text(
			annots[1],
			x + p.textWidth(annots[0]),
			y
		);

		p.pop();
	}
	
}
var t = function( p ) { 
	var lstm_cell = new LstmCell(p, 50, 80, 330, 200, 10);

  p.setup = function() {
		var myWidth = document.getElementById("c3").offsetWidth;
    p.createCanvas(600, 390);
  };

  p.draw = function() {
		lstm_cell.show();
		p.noLoop();
  };

	p.windowResized = function() {
		mwidth = document.getElementById("c3").offsetWidth;
		/*mheight = document.getElementById("c2").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);
	};
};
var myp52 = new p5(t, 'c3');
