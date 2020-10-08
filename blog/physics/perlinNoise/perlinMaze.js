function Cluster(p, anchor) {
	this.anchor = anchor;
	this.points = [anchor];
	this.angles = [anchor.heading()];
	this.convexHull = [];

	this.add = function(point) {
		this.points.push(point);
		this.angles.push(point.copy().sub(this.anchor).heading());
	}

	this.detectHull = function() {
		// Grahan algorithm

		// The first step is to find the point with the lowes y-coordinate
		// No operations are need as the first point in the cluster is already the point
		// with the lowest y-coordinate and
		//this.anchor = this.points[0];

		// Second step is to sort the points in increasing otder of the angle they and the
		// anchor point make with the x axis. We will do this with the Decorate-Sort-Undecorate
		// algorithm 
		const dsu = (arr1, arr2) => arr1
			.map((item, index) => [arr2[index], item]) // add the args to sort by
			.sort(([arg1], [arg2]) => arg2 - arg1) // sort by the args
			.reverse() // We want the angles in increasing order
			.map(([, item]) => item); // extract the sorted items

		this.points = dsu(this.points, this.angles);
		this.angles.sort()

		const min_angle = this.cols
		const ccw = function(p1, p2, p3) {
			// Counter Clock Wise detector.
			// Returns ccw > 0 if counter clockwise, 0 if colinear and < 0 if clock wise
			return ((p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x))
		}

		var stack = [this.anchor];
		for(var i = 0; i < this.points.length; i += 1) {
			var l = stack.length; // Improve readability
			if(l > 1) {
				while((l > 1)	&& (ccw(stack[l - 2], stack[l - 1], this.points[i]) < 0)) {
					stack.pop();
					l -= 1;
				}
			}
			stack.push(this.points[i]);
		}

		if(stack.length < 3) {
			this.convexHull = [];
		} else {
			console.log(stack)
			this.convexHull = stack;
		}
	}

	this.show = function() {
		p.push();
		p.stroke(255)
		p.noFill();
		p.beginShape()
		for(var i = 0; i < this.convexHull.length; i += 1) {
			p.vertex(this.convexHull[i].x, this.convexHull[i].y)
		}
		p.endShape(p.CLOSE);
		p.pop()
	}
}

