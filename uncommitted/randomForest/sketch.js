// ############################################################
var s = function( p ) { // p could be any variable name
  var tree;

  p.setup = function() {
    var myWidth = document.getElementById("c1").offsetWidth;
    /* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(myWidth, 600);

		tree = new Tree(p, myWidth / 2, p.height, 100, 10, '#ffeabc')

  };

  p.draw = function() {
    //p.background(0);
    //p.fill(255);
		p.push()
    //tree.show()
		p.pop()
    tree.show()
		p.noLoop()
  };

  p.windowResized = function() {
    mwidth = document.getElementById("c1").offsetWidth;
    /*mheight = document.getElementById("c1").offsetHeight;*/
    p.resizeCanvas(mwidth, p.height);
    p.noLoop();
    running = false;

    // Don't forget to resize all positions as well
    x = mwidth / 2;
  };
};
var myp51 = new p5(s, 'c1');

