
function Ball(p, pos, radialSpeed = 0, angularSpeed = 0.03, mass = 10) {
	this.pos = pos;
	this.angularSpeed = angularSpeed;
	this.radialSpeed = radialSpeed;
	this.mass = mass;

	this.radius = this.pos.mag();
	this.clr = p.color('#F4EBBE');
	this.lastPos = this.pos.copy();

	this.radialXoff = p.random();
	this.radialYoff = p.random();
	this.radialXSpeed = 0.02;
	this.radialYSpeed  = 0.02;

	this.update = function(angularAcc = 0) {
		let rad_random = p.noise(this.radialXoff, this.radialYoff)  
		this.radialSpeed = this.radius + 80 * (rad_random - 0.5);
  
		this.lastPos = this.pos.copy()
		this.pos.rotate(this.angularSpeed);
		this.pos.setMag(this.radialSpeed);

		this.radialXoff += this.radialXSpeed;
		this.radialYoff += this.radialYSpeed;
	}

	this.show = function() {
		p.push()
		p.strokeWeight(2)
		p.fill(this.clr)
		p.stroke(this.clr)

		p.line(
			this.lastPos.x,
			this.lastPos.y,
			this.pos.x,
			this.pos.y
		);
		p.pop()
	}
}

var s = function( p ) {
	var balls = new Array();
  p.setup = function() {
    var myWidth = document.getElementById("circularMotion").offsetWidth;
    p.createCanvas(600, 400);
		for(var i = 0; i < 100; i += 1) {
			balls.push(
				new Ball(
					p,
					p.constructor.Vector.random2D().mult(
						p.map(p.random(),0,1, 120, 180)
					),
					0,
					p.map(p.random(), 0, 1, 0.02, 0.04)
				)
			)
		}
  }

  p.draw = function() {
		if(p.frameCount == 1) {
			p.background(p.color(54, 53, 48));
		}

		p.background(p.color(54, 53, 48, 45));
		p.translate(p.width / 2, p.height / 2);
		for(ball of balls) {
			ball.show();
			ball.update(p.random());
		}
  }

  p.windowResized = function() {
    mwidth = document.getElementById("circularMotion").offsetWidth;

    p.resizeCanvas(mwidth, p.height);
  };
};

var myp51 = new p5(s, 'circularMotion');
