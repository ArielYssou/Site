function setup() {
	myWidth = document.getElementById("tree_rain").offsetWidth
	myHeight = document.getElementById("tree_rain").offsetHeight
	let canvas = createCanvas(myWidth, myHeight);
	colorMode(RGB);
	scene = Scene(7, 200)
	canvas.parent('tree_rain');
}

function draw() {
	background(55);

	scene.show()
}

function Scene(segments, drops) {
	var scene = {}

	scene.tree = Tree(segments)

	scene.droplets = []
	scene.splashes = []
	scene.droped_leafs = []
	scene.leaf_prob = 0.01
	scene.splash_prob = 0.2

	scene.grav = 1.5
	scene.wind = 0

	while (scene.droplets.length < drops) {
		scene.droplets.push(droplet(randomGaussian(7, 2), scene.grav, scene.wind));
	}

	scene.show = function() {
		if(frameCount % 20 === 0)
			scene.wind = map(noise(frameCount), 0, 1, 0.000, 0.0035)

		var posx = width/2
		var posy = height
		var theta = scene.tree.branches[0].theta
		posx += scene.tree.branches[0].len * cos(theta)
		posy -= scene.tree.branches[0].len * cos(theta)

		for(w=1; w < scene.tree.branches.length; w += 1) {
			posx += scene.tree.branches[w].len * sin(theta)
			posy -= scene.tree.branches[w].len * cos(theta)
			theta += scene.tree.branches[w].theta
			if(random() < scene.leaf_prob ) {
				scene.droped_leafs.push(
					Leaf(
						randomGaussian(posx, 0.1),
						randomGaussian(posy, 0.1),
						6, 0, 0, 0, scene.tree.top_clr
					)
				);
			}
		}
		// Droped Leafs dynamics
		for(j=0; j < scene.droped_leafs.length; j += 1) {
			scene.droped_leafs[j].acc.x = 5 * scene.wind
			scene.droped_leafs[j].acc.y = scene.grav/80
			scene.droped_leafs[j].update()
			if(scene.droped_leafs[j].frames > scene.droped_leafs[j].max_frames)
				scene.droped_leafs.splice(j,1);
		}
		for(j=0; j < scene.droped_leafs.length; j += 1)
			scene.droped_leafs[j].show()
		
		for(i = 0; i < scene.droplets.length/2; i += 1) {
			scene.droplets[i].show()
			scene.droplets[i].update()
			scene.droplets[i].acc.x = 500 * scene.wind 

			if( scene.droplets[i].pos.y > height ) {
				dp = scene.droplets[i];
				scene.droplets[i] = droplet(
					randomGaussian(7,2),
					scene.grav,
					scene.wind,
					dp.vel.x);
			}
		}

		scene.tree.update_dynamics(scene.wind)
		scene.tree.draw()

		for(i = Math.ceil(scene.droplets.length/2); i < scene.droplets.length; i += 1) {
			scene.droplets[i].show()
			scene.droplets[i].update()
			scene.droplets[i].acc.x = 500 * scene.wind


			if( scene.droplets[i].pos.y > height ) {
				dp = scene.droplets[i];
				scene.droplets[i] = droplet(randomGaussian(7,2), scene.grav, scene.wind, dp.vel.x)
				
				if(random() < scene.splash_prob) {
					scene.splashes.push(
						splash(dp.pos.x, dp.pos.y,
							5, -dp.vel.y/4,
							scene.wind, scene.grav, 4)
					);
					scene.splashes.push(
						splash(dp.pos.x, dp.pos.y,
							-5, -dp.vel.y/4,
							scene.wind, scene.grav, 4)
					);
				}
			}
		}

		
		for(i = 0; i < scene.splashes.length; i += 1) {
			scene.splashes[i].show()
			scene.splashes[i].update()
			if ( scene.splashes[i].pos.y > height )
				scene.splashes.splice(i, 1);
		}
		

	}

	return scene;
}

