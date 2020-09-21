var s = function( p ) { 
  p.setup = function() {
    myWidth = document.getElementById("tree_rain").offsetWidth
    myHeight = 0.5 * myWidth;
    p.createCanvas(myWidth, myHeight);
    p.colorMode(p.RGB);
    scene = Scene(p, 7, 200)
  }

  p.draw = function() {
    p.background(55);
    scene.show()
  }

  function Scene(p, segments, drops) {
    var scene = {}
    scene.tree =  new Tree(p, segments, leaf_prob = 0.01);
    scene.rain = Rain(p, drops, splash_prob = 0.2);
    //console.log(scene.rain)

    scene.grav = 1
    scene.wind = 0

    scene.show = function() {
      if(p.frameCount % 20 === 0)
        scene.wind = p.noise(p.frameCount) / 300

      scene.rain.show('background');
      scene.tree.show()
      scene.rain.show('foreground');
      scene.rain.show_splashes();

      scene.rain.update(scene.wind, scene.grav);
      scene.tree.update(scene.wind, scene.grav)
    }

    return scene;
  }
};

var myp51 = new p5(s, 'tree_rain');

var s = function( p ) { 
  p.setup = function() {
    myWidth = document.getElementById("rain").offsetWidth
    myHeight = 0.5 * myWidth;
    p.createCanvas(myWidth, myHeight);
    p.colorMode(p.RGB);
    rain_scene = Rain_Scene(p, 7, 200)
  }

  p.draw = function() {
    p.background(55);
    rain_scene.show()
  }

  function Rain_Scene(p, segments, drops) {
    var scene = {}
    scene.rain = Rain(p, drops, splash_prob = 0.2);
    //console.log(scene.rain)

    scene.grav = 1
    scene.wind = 0

    scene.show = function() {
      if(p.frameCount % 20 === 0)
        scene.wind = p.noise(p.frameCount) / 300

      scene.rain.show('all');
      scene.rain.show_splashes();
      scene.rain.update(scene.wind, scene.grav);
    }

    return scene;
  }
};

var myp52 = new p5(s, 'rain');

var s = function( p ) { 
	var naked_tree;
  var grav = 1
  var wind = 0

  p.setup = function() {
    myWidth = document.getElementById("branch").offsetWidth;
    //myHeight = document.getElementById("branch").offsetHeight
    myHeight = 0.5 * myWidth;
    p.createCanvas(myWidth, myHeight);
    p.colorMode(p.RGB);
		naked_tree = new Tree(p, 7, leaf_prob = 0.01, visible_leafs = false);
  }

  p.draw = function() {
    p.background(55);

		if(p.frameCount % 20 === 0)
			wind = p.noise(p.frameCount) / 300

		naked_tree.show(false)
		naked_tree.update(wind, grav)

  }
};

var myp53 = new p5(s, 'branch');

