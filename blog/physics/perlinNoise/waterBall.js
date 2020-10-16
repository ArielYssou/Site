Site = function(x, y, value) {
	this.x = x;
	this.y = y;
	this.value = value;
}

waterBall = function(p, scl, mouseRadius = 5, thresh = 0.5, ceil = 10, clr = 255, background = 0) {
	this.scl = scl;
	this.mouseRadius = mouseRadius; // raidius of the mouse  
	this.thresh = thresh;
	this.ceil = ceil;
	this.clr = clr;
	this.background = background;

	this.cols = p.floor(p.width / this.scl);
	this.rows = p.floor(p.height / this.scl);

	this.sites = new Array(this.rows * this.cols); // Active sites in lattice

	// Sites where the noise can surpass the function 
	// i.e. the only ones we need to check for updates
	this.activeNoiseSites = new Array();

	// Mouse hover masks the function values
	this.mask = new Array(this.mouseRadius, this.mouseRadius);

	// Sites masked by the mouse that need to be updated back
	this.needUpdate = new Array();
	this.recoverSpeed = 1 / 10; // After hidden, cells will take 10 frames to show completely

	// Noise space speeds and offsets
	this.xoff = this.yoff = this.zoff = 0;
	this.xSpeed = this.ySpeed = 0.3; // noise space speed
	this.zSpeed = 0.01;
	this.noiseMax = 0.9 * this.ceil; // Noise amplitude

	// Shape function and radius (since its a paraboloid)
	this.radius = 20 * this.scl;
	this.shape_function = function(x, y) {
		let xs = (x - (p.width/2) - this.radius) * (x - (p.width/2) + this.radius);
		let ys = (y - (p.height/2) - this.radius) * (y - (p.height/2) + this.radius);
		return this.ceil - xs - ys
	}

	this.init = function() {
		// Initializes the function map, noise and map arrays
		this.yoff = this.zoff;
    for(var y = 0; y < this.rows; y++) {
			this.xoff = this.zoff;
      for(var x = 0; x < this.cols; x++){
				var index = x + y * this.cols;
				var noise = this.noiseMax * p.noise(this.xoff, this.yoff, this.zoff);  
				var value = this.shape_function(this.scl * x, this.scl * y);
  
				if(value >= -this.noiseMax) { // Can be active
					this.sites[index] = value + noise > 0 ? 1 : 0;
					if(value <= this.noiseMax) {
						this.activeNoiseSites.push(new Site(x, y, value));
					}
				}
				this.xoff += this.xSpeed;
			}
			this.yoff += this.ySpeed;
		}
		this.zoff += this.zSpeed;

		for(var dy = 0; dy <= 2 * this.mouseRadius; dy += 1) {
			for(var dx = 0; dx <= 2 * this.mouseRadius; dx += 1) {
				if(p.dist(this.mouseRadius / 2, this.mouseRadius / 2, dx, dy) < this.mouseRadius) {
					value = ((dx * dx) + (dy * dy)) / (2 * this.mouseRadius ** 2) 
					this.mask.push(new Site(dx, dy, value))
				}
			}
		}
	}
	this.init();

	this.updateNoise = function() {
		for(const site of this.sites) {
			this.xoff = this.zoff + this.xSpeed * site.x;
			this.yoff = this.zoff + this.ySpeed * site.y;
			site.value = this.noiseMax * p.noise(this.xoff, this.yoff, this.zoff)
		}
		this.zoff += this.zSpeed;
	}

	this.applyMouse = function(mx, my) {
		var posx = = p.floor((mx / this.scl);
		var posy = = p.floor((my / this.scl);
		var index = posx + posy * this.cols;

		let maskY = 0
		for(var dy = -p.floor(this.mouseRadius/2); dy <= -p.floor(this.mouseRadius/2); dy += 1) {
			let maskX = 0
			for(var dx = -p.floor(this.mouseRadius/2); dx <= -p.floor(this.mouseRadius/2); dx += 1) {
				let maskIndex = maskX + maskY * this.mouseRadius;
				if(this.sites[index] == 1)	 {
					this.needUpdate.push(
						{
							'health': this.mask[maskIndex][i],
							'x' : posx + dx,
							'y' : posy + dy
						}
					)
				}
				maskX += 1;
			}
			maskY += 1;
		}
	}

	this.show = function() {
    for(var y = 0; y < this.rows; y++) {
      for(var x = 0; x < this.cols; x++){
				let index = x + y * this.cols
				let c = this.clr
				if(this.sites[index] < 0) {
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
  }

  p.draw = function() {
		p.background(ball.background)
		ball.show()
		//ball.applyMouse(p.mouseX, p.mouseY)
		//ball.updateNoise();
		ball.applyMouse(p.width / 2, p.height / 2)
		ball.updateShow();
		p.noLoop();
  }

  p.windowResized = function() {
    mwidth = document.getElementById("waterBall").offsetWidth;

    p.resizeCanvas(mwidth, p.height);
  };
};

var myp51 = new p5(s, 'waterBall');
