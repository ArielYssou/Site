gielis = function(phi, A, B, m, n1, n2, n3) {
    term1 = Math.cos((m * phi) / 4) / A
    term2 = Math.sin((m * phi) / 4) / B
    return ((Math.abs(term1) ** n2) + (Math.abs(term2) ** n3)) ** (-1 / n1)
}

function Leaf(p, detail, len, clr1, clr2, edge_clr) {
	this.detail = detail;
	this.len = len;
	this.clr1 = clr1;
	this.clr2 = clr2;
	this.edge_clr = edge_clr;

	this.midrip = new Array();
	this.upper_margin = new Array();
	this.lower_margin = new Array();

	this.gielis_params = {
        'A': 2,
        'B': 2,
        'm': 2,
        'n1': 1,
        'n2': 2,
        'n3': 1,
	}

	// Midrip main points positions
	var posx = -200;
	var dx =  (this.len + 40 * 2) / this.detail; 
	var posy = 0;

	var phi = p.PI; // angle for the gielis leaf curve
	var delta_phi = p.PI / this.detail;

	// main branch parameters
	var omega = (p.HALF_PI) / this.len;
	var main_amp = 0;

	for (var i = 0; i <= this.detail; i += 1) {
		console.log(phi)
		var midrip_pos = p.createVector(
				posx, 
				posy + main_amp * p.sin(omega * posx)
		)
		this.midrip.push(midrip_pos.copy())

		var gielis_radius = gielis(
			phi,
			this.gielis_params.A, 
			this.gielis_params.B, 
			this.gielis_params.m, 
			this.gielis_params.n1, 
			this.gielis_params.n2, 
			this.gielis_params.n3
		)
		gielis_radius *= 40;

		this.lower_margin.push(
			midrip_pos.copy().add(p.constructor.Vector.fromAngle(-phi).mult(gielis_radius))
		)
		this.upper_margin.push(
			midrip_pos.copy().add(p.constructor.Vector.fromAngle(+phi).mult(gielis_radius))
		)

		posx += dx;
		phi -= delta_phi;
	}

	posx -= 2 *  dx;
	var midrip_pos = p.createVector(
			posx, 
			posy + main_amp * p.sin(omega * posx)
	)
	this.midrip.push(midrip_pos.copy())
	var gielis_radius = gielis(
		phi,
		this.gielis_params.A, 
		this.gielis_params.B, 
		this.gielis_params.m, 
		this.gielis_params.n1, 
		this.gielis_params.n2, 
		this.gielis_params.n3
	)
	gielis_radius *= 40;

	this.lower_margin.push(
		midrip_pos.copy().add(p.constructor.Vector.fromAngle(-phi).mult(gielis_radius))
	)
	this.upper_margin.push(
		midrip_pos.copy().add(p.constructor.Vector.fromAngle(+phi).mult(gielis_radius))
	)

	console.log(this.upper_margin)
	console.log(this.lower_margin)
	console.log(this.midrip)

	this.draw = function() {
		for (var i = 1; i < this.midrip.length; i += 1) {
			// Margins - fill
			// Upper margin
			p.stroke(this.clr1)
			p.fill(this.clr1)
			p.quad(
				this.midrip[i - 1].x,
				this.midrip[i - 1].y,
				this.upper_margin[i - 1].x,
				this.upper_margin[i - 1].y,
				this.upper_margin[i].x,
				this.upper_margin[i].y,
				this.midrip[i].x,
				this.midrip[i].y,
			)
			//p.fill((i % 3) ? this.clr1 : this.clr2)
			p.quad(
				this.midrip[i - 1].x,
				this.midrip[i - 1].y,
				this.lower_margin[i - 1].x,
				this.lower_margin[i - 1].y,
				this.lower_margin[i].x,
				this.lower_margin[i].y,
				this.midrip[i].x,
				this.midrip[i].y,
			)

			// Margins
			// Upper margin
//			p.line(
//				this.upper_margin[i - 1].x,
//				this.upper_margin[i - 1].y,
//				this.upper_margin[i].x,
//				this.upper_margin[i].y,
//			)
			// Lower margin
//			p.line(
//				this.lower_margin[i - 1].x,
//				this.lower_margin[i - 1].y,
//				this.lower_margin[i].x,
//				this.lower_margin[i].y,
//			)

			p.stroke(this.clr2)
			p.strokeWeight(1)
			// Midrip
			p.line(
				this.midrip[i - 1].x,
				this.midrip[i - 1].y,
				this.midrip[i].x,
				this.midrip[i].y,
			)
			// Veins
			if( i % 1 == 0) {
				// Upper vein
				p.line(
					this.midrip[i - 1].x,
					this.midrip[i - 1].y,
					this.upper_margin[i - 1].x,
					this.upper_margin[i - 1].y,
				)
			}
			if( (i) % 1 == 0) {
				// Lower vein
				p.line(
					this.midrip[i - 1].x,
					this.midrip[i - 1].y,
					this.lower_margin[i - 1].x,
					this.lower_margin[i - 1].y,
				)
			}

		}
	}
}

var s = function( p ) { // p could be any variable name

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(800, 400);
  };

	p.draw = function() {
		//p.background(55);
		let elements = 1

		for (var i = 0; i < elements; i += 1) {
			let prob_leaf = 0.7;
			let autum_prob = 0.5;

			// var elem_pos = p.createVector(p.random(0, p.width), p.random(0, p.height))
			var elem_pos = p.createVector(400, 200)

			p.push()
			p.translate(400, 200)
			element = new Leaf(p, 20, 6 * 20, '#BDC667', '#77966D', '#ffffff');
			element.draw();

			p.pop()
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
