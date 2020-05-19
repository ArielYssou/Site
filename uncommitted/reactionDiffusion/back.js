// ############################################################
var s = function( p ) { // p could be any variable name
	var Da = 1; // Difusion rate for A particles
	var Db = 0.5; // Difusion rate for B particles
	var f = 0.0367; // feed rate (cration of particles A)
	var k = 0.0649 // kill rate for particles b

	var sites = [];
	var sites_alt = [];

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    //p.createCanvas(myWidth, 200);
    p.createCanvas(150, 150);
		//p.pixelDensity(1);

		sites = [];
		sites_alt = [];
		for (var x = 0; x < p.width; x++) {
			sites[x] = [];
			sites_alt[x] = [];
			for (var y = 0; y < p.height; y++) {
				sites[x][y] = {
					a: 1,
					b: 0
				};
				sites_alt[x][y] = {
					a: 1,
					b: 0
				};
			}
		}

		for (var i = 75; i < 76; i++) {
			for (var j = 75; j < 76; j++) {
				sites[i][j].b = 1;
			}
		}

//		for(var i = 0; i < p.width; i++) {
//			sites.push([]);
//			sites_alt.push([]);
//			for( var j = 0; j < p.height; j++ ) {
//				sites[i].push( new Site() );
//				sites_alt[i].push( new Site() );
//			}
//		}

  };

	p.draw = function() {
		p.background(53);

		for(var i = 1; i < p.width - 1; i++ ) {
			for(var j = 1; j < p.height - 1; j++ ) {
				var pixel = (i + j * p.width) * 4 // Pixels are acctually divided into 4
				var A = sites[i][j].a
				var B = sites[i][j].b

				sites_alt[i][j].a += Da * Laplace_a(i, j) - A * (B ** 2) + f * (1 - A)
				sites_alt[i][j].b += Db * Laplace_b(i, j) - A * (B ** 2) - (k + f) * B 

				sites_alt[i][j].a += p.constrain(sites_alt[i][j].a, 0 , 1)
				sites_alt[i][j].b += p.constrain(sites_alt[i][j].b, 0 , 1)

			}
		}

		p.loadPixels();
		for(var i = 0; i < p.width; i++ ) {
			for(var j = 0; j < p.height; j++ ) {
				var pix = (i + j * p.width) * 4 // Pixels are acctually divided into 4
				var A = sites_alt[i][j].a
				var B = sites_alt[i][j].b

				var clr = p.floor((A - B) * 255)
				clr = p.constrain(clr, 0, 255)

				p.pixels[pix + 0] = clr;
				p.pixels[pix + 1] = clr;
				p.pixels[pix + 2] = clr;
				p.pixels[pix + 3] = 255; //?
			}
		}
		p.updatePixels();
		//p.fill(255);
		
		swap();
	}

	function Site() {
		this.a = 0.7;
		this.b = 0.1;
	}

	function Laplace_a(i, j) {
		// Discrete laplace operator at site i, j of a grid using the 9 point stencil
		// To reduce computational burden try using the 5 point stecil:
		// Reference:	https://en.wikipedia.org/wiki/Discrete_Laplace_operator	

		var sum_a = 0;
		sum_a -= 1 * sites[i][j].a;
		sum_a += 0.2 * sites[i + 1][j].a;
		sum_a += 0.2 * sites[i - 1][j].a;
		sum_a += 0.2 * sites[i][j + 1].a;
		sum_a += 0.2 * sites[i][j - 1].a;
		sum_a += 0.05 * sites[i + 1][j + 1].a;
		sum_a += 0.05 * sites[i - 1][j - 1].a;
		sum_a += 0.05 * sites[i + 1][j + 1].a;
		sum_a += 0.05 * sites[i - 1][j - 1].a;
		//sum_a /= 518;

		return sum_a;
	}
	function Laplace_b(i, j) {
		// Discrete laplace operator at site i, j of a grid using the 9 point stencil
		var sum_b = 0;
		sum_b -= 1 * sites[i][j].b;
		sum_b += 0.2 * sites[i + 1][j].b;
		sum_b += 0.2 * sites[i - 1][j].b;
		sum_b += 0.2 * sites[i][j + 1].b;
		sum_b += 0.2 * sites[i][j - 1].b;
		sum_b += 0.05 * sites[i + 1][j + 1].b;
		sum_b += 0.05 * sites[i - 1][j - 1].b;
		sum_b += 0.05 * sites[i + 1][j + 1].b;
		sum_b += 0.05 * sites[i - 1][j - 1].b;
		//sum_b /= 518;

		return sum_b;
	}

	function swap() {
		var tmp = sites;
		sites = sites_alt;
		//sites_alt = tmp;
	}

	p.windowResized = function() {
		mwidth = document.getElementById("c1").offsetWidth;
		/*mheight = document.getElementById("c1").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);

		// Don't forget to resize all positions as well
		x = mwidth / 2;
	};
};
var myp51 = new p5(s, 'c1');


// ############################################################
// Sketch Two
var t = function( p ) { 
	var x, y;
  var speed = 2.5; 

  p.setup = function() {
		var myWidth = document.getElementById("c1").offsetWidth;
		/*var myHeight = document.getElementById("c1").offsetHeight;*/

    p.createCanvas(myWidth, 200);

		x = p.width / 2; 
		y = p.height / 2;
  };

  p.draw = function() {
    p.background(100);
    p.fill(1);
    x += speed; 
    if(x > p.width){
      x = 0; 
    }
    p.ellipse(x,y,50,50);

  };

	p.windowResized = function() {
		mwidth = document.getElementById("c2").offsetWidth;
		/*mheight = document.getElementById("c2").offsetHeight;*/
		p.resizeCanvas(mwidth, p.height);
	};
};
//var myp52 = new p5(t, 'c2');
