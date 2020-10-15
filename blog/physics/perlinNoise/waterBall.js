waterBall = function(p, scl, mouseRadius = 5, thresh = 0.5, ceil = 10, clr = 255, background = 0) {
	this.scl = scl;
	this.mouseRadius = mouseRadius; // raidius of the mouse  
	this.thresh = thresh;
	this.ceil = ceil;
	this.clr = clr;
	this.background = background;

	this.cols = p.floor(p.width / this.scl);
	this.rows = p.floor(p.height / this.scl);

	this.sites = new Array(this.cols * this.rows);
	this.noise = new Array(this.cols * this.rows);
	this.neighbors = new Array()
	this.mask = new Array()
	this.needUpdate = new Array()

	this.xoff = this.yoff = this.zoff = 0;
	this.xSpeed = this.ySpeed = 0.3; // noise space speed
	this.zSpeed = 0.01;
	this.noiseMax = 0.9 * this.ceil;
	this.recoverSpeed = 1 / 10; // After hidden, cells will take 10 frames to show completely

	this.radius = 20 * this.scl;
	this.shape_function = function(x, y) {
		let xs = (x - (p.width/2) - this.radius) * (x - (p.width/2) + this.radius);
		let ys = (y - (p.height/2) - this.radius) * (y - (p.height/2) + this.radius);
		return this.ceil - xs - ys
	}

	this.init = function() {
    for(var y = 0; y < this.rows; y++) {
      for(var x = 0; x < this.cols; x++){
				let index = x + y * this.cols;
				this.sites[index] = this.shape_function(this.scl * x, this.scl * y);
				this.noise[index] = this.noiseMax * p.noise(this.xoff, this.yoff, this.zoff);
				this.neighbors.push([])
				this.mask.push([])

				for(var dx = -this.mouseRadius; dx <= this.mouseRadius; dx += 1) {
					if((x + dx < 0) || (x + dx > this.cols))
						continue;
					for(var dy = -this.mouseRadius; dy <= this.mouseRadius; dy += 1) {
						if((y + dy < 0) || (y + dy > this.rows))
							continue;

						if(p.dist(0, 0, dx, dy) < this.mouseRadius) {
							this.neighbors[index].push(
								{
									'x' : x + dx,
									'y': y + dy
								}
							)
							this.mask[index].push( ((dx * dx) + (dy * dy)) / (2 * this.mouseRadius ** 2) );
						}
					}
				}
			}
		}
		let m = p.max(this.sites)
    for(var y = 0; y < this.rows; y++) {
      for(var x = 0; x < this.cols; x++){
				let index = x + y * this.cols;
				this.sites[index] /= (m / this.ceil);
			}
		}
	}
	this.init();

	this.updateNoise = function() {
		this.yoff = this.zoff;
    for(var y = 0; y < this.rows; y++) {
			this.xoff = this.zoff;
      for(var x = 0; x < this.cols; x++){
        var index = x + y * this.cols
				this.noise[index] = this.noiseMax * p.noise(this.xoff, this.yoff, this.zoff)
        this.xoff += this.xSpeed;
      }
      this.yoff += this.ySpeed;
    }
    this.zoff += this.zSpeed;
  }
	this.updateNoise();

	this.applyMouse = function(mx, my) {
		let index = p.floor((mx / this.scl) + (my / this.scl) * this.cols);
		p.fill(0,255,0)
		p.rect(mx, my ,10,10)

		if((index < this.neighbors.length) && (index > 0)) {
			for(var i = 0; i < this.neighbors[index].length; i += 1) {
				p.push()
				p.fill(0,255,0,1)
				p.rect(this.neighbors[index][i]['x'] ,this.neighbors[index][i]['y']*this.scl,10,10)
				p.pop()
				this.needUpdate.push(
					{
						'health': this.mask[index][i],
						'x' : this.neighbors[index][i]['x'],
						'y' : this.neighbors[index][i]['y']
					}
				)
			}
		}
	}

	this.show = function() {
    for(var y = 0; y < this.rows; y++) {
      for(var x = 0; x < this.cols; x++){
				let index = x + y * this.cols
				let c = this.clr
				if(this.sites[index] + this.noise[index] < (this.ceil + this.noiseMax) * this.thresh) {
					//c = this.background
					continue;
				}
				p.fill(c);
				p.noStroke();
				p.circle(x * this.scl, y * this.scl, this.scl);
      }
    }
  }

	this.updateShow = function() {
		for(var i = 0; i < this.needUpdate.length; i++) {
			p.fill(
				p.lerpColor(
					p.color(this.background, this.background, this.background),
					p.color(this.clr,this.clr, this.clr),
					this.needUpdate[i]['health']
				)
			)
			p.noStroke()
			p.circle(
				this.needUpdate[i]['x'] * this.scl,
				this.needUpdate[i]['y'] * this.scl,
				this.scl
			)
			//console.log(this.needUpdate[i]['x'])
			//console.log(this.needUpdate[i]['y'])
			this.needUpdate[i]['health'] += this.recoverSpeed;
			if(this.needUpdate[i]['health'] > 1) {
				this.needUpdate.splice(i, 1);
			}
		}
	}
}

var s = function( p ) {
	var ball;
  p.setup = function() {
    var myWidth = document.getElementById("waterBall").offsetWidth;
    p.createCanvas(myWidth, 400);
		ball = new waterBall(p, 6);
		console.log(ball.mask)
  }

  p.draw = function() {
		p.background(ball.background)
		ball.show()
		ball.applyMouse(p.mouseX, p.mouseY)
		//ball.updateNoise();
		//ball.applyMouse(p.width / 2, p.height / 2)
		ball.updateShow();
		//p.noLoop();
  }

  p.windowResized = function() {
    mwidth = document.getElementById("waterBall").offsetWidth;

    p.resizeCanvas(mwidth, p.height);
  };
};

var myp51 = new p5(s, 'waterBall');
