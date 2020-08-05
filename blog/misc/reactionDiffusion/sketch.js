var s = function( p ) { // p could be any variable name
  var grid;
  var next;
  var running = false;

  var dA = 0.2;
  var dB = 0.1;
  var feed = 0.0208;
  var k = 0.0576;

  //  var dA = 0.14;
  //  var dB = 0.06;
  //  var feed = 0.035;
  //  var k = 0.065;

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

    for (var i = p.width / 2; i < 1.1 * (p.width / 2); i++) {
      for (var j = p.height / 2; j < 1.1 * (p.height / 2); j++) {
        grid[i][j].b = 1;
      }
    }

    p.noLoop()
  }

  p.draw = function() {
    for (var x = 1; x < p.width - 1; x++) {
      for (var y = 1; y < p.height - 1; y++) {
        var a = grid[x][y].a;
        var b = grid[x][y].b;
        next[x][y].a = a + dA * laplaceA(x, y) - a * b * b + feed * (1 - a);
        next[x][y].b = b + dB * laplaceB(x, y) + a * b * b - (k + feed) * b;

        //next[x][y].a = p.constrain(next[x][y].a, 0, 1);
        //next[x][y].b = p.constrain(next[x][y].b, 0, 1);
      }
    }

    p.loadPixels();
    for (var x = 0; x < p.width; x++) {
      for (var y = 0; y < p.height; y++) {
        var pix = (x + y * p.width) * 4;
        var a = next[x][y].a;
        var b = next[x][y].b;
        var c = 255 - p.floor(a * 255);

        //c = p.constrain(c, 110, 255);
        
        p.pixels[pix + 0] = c;
        p.pixels[pix + 1] = 40;
        p.pixels[pix + 2] = 40;
        p.pixels[pix + 3] = 255;
      }
    }
    p.updatePixels();

    swap();
  }

  function laplaceA(x, y) {
    var sumA = 0;
    sumA += grid[x][y].a * -4;
    sumA += grid[x - 1][y].a;
    sumA += grid[x + 1][y].a;
    sumA += grid[x][y + 1].a;
    sumA += grid[x][y - 1].a;
    return sumA;
  }

  function laplaceB(x, y) {
    var sumB = 0;
    sumB += grid[x][y].b * -4;
    sumB += grid[x - 1][y].b;
    sumB += grid[x + 1][y].b;
    sumB += grid[x][y + 1].b;
    sumB += grid[x][y - 1].b;
    return sumB;
  }

  function swap() {
    var temp = grid;
    grid = next;
    next = temp;
  }

  p.mousePressed = function() {
    // Check if mouse is inside the circle
    if ( p.mouseY > 0 && p.mouseY < p.height) {
      if ( p.mouseX > 0 && p.mouseX < p.width ) {
        if ( ! running ) {
          p.loop();
          //myp53.running = false;
          //myp53.noLoop()
          //myp54.running = false;
          //myp54.noLoop()
          running = true;
          //console.log("PARTICLES running")
        } else {
          p.noLoop();
          running = false;
          //console.log("PARTICLES stoped")
        }
      }
    }
  }
};

var myp51 = new p5(s, 'c1');

