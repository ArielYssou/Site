function droplet(mass, grav, wind = 0, velx = 0) {
	var drop = {};
	drop.pos = createVector(random(-500, width), -600, random(0.7,3));
	drop.vel = createVector(0, map(mass, 0, 10, 3, 10), 0);
	drop.acc = createVector(wind, grav, 0);
	drop.vel.mult(1/drop.pos.z)

	drop.mass = mass;

	drop.len = map(drop.mass, 0, 10, 20, 40);

	drop.update = function() {
		drop.pos.add(drop.vel);
		var vec = drop.acc.copy()
		drop.vel.add(vec.mult(drop.pos.z/drop.mass));
	}

	drop.show = function() {
		push();
		stroke(185);
		strokeWeight(map(drop.mass,0,10,0.5,2));
		line(drop.pos.x, drop.pos.y,
			drop.pos.x + drop.vel.x, drop.pos.y + drop.len);
		pop();
	}

	return drop;
}

function splash(x, y, velx, vely, accx, accy, m) {
	var part = {}
	part.pos = createVector(x, y, 0);
	part.vel = createVector(velx, vely, 0);
	part.acc = createVector(accx, accy, 0);

	part.m = m

	part.show = function() {
		push()
		fill(185);
		ellipse(part.pos.x, part.pos.y, part.m, part.m)
		pop()
	};

	part.update = function() {
		part.pos.add(part.vel);
		part.vel.add(part.acc);
	};

	return part;
}
