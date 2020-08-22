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


