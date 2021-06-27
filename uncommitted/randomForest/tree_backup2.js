function Leaf() {
	this.show = function() {};
	this.draw_lines = function() {};
}

function Branch(p, base_points, length, angle, width_shrink, color, depth) {
	this.base_points = base_points;
	this.length = length;
	this.angle = angle;
	this.color = color;
	this.depth = depth;

	this.left_branch = null;
	this.right_branch = null;
	this.continuation = null;

	this.tip = {left: {}, right: {}};


	// If the branch makes a turn left(right) we increase(lower)
	// the length of the left side to improve the final visualization
	// let left_turn_correction = this.angle < 0 ? 1.1 : 0.9;
	this.heading = p.constructor.Vector.fromAngle(this.angle).mult(this.length); 
	this.width_heading = this.base_points.right.copy().sub(this.base_points.left).mult(width_shrink)

	this.tip.left = this.base_points.left.copy().add(this.heading).add(this.width_heading)
	this.tip.right = this.base_points.right.copy().add(this.heading).sub(this.width_heading)

	// List of bezier control points
	this.control_1_left = this.base_points.left.copy().add(p.constructor.Vector.fromAngle(this.angle * p.random(0.99, 1.01)).mult(this.length / 3))
	this.control_2_left = this.base_points.left.copy().add(p.constructor.Vector.fromAngle(this.angle * p.random(0.99, 1.01)).mult(2 * this.length / 3))
	this.control_1_right =this.base_points.right.copy().add(p.constructor.Vector.fromAngle(this.angle * p.random(0.99, 1.01)).mult(this.length / 3))
	this.control_2_right =this.base_points.right.copy().add(p.constructor.Vector.fromAngle(this.angle * p.random(0.99, 1.01)).mult(2 * this.length / 3))

	this.show = function(left_points, right_points, controls_1_left=[], controls_2_left=[], controls_1_right=[], controls_2_right=[]) {
		// add curet points to colleciton
		left_points.push(this.tip.left);
		right_points.push(this.tip.right);

		controls_1_left.push(this.control_1_left)
		controls_2_left.push(this.control_2_left)
		controls_1_right.push(this.control_1_right)
		controls_2_right.push(this.control_2_right)

		left_points_new = [...left_points]
		right_points_new = [...right_points]
		controls_1_left = [...controls_1_left]
		controls_2_left = [...controls_2_left]
		controls_1_right = [...controls_1_right]
		controls_2_right = [...controls_2_right]

		if (this.continuation != null) {
			this.continuation.show(left_points_new, right_points_new, controls_1_left, controls_2_left, controls_1_right, controls_2_right);
		} 

		if (this.left_branch != null) {
			this.left_branch.show([this.left_branch.base_points.left], [this.left_branch.base_points.right]);
		} 

		if (this.right_branch != null) {
			this.right_branch.show([this.right_branch.base_points.left], [this.right_branch.base_points.right]);
		} 

		if  ((this.continuation == null) && (this.left_branch == null) && ( (this.right_branch == null)) ) {
			p.push();
			p.fill(this.color);
			p.stroke(this.color);

			p.beginShape();
			p.vertex(left_points[0].x, left_points[0].y);
			// add all left points to shape
			for(var i = 1; i < left_points.length; i += 1) {
				p.bezierVertex(
					controls_1_left[i-1].x, controls_1_left[i-1].y,
					controls_2_left[i-1].x, controls_2_left[i-1].y,
					left_points[i].x, left_points[i].y,
				);
			}
			// add all right points pro tip to base to shape
			for(var i = right_points.length - 1; i > 0; i -= 1) {
				p.bezierVertex(
					controls_2_right[i-1].x, controls_2_right[i-1].y,
					controls_1_right[i-1].x, controls_1_right[i-1].y,
					right_points[i].x, right_points[i].y,
				);
			}
			p.vertex(right_points[0].x, right_points[0].y);

			p.endShape(p.CLOSE);
			p.pop();
		}

	}
}

function Tree(p, pos_x, pos_y, root_length, root_width, root_clr) {
	this.pos_x = pos_x;
	this.pos_y = pos_y;
	this.root_length = root_length;
	this.root_width = root_width;
	this.root_clr = root_clr;
	this.max_depth = 10 //p.random(4, 6)
	// this.n_stripes = 6;

	var create_branch = function(p, base_points, length, angle, width_shrink, color, depth, rel_depth, max_depth) {
		if (depth >= max_depth) {
			return ;
		}

		var branch = new Branch(p, base_points, length, angle, width_shrink, color, depth);

		if(p.random() < (0.99)) {
			let new_angle = angle + p.random(-p.HALF_PI / 4, p.QUARTER_PI / 4)
			let new_length = length * p.random(0.6, 0.99)
			width_shrink = p.random(0, 0.1)
			branch.continuation = create_branch(p, branch.tip, new_length, new_angle, width_shrink, color, depth + 1, rel_depth+ 1, max_depth)
		}

		if((p.random() < 0.4) && (rel_depth > 0)) {
			let new_angle = angle + p.random(-p.HALF_PI, -p.QUARTER_PI / 2)
			let new_length = length * p.random(0.6, 0.7)
			let delta_width = p.random(0.1, 0.6)
			let width = base_points.right.copy().sub(base_points.left).mag()
			let new_base_points = {
				left: base_points.left.copy(),
				right: base_points.left.copy().add(
					p.constructor.Vector.fromAngle(angle).mult(width * delta_width)
				),
			}
			branch.left_branch = create_branch(
				p,
				new_base_points,
				new_length,
				new_angle,
				width_shrink,
				color,
				depth + 1,
				0,
				max_depth
			)
		}

		if((p.random() < 0.4) && (rel_depth > 0)) {
			let new_angle = angle + p.random(p.HALF_PI, p.QUARTER_PI / 2)
			let new_length = length * p.random(0.6, 0.07)
			let delta_width = p.random(0.1, 0.6)
			let width = base_points.right.copy().sub(base_points.left).mag()
			let new_base_points = {
				left: base_points.right.copy(),
				right: base_points.right.copy().add(
					p.constructor.Vector.fromAngle(angle).mult(width * delta_width)
				),
			}
			branch.right_branch = create_branch(
				p,
				new_base_points,
				new_length,
				new_angle,
				width_shrink,
				color,
				depth + 1,
				0,
				max_depth
			)
		}	

		//TODO: add bifurcations
		
		return branch;
	}

	// The canvas will be translated to the roots position and rotated upwards, so no need to make these corrections here
	this.base_points = {
		left:  p.createVector(0, -this.root_width / 2),
		right:  p.createVector(0, +this.root_width / 2),
	}
	console.log('base points')
	console.log(this.base_points)

	this.tree = create_branch(
		p,
		base_points=this.base_points,
		length=root_length,
		angle=0,
		wid_contrationth=0,  // should not shink the main branch
		color=root_clr,
		depth=0,
		rel_depth=0,
		max_depth=this.max_depth
	);

	this.show = function() {
		p.push()
		p.strokeWeight(0)
		p.translate(this.pos_x, this.pos_y);
		p.rotate(-p.HALF_PI);
		this.tree.show(
			[this.base_points.left],
			[this.base_points.right]
		)
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
