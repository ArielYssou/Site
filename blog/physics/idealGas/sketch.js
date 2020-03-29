var simulation;
var t = 0;
var i = 0;
var xi, yi, xf, yf;

var color_slow;
var color_fast;

function setup() {
	let canvas = createCanvas(1000, 600);
	colorMode(RGB);
	color_slow = color(186, 91, 129);
	color_fast = color(252, 116, 20);

	simulation = Simulation()
	simulation.init(50);
	simulation.color_update();

	canvas.parent('sketch-holder');
}

function draw() {
	background(50);
	simulation.run();

	/*
	t += 1;
	if( t > 100 ) {
		saveCanvas('ideal_gas', 'png');
		noLoop()
	}
	*/
}

function Particle(x, y, vx, vy, radius = 15, mass = 1, clr = color(50,50,50)) {
	var particle = {};

	particle.pos = createVector(x, y);
	particle.vel = createVector(vx, vy);
	particle.mass = mass;
	particle.radius = radius;

	particle.clr = clr;

	particle.collisions = [particle.pos.copy()];

	particle.show = function() {
		push();
		fill(particle.clr);
		strokeWeight(0);
		ellipse(
			particle.pos.x,
			particle.pos.y,
			particle.radius,
			particle.radius
		);
		pop();
	}

	particle.overlaps = function(other) {
		// If the distance between centers is less than 2*radius then they overlap
		
		ans = Math.sqrt(((particle.pos.x - other.pos.x) ** 2) + ((particle.pos.y - other.pos.y) ** 2));
		return (ans < (particle.radius + other.radius) / 2 ? true : false);
	}

	particle.update = function() {
		// Cheks bouncing
		if ((particle.pos.x + particle.radius > width) || (particle.pos.x - particle.radius < 0)) {
			particle.vel.x *= -1;
			particle.collisions.push( particle.pos.copy() )
		}
		if ((particle.pos.y + particle.radius > height) || (particle.pos.y - particle.radius < 0)) {
			particle.vel.y *= -1;
			particle.collisions.push( particle.pos.copy() )
		}

		// Check boundry violation
		if( particle.pos.x > width )
			particle.pos.x = width - (width - particle.pos.x)
		if( particle.pos.y > height )
			particle.pos.y = height - (height - particle.pos.y)
		particle.pos.x = abs(particle.pos.x)
		particle.pos.y = abs(particle.pos.y)

		// Updates the position
		particle.pos = particle.pos.add(particle.vel)
	}

	particle.clr_update = function(max_vel) {
		particle.clr = lerpColor(
			color_slow,
			color_fast,
			particle.vel.mag() / max_vel
		)
	}

	return particle;
}

function Simulation() {
	that = {};

	that.particles = [];
	that.meanFreePaths = [];
	that.max_mfp = 100;

	that.init = function(n_particles) {
		let candidate;
		i = 0;
		fails = 0;
		while((i < n_particles) && (fails < 500) ) {
			candidate = Particle(
				randomGaussian(width/2, 200),
				randomGaussian(height/2, 200),
				randomGaussian(0, 1.5),
				randomGaussian(0, 1.5),
			);

			overlaps = false;
			for(j = 0; j < that.particles.length; j += 1) {
				particle = that.particles[j]
				if( candidate.overlaps(particle) ){ 
					overlaps = true;
					break;
				}
			}

			if (overlaps) {
				fails += 1;
			} else if (candidate.pos.x + candidate.radius > width) {
				fails += 1
			} else if(candidate.pos.x - candidate.radius < 0) {
				fails += 1
			} else if (candidate.pos.y + candidate.radius > height) {
				fails += 1
			} else if (candidate.pos.y - candidate.radius < 0) {
				fails += 1
			} else {
				that.particles.push(candidate);
				i += 1;
			}
		}
	}

	that.collision = function(p1, p2) {
		let M, factor;
		M = p1.mass + p2.mass;
		factor = (2 * p2.mass) / M;

		// Accont the mean free paths
		p1.collisions.push(p1.pos.copy())
		p2.collisions.push(p2.pos.copy())
		that.meanFreePaths.push(p1.collisions)
		that.meanFreePaths.push(p2.collisions)
		// Reset mean free paths
		p1.collisions = [ p1.pos.copy() ]
		p2.collisions = [ p2.pos.copy() ]

		pos11 = p1.pos.copy(); // We will need 2 copies of p1.pos
		pos12 = p1.pos.copy();
		vel11 = p1.vel.copy(); // The same for the speed
		vel12 = p1.vel.copy();

		pos2 = p2.pos.copy();
		vel2 = p2.vel.copy();

		pos_dif = pos11.sub(pos2)
		vel_dif = vel11.sub(vel2)

		factor *= vel_dif.dot(pos_dif);
		factor /= pos_dif.mag() ** 2;
		p1.vel.sub( pos_dif.mult(factor) );

		factor = (2 * p1.mass)/M;
		pos_dif = pos2.sub(pos12)
		vel_dif = vel2.sub(vel12)

		factor *= vel_dif.dot(pos_dif);
		factor /= pos_dif.mag() ** 2;
		p2.vel.sub( pos_dif.mult(factor) );

		while(p1.overlaps(p2)) { 
			p1.update()
			p2.update()
		}
	}

	that.check_collisions = function() {
		for(i = 0; i < that.particles.length; i += 1) {
			for(j = i + 1; j < that.particles.length; j += 1) {
				if( that.particles[i].overlaps( that.particles[j] ) )
					that.collision( that.particles[i], that.particles[j] );
			}
		}
	}

	that.update = function() {
		that.check_collisions();
		for(i = 0; i < that.particles.length; i += 1)
			that.particles[i].update();
	}

	that.color_update = function() {
		vmax = 0.0001
		for(i = 0; i < that.particles.length; i += 1) {
			vel = that.particles[i].vel.mag()
			if(vel > vmax){
				vmax = vel;
			}
		}
		//console.log(vmax)
		for(i = 0; i < that.particles.length; i += 1) 
			that.particles[i].clr_update(vmax);
	}

	that.display = function() {
		for(i = 0; i < that.particles.length; i += 1)
			that.particles[i].show();
	}

	that.show_mfp = function() {
		lgt = that.meanFreePaths.length
		for(i = 0; i < lgt; i += 1) {
			push();
			strokeWeight(3);
			strokeCap(ROUND);
			stroke(lerpColor(color(50,50,50), color_fast, i / lgt) );
			for(j = 1; j < that.meanFreePaths[i].length; j += 1) {
				xi = that.meanFreePaths[i][j].x;
				yi = that.meanFreePaths[i][j].y;
				xf = that.meanFreePaths[i][j - 1].x;
				yf = that.meanFreePaths[i][j - 1].y;
				line(xi, yi, xf, yf);
			}
			pop();
		}

		while( that.meanFreePaths.length > that.max_mfp ) 
			that.meanFreePaths.shift();
	}

	that.run = function() {
		that.display();
		that.update();
		that.color_update();
		//that.show_mfp();
	}

	return that;
}
