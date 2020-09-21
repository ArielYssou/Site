function Droplet(p, mass, grav, wind = 0, velx = 0) {
  this.mass = mass;
  this.pos = p.createVector(
		p.random(-100, p.width),
		-200,
		p.random(0.7, 3)
	);

  this.vel = p.createVector(0, 4 * this.mass, 0);
  this.acc = p.createVector(wind, grav, 0);
  this.vel.mult(1/this.pos.z)

  this.len = 4 * this.mass;

  this.update = function(wind) {
    this.acc.x = 250 * wind 
    this.pos.add(this.vel);
    var vec = this.acc.copy()
    this.vel.add(vec.mult(this.pos.z / this.mass));
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

function Splash(p, x, y, velx, vely, accx, accy, m) {
  this.pos = p.createVector(x, y, 0);
  this.vel = p.createVector(velx, vely, 0);
  this.acc = p.createVector(accx, accy, 0);
  this.m = m

  this.show = function() {
    p.push()
    p.fill(125);
		p.strokeWeight(0);
    p.circle(this.pos.x, this.pos.y, this.m)
    p.pop()
  };

  this.update = function() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
  };
}

function Rain(p, drops, splash_prob = 0.2) {
  this.droplets = [];
  this.splashes = [];
  this.drops = drops
  this.splash_prob = splash_prob;

  while (this.droplets.length < this.drops) {
    this.droplets.push(
      new Droplet(
        p,
        p.randomGaussian(15, 2),
        this.grav,
        this.wind)
    );
  }

  this.update = function( wind, grav) {
    for(var i = 0 ; i < this.droplets.length; i += 1) {
      this.droplets[i].update(wind);

      // If rain has reached floor, create a new one
      if(this.droplets[i].pos.y > p.height ) {
        dp = this.droplets[i]; // Original drop
        this.droplets[i] = new Droplet(
          p,
          p.randomGaussian(15,2),
          this.grav * 20,
          this.wind,
          dp.vel.x
        );

				// Splash uppon reaching the floor
        if(p.random() < this.splash_prob) {
          this.splashes.push(
            new Splash(
              p,
              dp.pos.x,
              dp.pos.y,
              5,
              -dp.vel.y / 6,
              wind,
              grav,
              3)
          );
          this.splashes.push(
            new Splash(
							p,
							dp.pos.x,
							dp.pos.y,
              -5,
							-dp.vel.y / 6,
              wind,
							grav,
							3
						)
          );
        }

      }
    }

    for(var i = 0; i < this.splashes.length; i += 1) {
      this.splashes[i].update();
      if(this.splashes[i].pos.y > p.height ) {
        this.splashes.splice(i, 1);
      }
    }
  }

  this.show = function(mode = 'all') {
    let start;
    let end;

    if (mode == 'background') {
      start = 0;
      end = Math.floor(this.droplets.length / 2);
    } else if(mode == 'foreground') {
      start = Math.ceil(this.droplets.length / 2);
      end = this.droplets.length;
    }
    else {
      start = 0;
      end = this.droplets.length;
    }

    for(var i = start; i < end; i += 1) {
      this.droplets[i].show();
    };
  };

  this.show_splashes = function() {
    for(var i = 0; i < this.splashes.length; i += 1) {
      this.splashes[i].show();
    }
	};
};
