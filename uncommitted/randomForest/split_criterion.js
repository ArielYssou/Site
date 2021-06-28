function SplitCritChart() {
  var chart_width = 720, // default width
      chart_height = 600; // default height

	var margin = {top: 10, right: 30, bottom: 30, left: 60},
			width = chart_width - margin.left - margin.right,
			height = chart_height - margin.top - margin.bottom;

  function my(selection) {
		// append the svg object to the body of the page
		svg_split_crit = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Create data
		var classes = [0, 1]
		var myColor = d3.scaleOrdinal().domain(classes)
			.range(["#FF934F", "#577399"])

		//Read the data
		d3.json("https://raw.githubusercontent.com/ArielYssou/Site/master/uncommitted/randomForest/data/split_gains.json", function(error, chart_data) {
			if (error) throw error;
			//
			// Add X axis
			var x_axis_plot = d3.scaleLinear()
				.domain([-8, 6])
				.range([0, width]);

			// Add Y axis
			var y_axis_plot = d3.scaleLinear()
				.domain([-20, -5])
				.range([height / 2, 0]);

			// Add X axis
			var x_axis_scatter = d3.scaleLinear()
				.domain([-8, 6])
				.range([0, width]);

			// Add Y axis
			var y_axis_scatter = d3.scaleLinear()
				.domain([-1, 11])
				.range([height, height / 2]);

			// Add dots
			svg_split_crit.append('g')
				.selectAll("split_scatter")
				.data(chart_data.data)
				.enter()
				.append("path")
					.attr("transform", d => "translate("+x_axis_scatter(d.x0) + ',' + y_axis_scatter(d.x1) + ")" )
					.attr("fill", d => +d.y == 0 ? 'blue' : 'red')
					.attr("d", d3.symbol().type( d => d3.symbols[d.y] ) )
					.attr('id', 'tree_scatter_dot')

			svg_split_crit.append("g")
					.selectAll("split_lines")
					.data(chart_data.splits)
					.enter()
					.append('line')
						.attr('x1', function (d) { return x_axis_scatter(d.value); } )
						.attr('x2', function (d) { return x_axis_scatter(d.value); } )
						.attr('y1', height / 2 )
						.attr('y2', height)
						.attr("stroke", "#ffeabc")
						.attr("stroke-width", 2)
						.attr("opacity", 0.2)
						.attr('id', 'splits')

			// Entropy Gain plot
			gain_plot = svg_split_crit.append("path")
					.datum(chart_data.splits)
					.attr("stroke", "#ffeabc")
					.attr("stroke-width", 1.)
					//.attr("opacity", 0.5)
					.attr('d', d3.line()
						.x(function(d) { return x_axis_plot(d.value); })
						.y(function(d) { return y_axis_plot(d.gain); })
						.curve(d3.curveCatmullRom.alpha(0.5))
					)

			gain_plot_markers = svg_split_crit.append('g')
				.selectAll('gsc_markers')
				.data(chart_data.splits)
				.enter()
				.append('circle')
					.attr('cx', d => x_axis_plot(d.value))
					.attr('cy', d => y_axis_plot(d.gain))
					.attr('r', 2)
					.attr('fill', '#ffeabc')

			

		})

    // generate chart here, using `width` and `height`
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

var svg_split_criterion = d3.select("#split_criterion")

split_crit_chart = SplitCritChart().width(720).height(400)
split_crit_chart(svg_split_criterion)

