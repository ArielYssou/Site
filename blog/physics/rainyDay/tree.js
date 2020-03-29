function pineLeaf(clr) {
	var leaf = {};
	leaf.clr = clr

	leaf.draw = function(x, y, wdth, len) {
		push()
		fill(leaf.clr)
		triangle(
			x + wdth/2, y,
			x, y + len,
			x - wdth/2, y
		);
		pop()
	}
	return leaf
}

function Leaf(x, y, velx, vely, accx, accy, clr, m = 15) {
	var leaf = {};

	leaf.pos = createVector(x, y, 0);
	leaf.vel = createVector(velx, vely, 0);
	leaf.acc = createVector(accx, accy, 0);

	leaf.m = m
	leaf.clr = clr
	leaf.display_clr = clr

	leaf.frames = 0
	leaf.max_frames = randomGaussian(130, 30)

	leaf.update = function() {
		leaf.vel.add(leaf.acc);
		leaf.pos.add(leaf.vel);
		leaf.frames += 1;
		leaf.display_clr = lerpColor(
			leaf.clr,
			color(55,55,55), //Background color
			leaf.frames/leaf.max_frames);
	};

	leaf.show = function() {
		push()
		strokeWeight(0)
		fill(leaf.display_clr)
		triangle(
			leaf.pos.x + leaf.m/2, leaf.pos.y,
			leaf.pos.x, leaf.pos.y + leaf.m,
			leaf.pos.x - leaf.m/2, leaf.pos.y
		);
		pop()
	}

	return leaf;
}

function Branch(mass, k, len, clr, theta = 0, omega = 0, alpha = 0) {
	var branch = {}

	branch.mass = mass
	branch.k = k
	branch.len = len
	branch.clr = clr

	branch.wdth = branch.len / 3

	branch.theta = theta
	branch.omega = omega
	branch.alpha = alpha

	branch.Fres = 0
	branch.CM = branch.len / 2

	branch.leafs = []

	branch.update = function() {
		branch.omega += branch.alpha 
		branch.theta += branch.omega
	}

	branch.draw = function(x, y) {
		push()
		fill(branch.clr);
		rect(x + branch.wdth/2, y, -branch.wdth, -branch.len)
		pop()
	}

	branch.draw_leafs = function(x, y) {
		push()
		for(j = 0; j < branch.leafs.length; j += 1) 
			branch.leafs[j].draw(x, y, - 6 * branch.wdth, -2 * branch.len);
		pop()
	}

	return branch;
}

function Tree(segments) {
	var tree = {}

	tree.branches = []

	//tree.btn_clr = color(38, 104, 36)
	tree.btn_clr = color(79, 91, 25)
	tree.top_clr = color(48, 130, 45)
	tree.brk_clr = color(170, 126, 76)

	tree.leaf_prob = 0.1;

	for(i = 0; i < segments; i += 1) {
			tree.branches.push(Branch(3, 0.03, height/(2.3*(i+2)), tree.brk_clr));
		if(i > 0)
			tree.branches[i].leafs.push(pineLeaf(lerpColor(tree.btn_clr, tree.top_clr, i/segments)));
			//tree.branches[i].leafs.push(pineLeaf(tree.top_clr));
		else
			tree.branches[i].len = height / 10
	}

	tree.draw = function() {
		push()
		translate(width / 2, height)
		for(i = 0; i < tree.branches.length; i += 1) {
			tree.branches[i].draw(0, 0)
			rotate(tree.branches[i].theta)
			translate(0, -tree.branches[i].len)

		}
		pop()

		push()
		translate(width / 2, height)
		for(i = 0; i < tree.branches.length; i += 1) {
			tree.branches[i].draw_leafs(0, 0)
			rotate(tree.branches[i].theta)
			translate(0, -tree.branches[i].len)
		}

		pop()
	}

	tree.update_dynamics = function(Fwind = 0) {
		displacement = 0;
		var grav = 0.2;
		var Fel, Fres, Ftot;

		for(i = 0; i < tree.branches.length; i += 1) {
			sine = sin(tree.branches[i].theta)

			displacement = tree.branches[i].theta
			Fel = - displacement * tree.branches[i].k 

			Fres =  - tree.branches[i].omega * 0.1

			if( abs(tree.branches[i].theta) > PI /2) {Fwind = 0};

			Ftot = Fwind*cos(tree.branches[i].theta)+ Fel + Fres
			tree.branches[i].alpha = Ftot 

			tree.branches[i].update()
		}
	}

	return tree;
}

