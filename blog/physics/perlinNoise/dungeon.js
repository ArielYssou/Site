function Cluster() {
	this.sites = [];
	this.angles = [];
	this.convexHull = [];
	this.anchor = 0;

	this.detectHull = function() {
		// Grahan algorithm

		// The first step is to find the point with the lowes y-coordinate
		// No operations are need as the first point in the cluster is already the point
		// with the lowest y-coordinate and
		this.anchor = this.sites[0];

		// Second step is to sort the points in increasing otder of the angle they and the
		// anchor point make with the x axis. We will do this with the Decorate-Sort-Undecorate
		// algorithm 
		const dsu = (arr1, arr2) => arr1
			.map((item, index) => [arr2[index], item]) // add the args to sort by
			.sort(([arg1], [arg2]) => arg2 - arg1) // sort by the args
			.reverse() // We want the angles in increasing order
			.map(([, item]) => item); // extract the sorted items

		this.sites = dsu(this.sites, this.angles);
		this.angles.sort().reverse();
		
		var stack = [];
		for(var i = 0; i < this.points.length; i += 1) {
			// pop the last point from the stack if we turn clockwise to reach this point
			while stack.length > 1	&&
				ccw(stack[stack.length - 2], stack[stack.length - 1], this.points[i]) <= 0 {
				stack.pop();
			}
			stack.push(this.points[i]);
		}
		this.convexHull = stack;
	}
}

function perlinMaze(p, scl, thresh = 0.4; clr, backgroud) {
	this.scl = scl;
	this.thresh = thresh;
	this.clr = clr;
	this.background = background;

	this.xoff = this.yoff = this.zoff = 0;
	this.xSpeed = this.ySpeed = 0.1; // noise space speed
	this.zSpeed = 0.01;

	this.cols = p.floor(p.width / scl);
	this.rows = p.floor(p.height / scl);
	
	this.sites = new Array(this.cols * this.rows);
	for(var i = 0; i < this.cols * rows; i++) {
		this.sites[i] = false;
	}

	this.update = function() {
		this.yoff = this.zoff;
    for(var y = 0; y < rows; y++) {
			this.xoff = this.zoff;
      for(var x = 0; x < cols; x++){
        var index = x + y * cols
				this.sites[index] = p.noise(this.xoff, this.yoff, this.zoff) > this.thresh;

        this.xoff += this.xSpeed;
      }
      this.yoff += this.ySpeed;
    }
    this.zoff += this.zSpeed;
  }
	this.update();

	this.draw_sites = function() {
    for(var y = 0; y < rows; y++) {
      for(var x = 0; x < cols; x++){
        var r = p.noise(this.xoff, this.yoff, this.zoff);
				var c = this.sites[index] ? this.clr : this.background;
				p.fill(c);
				p.circle(x * this.scl, y * this.scl, this.scl);
      }
    }
  }

	this.detect_clusters = function {
    for(var y = 0; y < rows; y++) {
      for(var x = 0; x < cols; x++){
	}
}

var s = function( p ) {
  p.setup = function() {
    var myWidth = document.getElementById("random_2d").offsetWidth;
    let c = p.createCanvas(myWidth, 200);

    rows = p.height / scl;
    cols = p.width / scl;
    p.saveCanvas(c, 'random_noise', 'jpg');
  }

  p.draw = function() {
		p.noLoop();
  }

  p.windowResized = function() {
    mwidth = document.getElementById("random_2d").offsetWidth;
    scl *= (mwidth / p.width); // Resizing the scale

    p.resizeCanvas(mwidth, p.height);
  };
}
var myp51 = new p5(s, '');
