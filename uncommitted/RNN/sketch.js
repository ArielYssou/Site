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







// ############################################################
// Sketch Two
var t = function( p ) { 
	var x, y;
  var speed = 2.5; 

  p.setup = function() {
		var myWidth = document.getElementById("c1").offsetWidth;
		/*var myHeight = document.getElementById("c1").offsetHeight;*/

    p.createCanvas(myWidth, 200);

		x = p.width / 2; 
		y = p.height / 2;
  };

  p.draw = function() {
    p.background(100);
    p.fill(1);
    x += speed; 
    if(x > p.width){
      x = 0; 
    }
    p.ellipse(x,y,50,50);

  };

	p.windowResized = function() {
		mwidth = document.getElementById("c2").offsetWidth;
		/*mheight = document.getElementById("c2").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);
	};
};
var myp52 = new p5(t, 'c2');
