function Droplet(p, mass, grav, wind = 0, velx = 0) {
	var drop = {};
	drop.mass = mass;
	drop.pos = p.createVector(p.random(-500, p.width), -600, p.random(0.7,3));
	drop.vel = p.createVector(0, 2 * drop.mass, 0);
	drop.acc = p.createVector(wind, grav, 0);
	drop.vel.mult(1/drop.pos.z)

	//drop.len = map(drop.mass, 0, 10, 20, 40);
	drop.len = 2 * drop.mass;

	drop.update = function(wind) {
		drop.acc.x = 250 * wind 
		drop.pos.add(drop.vel);
		var vec = drop.acc.copy()
		drop.vel.add(vec.mult(drop.pos.z / drop.mass));
	}

	drop.show = function() {
		p.push();
		p.stroke(185);
		//p.strokeWeight(p.map(drop.mass, 0, 10, 0.5, 2));
		p.strokeWeight( (drop.mass / 8) );
		p.line(drop.pos.x, drop.pos.y,
			drop.pos.x + drop.vel.x, drop.pos.y + drop.len);
		p.pop();
	}

	return drop;
}

function Splash(p, x, y, velx, vely, accx, accy, m) {
	var part = {}
	part.pos = p.createVector(x, y, 0);
	part.vel = p.createVector(velx, vely, 0);
	part.acc = p.createVector(accx, accy, 0);

	part.m = m

	part.show = function() {
		p.push()
		p.fill(185);
		p.ellipse(part.pos.x, part.pos.y, part.m, part.m)
		p.pop()
	};

	part.update = function() {
		part.pos.add(part.vel);
		part.vel.add(part.acc);
	};

	return part;
}

function Rain(p, drops, splash_prob = 0.2) {
	var rain = {};
	rain.droplets = [];
	rain.splashes = [];
	rain.drops = drops
	rain.splash_prob = splash_prob;

	while (rain.droplets.length < rain.drops) {
		rain.droplets.push(
			Droplet(
				p,
				p.randomGaussian(15, 2),
				rain.grav,
				rain.wind)
		);
	}

	rain.update = function( wind, grav) {
		for(var i = 0 ; i < rain.droplets.length; i += 1) {
			rain.droplets[i].update(wind);


			// If rain has reached floor, create a new one
			if(rain.droplets[i].pos.y > p.height ) {
				dp = rain.droplets[i]; // Original drop
				rain.droplets[i] = Droplet(
					p,
					p.randomGaussian(15,2),
					rain.grav * 20,
					rain.wind,
					dp.vel.x
				);
				if(p.random() < rain.splash_prob) {
					rain.splashes.push(
						Splash(
							p,
							dp.pos.x,
							dp.pos.y,
							5,
							-dp.vel.y / 3,
							wind,
							grav,
							4)
					);
					rain.splashes.push(
						Splash(p, dp.pos.x, dp.pos.y,
							-5, -dp.vel.y / 3,
							wind, grav, 4)
					);
				}
			}
		}

		for(var i = 0; i < rain.splashes.length; i += 1) {
			rain.splashes[i].update();
			if(rain.splashes[i].pos.y > p.height ) {
				rain.splashes.splice(i, 1);
			}
		}
	}


	rain.show = function(mode = 'all') {
		let start;
		let end;

		if (mode == 'background') {
			start = 0;
			end = Math.floor(rain.droplets.length / 2);
		} else if(mode == 'foreground') {
			start = Math.ceil(rain.droplets.length / 2);
			end = rain.droplets.length;
		}
		else {
			start = 0;
			end = rain.droplets.length;
		}

		for(var i = start; i < end; i += 1) {
			rain.droplets[i].show();
		};
	};

	rain.show_splashes = function() {
		for(var i = 0; i < rain.splashes.length; i += 1) {
			rain.splashes[i].show();
		}
	};

	return rain;
	};
