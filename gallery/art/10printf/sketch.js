function generatePattern(p, scl = 10, clr = '#000000', hilight_clr = '#E6D2A5',  hlght_prob = 0.1) {

	let prob = p.random(0.25, 0.75);
	let noise_speed = 0.05;

	p.push();
	p.colorMode(p.HEX)	
	for(var i = 0; i < p.width / scl; i += 1) {
		for(var j = 0; j < p.height / scl; j += 1) {
			c = clr;
			if(p.random() < 0.4) {
				c = p.lerpColor(p.color(clr), p.color(hilight_clr), p.noise(i * noise_speed, j * noise_speed));
			}
			p.stroke(c);
			p.strokeWeight(2.);
			p.strokeCap(p.ROUND)
			if(p.random() < prob) {
				p.line(i * scl, j * scl, (i + 1) * scl, (j + 1) * scl);
			} else {
				p.line((i + 1) * scl, j * scl, i * scl, (j + 1) * scl);
			}
		}
	}
	p.pop();
}

var s = function( p ) { // p could be any variable name

  p.setup = function() {
		//var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(900, 500);
  };

	p.draw = function() {
		generatePattern(p);
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
