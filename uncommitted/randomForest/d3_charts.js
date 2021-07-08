var d3_global_settings = {
	class_1_color: '#ffcb5c',
	class_2_color: '#6096BA',
	hyperplane_color: '#ffeabc',
	mislabel_color: '#D33643',
	correct_label_color: '#379634',
}


function FeatureSpaceSplitChart() {
	// set the dimensions and margins of the graph
	var chart_width = 720, // default width
      chart_height = 600; // default height

	var margin = {top: 10, right: 30, bottom: 30, left: 60},
			width = chart_width - margin.left - margin.right,
			height = chart_height - margin.top - margin.bottom;

	var paths = new Array();

	function my(selection) {
		// append the svg object to the body of the page
		var svg = selection
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.on('click', my.rewind_animation())

		// Create data
		var classes = [0, 1]
		var scatter_colors = d3.scaleOrdinal().domain(classes)
			.range([
				d3_global_settings.class_1_color,
				d3_global_settings.class_2_color
			])

		function colorPoints() {
			d3.selectAll("#scatter_dot").transition()
					.delay(function(d, i){return(i * 5)})
					.duration(100)
					.style("fill", function(d) { return scatter_colors(d.y) } )
		}

		var hyperplanes = new Array();
		hyperplanes.push(
			{value: -0.76, axis: 'x0', depth: 0},
			{value: -8.00, axis: 'x0', depth: 1},
			{value: -4.80, axis: 'x0', depth: 2},
			{value: -3.21, axis: 'x0', depth: 4},
			{value: -0.42, axis: 'x1', depth: 2},
		)

		var decision_lines = new Array();
		decision_lines.push(
			{
				id: 0,
				values: [{'x': -15,'y': -0.42}, {'x': -3.21, 'y': -0.42}, {'x': -3.21, 'y': -10}],
			},
			{
				id: 1,
				values: [{'x': -4.80, 'y': 20}, {'x': -4.80, 'y': 1.12}, {'x': -0.76, 'y': 1.12}, {'x': -0.76, 'y': 20}],
			},
		)

		//Read the data
		d3.csv("https://raw.githubusercontent.com/ArielYssou/Site/master/uncommitted/randomForest/data/example_data.csv", function(data) {
			// Add X axis
			var x_axis = d3.scaleLinear()
				.domain([-15, 10])
				.range([0, width]);

			// Add Y axis
			var y_axis = d3.scaleLinear()
				.domain([-10, 20])
				.range([height, 0]);

			// Add dots
			svg.append('g')
				.selectAll("dot")
				.data(data)
				.enter()
				.append("circle")
					.attr("cx", function (d) { return x_axis(d.x0); } )
					.attr("cy", function (d) { return y_axis(d.x1); } )
					.attr("r", 3.5)
					.attr('id', 'scatter_dot')
					.style("fill", "#444444")

			svg.append("g")
				.selectAll("paths")
				.data(decision_lines)
				.enter()
				.append("path")
					.attr("d", function (d) {
							return d3.line()
									.x(d => x_axis(d.x))
									.y(d => y_axis(d.y))
									(d.values)
					})
					.attr("fill", "none")
					.attr("stroke", d3_global_settings.hyperplane_color)
					.attr("stroke-width", 2)
					.attr("class", 'hyperplanes')
					.attr("id" , function(d){
						return "line" + d.id;
					})

			for(var idx = 0; idx < 2; idx += 1) {
				var path = svg.select('#line' + idx)
				var totalLength = path.node().getTotalLength();

				paths.push(path);

				path
					.attr("stroke-dasharray", totalLength + " " + totalLength)
					.attr("stroke-dashoffset", totalLength)
					.transition()
						//.delay( function(i) { return i * 1000} )
						.duration(1500)
						.ease(d3.easeLinear)
						.attr("stroke-dashoffset", 0)
						.on("end", colorPoints);
			}

		})
	}

	//Animation functions
	my.animateChart = function() {
		for(path of paths) {
			var totalLength = path.node().getTotalLength();

			my.paths.push(path);

			path
				.attr("stroke-dasharray", totalLength + " " + totalLength)
				.attr("stroke-dashoffset", totalLength)
				.transition()
					//.delay( function(i) { return i * 1000} )
					.duration(1500)
					.ease(d3.easeLinear)
					.attr("stroke-dashoffset", 0)
					.on("end", colorPoints);
		}
	}

	my.rewind_animation = function() {
		// Make hyperplanes transparent
		d3.selectAll('.hyperplanes')
			.transition()
			.attr('fill', d3_global_settings.background)

		//remove color from points
		d3.selectAll("#scatter_dot")
				.transition()
				.delay(function(d, i){return(i * 5)})
				.duration(100)
				.style("fill", '#444444')
		my.animateChart();
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

var svg_fss =  d3.select("#feature_space_split")

fss_chart = FeatureSpaceSplitChart().width(720).height(400)
fss_chart(svg_fss)
fss_chart.animateChart()


//
// Figure 2. Decision tree chart
//

function TreeChart() {
  var tree_width = 720, // default width
      tree_height = 600; // default height

	var margin = {top: 10, right: 30, bottom: 30, left: 60},
			width = tree_width - margin.left - margin.right,
			height = tree_height - margin.top - margin.bottom;

  function my(selection) {
		// set the dimensions and margins of the graph
		// append the svg object to the body of the page
		svg_tree = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var nodeHilight = function(node_ids, hyperplanes, node_class) {
			dots = d3.selectAll('#tree_scatter_dot')
			dots
				.transition()
				.duration(500)
				.attr('fill', d => node_ids.includes(d.index) ? (+d.y == +node_class ? d3_global_settings.correct_label_color : d3_global_settings.mislabel_color) : 'gray')
				.attr('opacity', d => node_ids.includes(d.index) ? 1 : 0.33 )

			planes = d3.selectAll('#hyperplanes').data(hyperplanes)
			planes.transition().duration(500).attr('opacity', (d, i) => 0.33 + i / 3 )

			planes.exit().transition().duration(500).ease(d3.easeCubicOut)
				.attr("stroke-dashoffset", 0);
			planes.exit().transition().duration(500).attr('opacity', 0)
		}

		var nodeExit = function() {
			d3.selectAll('#tree_scatter_dot').transition()
				.duration(500)
				.attr('opacity', '1')
				.attr("fill",  d => +d.y == d.pred ? d3_global_settings.correct_label_color: d3_global_settings.mislabel_color)

			planes = d3.selectAll('#hyperplanes')

			planes.transition().duration(500)
				.ease(d3.easeCubicOut)
				.attr("stroke-dashoffset", 100);


			planes.transition()
				.duration(100)
				.attr('opacity', (d, i) => 0.33 +  i / 3 )
		}

		//Read the data
		d3.json("https://raw.githubusercontent.com/ArielYssou/Site/master/uncommitted/randomForest/data/tree.json", function(error, tree) {
			if (error) throw error;
			//
			// Add X axis
			var x_axis_tree = d3.scaleLinear()
				.domain([-12, 42])
				.range([0, (width / 3)]);

			// Add Y axis
			var y_axis_tree = d3.scaleLinear()
				.domain([30, 0])
				.range([height - 40, 40]);

			// Add X axis
			var x_axis_scatter = d3.scaleLinear()
				.domain([-15, 10])
				.range([(width / 3) + 10, width]);

			// Add Y axis
			var y_axis_scatter = d3.scaleLinear()
				.domain([-10, 20])
				.range([height, 0]);

			// Add dots
			dots = svg_tree.append('g')
				.selectAll("tree_scatter")
				.data(tree.data)
				.enter()
				.append("path")
					.attr("transform", d => "translate("+x_axis_scatter(d.x0) + ',' + y_axis_scatter(d.x1) + ")" )
					.attr("fill", d => +d.y == d.pred ? d3_global_settings.correct_label_color : d3_global_settings.mislabel_color)
					.attr("d", d3.symbol().type( d => d3.symbols[d.y] ) )
					.attr('id', 'tree_scatter_dot')

			hyperplanes = svg_tree.append("g")
					.selectAll("tree_hyperplanes")
					.data(tree.hyperplanes)
					.enter()
					.append('line')
						.attr('x1', function (d) { return x_axis_scatter(d.x1); } )
						.attr('x2', function (d) { return x_axis_scatter(d.x2); } )
						.attr('y1', function (d) { return y_axis_scatter(d.y1); } )
						.attr('y2', function (d) { return y_axis_scatter(d.y2); } )
						.attr("stroke-dasharray", function (d, i) { return  (10, 2 * (2 - i)) }) 
						.attr("stroke", "#ffeabc")
						.attr("stroke-width", 2)
						.attr("opacity", (d, i) => 0.3 + i / 3)
						.attr('id', 'hyperplanes')

			var node_width = 85
			var node_height = 45
			
			// Add links
			links = svg_tree.append("g")
					.selectAll("tree_links")
					.data(tree.links)
					.enter()
					.append('line')
						.attr('x1', function (d) { return x_axis_tree(d.x1);  } )
						.attr('x2', function (d) { return x_axis_tree(d.x2);  } )
						.attr('y1', function (d) { return y_axis_tree(d.y1);  } )
						.attr('y2', function (d) { return y_axis_tree(d.y2);  } )
						.attr("stroke", "#ffeabc")
						.attr("stroke-width", 1.5)
						.attr("opacity", 0.5)

			// Add nodes
			nodes = svg_tree.append('g')
				.selectAll("nodes")
				.data(tree.nodes)
				.enter()
				.append("rect")
					.attr("rx", 3)
					.attr("ry", 3)
					.attr("x", function (d) { return x_axis_tree(d.pos_x) - (node_width / 2); } )
					.attr("y", function (d) { return y_axis_tree(d.pos_y) - (node_height / 2); } )
					.attr('width', node_width)
					.attr('height', node_height)
					.style("fill", "#363530")
					.style('stroke', d => d.is_leaf == 0 ? "#ffeabc" : (d.class == 0 ? d3_global_settings.class_1_color : d3_global_settings.class_2_color))
					.style('stroke-width', 1.5)
     			.on('mouseover', function(d) {
					 nodeHilight(d.population, d.hyperplanes, d.class );
						d3.select(this)
							.transition()
							.duration(200)
							.style('fill', '#2b2b26')
							.style('stroke-width', 2)
					})
     			.on('mouseout', function() {
						nodeExit();
						d3.select(this)
							.transition()
							.duration(50)
							.style('fill', '#363530')
							.style('stroke-width', 1.5)
					})

			// node text
			text = svg_tree.append('g')
				.selectAll("node_text")
				.data(tree.nodes)
				.enter() 
					.append("text")
						.attr("x", function(d) { return x_axis_tree(d.pos_x) })
						.attr("y", function(d) { return y_axis_tree(d.pos_y) })
					  .attr('dy', '.25em')
						.attr("text-anchor", 'middle' )
						.attr("stroke", "none")
						.attr("fill", "#ffeabc")
						.attr("font-size", 16)
						.text(function(d) { return d.is_leaf == 0 ? 'x' + d.feature + ' <= ' + parseFloat(d.threshold).toFixed(2) : '🍃 class ' + d.class; })
					.on('mouseover', d => nodeHilight( d.population, d.hyperplanes, d.class ) )
				  .on('mouseout', nodeExit )
		})
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

var svg_tree = d3.select("#decision_tree")
tree_chart = TreeChart().width(720).height(400)
tree_chart(svg_tree)


//
// decision splits
//


function DecisionChart() {
  var total_width = 720, // default width
      total_height = 200; // default height

	var margin = {top: 10, right: 30, bottom: 30, left: 60},
			width = total_width - margin.left - margin.right,
			height = total_height - margin.top - margin.bottom;

  function my(selection) {
		// append the svg object to the body of the page
		svg_chart = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var points = new Array();
		var splits = new Array();
		for (const val of Array.from(Array(7).keys())) {
			points.push(
				{'x': val, 'y': Math.random() * 2 - 1, 'class': Math.random() >= 0.5 ? 0 : 1}
			)
			splits.push(
				{'x': val + 0.5, y: -1, 'class': 2}

			)
		}
		splits.pop();

		// Add X axis
		var x_axis = d3.scaleLinear()
			.domain([-0.5, 6.5])
			.range([0, width]);

		// Add Y axis
		var y_axis = d3.scaleLinear()
			.domain([-1, 1])
			.range([height, 0]);

		// Axes
		var xAxis = svg_chart.append("g")
				.attr("class", "x-axis")
				.attr("transform", "translate(" + 0 + "," + height + ")")
				.call(d3.axisBottom(x_axis));

		// Add dots
		dots = svg_chart.append('g')
			.selectAll("split_points")
			.data(points)
			.enter()
			.append("path")
				.attr("transform", d => "translate("+x_axis(d.x) + ',' + y_axis(d.y) + ")" )
				.attr("fill", d => d.class == 0 ? d3_global_settings.class_1_color : d3_global_settings.class_2_color)
				.attr("d", d3.symbol().type( d3.symbols[0] ).size(70) )
		svg_chart.append('g')
			.selectAll("points_label")
			.data(points)
			.enter()
					.append("text")
						.attr("x", function(d) { return x_axis(d.x + 0.15) })
						.attr("y", function(d) { return y_axis(d.y + 0.1) })
					  .attr('dy', '.25em')
						.attr("text-anchor", 'middle' )
						.attr("stroke", "none")
						.attr("fill", "#ffeabc")
						.attr("font-size", 16)
						.text('x')
		svg_chart.append('g')
			.selectAll("points_minnor_label")
			.data(points)
			.enter()
					.append("text")
						.attr("x", function(d) { return x_axis(d.x + 0.22) })
						.attr("y", function(d) { return y_axis(d.y + 0.07) })
					  .attr('dy', '.25em')
						.attr("text-anchor", 'middle' )
						.attr("stroke", "none")
						.attr("fill", "#ffeabc")
						.attr("font-size", 12)
						.text((d, i) => '' + i)

		// Add dots
		dots = svg_chart.append('g')
			.selectAll("split_points")
			.data(splits)
			.enter()
			.append("path")
				.attr("transform", d => "translate("+x_axis(d.x) + ',' + y_axis(d.y) + ") rotate(-45)" )
				.attr("fill", '#ffeabc')
				.attr("d", d3.symbol().type( d3.symbols[1]).size(40) )
		// Add split text
		svg_chart.append('g')
			.selectAll("split_points_label")
			.data(splits)
			.enter()
					.append("text")
						.attr("x", function(d) { return x_axis(d.x + 0.15) })
						.attr("y", function(d) { return y_axis(d.y + 0.1) })
					  .attr('dy', '.25em')
						.attr("text-anchor", 'middle' )
						.attr("stroke", "none")
						.attr("fill", "#ffeabc")
						.attr("font-size", 16)
						.text('α')
		svg_chart.append('g')
			.selectAll("split_points_minnor_label")
			.data(splits)
			.enter()
					.append("text")
						.attr("x", function(d) { return x_axis(d.x + 0.24) })
						.attr("y", function(d) { return y_axis(d.y + 0.09) })
					  .attr('dy', '.25em')
						.attr("text-anchor", 'middle' )
						.attr("stroke", "none")
						.attr("fill", "#ffeabc")
						.attr("font-size", 14)
						.text((d, i) => '' + i)

		// decision lines
		svg_chart.append("g")
				.selectAll("decision_split_lines")
				.data(splits)
				.enter()
				.append('line')
					.attr('x1', function (d) { return x_axis(d.x); } )
					.attr('x2', function (d) { return x_axis(d.x); } )
					.attr('y1', y_axis(-1) )
					.attr('y2', y_axis(1) )
					.attr("stroke-dasharray", (10, 2) ) 
					.attr("stroke", "#ffeabc")
					.attr("stroke-width", 2)
					.attr("opacity", 0.8)

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

var svg_decision_lines = d3.select("#decision_splits")
decision_lines_chart = DecisionChart().width(700).height(200)
decision_lines_chart(svg_decision_lines)


//
// Split criterion: entropy
//

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

			var plots_offset = 30;

			// Add X axis
			var x_axis_plot = d3.scaleLinear()
				.domain([-8, 6])
				.range([0, width]);
			var xAxisPlot = svg_split_crit.append("g")
					.attr("class", "x-axis")
					.attr("transform", "translate(" + 0 + "," + height + ")")
					.call(d3.axisBottom(x_axis_plot))
					.attr("class", "axisDarkTheme")

			// Add Y axis
			var y_axis_plot = d3.scaleLinear()
				.domain([-20, -5])
				.range([(height / 2) - plots_offset, 0]);
			var yAxisPlot = svg_split_crit
				.append("g")
					.attr("class", "y-axis")
					.call(d3.axisLeft(y_axis_plot).ticks(6))
					.attr("class", "axisDarkTheme")
			yAxisPlot.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 16)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Entropy");

			// Add X axis
			var x_axis_scatter = d3.scaleLinear()
				.domain([-8, 6])
				.range([0, width]);
			svg_split_crit.append("g")
					.attr("class", "x-axis")
					.attr("transform", "translate(" + 0 + "," + ((height / 2) - plots_offset) + ")")
					.call(d3.axisBottom(x_axis_scatter))
					.attr("class", "axisDarkTheme")

			// Add Y axis
			var y_axis_scatter = d3.scaleLinear()
				.domain([-1, 11])
				.range([height, plots_offset + (height / 2)]);
			var yAxisScatter = svg_split_crit
				.append("g")
					.attr("class", "y-axis")
					.call(d3.axisLeft(y_axis_scatter).ticks(5))
					.attr("class", "axisDarkTheme")
			yAxisScatter.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 0)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("y");

			// Add dots
			svg_split_crit.append('g')
				.selectAll("split_scatter_plot")
				.data(chart_data.data)
				.enter()
				.append("path")
					.attr("transform", d => "translate("+x_axis_scatter(d.x0) + ',' + y_axis_scatter(d.x1) + ")" )
					.attr("fill", d => +d.y == 0 ? d3_global_settings.class_1_color: d3_global_settings.class_2_color)
					.attr("d", d3.symbol().type( d => d3.symbols[d.y] ) )
					.attr('id', 'split_scatter_dot')

			const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
			splits = svg_split_crit.append("g")
					.selectAll("split_lines")
					.data(chart_data.splits)
					.enter()
					.append('line')
						.attr('x1', function (d) { return x_axis_scatter(d.value); } )
						.attr('x2', function (d) { return x_axis_scatter(d.value); } )
						.attr('y1', height / 2 + plots_offset )
						.attr('y2', height )
						.attr("stroke", "#ffeabc")
						.attr("stroke-width", 1)
						.attr("opacity", 0.)
					.transition()
						.duration(100)
						.delay((d, i) => 100 * i)
						.style('opacity', (d) => map(d.gain, -20, -6, 0.2, 1))
						//.attr('y2', height)
						.ease(d3.easeQuadInOut)

			// Entropy Gain plot
			gain_plot = svg_split_crit.append("path")
					.datum(chart_data.splits)
					.attr("stroke", "#FF7E47")
					.attr("stroke-width", 1.)
					.attr('fill', '#FF7E47')
					.attr("fill-opacity", 0.0)
					.attr('d', d3.line()
						.x(function(d) { return x_axis_plot(d.value); })
						.y(function(d) { return y_axis_plot(d.gain); })
						.curve(d3.curveCatmullRom.alpha(0.5))
					)

			var totalLength = gain_plot.node().getTotalLength();
			gain_plot	
				.attr("stroke-dasharray", totalLength + " " + totalLength)
				.attr("stroke-dashoffset", totalLength)
				.transition()
					//.delay( function(i) { return i * 1000} )
					.duration(2900)
					.ease(d3.easeLinear)
					.attr("stroke-dashoffset", 0)
					.on('end', function() { d3.select(this).transition().duration(1000).style('fill-opacity', 0.1) } )

			gain_plot_markers = svg_split_crit.append('g')
				.selectAll('gsc_markers')
				.data(chart_data.splits)
				.enter()
				.append('circle')
					.attr('cx', d => x_axis_plot(d.value))
					.attr('cy', d => y_axis_plot(d.gain))
					.attr('r', 2)
					.attr('fill', '#FF7E47')
					.attr('opacity', 0)
					.transition()
						.duration(100)
						.delay((d, i) => 100 * i)
						.style('opacity', 1)
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

// 
// Log plot
//

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
		svg_log_plot.append("g")
				.attr("class", "x-axis")
				.attr("transform", "translate(" + 0 + "," + height + ")")
				.call(d3.axisBottom(x_axis_plot).ticks(8))
				.attr("class", "axisDarkTheme")

		var yAxis = svg_log_plot.append("g")
				.attr("class", "axisDarkTheme")
				.attr("class", "y-axis")
				.call(d3.axisLeft(y_axis_plot).ticks(7))
				.attr("class", "axisDarkTheme")

		// Labels
		svg_log_plot.append("text")
				.attr("class", "axis-title")
				.attr("text-anchor", "end")
				.attr('x', width)
				.attr("y", height - 10)
				.attr('fill', '#ffeabc')
				.text("p")

		yAxis.append("text")
				.attr("class", "axis-title")
				.attr("text-anchor", "end")
				.attr("transform", "rotate(-90)")
				.attr("dy", "-1.35em")
				.attr("y", -16)
				.text("Entropy")

		// Entropy Gain plot
		log_plot = svg_log_plot.append("path")
				.datum(points)
				.attr("stroke", "#FF7E47")
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
