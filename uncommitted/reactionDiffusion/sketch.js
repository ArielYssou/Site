// ############################################################
var s = function( p ) { // p could be any variable name
	// Daniel Shiffman
	// http://codingtra.in
	// http://patreon.com/codingtrain
	// Code for this video: https://youtu.be/BV9ny785UNc

	// Written entirely based on
	// http://www.karlsims.com/rd.html

	// Also, for reference
	// http://hg.postspectacular.com/toxiclibs/src/44d9932dbc9f9c69a170643e2d459f449562b750/src.sim/toxi/sim/grayscott/GrayScott.java?at=default

	var grid;
	var next;

	var dA = 1.1;
	var dB = 0.55;
	var feed = 0.0367;
	var k = 0.0649;

	p.setup = function(){
		p.createCanvas(200, 200);
		p.pixelDensity(1);
		grid = [];
		next = [];
		for (var x = 0; x < p.width; x++) {
			grid[x] = [];
			next[x] = [];
			for (var y = 0; y < p.height; y++) {
				grid[x][y] = {
					a: 1,
					b: 0
				};
				next[x][y] = {
					a: 1,
					b: 0
				};
			}
		}

		for (var i = 100; i < 110; i++) {
			for (var j = 100; j < 110; j++) {
				grid[i][j].b = 1;
			}
		}
	}

	p.draw = function() {
		p.background(51);

		for (var x = 1; x < p.width - 1; x++) {
			for (var y = 1; y < p.height - 1; y++) {
				var a = grid[x][y].a;
				var b = grid[x][y].b;
				next[x][y].a = a + dA * laplaceA(x, y) - a * b * b + feed * (1 - a);
				next[x][y].b = b + dB * laplaceB(x, y) + a * b * b - (k + feed) * b;

				next[x][y].a = p.constrain(next[x][y].a, 0, 1);
				next[x][y].b = p.constrain(next[x][y].b, 0, 1);
			}
		}

		p.loadPixels();
		for (var x = 0; x < p.width; x++) {
			for (var y = 0; y < p.height; y++) {
				var pix = (x + y * p.width) * 4;
				var a = next[x][y].a;
				var b = next[x][y].b;
				var c = p.floor((a - b) * 255);
				c = p.constrain(c, 0, 255);
				p.pixels[pix + 0] = c;
				p.pixels[pix + 1] = c;
				p.pixels[pix + 2] = c;
				p.pixels[pix + 3] = 255;
			}
		}
		p.updatePixels();

	swap();
	}

	function laplaceA(x, y) {
		var sumA = 0;
		sumA += grid[x][y].a * -1;
		sumA += grid[x - 1][y].a * 0.2;
		sumA += grid[x + 1][y].a * 0.2;
		sumA += grid[x][y + 1].a * 0.2;
		sumA += grid[x][y - 1].a * 0.2;
		sumA += grid[x - 1][y - 1].a * 0.05;
		sumA += grid[x + 1][y - 1].a * 0.05;
		sumA += grid[x + 1][y + 1].a * 0.05;
		sumA += grid[x - 1][y + 1].a * 0.05;
		return sumA;
	}

	function laplaceB(x, y) {
		var sumB = 0;
		sumB += grid[x][y].b * -1;
		sumB += grid[x - 1][y].b * 0.2;
		sumB += grid[x + 1][y].b * 0.2;
		sumB += grid[x][y + 1].b * 0.2;
		sumB += grid[x][y - 1].b * 0.2;
		sumB += grid[x - 1][y - 1].b * 0.05;
		sumB += grid[x + 1][y - 1].b * 0.05;
		sumB += grid[x + 1][y + 1].b * 0.05;
		sumB += grid[x - 1][y + 1].b * 0.05;
		return sumB;
	}

	function swap() {
		var temp = grid;
		grid = next;
		next = temp;
	}
};
var myp51 = new p5(s, 'c1');
