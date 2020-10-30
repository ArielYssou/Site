function Ring(p, inner_radius, outer_radius, clr, n_meshes, noise_amplitude, zoff) {
	this.inner_radius = inner_radius;
	this.outer_radius = outer_radius;
	this.clr = clr;
	this.zoff = zoff;
	this.noise_amplitude = noise_amplitude;

	this.dTheta = p.TWO_PI / n_meshes;
	this.noise_radius = outer_radius - inner_radius / 3

	this.points = []
	this.radii = []

	for(var theta = 0; theta < p.TWO_PI; theta += this.dTheta) {
		let xoff = p.map(p.cos(theta), -1, 1, 0, this.noise_amplitude)
		let yoff = p.map(p.sin(theta), -1, 1, 0, this.noise_amplitude)
		let r = p.map(
			p.noise(xoff, yoff, this.zoff),
			0, 1,
			this.outer_radius - this.noise_radius, this.outer_radius
		)

		this.radii.push( r );
		this.points.push(p.createVector(r * p.cos(theta), r * p.sin(theta)));
	}

	this.show = function() {
		p.push()
		p.stroke('#79271c')
		p.fill(this.clr)
		p.beginShape()
		for(var i = 0; i < this.points.length; i += 1) {
			p.vertex(this.points[i].x, this.points[i].y);
		}
		p.endShape(p.CLOSE);
		p.pop()
	}

	this.show_grid = function() {
		p.push()
		p.stroke('#ffeabc')
		p.fill('#42403b')
		p.beginShape()
		for(var i = 0; i < this.points.length; i += 1) {
			p.vertex(this.points[i].x, this.points[i].y);
		}
		p.endShape(p.CLOSE);
		p.pop()
	}

	this.show_minimalist = function() {
		p.push()
		p.stroke('#79271c')
		p.fill(this.clr)
		p.circle(0,0, this.outer_radius)
		p.pop()
	}

	this.rescale = function(scl) {
		this.inner_radius *= scl;
		this.outer_radius *= scl;
		for(var i = 0; i < this.points.length; i += 1) {
			this.points[i].mult(scl);
		}
	}
}

function Tree(p, pos, max_radius = 150, theme = 'wood') {
	this.pos = pos;
	this.max_radius = max_radius; // Max radius of tree

	this.rings = [];
	this.current_radius = 0;
	this.zoff = 0; // Noise offset
	this.z_inc = 0.02 // Noise increment

	this.codes = {
		0: 'small',
		1 : 'medium',
		2 : 'large',
		3 : 'bark',
	}

	if(theme == 'blue_wood') {
		this.colors = {
			'small': '#0a0429',
			'medium':'#b97c72',
			'large': '#f6fcee',
			'bark': '#080c55',
		};
	} else if (theme == 'grid') {
		this.colors = {
			'small': '#42403b',
			'medium':'#42403b',
			'large': '#42403b',
			'bark': '#42403b',
		};
	}
	else {
		this.colors = {
			'small': '#b95939',
			'medium':'#e78c4d',
			'large': '#fcc473',
			'bark': '#79271c',
		};

	}

	this.radius = {
		'small': 10,
		'medium': 20,
		'large': 30,
		'bark' : 40,
	}


	this.scale = function() {
		if(this.current_radius > this.max_radius) {
			// Scale all rings
			let scl = this.max_radius / this.current_radius;
			for(var i = 0; i < this.rings.length; i += 1) {
				this.rings[i].rescale(scl);
			}

			// Scale default radii
			for (var key of Object.keys(this.radius)) {
				this.radius[key] *= scl;
			}

			this.current_radius *= scl
		} else {
			//pass
		}
	}

	this.add = function(size_code) {
		let size = this.codes[size_code];
		let meshes = p.min(p.max(Math.floor(this.current_radius) ** 2, 20), 100)
		let noise_amplitude = p.map(this.current_radius, 0 ,this.max_radius, 0.1, 1.5)

		if( size == 'bark' ) {
			noise_amplitude = 1.5
		}

		this.rings.push(
			new Ring(
				p,
				this.current_radius,
				this.current_radius + this.radius[size],
				this.colors[size],
				meshes,
				noise_amplitude,
				this.zoff
			)
		)
		this.current_radius += this.radius[size]
		this.scale();
		this.zoff += this.z_inc;
	}

	this.show = function(style = 'normal') {
		p.push();
		p.translate(this.pos.x, this.pos.y);
		for(var i =  this.rings.length - 1; i > -1; i -= 1) {
			if(style == 'grid') {
				this.rings[i].show_grid();
			} else if(style == 'minimalist') {
				this.rings[i].show_minimalist()
			} else {
				this.rings[i].show()
			}
		}
		p.pop();
	}
}


var s = function( p ) { // p could be any variable name
	var tree = new Tree(p, p.createVector(0,0));

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(800, 400);
  };

	p.draw = function() {
		//p.background(55);
		let trees = 23
		for (var i = 0; i < trees; i += 1) {
			let radius = p.random(90, 200);
			let rings = p.random(10,30);
			tree = new Tree(p, p.createVector(p.random(0, p.width), p.random(0, p.height)), radius);
			for(var j = 0; j < rings; j += 1) {
				tree.add(p.random([0,1,2]))
			}
			tree.show('wood')
		}
		p.noLoop()
  };

	p.windowResized = function() {
		mwidth = document.getElementById("c1").offsetWidth;
		/*mheight = document.getElementById("c1").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);

		// Don't forget to resize all positions as well
		x = mwidth / 2;
	};
};
var myp51 = new p5(s, 'c1');
