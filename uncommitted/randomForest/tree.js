function Leaf() {
	this.show = function() {};
}


function Branch(p, length, angle, width, color, depth) {
	this.length = length;
	this.angle =  angle;
	this.width = width;
	this.color = color;
	this.depth = depth;

	this.right_branch = new Leaf();
	this.left_branch = new Leaf();

	this.show = function() {
		p.push()
		p.rotate(this.angle);
		p.fill(this.color);
		p.rect(0, -this.width / 2, this.length, this.width);
		p.translate(this.length, 0);
		this.right_branch.show();
		p.pop()

		p.push()
		p.rotate(this.angle);
		p.translate(this.length, 0);
		this.left_branch.show();
		p.pop()
	}
}

create_branch = function(p, length, angle, width, color, depth, max_depth) {
	// Recusive function to generate a tree
	// Stop condition
	if (depth >= max_depth) {
		return new Leaf();
	}

	// current branch
	var branch = new Branch(p, length, angle, width, color, depth)

	// Rigt branch
	//length_delta = p.random(0.94, 0.97);
	length_delta = 0.9;
	angle_delta = p.random(-p.QUARTER_PI / 4, p.QUARTER_PI / 4);
	width_delta = p.random(0.94, 0.97);
	branch.right_branch = create_branch (
		p,
		length * length_delta,
		angle + angle_delta,
		width * width_delta,
		color,
		depth + 1,
		max_depth
	)

	// left branch
	//length_delta = p.random();
	length_delta = 0.8;
	width_delta = p.random(0.4, 0.7);
	branch.left_branch = create_branch (
		p,
		length * length_delta,
		angle - angle_delta,
		width * width_delta,
		color,
		depth + 1,
		max_depth
	)

	return branch
}


function Tree(p, pos_x, pos_y, root_length, root_width, root_clr) {
	this.pos_x = pos_x;
	this.pos_y = pos_y;
	this.root_length = root_length;
	this.root_width = root_width;
	this.root_clr = root_clr;
	this.max_depth = p.random(6, 10)


	this.tree = create_branch(p, root_length, 0, root_width, root_clr, 0, this.max_depth);
	this.tree.color = p.color(100,0,0);
	console.log(this.tree)

	this.show = function() {
		p.strokeWeight(0)
		p.translate(this.pos_x, this.pos_y);
		p.rotate(-p.HALF_PI);
		this.tree.show()
	}
}
