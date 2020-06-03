// ############################################################
var s = function( p ) { // p could be any variable name
  p.setup = function() {
		var myWidth = document.getElementById("c1").offsetWidth;
		/* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(300, 300, p.WEBGL);
  };

  p.draw = function() {
    p.background(55);
	  p.ambientLight(150, 150, 150);
		p.pointLight(255, 25, 55, 150, 50, 100);
		p.noStroke()

		p.push();
		//p.specularMaterial(00);
		p.ambientMaterial(150, 150 ,150);
		//p.noFill();
		//p.stroke(255);
		//p.normalMaterial();
		//p.fill(250, 0, 0);
		p.translate(0, 0, 0);
		p.sphere(50);
		p.pop();

		p.stroke(10)
		p.line(0,0,0,100,100,10)
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
var myp52 = new p5(t, 'c2');
