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

	this.xoff = this.yoff = this.zoff = 0;
	this.xSpeed = this.ySpeed = 0.3; // noise space speed
	this.zSpeed = 0.01;
	this.noiseMax = 0.9 * this.ceil;

	for(var y = 0; y < this.rows; y++) {
		for(var x = 0; x < this.cols; x++){
			var index = x + y * this.cols;
			this.sites[index] = 0;
		}
	}

	this.radius = 70 * this.scl;
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

				for(var i = -this.mouseRadius; i <= this.mouseRadius; i += 1) {
					if((x + i < 0) || (x + i < this.rows))
						continue;
					for(var j = -this.mouseRadius; j <= this.mouseRadius; j += 1) {
						if((y + j < 0) || (j + y > this.cols))
							continue;
						let d = p.dist(x, y, i, j)
						if(d < this.mouseRadius) {
							this.neighbors[index].push(index - i - j * cols)
							let xs = (i - this.mouseRadius) * (i + this.mouseRadius)  
							let ys = (j - this.mouseRadius) * (j + this.mouseRadius)  
							this.mask[index].push(1 - xs - ys);
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

	this.update_noise = function() {
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
	this.update_noise();

	this.apply_mouse = function() {
		let index = p.floor((p.mouseX / this.scl) + (p.mouseY / this.scl) * this.cols);
		for(var i = 0; i < this.neighbors[index].length; i += 1) {
			this.sites[this.neighbors[index][i]] *= this.mask[index][i];
		}
	}

	this.show = function() {
    for(var y = 0; y < this.rows; y++) {
      for(var x = 0; x < this.cols; x++){
				let index = x + y * this.cols
				let c = this.clr
				if(this.sites[index] + this.noise[index] < (this.ceil + this.noiseMax) * this.thresh) {
					c = this.background;
				}
				p.fill(c);
				p.circle(x * this.scl, y * this.scl, this.scl);
      }
    }
  }
}

var s = function( p ) {
	var ball;
  p.setup = function() {
    var myWidth = document.getElementById("waterBall").offsetWidth;
    p.createCanvas(myWidth, 400);
		ball = new waterBall(p, 4);
		console.log(ball.sites)
  }

  p.draw = function() {
		ball.show()
		p.noLoop();
  }

  p.windowResized = function() {
    mwidth = document.getElementById("waterBall").offsetWidth;

    p.resizeCanvas(mwidth, p.height);
  };
};

var myp51 = new p5(s, 'waterBall');
