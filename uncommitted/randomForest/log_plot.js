function LogPlotChart() {
  var total_width = 720, // default width
      total_height = 200; // default height

	var margin = {top: 30, right: 90, bottom: 30, left: 90},
			width = total_width - margin.left - margin.right,
			height = total_height - margin.top - margin.bottom;

  function my(selection) {
		// append the svg object to the body of the page
		svg_log_plot = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var points = new Array();
		for (var val = 0.; val <= 1.01; val += 0.02) {
			val_x = val == 0.0 ? 0.001 : val;
			points.push(
				{'x': val_x, 'y': -Math.log(val_x)},
			)
		}

		// Add X axis
		var x_axis_plot = d3.scaleLinear()
			.domain([-0.1, 1.1])
			.range([0, width]);

		// Add Y axis
		var y_axis_plot = d3.scaleLinear()
			.domain([0, 7])
			.range([height, 0]);

		// Axes
		xAxis = svg_log_plot.append("g")
				.attr("class", "x-axis")
				.attr("transform", "translate(" + 0 + "," + height + ")")
				.call(d3.axisBottom(x_axis_plot));;

		yAxis = svg_log_plot.append("g")
				.attr("class", "y-axis")
				.call(d3.axisLeft(y_axis_plot));;

		// Labels
		svg_log_plot.append("text")
				.attr("class", "axis-title")
				.attr("transform", "translate(" + width + ", 0)")
				.attr("y", (height) - 10)
				.attr('fill', '#ffeabc')
				.text("p")

		yAxis.append("text")
				.attr("class", "axis-title")
				.attr("transform", "rotate(-90)")
				.attr("y", 16)
				.text("S")

		// Entropy Gain plot
		log_plot = svg_log_plot.append("path")
				.datum(points)
				.attr("stroke", "#ffeabc")
				.attr('fill', 'none')
				.attr("stroke-width", 1.5)
				.attr('d', d3.line()
					.x(function(d) { return x_axis_plot(d.x); })
					.y(function(d) { return y_axis_plot(d.y); })
					.curve(d3.curveCatmullRom.alpha(0.5))
				)

		// Plot markers
		log_plot_markers = svg_log_plot.append('g')
			.selectAll('log_plot_markers')
			.data([{x: 1, y: 0}])
			.enter()
			.append('circle')
				.attr('cx', d => x_axis_plot(d.x))
				.attr('cy', d => y_axis_plot(d.y))
				.attr('r', 2)
				.attr('fill', "#ffeabc")


		my.createVerticalLine = function(xPos) {
			svg_log_plot.append("g")
				.append("line")
				.attr("x1", x_axis_plot(xPos))
				.attr("y1", 0)
				.attr("x2", x_axis_plot(xPos))
				.attr("y2", height)
				.attr("stroke-dasharray", (10, 2))
				.style("stroke", "#ffeabc")
				.style("stroke-width", 1)
				.style('opacity', 0.7)
		};

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

var svg_entropy_plot = d3.select("#log_plot")

log_plot_chart = LogPlotChart().width(400).height(200)
log_plot_chart(svg_entropy_plot)
log_plot_chart.createVerticalLine(0)
