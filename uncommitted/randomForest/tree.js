function Leaf() {
	this.show = function() {};
	this.draw_lines = function() {};
}


function Branch(p, length, angle, width, color, depth, base_vertexes, n_stripes=6, n_details=6, is_leaf=false) {
	this.length = length;
	this.angle =  angle;
	this.width = width;
	this.half_width = this.width / 2;
	this.color = color;
	this.depth = depth;
	this.base_vertexes = base_vertexes;
	this.n_stripes = n_stripes;
	this.n_details = n_details; // Number of points in each bezier curve
	this.is_leaf == is_leaf;

	this.right_branch = new Leaf();
	this.main_branch = new Leaf();
	this.left_branch = new Leaf();

	this.check_leaf = function() {
		return ((this.left_branch instanceof Leaf) && (this.right_branch instanceof Leaf))
	}

	this.heading_x = p.cos(this.angle);
	this.heading_y = p.sin(this.angle);

	// Generating the bezier details of this branch
	this.controls_1 = {};
	this.controls_2 = {};
	this.anchors = {};

	this.generate_details = function() {
		let x_speed = 0.1;
		let xoff = 0.0 + x_speed * this.depth;
		let noise_amp = 20;

		// generate a bezier curve for each stripe
		for(var i = 0; i < this.n_stripes; i += 1) {
			this.controls_1[i] = new Array();
			this.controls_2[i] = new Array();
			this.anchors[i] = new Array();

			let base_y = this.base_vertexes[i].y;
			let y_width = base_y ?? (i * (this.width / this.n_stripes)) - this.half_width;
			let vertexes = this.n_details * 3;

			for(var j = 0; j <= vertexes; j += 3) {
				xoff += x_speed;
				dy = noise_amp * (2 * p.noise(xoff) - 1)
				this.controls_1[i].push({
					x: (j / (vertexes + 2)) * this.length,
					y: y_width + dy,
				})

				xoff += x_speed;
				dy = noise_amp * (2 * p.noise(xoff) - 1)
				this.controls_2[i].push({
					x: ((j + 1) / (vertexes + 2)) * this.length,
					y: y_width + dy,
				})

				xoff += x_speed;
				dy = noise_amp * (2 * p.noise(xoff) - 1)
				this.anchors[i].push({
					x: ((j + 2) / (vertexes + 2)) * this.length,
					y:  y_width + dy,
				})

			}
		}
	}

	// Function to gather the end of each branch detail stripe
	this.get_final_vertexes = function() {
		let out = new Array();
		for(var i = 0; i < this.n_stripes; i += 1) {
			out.push(this.anchors[i][this.anchors[i].length - 1]);
		}
		return out;
	}

	// Print the tree struct with rects
	this.show = function() {
		p.push()
		p.rotate(this.angle);
		//p.fill(this.color);
		p.rect(0, -this.half_width, this.length, this.width);
		p.translate(this.length, 0);
		this.right_branch.show();
		p.pop()

		if(this.main_branch) {
			p.push()
			p.rotate(this.angle);
			p.translate(this.length, 0);
			this.main_branch.show();
			p.pop()
		}

		p.push()
		p.rotate(this.angle);
		p.translate(this.length, 0);
		this.left_branch.show();
		p.pop()
	}

	// Print the tree branch details
	this.draw_lines = function() {
		p.push()
		p.rotate(this.angle);
		p.noFill();
		p.stroke(this.color);
		p.strokeWeight(1);
		for(var i = 0; i < this.n_stripes; i += 1) {
			// The Detail line is a beizier curve with n_details vetexes
			p.beginShape()

			// start detail line
			p.vertex(
				0, // 1st anchor x
				this.base_vertexes[i].y, // 1st anchor x
			)

			// add bezier details
			for(var j = 0; j < this.anchors[i].length; j += 1) {
				p.bezierVertex(
					this.controls_1[i][j].x,
					this.controls_1[i][j].y,
					this.controls_2[i][j].x,
					this.controls_2[i][j].y,
					this.anchors[i][j].x,
					this.anchors[i][j].y,
				)
			}

			p.endShape()
		}

		p.translate(this.length, 0);

		this.right_branch.draw_lines();
		p.pop()

		if(this.main_branch) {
			p.push()
			p.rotate(this.angle);
			p.translate(this.length, 0);
			this.main_branch.draw_lines();
			p.pop()
		}

		p.push()
		p.rotate(this.angle);
		p.translate(this.length, 0);
		this.left_branch.draw_lines();
		p.pop()
	}

}

create_branch = function(p, length, angle, width, color, depth, max_depth, base_vertexes, is_main) {
	// Recusive function to generate a tree
	// Stop condition
	if (depth >= max_depth) {
		return new Leaf();
	}

	// current branch
	var branch = new Branch(p, length, angle, width, color, depth, base_vertexes)
	branch.generate_details();
	let end_vertexes = branch.get_final_vertexes();

	// Main branch
	//length_delta = p.random(0.94, 0.97);
	if(is_main) {
		length_delta = 0.9;
		angle_delta = p.random(-p.QUARTER_PI, p.QUARTER_PI) * 0.01;
		width_delta = 0.7;
		branch.main_branch = create_branch (
			p,
			length * length_delta,
			angle_delta,
			width * width_delta,
			color,
			depth + 1,
			max_depth,
			end_vertexes,
			true
		)
	} else {
		branch.main_branch = new Leaf();
	}

	// Rigt branch
	//length_delta = p.random(0.94, 0.97);
	length_delta = p.random(0.6, 1.05);
	angle_delta = p.random(-p.QUARTER_PI, p.QUARTER_PI) * 0.7;
	width_delta = p.random(0.7, 0.9);
	branch.right_branch = create_branch (
		p,
		length * length_delta,
		angle + angle_delta,
		width * width_delta,
		color,
		depth + 1,
		max_depth,
		end_vertexes,
		false
	)

	// left branch
	//length_delta = p.random();
	length_delta = p.random(0.6, 1.05);
	width_delta = p.random(0.1, 0.5);
	angle_delta = p.random(-p.QUARTER_PI, p.QUARTER_PI) * 0.05;
	branch.left_branch = create_branch (
		p,
		length * length_delta,
		angle + angle_delta,
		width * width_delta,
		color,
		depth + 1,
		max_depth,
		end_vertexes,
		false
	)

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
