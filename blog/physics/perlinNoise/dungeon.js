function Cluster(anchor) {
	this.sites = [];
	this.angles = [];
	this.convexHull = [];
	this.anchor = anchor;

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
		
		this.ccw = function(p1, p2, p3) {
			// Counter Clock Wise detector.
			// Returns ccw > 0 if counter clockwise, 0 if colinear and < 0 if clock wise
			return ((p2.x - p1.x) * ( p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x))
		}

		var stack = [];
		for(var i = 0; i < this.points.length; i += 1) {
			// pop the last point from the stack if we turn clockwise to reach this point
			if(i > 0) {
				if(this.angles[i] > this.angles[i - 1])
					stack.pop();
			}

			var l = stack.length; // Improve readability
			while stack.length > 1	&& this.ccw(l - 2], stack[l - 1], this.points[i]) <= 0 {
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
	this.labels = new Array(this.cols * this.rows);
	this.up = new Array(this.cols * this.rows);
	this.right = new Array(this.cols * this.rows);

	for(var y = 0; y < this.rows; y++) {
		for(var x = 0; x < this.cols; x++){
			var index = x + y * this.cols;
			this.sites[index] = false;
			this.labels[inde] = index;

			if(y != 0)
				this.up[index] = index - this.cols
			else
				this.up[index] = null;

			if(x > 0)
				this.left[index] = index - 1;
			else
				this.left[index] = null;
		}
	}

	this.update = function() {
		this.yoff = this.zoff;
    for(var y = 0; y < this.rows; y++) {
			this.xoff = this.zoff;
      for(var x = 0; x < this.cols; x++){
        var index = x + y * this.cols
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
		// Hoshen - Kopelman algorithm
		// See:
		// [1] - Very confusing but correct:
		// https://en.wikipedia.org/wiki/Hoshen%E2%80%93Kopelman_algorithm
		// [2] - More explanatory. Complements [1] well:
		// https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiN4_--4Z7sAhU7JbkGHcYBCP0QFjAFegQIBhAC&url=https%3A%2F%2Fwebhome.weizmann.ac.il%2Fhome%2Ffeamit%2Fnodalweek%2Fc_joas_nodalweek.pdf&usg=AOvVaw3AwGXXqVZN-mBWmjoB3YTl 

		let above;
		let left;

		find = function(x) {
			let y = x;
			while(this.labels[y] != y)
				y = this.labels[y];
			while(this.labels[x] != x) {
				let z = this.labels[x];
				this.labels[x] = y;
				x = z;
			}
			return y;
		}

		union = function(x, y) {
			this.labels[find(x)] = find(y);
		}

		const union(x, y) => this.labels

		global_label = 0
    for(var y = 0; y < rows; y++) {
      for(var x = 0; x < cols; x++) {
				var index = x + y * cols;
				if(this.sites[index]) {
					if(x == 0)
						above = 0;
					else
						above = this.labels[this.up[index]];
					if(y == 0)
						left = 0;
					else
						left = this.labels[this.left[index]];

					if((left == 0) && (above == 0)){
						largest_label += 1;
						this.labels[index] = largest_label;
						this.clusters = new Cluster(p.createVector(x * scl, y * scl));
					} else if ((left != 0) && (above == 0) {
						this.labels[index] = find(left);
					} else if (left == 0) && (above != 0) {
						this.labels[index] = find(above);
					} else {
						union(left, above);
						this.labels[index] = find[left]
					}
				}	
			}
		}
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
