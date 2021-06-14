function Leaf() {
	this.show = function() {};
	this.draw_lines = function() {};
}

function Branch(p, base_points, length, angle, is_leaf=false) {
	this.base_points = base_points;
	this.length = length;
	this.angle = angle;
	this.is_laef = is_leaf;
	this.sub_branches = new Array();
	this.width = this.base_points.left.y - this.base_points.right.y ?? 10


	this.tip = {left: {}, right: {}};

	// Avoid multiple cossine calculations and improve readability
	let dx = length * p.cos(this.angle)
	let dy = this.length * p.sin(this.angle)
	
	// If the branch makes a turn left(right) we increase(lower)
	// the length of the left side to improve the final visualization
	let left_turn_correction = this.angle < 0 ? 1.1 : 0.9;

	this.tip.left = {
		x: this.base_points.left.x + left_turn_correction * dx,
		y: this.base_points.left.y + left_turn_correction * dy,
	}
	this.tip.right = {
		x: this.base_points.right.x + dx,
		y: this.base_points.right.y + dy,
	}

	this.get_tip = function() {
		return this.tip;
	}

	this.show = function(left_points, right_points) {
		if (Array.isArray(this.sub_branches) && this.sub_branches.length) {
			for(const sub_branch of this.sub_branches) {
				// Make copy of argument arrays
				left_points_new = [...left_points]
				right_points_new = [...right_points]
				
				// add curet points to colleciton
				left_points_new.push(this.tip.left);
				right_points_new.push(this.tip.right);

				// Call branch
				sub_branch.show(left_points_new, right_points_new);
			}
		} else {
			p.push();
			p.beginShape();
			p.fill(this.color);
			p.stroke(this.color);
			// add all left points to shape
			for(const point of left_points) {
				p.vertex(point.x, point.y);
			}
			// add all right points pro tip to base to shape
			for(const point of right_points.reverse()) {
				p.vertex(point.x, point.y);
			}

			p.endShape(p.CLOSE);
			p.pop();
		}

	}
}


create_branch = function(p, length, angle, width, color, depth, max_depth, base_vertexes, is_main) {
	// Recusive function to generate a tree
	// Stop condition
	if (depth >= max_depth) {
		return ;
	}

	branch = new Branch(p, base_points={}, length=10, angle=p.PI, is_leaf=false)

	let right_prob = 0.2;
	let left_prob = 0.2;
	let leaf_prob = 0.1;

	if(p.random()) < right_prob) {
		branch.sub_branches.push(

		)
	}

	// current branch
	var branch = new Branch(p, length, angle, width, color, depth, base_vertexes)
	return branch
}


function Tree(p, pos_x, pos_y, root_length, root_width, root_clr) {
	this.pos_x = pos_x;
	this.pos_y = pos_y;
	this.root_length = root_length;
	this.root_width = root_width;
	this.root_clr = root_clr;
	this.max_depth = 4 //p.random(4, 6)
	this.n_stripes = 6;

	let base_vertexes = []
	for(var i = 0; i <= this.n_stripes; i += 1) {
		base_vertexes.push(this.root_width / (i + 1));
	}


	this.tree = create_branch(p, root_length, 0, root_width, root_clr, 0, this.max_depth, base_vertexes, true);
	// this.tree.color = p.color(100,0,0);

	this.show = function() {
		p.push()
		p.strokeWeight(0)
		p.translate(this.pos_x, this.pos_y);
		p.rotate(-p.HALF_PI);
		this.tree.show()
		p.pop()
	}

	this.draw_lines = function() {
		p.push()
		p.strokeWeight(1)
		p.translate(this.pos_x, this.pos_y);
		p.rotate(-p.HALF_PI);
		this.tree.draw_lines()
		p.pop()
	}

}
