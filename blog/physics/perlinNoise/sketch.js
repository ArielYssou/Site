/*
var s = function( p ) {
  var scl = 5;
  var rows, cols;

  p.setup = function() {
    var myWidth = document.getElementById("random_2d").offsetWidth;
    let c = p.createCanvas(myWidth, 200);

    rows = p.height / scl;
    cols = p.width / scl;
    p.saveCanvas(c, 'random_noise', 'jpg');
  }

  p.draw = function() {
    for(var y = 0; y < rows; y++) {
      for(var x = 0; x < cols; x++){
        var r = p.random() * 255;
        p.fill(r);
        p.stroke(0)
        p.rect(x * scl, y * scl, scl, scl);
      }
    }
    if( p.frameCount > 1)
      p.noLoop();
  }

  p.windowResized = function() {
    mwidth = document.getElementById("random_2d").offsetWidth;
    scl *= (mwidth / p.width); // Resizing the scale

    p.resizeCanvas(mwidth, p.height);
  };
}
var myp51 = new p5(s, 'random_2d');
*/

var s = function( p ) {
  var scl = 20; //scale
  var inc = 0.1;
  var zoff = 0;
  var rows, cols;
  var running;
  var clr;

  var particles = [];
  var flowfield = [];

  p.setup = function() {
    var myWidth = document.getElementById("perlin_field").offsetWidth;
    p.createCanvas(myWidth, 400);
    p.background(52);
    rows = p.floor(p.height / scl);
    cols = p.floor(p.width / scl);
    p.colorMode(p.RGB)
    clr = p.color(232, 226, 136, 7);

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
        var angle = p.noise(xoff, yoff, zoff) * 1 * p.TWO_PI; //Try 2
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

  }
  p.windowResized = function() {
    mwidth = document.getElementById("perlin_field").offsetWidth;
    scl *= (mwidth / p.width); // Resizing the scale
    for(var i = 0; i < particles.length; i += 1) {
      particles[i].pos.mult( (mwidth / p.width) );
      particles[i].last_pos.mult( (mwidth / p.width) );
      p.background(52);
    }

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
      p.stroke(clr);
      p.line(this.pos.x, this.pos.y,
        this.last_pos.x, this.last_pos.y);
      this.last_pos = this.pos.copy()
    }
  }  

  p.mousePressed = function() {
    // Check if mouse is inside the circle
    if ( p.mouseY > 0 && p.mouseY < p.height) {
      if ( p.mouseX > 0 && p.mouseX < p.width ) {
        if ( ! running ) {
          p.loop();
          myp53.running = false;
          myp53.noLoop()
          myp54.running = false;
          myp54.noLoop()
          running = true;
          //console.log("PARTICLES running")
        } else {
          p.noLoop();
          running = false;
          //console.log("PARTICLES stoped")
        }
      }
    }
  }

}
var myp52 = new p5(s, 'perlin_field');

// #######################################################
// #######################################################
// #######################################################