function perlinMaze(p, scl, thresh = 0.5, clr = 255, background = 0) {
	this.scl = scl;
	this.thresh = thresh;
	this.clr = clr;
	this.background = background;

	this.clusters = {}

	this.xoff = this.yoff = this.zoff = 0;
	this.xSpeed = this.ySpeed = 0.1; // noise space speed
	this.zSpeed = 0.01;

	this.cols = p.floor(p.width / scl);
	this.rows = p.floor(p.height / scl);
	
	this.sites = new Array(this.cols * this.rows);
	this.labels = new Array(this.cols * this.rows);
	this.up = new Array(this.cols * this.rows);
	this.left = new Array(this.cols * this.rows);

	for(var y = 0; y < this.rows; y++) {
		for(var x = 0; x < this.cols; x++){
			var index = x + y * this.cols;
			this.sites[index] = 0;
			this.labels[index] = 0;

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
				this.sites[index] = p.noise(this.xoff, this.yoff, this.zoff) < this.thresh ? 1 : 0;

        this.xoff += this.xSpeed;
      }
      this.yoff += this.ySpeed;
    }
    this.zoff += this.zSpeed;
  }
	this.update();

	this.show = function() {
		var colors = {0 : 0}
    for(var y = 0; y < this.rows; y++) {
      for(var x = 0; x < this.cols; x++){
				let index = x + y * this.cols
        var r = p.noise(this.xoff, this.yoff, this.zoff);
				var c = this.sites[index] ? this.clr : this.background;

				if(this.labels[index] in colors) {
					c = colors[this.labels[index]]
				} else {
					colors[this.labels[index]] = 
						p.color(p.random() * 255, p.random() * 255, p.random() * 255);
					c = colors[this.labels[index]]
				}

				p.fill(c);
				p.circle(x * this.scl, y * this.scl, this.scl);
      }
    }
  }

	this.showClusters = function() {
		for(var cluster_index in this.clusters) {
			if(Object.prototype.hasOwnProperty.call(this.clusters, cluster_index)) {
				this.clusters[cluster_index].show();
			}
		}
	}

	this.detect_clusters = function() {
		// Hoshen - Kopelman algorithm
		// See:
		// [1] - Very confusing but correct:
		// https://en.wikipedia.org/wiki/Hoshen%E2%80%93Kopelman_algorithm
		// [2] - More explanatory. Complements [1] well:
		// https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiN4_--4Z7sAhU7JbkGHcYBCP0QFjAFegQIBhAC&url=https%3A%2F%2Fwebhome.weizmann.ac.il%2Fhome%2Ffeamit%2Fnodalweek%2Fc_joas_nodalweek.pdf&usg=AOvVaw3AwGXXqVZN-mBWmjoB3YTl 

		var above;
		var left;
		var equivalence = [0]
		//var equivalence = new Array(this.rows * this.cols);
		//for(var i = 0; i < this.rows * this.cols; i += 1)
		//	equivalence[i] = i;

		find = function(x) {
			let y = x;
			while(equivalence[y] != y)
				y = equivalence[y];
			while(equivalence[x] != x) {
				let z = equivalence[x];
				equivalence[x] = y;
				x = z;
			}
			return y;
		}

		union = function(x, y) {
			equivalence[find(x)] = find(y);
		}

		var global_label = 0
    for(var y = 0; y < this.rows; y++) {
      for(var x = 0; x < this.cols; x++) {
				var index = x + y * this.cols;
				if(this.sites[index] == 1) {
					if(y == 0)
						above = 0;
					else
						above = this.labels[this.up[index]];

					if(x == 0)
						left = 0;
					else
						left = this.labels[this.left[index]];

					if((left == 0) && (above == 0)){
						global_label += 1;
						this.labels[index] = global_label;
						equivalence.push(global_label)
					} else if ((left != 0) && (above == 0)) {
						this.labels[index] = find(left);
					} else if ((left == 0) && (above != 0)) {
						this.labels[index] = find(above);
					} else {
						union(left, above);
						this.labels[index] = find(left);
					}
				}	
			}
		}
    for(var y = 0; y < this.rows; y++) {
      for(var x = 0; x < this.cols; x++) {
				var index = x + y * this.cols;
				this.labels[index] = find(this.labels[index])
			}
		}
	}

	this.form_clusters = function() {
		for(var y = 0; y < this.rows; y++) {
      for(var x = 0; x < this.cols; x++){
				let index = x + y * this.cols;
				if(this.labels[index] == 0){ continue };

				if(this.labels[index] in this.clusters) {
					this.clusters[this.labels[index]].add(p.createVector(x * scl, y * scl));
				} else {
					this.clusters[this.labels[index]] = new Cluster(p, p.createVector(x * scl, y * scl))
				}
			}
		}

		for(var cluster_index in this.clusters) {
			if(Object.prototype.hasOwnProperty.call(this.clusters, cluster_index)) {
				this.clusters[cluster_index].detectHull();
			}
		}
	}
}

var s = function( p ) {
	var maze;
  p.setup = function() {
    var myWidth = document.getElementById("perlinMaze").offsetWidth;
    p.createCanvas(myWidth, 400);
		maze = new perlinMaze(p, 10);
		maze.detect_clusters();
		maze.form_clusters();
  }

  p.draw = function() {
		console.log(maze);
		maze.show()
		maze.showClusters();
		p.noLoop();
  }

  p.windowResized = function() {
    mwidth = document.getElementById("perlinMaze").offsetWidth;

    p.resizeCanvas(mwidth, p.height);
  };
}
var myp51 = new p5(s, 'perlinMaze');
