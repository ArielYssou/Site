function Particle() {
	// Constructor function for particles.
	// Parameters:
	// 	pos : current position. 
	// 	last_pos: last position.
	// 	vel: velocity
	// 	acc : acceleration
	// 	max_vel: velocity cap. There is no dissipation so this is vital so the speed doesn't just increase indefinitely.
	//
	// 	External GLOBAL variables:
	// 	scl: Scale of the canvas. The canvas is divided into sectors of dimension scl*scl.
	//	
	//	methods:
	//	update: Updates IN ORDER: vel, pos, acc.
	//	applyForce: Apply an external force. Basically updates acc.
	//	follow: Determines the position in the force field and applies the local force.
	//	edges: Apllies the boundary conditions (spherical) updating the pos and last_pos variables accordingly.
	//	show: Draws the path of the particle in the canvas.
	//
	//
		this.pos = createVector(random(width), random(height));
		this.last_pos = this.pos.copy(); //Used in the show() function
		this.vel = p5.Vector.random2D();
		this.acc = createVector(0, 0);

		this.max_vel = 4 // If not capped the speed only increases

		this.update = function() {
			// Updates the velocity, position and then acceleration
			this.vel.add(this.acc);
			this.vel.limit(this.max_vel);
			this.pos.add(this.vel);
			this.acc.mult(0);
		}

		this.applyForce = function(force) {
			// Future proof. Could just be an inline function.
			this.acc.add(force);
		}

		this.follow = function(vectors) {
			// Follows the force field
			var x = floor(this.pos.x /scl);
			var y = floor(this.pos.y /scl);
			var index = x + y * cols;
			var force = vectors[index];
			this.applyForce(force);
		}

		this.edges = function() {
			// Boundary conditions
			if( this.pos.x > width ) {
				this.pos.x = 0;
				this.last_pos.x = 0;
			}
			if( this.pos.y > height ) {
				this.pos.y = 0;
				this.last_pos.y = 0;
			}
			if( this.pos.x < 0 ) {
				this.pos.x = width;
				this.last_pos.x = width;
			}
			if( this.pos.y < 0 ) {
				this.pos.y = height;
				this.last_pos.y = height;
			}
		}

		this.show = function() {
			// Prints the last trajectory (a line between the current
			// position and the previous)
			stroke(clr);
			line(this.pos.x, this.pos.y,
				this.last_pos.x, this.last_pos.y);
			this.last_pos = this.pos.copy()
		}
	}	