var s = function( p ) {
  var scl = 20; //scale
  var inc = 0.1;
  var zoff = 0;
  var rows, cols;
  var running;
  var radius = 50;

  var fr;

  var particles = [];
  var flowfield = [];
  var externalField = [];

  p.setup = function() {
    var myWidth =  document.getElementById("perlin_alt").offsetWidth;
    if( myWidth > 600 )
      myWidth = 600

    p.createCanvas(myWidth, 400);
    p.background(0);
    rows = p.floor(p.height / scl);
    cols = p.floor(p.width / scl);

    p.noLoop();
    running = false;

    for(var i = 0; i < 400; i += 1) {
      particles.push(new Particle());
    }
    flowfield = new Array(cols * rows);
    externalField = new Array(cols * rows);

    var center = p.createVector(p.width/2, p.height/2);
    for(var y = 0; y < rows; y++) {
      for(var x = 0; x < cols; x++){
        var pos = p.createVector(x, y).mult(scl)
        var center = p.createVector(p.width/2, p.height/2);

        var toCenter = center.sub( pos );
        
        toCenter.setMag( toCenter.magSq() );
        toCenter.mult( 0.000025 );

        var index = x + y * cols;
        externalField[index] = toCenter;
      }
    }

  }

  p.draw = function() {
    p.background(0, 25);
    var yoff = 0;
    for(var y = 0; y < rows; y++) {
      var xoff = 0;
      for(var x = 0; x < cols; x++){
        var angle = p.noise(xoff, yoff, zoff) * 4 * p.TWO_PI;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(0.1);

        var index = x + y * cols
        flowfield[index] = v.add( externalField[index] );

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
    }
  }

  p.windowResized = function() {
    mwidth = document.getElementById("perlin_alt").offsetWidth;
    scl *= (mwidth / p.width); // Resizing the scale
    for(var i = 0; i < particles.length; i += 1) {
      particles[i].pos.mult( (mwidth / p.width) );
      particles[i].last_pos.mult( (mwidth / p.width) );
      p.background(0);
    }

    p.resizeCanvas(mwidth, p.height);
  };

  function Particle() {
    //this.pos = p.createVector(p.random(p.width), p.random(p.height));
    this.pos = p.createVector(p.width/2, p.height/2);
    this.pos.add( p5.Vector.random2D().setMag(100 + p.random(-5, 5)) )
    this.last_pos = this.pos.copy()

    this.vel = p.createVector(p.random(p.width), p.random(p.height));
    var center = p.createVector(p.width/2, p.height/2);
    var toCenter = center.sub( this.vel );
    this.vel = toCenter.rotate(p.PI)
    this.vel.setMag(5)

    this.acc = p.createVector(0, 0);

    this.max_vel = 5

    this.update = function() {
      this.vel.add(this.acc)
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

    this.show = function() {
      p.strokeWeight(2)
      p.stroke('#ff5323');
      p.line(this.pos.x, this.pos.y,
        this.last_pos.x, this.last_pos.y);
      this.last_pos = this.pos.copy()
    }
  }  

  p.mousePressed = function() {
    // Check if mouse is inside the circle
    if ( p.mouseY > 0 && p.mouseY < p.height) {
      if ( p.mouseX > 0 && p.mouseX < p.width ) {
        if ( ! running ) {
          p.loop();
          myp52.running = false;
          myp52.noLoop()
          myp54.running = false;
          myp54.noLoop()
          running = true;
          console.log("CIRCLE running")
        } else {
          p.noLoop();
          running = false;
          console.log("CIRCLE stopped")
        }
      }
      else
        console.log("CIRCLE not within X border")
    }
    else
      console.log("CIRCLE not within Y border")
  }
}
var myp53 = new p5(s, 'perlin_alt');


// #######################################################
// #######################################################
// #######################################################

var s = function( p ) {
  var scl = 5;
  var rows, cols;
  var zoff = 0;
  var inc = 0.1;
  var running = false;
  var sites = [];
  var clr;

  p.setup = function() {
    var myWidth =  document.getElementById("ink").offsetWidth;
    if( myWidth > 600 )
      myWidth = 600

    p.createCanvas(myWidth, 400);
    p.background(52)
    p.colorMode(p.RGB);
    clr = p.color(186, 91, 129);

    rows = p.floor(p.height / scl);
    cols = p.floor(p.width / scl);
    sites = new Array(cols * rows);
    for(var i = 0; i < cols * rows; i++)
      sites[i] = false;

    p.noLoop()
  }

  p.draw = function() {
    p.noStroke()
    var yoff = zoff;
    for(var y = 0; y < rows; y++) {
      var xoff = zoff;
      for(var x = 0; x < cols; x++){
        var r = p.noise(xoff, yoff, zoff);
        var index = x + y * cols

        if( r > 0.4 ) {
          if( sites[index]) {
            sites[index] = false;
            p.fill(52);
            p.ellipse(x * scl, y * scl, scl+1, scl+1);
          }
        }
        else {
          if( ! sites[index] ) {
            sites[index] = true;
            p.fill(clr)
            p.ellipse(x * scl, y * scl, scl, scl);
          }
        }
        xoff += inc;
      }
      yoff += inc;
    }
    zoff += 0.01;
  }

  //yoff += inc;
  //zoff += 0.001;

  p.windowResized = function() {
    mwidth = document.getElementById("ink").offsetWidth;
    scl *= (mwidth / p.width); // Resizing the scale
    rows = p.floor(p.height / scl);
    cols = p.floor(p.width / scl);

    p.resizeCanvas(mwidth, p.height);
  };

  p.mousePressed = function() {
    // Check if mouse is inside the circle
    if ( p.mouseY > 0 && p.mouseY < p.height) {
      if ( p.mouseX > 0 && p.mouseX < p.width ) {
        if ( ! running ) {
          running = true;
          p.loop();
          myp52.running = false;
          myp52.noLoop()
          myp53.running = false;
          myp53.noLoop()
        } else {
          p.noLoop();
          running = false;
        }
      }
    }
  }
}
var myp54 = new p5(s, 'ink');
