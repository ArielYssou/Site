var color_slow = [186, 91, 129];
var color_fast = [252, 116, 20];

var s = function( p ) {
  var simulation;
  var t = 0;
  var xi, yi, xf, yf;

  var color_slow;
  var color_fast;   

  p.setup = function() {
    var myWidth = document.getElementById("c1").offsetWidth;
    var myHeight = document.getElementById("c1").offsetHeight;
    //let myHeight = 0.5 * myWidth;
    p.createCanvas(myWidth, 300);
    p.colorMode(p.RGB);
    
    let show_mfp = false;
    simulation = Simulation(p, show_mfp);
    simulation.init(50);
    simulation.color_update();

  }

  p.draw = function() {
    p.background(50);
    simulation.run();
    t += 1;
  }

  p.windowResized = function() {
    var myWidth = document.getElementById("c1").offsetWidth
    var myHeight = document.getElementById("c1").offsetHeight
    p.resizeCanvas(myWidth, myHeight);
  }

}

var myp51 = new p5(s, 'c1');

var s = function( p) {
  var simulation;
  var t = 0;
  var xi, yi, xf, yf;

  p.setup = function() {
    var myWidth = document.getElementById("c2").offsetWidth
    //var myHeight = document.getElementById("c2").offsetHeight
    let myHeight = 0.5 * myWidth;
    p.createCanvas(myWidth, myHeight);
    //my_canvas.parent('sketch-holder-test')
    p.colorMode(p.RGB);

    let show_mfp = true;
    simulation = Simulation(p, show_mfp);
    simulation.init(50);
    simulation.color_update();

  }

  p.draw = function() {
    p.background(50);
    simulation.run();
    t += 1;
  }

  p.windowResized = function() {
    var myWidth = document.getElementById("c2").offsetWidth
    var myHeight = document.getElementById("c2").offsetHeight
    p.resizeCanvas(myWidth, myHeight);
  }

}

var myp52 = new p5(s, 'c2');

Particle = function(p, x, y, vx, vy, radius = p.width / 75, mass = 1, clr = p.color(50,50,50)) {
  var particle = {};

  particle.pos = p.createVector(x, y);
  particle.vel = p.createVector(vx, vy);
  particle.mass = mass;
  particle.radius = radius;

  particle.clr = clr;

  particle.colisions = [particle.pos.copy()];

  particle.show = function() {
    p.push();
    p.fill(particle.clr);
    p.strokeWeight(0);
    p.ellipse(
      particle.pos.x,
      particle.pos.y,
      particle.radius,
      particle.radius
    );
    p.pop();
  }

  particle.overlaps = function(other) {
    // If the distance between centers is less part 2*radius then they overlap
    
    ans = Math.sqrt(((particle.pos.x - other.pos.x) ** 2) + ((particle.pos.y - other.pos.y) ** 2));
    return (ans < (particle.radius + other.radius) / 2 ? true : false);
  }

  particle.update = function() {
    // Cheks bouncing
    if ((particle.pos.x + particle.radius > p.width) || (particle.pos.x - particle.radius < 0)) {
      particle.vel.x *= -1;
      particle.colisions.push( particle.pos.copy() )
    }
    if ((particle.pos.y + particle.radius > p.height) || (particle.pos.y - particle.radius < 0)) {
      particle.vel.y *= -1;
      particle.colisions.push( particle.pos.copy() )
    }

    // Check boundry violation
    if( particle.pos.x > p.width )
      particle.pos.x = p.width - (p.width - particle.pos.x)
    if( particle.pos.y > p.height )
      particle.pos.y = p.height - (p.height - particle.pos.y)
    particle.pos.x = p.abs(particle.pos.x)
    particle.pos.y = p.abs(particle.pos.y)

    // Updates the position
    particle.pos = particle.pos.add(particle.vel)
  }

  particle.clr_update = function(max_vel) {
    particle.clr = p.lerpColor(
      p.color(color_slow[0], color_slow[1], color_slow[2]),
      p.color(color_fast[0], color_fast[1], color_fast[2]),
      particle.vel.mag() / max_vel
    )
  }

  return particle;
}

Simulation = function(p, show_mfp) {
  var that = {};
  var show_mfp = show_mfp;

  that.particles = [];
  that.meanFreePaths = [];
  that.max_mfp = 100;

  that.init = function(n_particles) {
    var candidate;
    i = 0;
    fails = 0;
    while((i < n_particles) && (fails < 500) ) {
      candidate = Particle(
        p,
        p.randomGaussian(p.width/2, 200),
        p.randomGaussian(p.height/2, 200),
        p.randomGaussian(0, 1.5),
        p.randomGaussian(0, 1.5),
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
      } else if (candidate.pos.x + candidate.radius > p.width) {
        fails += 1
      } else if(candidate.pos.x - candidate.radius < 0) {
        fails += 1
      } else if (candidate.pos.y + candidate.radius > p.height) {
        fails += 1
      } else if (candidate.pos.y - candidate.radius < 0) {
        fails += 1
      } else {
        that.particles.push(candidate);
        i += 1;
      }
    }
  }

  that.colision = function(p1, p2) {
    let M, factor;
    M = p1.mass + p2.mass;
    factor = (2 * p2.mass) / M;

    // Accont the mean free paths
    p1.colisions.push(p1.pos.copy())
    p2.colisions.push(p2.pos.copy())
    that.meanFreePaths.push(p1.colisions)
    that.meanFreePaths.push(p2.colisions)
    // Reset mean free paths
    p1.colisions = [ p1.pos.copy() ]
    p2.colisions = [ p2.pos.copy() ]

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

  that.check_colisions = function() {
    for(i = 0; i < that.particles.length; i += 1) {
      for(j = i + 1; j < that.particles.length; j += 1) {
        if( that.particles[i].overlaps( that.particles[j] ) )
          that.colision( that.particles[i], that.particles[j] );
      }
    }
  }

  that.update = function() {
    that.check_colisions();
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
      p.push();
      p.strokeWeight(2);
      p.strokeCap(p.ROUND);
      p.stroke(p.lerpColor(p.color(50,50,50), p.color(252, 116, 20), i / lgt) );
      for(j = 1; j < that.meanFreePaths[i].length; j += 1) {
        xi = that.meanFreePaths[i][j].x;
        yi = that.meanFreePaths[i][j].y;
        xf = that.meanFreePaths[i][j - 1].x;
        yf = that.meanFreePaths[i][j - 1].y;
        p.line(xi, yi, xf, yf);
      }
      p.pop();
    }

    while( that.meanFreePaths.length > that.max_mfp ) 
      that.meanFreePaths.shift();
  }

  that.run = function() {
    that.update();
    if(show_mfp) {
      that.show_mfp();
      that.color_update();
    } else {
      that.display();
      that.color_update();
    }
  }

  return that;
}


