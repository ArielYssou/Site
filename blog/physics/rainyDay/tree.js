function pineLeaf(p, clr) {
  this.clr = clr

  this.show = function(width, len) {
    p.push()
    p.fill(this.clr)
    p.stroke('#333333')
		p.beginShape();
		p.vertex(width / 2, 0)
		p.quadraticVertex(width / 6, len / 3, 0, len)
		p.quadraticVertex( - width / 6,  + len / 3,  - width / 2, 0)
		p.endShape(p.CLOSE);
    p.pop()
  }
}

function Leaf(p, x, y, velx, vely, accx, accy, clr, m = 20) {
  this.pos = p.createVector(x, y, 0);
  this.vel = p.createVector(velx, vely, 0);
  this.acc = p.createVector(accx, accy, 0);
  this.acc.mult(1 / m)

  this.m = m
  this.clr = clr
  this.display_clr = clr
  this.len = 12;
  this.height = 5;

	this.rotation = 0;
	this.ang_speed = p.noise(x, y);

  this.frames = 0
  this.max_frames = p.randomGaussian(100, 30)

  this.update = function(wind, grav) {
    this.acc.x = 10 * wind;

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.frames += 1;
    this.display_clr = p.lerpColor(
      this.clr,
      p.color(55, 55, 55), //Background color
      this.frames / this.max_frames);
  };

  this.show = function() {
    p.push()
		p.translate(this.pos.x, this.pos.y)
		//p.circle(0, 0, this.height)
		p.rotate( this.rotation)
		this.rotation += this.ang_speed;
    p.strokeWeight(0)
    p.fill(this.display_clr)
		p.beginShape()
		p.vertex(0, 0);
		p.quadraticVertex(
			this.len / 3,
			this.height,
			this.len,
			0,
		)
		p.quadraticVertex(
			this.len / 3,
			- this.height,
			0,
			0
		)
		p.endShape(p.CLOSE)
    p.pop()
  }
}

function Branch(p, pos, mass, k, len, clr) {
	this.pos = pos;
  this.mass = mass;
  this.k = k;
  this.len = len;
  this.clr = clr;
  this.width = this.len / 2.2;

  this.theta =  0
  this.omega = 0;
  this.alpha = 0;
	this.sine = 1;
	this.cossine = 0;

  this.leafs = []

  this.update_angle = function(fWind) {
		let Fel = - this.theta * this.k 
		let Fres =  - this.omega * 0.1

		if( p.abs(this.theta) > p.HALF_PI) {
			fWind = 0
		}

		let Ftot = fWind * this.cossine + Fel + Fres

		this.alpha = Ftot 
    this.omega += this.alpha 
    this.theta += this.omega

		this.sine = p.sin(this.theta)
		this.cossine = p.cos(this.theta)
  }

	this.update_pos = function(last_branch) {
		// The postition of the base of the last branch
		this.pos = last_branch.pos.copy().add(
			p.constructor.Vector.fromAngle(-last_branch.theta + p.HALF_PI).mult(last_branch.len));
	}

  this.show = function() {
    p.push()
    p.fill(this.clr);
    p.stroke(this.clr);
    p.rect(this.width/2, 0, -this.width, -this.len)
    p.pop()
  }

  this.show_leafs = function() {
    p.push()
    for(j = 0; j < this.leafs.length; j += 1) 
      this.leafs[j].show(- 6 * this.width, -2.5 * this.len);
    p.pop()
  }
}

function Tree(p, segments, leaf_prob, visible_leafs = true) {
  this.branches = []
  this.dropped_leafs = []
  this.leaf_prob = leaf_prob;
	this.visible_leafs = visible_leafs;

	this.pos = p.createVector(p.width / 2, p.height);
  //this.btn_clr = color(38, 104, 36)
  this.btn_clr = p.color(79, 91, 25);
  this.top_clr = p.color(48, 130, 45);
  this.brk_clr = p.color('#824e2e');


  for(i = 0; i < segments; i += 1) {
		let len = i * 70 * (0.85 ** i);
		this.branches.push(
			new Branch(
				p,
				p.createVector(0, p.height - (len / i)),
				3,
				0.03,
				70 * (0.85 ** i),
				this.brk_clr
			)
		);
    if(i > 0)
      this.branches[i].leafs.push(
        new pineLeaf(
          p,
          p.lerpColor(this.btn_clr, this.top_clr, i / segments)
        )
      );
    else
      this.branches[i].len = 40;
  }

  this.show = function(show_dropped = true) {

    if(show_dropped) {
      for(var i = 0; i < this.dropped_leafs.length; i += 1) {
        this.dropped_leafs[i].show()
      }
    }

    p.push();
    p.translate(this.pos);
    for(i = 0; i < this.branches.length; i += 1) {
      this.branches[i].show();
			if(this.visible_leafs)
				this.branches[i].show_leafs();
      p.rotate(this.branches[i].theta);
      p.translate(0, -this.branches[i].len);
    }
    p.pop();
  }

  this.update = function(fWind = 0, fGrav = 0.2) {
		this.branches[0].update_angle(fWind);

    for(i = 1; i < this.branches.length; i += 1) {
			this.branches[i].update_angle(fWind);
			this.branches[i].update_pos( this.branches[i - 1] );

      if(p.random() < this.leaf_prob ) {
				let dx = p.random(0, this.branches[i].len * this.branches[i].cossine)
        this.dropped_leafs.push(
          new Leaf(
            p,
            (p.width / 2) + this.branches[i].pos.x + dx,
            p.height - this.branches[i].pos.y,
            6, 0, 0, fGrav, this.top_clr
          )
        );
			}
    }

    // Falling leafs
    for(var j = 0; j < this.dropped_leafs.length; j += 1) {
      this.dropped_leafs[j].update(fWind, fGrav);
      if(this.dropped_leafs[j].frames > this.dropped_leafs[j].max_frames)
        this.dropped_leafs.splice(j, 1);
			else if(this.dropped_leafs[j].pos.x > (p.width))
        this.dropped_leafs.splice(j, 1);
    };
  }
}
