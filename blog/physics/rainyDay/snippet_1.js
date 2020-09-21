  function Scene(p, segments, drops) {
    var scene = {}
    scene.tree =  new Tree();
    scene.rain = new Rain();

    scene.grav = 1
    scene.wind = p.noise()

    scene.show = function{
			scene.tree.show()
			scene.rain.show()
      scene.rain.update(scene.wind, scene.grav);
      scene.tree.update(scene.wind, scene.grav);
    }

    return scene
	}
