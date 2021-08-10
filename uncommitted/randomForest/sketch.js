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
	// TODO MELHORAR ESSA SINTAXEEEEEEEEE
	delta_angle = p.noise(this.base_points.left.x, this.base_points.left.y) * p.QUARTED_PI
	this.control_1_left = this.base_points.left.copy()
		.add(p.constructor.Vector.fromAngle(this.angle + delta_angle).mult(this.length / 3))

	delta_angle = p.noise(this.tip.left.x, this.tip.left.y) * p.QUARTED_PI
	this.control_2_left = this.base_points.left.copy()
		.add(p.constructor.Vector.fromAngle(this.angle + delta_angle).mult(2 * this.length / 3))

	delta_angle = p.noise(this.base_points.right.x, this.base_points.right.y) * p.QUARTED_PI
	delta_angle = p.random(-p.QUARTER_PI / 8, p.QUARTER_PI / 8)
	this.control_1_right = this.base_points.right.copy()
		.add(p.constructor.Vector.fromAngle(this.angle + delta_angle).mult(this.length / 3))

	delta_angle = p.noise(this.tip.right.x, this.tip.right.y) * p.QUARTED_PI
	delta_angle = p.random(-p.QUARTER_PI / 8, p.QUARTER_PI / 8)
	this.control_2_right = this.base_points.right.copy()
		.add(p.constructor.Vector.fromAngle(this.angle + delta_angle).mult(2 * this.length / 3))

	this.make_tips = function(p) {
		// This function detecte each branches tips and then stes its tip point to be equal and in the middle
		if ((this.continuation == null) && (this.left_branch == null) && ( (this.right_branch == null)) ) {
			this.tip.left.add(this.base_points.right.copy().sub(this.base_points.left).mult(0.5))
			this.tip.right.sub(this.base_points.right.copy().sub(this.base_points.left).mult(0.5))
		}

		if (this.continuation != null) {
			this.continuation.make_tips(p)
		}

		if (this.left_branch != null) {
			this.left_branch.make_tips(p)
		}

		if (this.right_branch != null) {
			this.right_branch.make_tips(p)
		}

	}

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
			this.continuation.show(
				left_points_new,
				right_points_new,
				controls_1_left,
				controls_2_left,
				controls_1_right,
				controls_2_right
			);
		}

		if (this.left_branch != null) {
			this.left_branch.show([this.left_branch.base_points.left], [this.left_branch.base_points.right]);
		}

		if (this.right_branch != null) {
			this.right_branch.show([this.right_branch.base_points.left], [this.right_branch.base_points.right]);
		}

		if ((this.continuation == null) && (this.left_branch == null) && ( (this.right_branch == null)) ) {
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

			p.vertex(right_points[right_points.length - 1].x, right_points[right_points.length - 1].y);
			// add all right points pro tip to base to shape
			for(var i = right_points.length - 1; i > 0; i -= 1) {
				p.bezierVertex(
					controls_2_right[i - 1].x, controls_2_right[i - 1].y,
					controls_1_right[i -1 ].x, controls_1_right[i - 1].y,
					right_points[i - 1].x, right_points[i - 1].y,
				);
			}
			p.vertex(right_points[0].x, right_points[0].y);

			p.endShape(p.CLOSE);

			left_points.splice(0, 2);
			right_points.splice(0, 2);

			p.pop();
		}

		// Draw leafs
		if (this.depth > 5) {
			for(var leaf_idx =0; leaf_idx < 5; leaf_idx += 1) {
				let clr = p.lerpColor(p.color('#6B793E'), p.color('#99AC5D'), p.random())
				//clr.setAlpha(70)
				p.fill(clr)
				p.push();
				p.strokeWeight(0)

				let dv = p.constructor.Vector.random2D().mult(30 * p.random())
				let v = this.tip.left.copy().add(dv)
				p.translate(v.x, v.y)
				//p.rotate(p.random(0, p.PI))
				p.rotate(dv.heading())

				p.quad(
					0, 0,
					4, 4,
					18, 0,
					4, -4,
				)
				p.pop();
			}
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
	this.base_points = {
		left: p.createVector(this.pos_x - (this.root_width / 2), this.pos_y),
		right: p.createVector(this.pos_x + (this.root_width / 2), this.pos_y),
	}

	var create_branch = function(p, base_points, length, angle, width_shrink, color, depth, rel_depth, max_depth) {
		if (depth >= max_depth) {
			return ;
		}

		var branch = new Branch(p, base_points, length, angle, width_shrink, color, depth);

		if(p.random() < (0.99)) {
			let new_angle = angle + p.random(-p.HALF_PI / 4, p.QUARTER_PI / 4)
			let new_length = length * p.random(0.6, 0.99)
			width_shrink = p.random(0.05, 0.2)
			branch.continuation = create_branch(
				p,
				branch.tip,
				new_length,
				new_angle,
				width_shrink,
				color,
				depth + 1,
				rel_depth+ 1,
				max_depth)
		}

		if((p.random() < 0.1) && (rel_depth > 0)) {
			let new_angle = angle + p.random(-p.QUARTER_PI / 2, -p.QUARTER_PI)
			let new_length = length * p.random(0.6, 0.7)
			let delta_width = p.random(0.7, 1)
			let width = base_points.right.copy().sub(base_points.left).mag()
			let new_base_points = {
				left: base_points.left.copy(),
				right: base_points.left.copy().add(p.constructor.Vector.fromAngle(angle).mult(width * delta_width)),
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

		if((p.random() < 0.1) && (rel_depth > 0)) {
			let new_angle = angle + p.random(0, p.QUARTER_PI)
			let new_length = length * p.random(0.6, 0.07)
			let delta_width = p.random(0.7, 1)
			let width = base_points.right.copy().sub(base_points.left).mag()
			let new_base_points = {
				left: base_points.right.copy().add(p.constructor.Vector.fromAngle(angle).mult(width * delta_width)),
				right: base_points.right.copy(),
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

		return branch;
	}



	this.tree = new Array();

	for(var i = 0; i < 10; i += 1) {
		var branch_offset = p.random(-15, 15)
		this.tree.push(
			create_branch(
				p,
				base_points={
					left: this.base_points.left.copy().sub(p.createVector(branch_offset, 0)),
					right: this.base_points.right.copy().sub(p.createVector(branch_offset, 0)),
				},
				length=root_length,
				angle=-p.HALF_PI,
				wid_contrationth=0,  // should not shink the main branch
				color=p.lerpColor(p.color('#715132'), p.color('#A57548'), p.random()),
				depth=0,
				rel_depth=0,
				max_depth=this.max_depth
			)
		)
	}

	for( branch of this.tree ) {
		branch.make_tips()
	}

	this.show = function() {
		for( branch of this.tree ) {
			p.push()
			p.strokeWeight(0)
			branch.show(
				[this.base_points.left],
				[this.base_points.right]
			)
			p.pop()
		}
	}

}

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


function Mondrian(p, width, height, method='fixed') {
	this.width = width;
	this.height = height;
	this.method = method;

	this.colors = {
		'red': p.color('#e5342e'),
		'blue': p.color('#4476a9'),
		'yellow': p.color('#f8e121'),
		'black': p.color('#1a1817'),
		'white': p.color('#faf7f5'),
	};

	// Repeating colros to cheaply increase selection probability
	this.color_list = [
		'red',
		'blue',
		'yellow',
		'black',
		'white', 'white', 'white', 'white',
	]

	this.horizontal_lines = [
		{x0: 0, x1: this.width, y0: 0, y1: 0},
		{x0: 0, x1: this.width, y0: this.height, y1: this.height}
	];
	this.vertical_lines = [
		{x0: 0, x1: 0, y0: 0, y1: this.height},
		{x0: this.width, x1: this.width, y0: 0, y1: this.height}
	];
	this.rects = [];

	this.base_size = 20;
	this.max_width_partition = Math.floor(this.width / this.base_size);
	this.max_height_partition = Math.floor(this.height / this.base_size);

	this.get_intersections = function(val, search_along='horizontal') {
		var intersections = new Array();
		var search_axis = (search_along == 'horizontal') ? 'x' : 'y';  // For horizontal intersections we check all
		var lines = (search_along == 'horizontal') ? this.horizontal_lines : this.vertical_lines;

		for(var idx = 0; idx < lines.length; idx += 1) {
			if ((val >= lines[idx][search_axis + '0']) && (val <= lines[idx][search_axis + '1'])) {
				intersections.push(lines[idx][(search_along == 'horizontal') ? 'y0' : 'x0']);
			}
		}
		return intersections;
	}

	// Should be only one funcion, but alas
	this.get_line_intersections = function(line, search_along='horizontal') {
		var intersections = new Array();

		if (search_along == 'horizontal') {
			var lines = this.horizontal_lines;
			for(var idx = 0; idx < lines.length; idx += 1) {

				var cond1 = (line.x0 >= lines[idx].x0);
				var cond2 = (line.x0 <= lines[idx].x1);
				var cond3 = (line.y0 <= lines[idx].y0);
				var cond4 = (line.y1 >= lines[idx].y1);

				if (cond1 && cond2 && cond3 && cond4) {
					intersections.push(lines[idx]);
				}
			}
		} else {
			var lines = this.vertical_lines;

			for(var idx = 0; idx < lines.length; idx += 1) {
				var cond1 = (line.y0 >= lines[idx].y0);
				var cond2 = (line.y0 <= lines[idx].y1);
				var cond3 = (line.x0 <= lines[idx].x0);
				var cond4 = (line.x1 >= lines[idx].x1);

				if (cond1 && cond2 && cond3 && cond4) {
					intersections.push(lines[idx]);
				}
			}
		}
		return intersections;
	}

	this.add_line = function() {
		var r = Math.random();

		if (r < 0.5) {
			// Vertical line
			if (this.method == 'random') {
				var new_pos = Math.random() * this.width;
			} else {
					var new_pos = Math.floor(this.max_width_partition * Math.random()) * this.base_size
			}
			
			// Check all possible intersections
			var intersections = this.get_intersections(new_pos, 'horizontal');

			// select two random positions to draw the new line
			var positions = [];
			var indexes = [...Array(intersections.length).keys()];

			var idx = indexes.splice(Math.floor(Math.random() * indexes.length), 1);
			positions.push( intersections[idx] )  

			idx = indexes.splice(Math.floor(Math.random() * indexes.length), 1);
			positions.push( intersections[idx] )

			positions.sort();

			this.vertical_lines.push({
				x0: new_pos,
				x1: new_pos,
				y0: positions[0],
				y1: positions[1],
			})
		} else {
			// Horizontal line
			if (this.method == 'random') {
				var new_pos = Math.random() * this.height;
			} else {
					var new_pos = Math.floor(this.max_height_partition * Math.random()) * this.base_size
			}
			
			// Check all possible intersections
			var intersections = this.get_intersections(new_pos, 'vertical');

			// select two random positions to draw the new line
			var positions = [];
			var indexes = [...Array(intersections.length).keys()];

			var idx = indexes.splice(Math.floor(Math.random() * indexes.length), 1)[0];
			positions.push( intersections[idx] )  

			idx = indexes.splice(Math.floor(Math.random() * indexes.length), 1)[0];
			positions.push( intersections[idx] )
			positions.sort();

			this.horizontal_lines.push({
				x0: positions[0],
				x1: positions[1],
				y0: new_pos,
				y1: new_pos,
			})
		}
	}

	this.detect_rectangles = function() {
		// Run throught all horizontal lines
		for (hline of this.horizontal_lines) {
			vertical_intersections = this.get_line_intersections(hline, 'vertical');
	

			// Decorate Sort Undecorate
			const dsu = (arr1, arr2) => arr1
				.map((item, index) => [arr2[index], item]) // add the args to sort by
				.sort(([arg1], [arg2]) => arg2 - arg1) // sort by the args
				.map(([, item]) => item); // extract the sorted items


			var vertical_positions = [] // along the x axis
			for (vline of vertical_intersections) {
				vertical_positions.push(vline.x0);
			}

			vertical_intersections = dsu(vertical_intersections, vertical_positions).reverse()

			for (var idx = 0; idx < vertical_intersections.length - 1; idx += 1) {
				line_start = vertical_intersections[idx];
				line_end = vertical_intersections[idx + 1];
				
				horizontal_intersections = this.get_line_intersections(line_start, 'horizontal')

				var horizontal_positions = []
				for (vline of horizontal_intersections) {
					horizontal_positions.push(vline.y0);
				}

				top_line = null;
				horizontal_intersections = dsu(horizontal_intersections, horizontal_positions)
				for (vline of horizontal_intersections) {
					if (vline.y0 < hline.y0) {
						top_line = vline
						break;
					}
				}

				if( top_line ) {
					this.rects.push({
						x: line_start.x0,
						y: top_line.y0,
						width: line_end.x0 - line_start.x0,
						height: hline.y0 - top_line.y0,
					})
				}

			}
 
		}
		console.log('detected rectangles:')
		console.log(this.rects)
	}
	
	this.generate = function(n_lines) {
		for (var i = 0; i < n_lines; i += 1) {
			this.add_line();
		}
	}

	this.show = function() {
		p.push()

		for (rect of this.rects) {
			var clr = this.colors[p.random(this.color_list)]
			p.fill(clr)
			p.rect(
				rect.x,
				rect.y,
				rect.width,
				rect.height,
			)
		}
		p.stroke('#ffeabc')
		for(line of [...this.horizontal_lines, ...this.vertical_lines]) {
			p.line(
				line.x0,
				line.y0,
				line.x1,
				line.y1,
			)
		}
		p.pop()

	}

}

var s2 = function( p ) { // p could be any variable name
  var mondrian;

  p.setup = function() {
    var myWidth = document.getElementById("c2").offsetWidth;
    /* var myHeight = document.getElementById("c1").offsetHeight; */
    p.createCanvas(600, 400);

		mondrian = new Mondrian(p, 600, 400)

		mondrian.generate(39)
		mondrian.detect_rectangles()
  };

  p.draw = function() {
    //p.background(0);
    //p.fill(255);
		p.push()
    mondrian.show()
		p.pop()
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
var myp51 = new p5(s2, 'c2');
