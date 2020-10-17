Site = function(x, y, value, active = false, health = 0) {
	this.x = x;
	this.y = y;
	this.value = value;
	this.active = active;
	this.health = health;
}

waterBall = function(p, scl, mouseRadius = 15) {
	this.scl = scl;
	this.mouseRadius = mouseRadius; // raidius of the mouse  
	this.thresh = 0.4;
	this.clr = p.color('#CACC90');
	this.background = p.color('#363530');
	this.noiseMax = 0.7; // Noise amplitude

	this.cols = p.floor(p.width / this.scl);
	this.rows = p.floor(p.height / this.scl);

	this.sites = new Array(this.rows * this.cols); // Active sites in lattice

	// Sites where the noise can surpass the function 
	// i.e. the only ones we need to check for updates
	this.activeNoiseSites = new Array();

	// Mouse hover masks the function values
	this.mouseDiam = 1 + (2 * this.mouseRadius);
	this.mouseMiddle = this.mouseRadius + 1;
	this.mask = new Array();

	// Sites masked by the mouse that need to be updated back
	this.needUpdate = {};
	this.recoverSpeed = 1 / 17; // After hidden, cells will take 10 frames to show completely

	// Noise space speeds and offsets
	this.xoff = this.yoff = this.zoff = 0;
	this.xSpeed = 0.2;
	this.ySpeed = 0.2; // noise space speed
	this.zSpeed = 0.2;

	// Shape function and radius (since its a paraboloid)
	this.radius = 30 * this.scl;
	this.shape_function = function(x, y) {
		let xs = (x - (p.width/2) - this.radius) * (x - (p.width/2) + this.radius);
		let ys = (y - (p.height/2) - this.radius) * (y - (p.height/2) + this.radius);
		return 1 - xs - ys
	}

	this.init = function() {
		// Initializes the function map, noise and map arrays
		var normalization = -Infinity;
    for(var y = 0; y < this.rows; y++) {
      for(var x = 0; x < this.cols; x++){
				var index = x + y * this.cols;
				var value = this.shape_function(this.scl * x, this.scl * y);
				this.sites[index] =  new Site(x, y, value, false);
				normalization = value > normalization ? value  : normalization
			}
		}
		for(site of this.sites) {
			site.value /= normalization;
		}

		// Apply noise and set active sites
		this.yoff = this.zoff;
    for(var y = 0; y < this.rows; y++) {
			this.xoff = this.zoff;
      for(var x = 0; x < this.cols; x++){
				var index = x + y * this.cols;
				var noise = this.noiseMax * p.noise(this.xoff, this.yoff, this.zoff);  
				if((this.sites[index].value + noise) / (1 + this.noiseMax) > this.thresh) {
					this.sites[index].health = 1;
					this.sites[index].active = true;
				}
  
				if(this.sites[index].value >= -this.noiseMax) { // Can be active
					if(this.sites[index].value <= this.noiseMax) {
						this.activeNoiseSites.push(this.sites[index]);
					}
				}
				this.xoff += this.xSpeed;
			}
			this.yoff += this.ySpeed;
		}
		this.zoff += this.zSpeed;

		// Make mouse maks values
		for(var dy = -this.mouseRadius; dy <= this.mouseRadius; dy += 1) {
			for(var dx = -this.mouseRadius; dx <=  this.mouseRadius; dx += 1) {
				if(p.dist(0, 0, dx, dy) < this.mouseRadius) {
					this.mask.push(
						p.min(((p.dist(0, 0, dx, dy) / this.mouseRadius) - 0.7), 1)
					)
				} else {
					this.mask.push(1)
				}
			}
		}
	}
	this.init();

	this.updateNoise = function() {
		for(var i = 0; i < this.activeNoiseSites.length; i += 1) {
			var site = this.activeNoiseSites[i];
			var index = site.x + site.y * this.cols;

			this.xoff = this.zoff + this.xSpeed * site.x;
			this.yoff = this.zoff + this.ySpeed * site.y;
			noise = this.noiseMax * p.noise(this.xoff, this.yoff, this.zoff)
			if((site.value + noise) / (1 + this.noiseMax) > this.thresh) {
				if(! this.sites[index].active) {
					this.sites[index].health = 0
					this.sites[index].active = true;
					this.needUpdate[index] = this.sites[index]; 
				}
			} else {
				if(this.sites[index].active) {
					this.sites[index].active = false;
					this.needUpdate[index] = this.sites[index]; 
				}
			}
		}
		this.zoff += this.zSpeed;
	}

	this.applyMouse = function(mx, my) {
		// Implement minmun and maximum x and y values to ignore part of the screen
		var posx = p.floor((mx / this.scl));
		var posy = p.floor((my / this.scl));
		let maskIndex = 0;

		for(var dy = - this.mouseRadius; dy <= this.mouseRadius; dy += 1) {
			if((posy + dy < 0) || (posy + dy > this.rows)) {continue;}
			for(var dx = - this.mouseRadius; dx <= this.mouseRadius; dx += 1) {
				if(posx + dx < 0 || posx + dx > this.cols) {continue;}
				maskIndex = (dx + this.mouseRadius)
					+ (dy + this.mouseRadius) * (this.mouseDiam);
				let absoluteIndex = (posx + dx) + this.cols * (posy + dy);

				if(absoluteIndex >= this.sites.length)
					continue;
				if(this.sites[absoluteIndex].active) {
					this.sites[absoluteIndex].health = p.min(
						this.mask[maskIndex],
						this.sites[absoluteIndex].health
					)
					this.needUpdate[absoluteIndex] = this.sites[absoluteIndex]
				} else if (this.sites[absoluteIndex].health > 0) {
					this.sites[absoluteIndex].health = p.min(
						this.mask[maskIndex],
						this.sites[absoluteIndex].health
					)
				}
			}
		}
	}

	this.show = function() {
		for(const site of this.sites) {
			let c = this.clr
			if(! site.active) {
				//c = this.background;
				continue;
			}
			p.fill(c);
			p.noStroke();
			p.circle(site.x * this.scl, site.y * this.scl, this.scl);
    }
  }

	this.updateShow = function() {
		for(const pos of Object.keys(this.needUpdate)) {
			//console.log(pos)
			p.fill(
				p.lerpColor(
					this.background,
					this.clr,
					this.needUpdate[pos].health
				)
			)
			p.noStroke()
			p.circle(
				this.needUpdate[pos].x * this.scl,
				this.needUpdate[pos].y * this.scl,
				this.scl
			)
			if(this.needUpdate[pos].active) {
				this.needUpdate[pos].health += this.recoverSpeed;
				this.sites[pos].health += this.recoverSpeed;
				if(this.needUpdate[pos].health >= 1) {
					delete this.needUpdate.pos;
				}
			} else {
				this.needUpdate[pos].health -= this.recoverSpeed;
				this.sites[pos].health -= this.recoverSpeed;
				if(this.needUpdate[pos].health <= 0) {
					delete this.needUpdate.pos;
				}
			}
		}
	}
}

var s = function( p ) {
	var ball;
  p.setup = function() {
    var myWidth = document.getElementById("waterBall").offsetWidth;
    p.createCanvas(myWidth, 400);
		ball = new waterBall(p, 2);
  }

  p.draw = function() {
		if(p.frameCount == 1) {
			p.background(ball.background)
			ball.show()
			ball.show()
			ball.show()
			ball.show()
			ball.show()
		}
		//ball.applyMouse(p.mouseX, p.mouseY)
		ball.updateNoise();
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
