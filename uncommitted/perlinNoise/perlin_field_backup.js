var s = function( p ) {
	var scl = 20; //scale
	var inc = 0.1;
	var zoff = 0;
	var rows, cols;
	var running;

	var fr;

	var particles = [];
	var flowfield = [];

	p.setup = function() {
		var myWidth = document.getElementById("perlin_field").offsetWidth;
		p.createCanvas(myWidth, 400);
		p.background(255);
		rows = p.floor(p.height / scl);
		cols = p.floor(p.width / scl);
		fr = p.createP('');

		p.noLoop();
		running = false;

		for(var i = 0; i < 800; i += 1) {
			particles.push(new Particle());
		}
		flowfield = new Array(cols * rows);
	}

	p.draw = function() {
		var yoff = 0;
		for(var y = 0; y < rows; y++) {
			var xoff = 0;
			for(var x = 0; x < cols; x++){
				var angle = p.noise(xoff, yoff, zoff) * p.TWO_PI;
				var v = p5.Vector.fromAngle(angle);
				v.setMag(1);

				var index = x + y * cols
				flowfield[index] = v

				xoff += inc;
				p.stroke(0, 50);
			}
			yoff += inc;
			zoff += 0.001;
		}

		for(var i = 0; i < particles.length; i += 1) {
			particles[i].follow(flowfield);
			particles[i].show();
			particles[i].update();
			particles[i].edges();
		}

		fr.html(p.floor(p.frameRate()));
	}
	p.windowResized = function() {
		mwidth = document.getElementById("perlin_field").offsetWidth;
		scl *= (mwidth / p.width); // Resizing the scale

		p.resizeCanvas(mwidth, p.height);
	};

	function Particle() {
		this.pos = p.createVector(p.random(p.width), p.random(p.height));
		this.last_pos = this.pos.copy()
		this.vel = p5.Vector.random2D();
		this.acc = p.createVector(0, 0);

		this.max_vel = 4

		this.update = function() {
			this.vel.add(this.acc);
			this.vel.limit(this.max_vel);
			this.pos.add(this.vel);
			this.acc.mult(0);
		}

		this.applyForce = function(force) {
			this.acc.add(force);
		}

		this.follow = function(vectors) {
			var x = p.floor(this.pos.x /scl);
			var y = p.floor(this.pos.y /scl);
			var index = x + y * cols;
			var force = vectors[index];
			this.applyForce(force);
		}

		this.edges = function() {
			if( this.pos.x > p.width ) {
				this.pos.x = 0;
				this.last_pos.x = 0;
			}
			if( this.pos.y > p.height ) {
				this.pos.y = 0;
				this.last_pos.y = 0;
			}
			if( this.pos.x < 0 ) {
				this.pos.x = p.width;
				this.last_pos.x = p.width;
			}
			if( this.pos.y < 0 ) {
				this.pos.y = p.height;
				this.last_pos.y = p.height;
			}
		}

		this.show = function() {
			p.stroke(1, 50);
			p.line(this.pos.x, this.pos.y,
				this.last_pos.x, this.last_pos.y);
			this.last_pos = this.pos.copy()
		}
	}	

	p.mousePressed = function() {
		// Check if mouse is inside the circle
		if ( ! running ) {
			p.loop();
			running = true;
		} else {
			p.noLoop();
			running = false;
		}
	}
}
var myp52 = new p5(s, 'perlin_field');
