function Droplet(p, mass, grav, wind = 0, velx = 0) {
  this.mass = mass;
  this.pos = p.createVector(
		p.random(0, p.width),
		0, // Rain starts at the top
	);

  this.vel = p.createVector(velx, 4 * this.mass);
  this.acc = p.createVector(wind, grav);

  this.len = 4 * this.mass;

  this.update = function(wind) {
    this.acc.x = wind 
    this.pos.add(this.vel);
  }

  this.show = function() {
    p.push();
    p.stroke(125);
		p.translate(this.pos.x, this.pos.y)
    p.strokeWeight( (this.mass / 10) );
    p.line(0, 0, this.vel.x, this.len);
    p.pop();
  }
}
