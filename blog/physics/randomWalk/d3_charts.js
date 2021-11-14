//
// Random Walk
//

function random_walker(run, p=0.5, steps=250) {
	var positions = new Array();
	var current_pos = 0;

	for(var step = 0; step <= steps; step += 1) {
		direction = (Math.random() < p) ? 1 : -1;
		current_pos += direction;
		positions.push({
			run: run,
			position: current_pos,
			step: step,
		})
	}
	return positions;
}

function rw_boundry(which='upper', p=0.5, steps=250, confidence_interval=3) {
	var sign = which == 'upper' ? 1 : -1;
	var positions = new Array();
	for(var i = 0; i <= steps; i += 1) {
		positions.push({
			x: i,
			y: sign * confidence_interval * Math.sqrt(4 * (p * (1 - p)) * i),
		})
	}

	return positions;
}



function RandomWalkChart() {
  var total_width = 720, // default width
      total_height = 300; // default height

	var margin = {top: 30, right: 90, bottom: 30, left: 90},
			width = total_width - margin.left - margin.right,
			height = total_height - margin.top - margin.bottom;

	var _max_steps = 350; _y_lim = 70;

  function my(selection) {
		// append the svg object to the body of the page
		svg_random_walk = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr('class', 'center')
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Add X axis
		var x_axis_plot = d3.scaleLinear()
			.domain([0, _max_steps])
			.range([0, width]);

		// Add Y axis
		var y_axis_plot = d3.scaleLinear()
			.domain([-_y_lim, _y_lim])
			.range([height, 0]);

		// Axes
		svg_random_walk.append("g")
				.attr("class", "x-axis")
				.attr("transform", "translate(" + 0 + "," + height + ")")
				.call(d3.axisBottom(x_axis_plot).ticks(10))
				.attr("class", "axisDarkTheme")

		var yAxis = svg_random_walk.append("g")
				.attr("class", "axisDarkTheme")
				.attr("class", "y-axis")
				.call(d3.axisLeft(y_axis_plot).ticks(7))
				.attr("class", "axisDarkTheme")

		// Labels
		svg_random_walk.append("text")
				.attr("class", "axis-title")
				.attr("text-anchor", "end")
				.attr('x', width)
				.attr("y", height - 10)
				.attr('fill', '#ffeabc')
				.text("Step")

		yAxis.append("text")
				.attr("class", "axis-title")
				.attr("text-anchor", "end")
				.attr("transform", "rotate(-90)")
				.attr("dy", "-1.35em")
				.attr("y", -16)
				.text("Position")

		// Make a random walk
		// ref: https://stackoverflow.com/questions/8689498/drawing-multiple-lines-in-d3-js
		for(run = 0; run < 50; run += 1) {
			positions = random_walker(run, p=0.5, _max_steps)
			rw_plot = svg_random_walk.append("path")
					.datum(positions)
					.attr("stroke", "#FF7E47")
					.attr('fill', 'none')
					.attr('opacity', 0.3)
					.attr("stroke-width", 2)
					.attr('d', d3.line()
						.x(function(d) { return x_axis_plot(d.step); })
						.y(function(d) { return y_axis_plot(d.position); })
						// .curve(d3.curveCatmullRom.alpha(0.5))
					)
		}

		var upper_boundry = rw_boundry('upper', p=0.5, _max_steps, confidence_interval=3);
		console.log(upper_boundry)
		svg_random_walk.append("path")
				.datum(upper_boundry)
				.attr("stroke", "#ffffff")
				.attr('fill', 'none')
				.attr("stroke-width", 2.0)
				.attr("stroke-dasharray", (10, 5))
				.attr('d', d3.line()
					.x(function(d) { return x_axis_plot(d.x); })
					.y(function(d) { return y_axis_plot(d.y); })
					// .curve(d3.curveCatmullRom.alpha(0.5))
				)

		var lower_boundry = rw_boundry('lower', p=0.5, _max_steps)
		svg_random_walk.append("path")
				.datum(lower_boundry)
				.attr("stroke", "#ffffff")
				.attr('fill', 'none')
				.attr("stroke-width", 2.0)
				.attr("stroke-dasharray", (10, 5))
				.attr('d', d3.line()
					.x(function(d) { return x_axis_plot(d.x); })
					.y(function(d) { return y_axis_plot(d.y); })
					// .curve(d3.curveCatmullRom.alpha(0.5))
				)

		// Plot markers
		/*
		rw_plot_markers = svg_random_walk.append('g')
			.selectAll('rw_plot_markers')
			.data([{x: 1, y: 0}])
			.enter()
			.append('circle')
				.attr('cx', d => x_axis_plot(d.x))
				.attr('cy', d => y_axis_plot(d.y))
				.attr('r', 2)
				.attr('fill', "#ffeabc")
		*/

  }

  my.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return my;
  };

  my.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return my;
  };

  return my;
}

var svg_entropy_plot = d3.select("#rw_plot")

rw_plot_chart = RandomWalkChart().width(600).height(250)
rw_plot_chart(svg_entropy_plot)

