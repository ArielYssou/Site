function Droplet(p, mass, grav, wind = 0, velx = 0) {
  var drop = {};
  this.mass = mass;
  this.pos = p.createVector(
		p.random(-500, p.width),
		-600,
		p.random(0.7, 3)
	);

  this.vel = p.createVector(0, 4 * this.mass, 0);
  this.acc = p.createVector(wind, grav, 0);
  this.vel.mult(1/this.pos.z)

  //this.len = map(this.mass, 0, 10, 20, 40);
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
    //p.strokeWeight(p.map(this.mass, 0, 10, 0.5, 2));
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
  var rain = {};
  rain.droplets = [];
  rain.splashes = [];
  rain.drops = drops
  rain.splash_prob = splash_prob;

  while (rain.droplets.length < rain.drops) {
    rain.droplets.push(
      new Droplet(
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
        rain.droplets[i] = new Droplet(
          p,
          p.randomGaussian(15,2),
          rain.grav * 20,
          rain.wind,
          dp.vel.x
        );

				// Splash uppon reaching the floor
        if(p.random() < rain.splash_prob) {
          rain.splashes.push(
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
          rain.splashes.push(
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
