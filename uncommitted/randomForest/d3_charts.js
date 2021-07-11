var d3_settings = {
	feat1_clr: '',
	feat2_clr: '',
	class1_clr: '#ffcb5c',
	class2_clr: '#6096BA',
	hplane_clr: '#C6DAE6',
	error_clr: '#D33643',
	correct_clr: '#379634',
}

//funtion addLegend(chart, pos_x=1, pos_y=1) {
//	chart.svg.selectAll('legends').enter().
//}


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
				.attr('class', 'center')
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

		// Create data
		var scatter_colors = d3.scaleOrdinal().domain([0, 1])
			.range([
				d3_settings.class1_clr,
				d3_settings.class2_clr
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
				values: [{'x': -15,'y': -0.42},
					{'x': -3.21, 'y': -0.42},
					{'x': -3.21, 'y': -10}
				],
			},
			{
				id: 1,
				values: [
					{'x': -4.80, 'y': 20},
					{'x': -4.80, 'y': 1.12},
					{'x': -0.76, 'y': 1.12},
					{'x': -0.76, 'y': 20}
				],
			},
		)

		var legend_config = {
			'symbols': [d3.symbols[0], d3.symbols[0]],
			'labels': ['Class 1', 'Class 2'],
			'legend_colors': [d3_settings['class1_clr'], d3_settings['class2_clr']],
			'posx': width * 0.9,
			'posy': posy = height * (1 - 0.9),
			'width': 100,
			'height': 50,
			'margin': {top: 15, right: 10, bottom: 15, left: 10},
		}

		var legend_data = [
			{'symbol' : d3.symbols[0], 'label': 'Class 1', 'color': d3_settings['class1_clr']},
			{'symbol' : d3.symbols[1], 'label': 'Class 2', 'color': d3_settings['class2_clr']},
		]

		var legend_x_axis = d3.scaleLinear()
			.domain([0, 10])
			.range([
				legend_config['posx'] + legend_config.margin.left,
				legend_config['posx'] + legend_config['width'] - legend_config.margin.right
			]);

		var legend_y_axis = d3.scaleLinear()
			.domain([0, legend_data.length - 1])
			.range([
				legend_config['posy'] + legend_config.margin.top,
				legend_config['posy'] + legend_config['height'] - legend_config.margin.bottom 
			]);

		svg.append('g')
			.append('rect')
				.attr('x', legend_config['posx'])
				.attr('y', legend_config['posy'])
				.attr('rx', 6)
				.attr('ry', 6)
				.attr('width', legend_config.width)
				.attr('height',legend_config.height)
				.attr('fill', "#ffffff")
				.attr('opacity', 0.05)

		svg.append('g')
			.selectAll('legend_1')
			.data(legend_data)
			.enter()
			.append("path")
				.attr("transform", (d, i) => "translate("+legend_x_axis(1) + ',' + legend_y_axis(i) + ")" )
				.attr("fill", d => d.color)
				.attr("d", d3.symbol().type( (d, i) => d3.symbols[i] ) )

		svg.append('g')
			.selectAll('legend_1_labels')
			.data(legend_data)
			.enter()
			.append("text")
				.attr('x', legend_x_axis(0) + 40 )
				.attr('y', (d, i) => legend_y_axis(i) )
				.attr('dy', '.25em')
				.attr("text-anchor", 'middle' )
				.attr("stroke", "none")
				.attr("fill", "#ffeabc")
				.attr("font-size", 16)
				.text(d => d.label)
		
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
				.append("path")
					.attr("transform", d => "translate("+ x_axis(d.x0) + ',' + y_axis(d.x1) + ")" )
					.attr("fill", '#444444')
					.attr("d", d3.symbol().type( d => d3.symbols[+d.y] ).size(50) )
					.attr('id', 'scatter_dot')

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
					.attr("stroke", d3_settings.hplane_clr)
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


			//Animation functions
			animateChart = function() {
				for(path of paths) {
					var totalLength = path.node().getTotalLength();

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

			rewind_animation = function() {
				//remove color from points
				d3.selectAll("#scatter_dot")
						.transition()
						.duration(100)
						.style("fill", '#444444')

				animateChart();
			}

			d3.select('#feature_space_split').on('click', rewind_animation)
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

var svg_fss =  d3.select("#feature_space_split")

fss_chart = FeatureSpaceSplitChart().width(720).height(400)
fss_chart(svg_fss)
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
		var svg_tree = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr('class', 'center')
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var nodeHilight = function(node_ids, hyperplanes, node_class) {
			dots = d3.selectAll('#tree_scatter_dot')
			dots
				.transition()
				.duration(500)
				.attr('fill', d => node_ids.includes(d.index) ? (+d.y == +node_class ? d3_settings.correct_clr : d3_settings.error_clr) : 'gray')
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
				.attr("fill",  d => +d.y == d.pred ? d3_settings.correct_clr: d3_settings.error_clr)

			planes = d3.selectAll('#hyperplanes')

			planes.transition().duration(500)
				.ease(d3.easeCubicOut)
				.attr("stroke-dashoffset", 100);


			planes.transition()
				.duration(100)
				.attr('opacity', (d, i) => 0.33 +  i / 3 )
		}

		var legend_config = {
			'posx': width * 0.8,
			'posy': posy = height * (1 - 0.9),
			'width': 120,
			'height': 50,
			'margin': {top: 15, right: 10, bottom: 15, left: 10},
		}

		var legend_data = [
			{'x': 0, 'y': 0, 'symbol' : d3.symbols[0], 'label': 'Correct', 'color': d3_settings['correct_clr']},
			{'x': 1.5, 'y': 0, 'symbol' : d3.symbols[1], 'label': '', 'color': d3_settings['correct_clr']},
			{'x': 0, 'y': 1, 'symbol' : d3.symbols[0], 'label': 'Mislabel', 'color': d3_settings['error_clr']},
			{'x': 1.5, 'y': 1, 'symbol' : d3.symbols[1], 'label': '', 'color': d3_settings['error_clr']},
		]

		var legend_x_axis = d3.scaleLinear()
			.domain([0, 10])
			.range([
				legend_config['posx'] + legend_config.margin.left,
				legend_config['posx'] + legend_config['width']- legend_config.margin.right
			]);

		var legend_y_axis = d3.scaleLinear()
			.domain([0, 1])
			.range([
				legend_config['posy'] + legend_config.margin.top,
				legend_config['posy'] + legend_config['height'] - legend_config.margin.bottom
			]);

		svg_tree.append('g')
			.append('rect')
				.attr('x', legend_config['posx'])
				.attr('y', legend_config['posy'])
				.attr('rx', 6)
				.attr('ry', 6)
				.attr('width', legend_config.width)
				.attr('height',legend_config.height)
				.attr('fill', "#ffffff")
				.attr('opacity', 0.05)

		svg_tree.append('g')
			.selectAll('legend_1')
			.data(legend_data)
			.enter()
			.append("path")
				.attr("transform", (d, i) => "translate("+legend_x_axis(d.x) + ',' + legend_y_axis(d.y) + ")" )
				.attr("fill", d => d.color)
				.attr("d", d3.symbol().type( (d, i) => d.symbol ) )

		svg_tree.append('g')
			.selectAll('legend_1_labels')
			.data(legend_data)
			.enter()
			.append("text")
				.attr('x', d => legend_x_axis(d.x) + 60 )
				.attr('y', (d) => legend_y_axis(d.y) )
				.attr('dy', '.25em')
				.attr("text-anchor", 'middle' )
				.attr("stroke", "none")
				.attr("fill", "#ffeabc")
				.attr("font-size", 16)
				.text(d => d.label)

		//Read the data
		d3.json("https://raw.githubusercontent.com/ArielYssou/Site/master/uncommitted/randomForest/data/tree.json", function(error, tree) {
			if (error) throw error;
			//
			var plot_offset = 30
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
				.range([(width / 3) + plot_offset, width]);

		// Axes
		var xAxis = svg_tree.append("g")
				.attr("class", "x-axis")
				.attr("transform", "translate(" + 0 + "," + height + ")")
				.call(d3.axisBottom(x_axis_scatter))
				.attr("class", "axisDarkTheme")

			// Add Y axis
			var y_axis_scatter = d3.scaleLinear()
				.domain([-10, 20])
				.range([height, 0]);

			var yAxisPlot = svg_tree
				.append("g")
					.attr("class", "y-axis")
					.attr("transform", "translate(" + ((width / 3) + plot_offset) + "," + 0 + ")")
					.call(d3.axisLeft(y_axis_scatter).ticks(8))
					.attr("class", "axisDarkTheme")
			yAxisPlot.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 16)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("X1");



			// Add dots
			dots = svg_tree.append('g')
				.selectAll("tree_scatter")
				.data(tree.data)
				.enter()
				.append("path")
					.attr("transform", d => "translate("+x_axis_scatter(d.x0) + ',' + y_axis_scatter(d.x1) + ")" )
					.attr("fill", d => +d.y == d.pred ? d3_settings.correct_clr : d3_settings.error_clr)
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
						.attr("stroke", d3_settings['hplane_clr'])
						.attr("stroke-width", 2)
						.attr("opacity", (d, i) => 0.3 + i / 3)
						.attr('id', 'hyperplanes')

			var node_width = 90
			var node_height = 50
			
			// Add links
			var links = svg_tree.append("g")
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
			var nodes = svg_tree.append('g')
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
					.attr("stroke-dasharray", (d, i) => d.is_leaf == 1 ? (0, 0) : (10, 2 * (2 - i))) 
					.style("fill", "#363530")
					.style('stroke', d => d.is_leaf == 0 ? "#ffeabc" : (d.class == 0 ? d3_settings.class1_clr : d3_settings.class2_clr))
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
			var text = svg_tree.append('g')
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
						.attr("font-size", 18)
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
				.attr('class', 'center')
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var points = new Array();
		var splits = new Array();
		for (const val of Array.from(Array(7).keys())) {
			points.push(
				{'x': val, 'y': Math.random() * 2 - 1, 'class': val % 3 == 0 ? 0 : 1}
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
				.call(d3.axisBottom(x_axis))
				.attr("class", "axisDarkTheme")

		// Add dots
		var dots = svg_chart.append('g')
			.selectAll("split_points")
			.data(points)
			.enter()
			.append("path")
				.attr("transform", d => "translate("+x_axis(d.x) + ',' + y_axis(d.y) + ")" )
				.attr("fill", d => d.class == 0 ? d3_settings.class1_clr : d3_settings.class2_clr)
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
		var dots = svg_chart.append('g')
			.selectAll("split_points")
			.data(splits)
			.enter()
			.append("path")
				.attr("transform", d => "translate("+x_axis(d.x) + ',' + y_axis(d.y) + ") rotate(-45)" )
				.attr("fill", d3_settings.hplane_clr)
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
						.attr("fill", d3_settings.hplane_clr)
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
						.attr("fill", d3_settings.hplane_clr)
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
					.attr("stroke-dasharray", (10, 4) ) 
					.attr("stroke", d3_settings.hplane_clr)
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
				.attr('class', 'center')
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

			svg_split_crit.append("text")
				.attr("class", "axis-title")
				.attr("text-anchor", "end")
				.attr('x', width)
				.attr("y", height - 10)
				.attr('fill', '#ffeabc')
				.text("x")
			svg_split_crit.append("text")
				.attr("class", "axis-title")
				.attr("text-anchor", "end")
				.attr('x', width)
				.attr("y", (height / 2) - 40)
				.attr('fill', '#ffeabc')
				.text("x")

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
				.domain([-1.4, 11])
				.range([height, plots_offset + (height / 2)]);
//			var yAxisScatter = svg_split_crit
//				.append("g")
//					.attr("class", "y-axis")
//					.call(d3.axisLeft(y_axis_scatter).ticks(5))
//					.attr("class", "axisDarkTheme")
//			yAxisScatter.append("text")
//					.attr("transform", "rotate(-90)")
//					.attr("y", 0)
//					.attr("dy", ".71em")
//					.style("text-anchor", "end")
//					.text("y");

			// Add dots
			svg_split_crit.append('g')
				.selectAll("split_scatter_plot")
				.data(chart_data.data)
				.enter()
				.append("path")
					.attr("transform", d => "translate("+x_axis_scatter(d.x0) + ',' + y_axis_scatter(d.x1) + ")" )
					.attr("fill", d => +d.y == 0 ? d3_settings.class1_clr: d3_settings.class2_clr)
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
					.attr("stroke", d3_settings.hplane_clr)
					.attr("stroke-width", 1)
					.attr("opacity", 0.)

			splits.transition()
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
			gain_plot_markers.transition()
						.duration(100)
						.delay((d, i) => 100 * i)
						.style('opacity', 1)
		})

		rewind = function () {
			gain_plot_markers.transition().duration(1).style('opacity', 0)
			splits.transition().duration(1).style('opacity', 0)
			gain_plot.transition().duration(1).style('fill-opacity', 0.)

			const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
			splits.transition()
						.duration(100)
						.delay((d, i) => 100 * i)
						.style('opacity', (d) => map(d.gain, -20, -6, 0.2, 1))
						//.attr('y2', height)
						.ease(d3.easeQuadInOut) 

			gain_plot_markers.transition()
						.duration(100)
						.delay((d, i) => 100 * i)
						.style('opacity', 1)

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
		}

		d3.select("#split_criterion").on('click',rewind)


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
      total_height = 300; // default height

	var margin = {top: 30, right: 90, bottom: 30, left: 90},
			width = total_width - margin.left - margin.right,
			height = total_height - margin.top - margin.bottom;

  function my(selection) {
		// append the svg object to the body of the page
		svg_log_plot = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr('class', 'center')
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

		my.createVerticalLine = function(xPos) {
			svg_log_plot.append("g")
				.append("line")
				.attr("x1", x_axis_plot(xPos))
				.attr("y1", 0)
				.attr("x2", x_axis_plot(xPos))
				.attr("y2", height)
				.attr("stroke-dasharray", (10, 5))
				.style("stroke", "#ffffff")
				.style("stroke-width", 1)
				.style('opacity', 0.5)
		};
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

log_plot_chart = LogPlotChart().width(400).height(250)
log_plot_chart(svg_entropy_plot)
log_plot_chart.createVerticalLine(0)

//
// Feature Importance chart
//

function VIMPChart() {

	// This data in generated in the data_generation notebook and is translated here to avoid
	// having to make an call to download this data, improveing the overall performance of the post
	var tree_data = {
		'points': [
			{'x': 0.3125, 'y': 0, 'value': 8.604394186997094, 'variable': 0},
			{'x': 0.9375, 'y': 0, 'value': 10.435935770241692, 'variable': 0},
			{'x': 1.5625, 'y': 0, 'value': 3.588824160668688, 'variable': 0},
			{'x': 2.1875, 'y': 0, 'value': 9.952075501156154, 'variable': 1},
			{'x': 2.8125, 'y': 0, 'value': 10.104013750950099, 'variable': 0},
			{'x': 3.4375, 'y': 0, 'value': 10.070414752120197, 'variable': 0},
			{'x': 4.0625, 'y': 0, 'value': 6.010510715780533, 'variable': 0},
			{'x': 4.6875, 'y': 0, 'value': 9.948888366153687, 'variable': 0},
			{'x': 5.3125, 'y': 0, 'value': 9.249372318751993, 'variable': 0},
			{'x': 5.9375, 'y': 0, 'value': 10.810512814352965, 'variable': 1},
			{'x': 6.5625, 'y': 0, 'value': 4.778802720990813, 'variable': 0},
			{'x': 7.1875, 'y': 0, 'value': 3.0323302873368365, 'variable': 0},
			{'x': 7.8125, 'y': 0, 'value': 6.772675981853499, 'variable': 0},
			{'x': 8.4375, 'y': 0, 'value': 9.09019690684594, 'variable': 1},
			{'x': 9.0625, 'y': 0, 'value': 2.6511823827901106, 'variable': 0},
			{'x': 9.6875, 'y': 0, 'value': 10.84895420846731, 'variable': 1},
			{'x': 0.625, 'y': 1, 'value': 6.209570423699916, 'variable': 1},
			{'x': 1.875, 'y': 1, 'value': 5.382249297929214, 'variable': 0},
			{'x': 3.125, 'y': 1, 'value': 7.213343782904882, 'variable': 0},
			{'x': 4.375, 'y': 1, 'value': 6.95359966346709, 'variable': 1},
			{'x': 5.625, 'y': 1, 'value': 3.8711036214673915, 'variable': 1},
			{'x': 6.875, 'y': 1, 'value': 7.652112350562794, 'variable': 1},
			{'x': 8.125, 'y': 1, 'value': 8.305268744431118, 'variable': 0},
			{'x': 9.375, 'y': 1, 'value': 11.072034453896096, 'variable': 1},
			{'x': 1.25, 'y': 2, 'value': 9.883599258244658, 'variable': 0},
			{'x': 3.75, 'y': 2, 'value': 5.84150461329126, 'variable': 1},
			{'x': 6.25, 'y': 2, 'value': 4.948094350681444, 'variable': 0},
			{'x': 8.75, 'y': 2, 'value': 10.172943824167291, 'variable': 0},
			{'x': 2.5, 'y': 3, 'value': 6.735297328417683, 'variable': 0},
			{'x': 7.5, 'y': 3, 'value': 5.50867856494105, 'variable': 0},
			{'x': 5.0, 'y': 4, 'value': 9.578376205019406, 'variable': 0}],
	 'links': [
		 {'x1': 0.625, 'x2': 0.3125, 'y1': 1, 'y2': 0},
			{'x1': 0.625, 'x2': 0.9375, 'y1': 1, 'y2': 0},
			{'x1': 1.875, 'x2': 1.5625, 'y1': 1, 'y2': 0},
			{'x1': 1.875, 'x2': 2.1875, 'y1': 1, 'y2': 0},
			{'x1': 3.125, 'x2': 2.8125, 'y1': 1, 'y2': 0},
			{'x1': 3.125, 'x2': 3.4375, 'y1': 1, 'y2': 0},
			{'x1': 4.375, 'x2': 4.0625, 'y1': 1, 'y2': 0},
			{'x1': 4.375, 'x2': 4.6875, 'y1': 1, 'y2': 0},
			{'x1': 5.625, 'x2': 5.3125, 'y1': 1, 'y2': 0},
			{'x1': 5.625, 'x2': 5.9375, 'y1': 1, 'y2': 0},
			{'x1': 6.875, 'x2': 6.5625, 'y1': 1, 'y2': 0},
			{'x1': 6.875, 'x2': 7.1875, 'y1': 1, 'y2': 0},
			{'x1': 8.125, 'x2': 7.8125, 'y1': 1, 'y2': 0},
			{'x1': 8.125, 'x2': 8.4375, 'y1': 1, 'y2': 0},
			{'x1': 9.375, 'x2': 9.0625, 'y1': 1, 'y2': 0},
			{'x1': 9.375, 'x2': 9.6875, 'y1': 1, 'y2': 0},
			{'x1': 1.25, 'x2': 0.625, 'y1': 2, 'y2': 1},
			{'x1': 1.25, 'x2': 1.875, 'y1': 2, 'y2': 1},
			{'x1': 3.75, 'x2': 3.125, 'y1': 2, 'y2': 1},
			{'x1': 3.75, 'x2': 4.375, 'y1': 2, 'y2': 1},
			{'x1': 6.25, 'x2': 5.625, 'y1': 2, 'y2': 1},
			{'x1': 6.25, 'x2': 6.875, 'y1': 2, 'y2': 1},
			{'x1': 8.75, 'x2': 8.125, 'y1': 2, 'y2': 1},
			{'x1': 8.75, 'x2': 9.375, 'y1': 2, 'y2': 1},
			{'x1': 2.5, 'x2': 1.25, 'y1': 3, 'y2': 2},
			{'x1': 2.5, 'x2': 3.75, 'y1': 3, 'y2': 2},
			{'x1': 7.5, 'x2': 6.25, 'y1': 3, 'y2': 2},
			{'x1': 7.5, 'x2': 8.75, 'y1': 3, 'y2': 2},
			{'x1': 5.0, 'x2': 2.5, 'y1': 4, 'y2': 3},
			{'x1': 5.0, 'x2': 7.5, 'y1': 4, 'y2': 3}]
	};
	var var0_importances = new Array();
	var var1_importances = new Array();
	for(var point of tree_data.points) {
		if(point.variable == 0) {
			var0_importances.push((point.y + 1) * point.value)
		} else {
			var1_importances.push(((point.y + 1) / 2) * point.value)
		}
	}

	var sum = var0_importances.reduce((a, b) => a + b, 0);
	const var0_vimp = (sum / var0_importances.length) || 0;

	sum = var1_importances.reduce((a, b) => a + b, 0);
	const var1_vimp = (sum / var1_importances.length) || 0;

  var tree_width = 720, // default width
      tree_height = 600; // default height

	var margin = {top: 10, right: 30, bottom: 30, left: 60},
			width = tree_width - margin.left - margin.right,
			height = tree_height - margin.top - margin.bottom;

  function my(selection) {
		// set the dimensions and margins of the graph

		// append the svg object to the body of the page
		svg_vimp = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr('class', 'center')
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Create data
		var classes = [0, 1]
		var myColor = d3.scaleOrdinal().domain([0, 1])
			.range(["#FF934F", "#577399"])

		// Add X axis
		var x_axis = d3.scaleLinear()
			.domain([0, 10])
			.range([0, width]);

		// Add Y axis
		var y_axis = d3.scaleLinear()
			.domain([-0.5, 4.5])
			.range([height, 0]);

		// Add links
		vimp_links = svg_vimp.append("g")
				.selectAll("feat_imp_links")
				.data(tree_data.links)
				.enter()
				.append('line')
					.attr('x1', function (d) { return x_axis(d.x1);  } )
					.attr('x2', function (d) { return x_axis(d.x2);  } )
					.attr('y1', function (d) { return y_axis(d.y1);  } )
					.attr('y2', function (d) { return y_axis(d.y2);  } )
					.attr("stroke", "#ffeabc")
					.attr("stroke-width", 1.5)

		// Add nodes
		vimp_nodes = svg_vimp.append('g')
			.selectAll("feat_imp_nodes")
			.data(tree_data.points)
			.enter()
			.append("circle")
				.attr('class', 'feat_imp_node')
				.attr("cx", function (d) { return x_axis(d.x) } )
				.attr("cy", function (d) { return y_axis(d.y) } )
				.attr("r", function (d) { return ((d.y + 1) / 2) * d.value } )
				.attr("fill", (d) => d.variable == 1 ? d3_settings.class1_clr : d3_settings.class2_clr)

		var vimp_texts_data = [
				{x: width / 4, y: height / 2 - 40, t: 'Feature 1 importance:'},
				{x: (3/4) * width, y: height / 2 - 40, t: 'Feature 2 importance:'},
				{x: width / 4, y: height / 2 + 40, t: parseFloat(var0_vimp).toFixed(2)},
				{x: (3/4) * width, y: height / 2 + 40, t: parseFloat(var1_vimp).toFixed(2)},
		]

		vimp_text = svg_vimp.append('g')
			.selectAll('vimpTexts')
			.data(vimp_texts_data)
			.enter()
			.append('text')
				.attr("x", (d) => d.x)
				.attr("y", (d) => d.y)
				.attr('dy', '.25em')
				.attr("text-anchor", 'middle' )
				.attr("stroke", "none")
				.attr("fill", "#ffeabc")
				.attr("font-size", 22)
				.attr('opacity', 0)
				.text((d) => d.t)
				
		var showAverages = function() {
			vimp_links.transition()
					.duration(500)
					.style("opacity", 0)

			vimp_nodes.transition()
					.duration(1500)
					.delay(500)
					.attr("cx", (d) => d.variable == 0 ? width / 4 : (3/4) * width )
					.attr("cy",  height / 2)
					.attr('r', (d) => d.variable == 0 ? var0_vimp : var1_vimp)
					.on('end', function() {vimp_text.transition().duration(500).attr('opacity', 1)} )
					//.ease(d3.easeQuadIn)
		}

		var showTreeStructure = function() {
			vimp_text.transition().duration(100).attr('opacity', 0)

			vimp_nodes.transition()
					.duration(1500)
					.attr("cx", function (d) { return x_axis(d.x) } )
					.attr("cy", function (d) { return y_axis(d.y) } )
					.attr("r", function (d) { return ((d.y + 1) / 2) * d.value } )

			vimp_links.transition()
					.duration(1000)
					.delay(1500)
					.style("opacity", 1)
		}
		d3.select('#form').select('#vimp_nodes').on('click', showAverages)
		d3.select('#form').select('#vimp_tree').on('click', showTreeStructure)

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

var svg_vimp = d3.select("#feature_importance")

vimp_chart = VIMPChart().width(720).height(400)
vimp_chart(svg_vimp)

//
// AMD chart
//
function AMDChart() {
	// Data was generated by hand as it was faster than code it
	var sub_trees = [
		{
			'points': [
				{'x': 1, 'y': 3, 'feature': 1},
				{'x': 0, 'y': 2, 'feature': -1},
				{'x': 2, 'y': 2, 'feature': 0},
				{'x': 1, 'y': 1, 'feature': 0},
				{'x': 3, 'y': 1, 'feature': -1},
				{'x': 0, 'y': 0, 'feature': -1},
				{'x': 2, 'y': 0, 'feature': -1},
			],
		 'links': [
			 {'x1': 1, 'y1': 3, 'x2': 0, 'y2': 2},
			 {'x1': 1, 'y1': 3, 'x2': 2, 'y2': 2},
			 {'x1': 2, 'y1': 2, 'x2': 1, 'y2': 1},
			 {'x1': 2, 'y1': 2, 'x2': 3, 'y2': 1},
			 {'x1': 1, 'y1': 1, 'x2': 0, 'y2': 0},
			 {'x1': 1, 'y1': 1, 'x2': 2, 'y2': 0},
		 ],
			'details': [
				{'x': 2, 'y': 2} 
			],
			'width': 3,
		},
		{
			'points': [
				{'x': 2, 'y': 3, 'feature': 1},
				{'x': 1, 'y': 2, 'feature': 0},
				{'x': 3, 'y': 2, 'feature': -1},
				{'x': 0, 'y': 1, 'feature': -1},
				{'x': 2, 'y': 1, 'feature': -1}],
		 'links': [
			 {'x1': 2, 'y1': 3, 'x2': 1, 'y2': 2},
			 {'x1': 2, 'y1': 3, 'x2': 3, 'y2': 2},
			 {'x1': 1, 'y1': 2, 'x2': 0, 'y2': 1},
			 {'x1': 1, 'y1': 2, 'x2': 2, 'y2': 1}],
			'details': [
				{'x': 1, 'y': 2} 
			],
			'width': 3,
		},
		{
			'points': [
				{'x': 1, 'y': 3, 'feature': 1},
				{'x': 0, 'y': 2, 'feature': -1},
				{'x': 2, 'y': 2, 'feature': 1},
				{'x': 1, 'y': 1, 'feature': -1},
				{'x': 3, 'y': 1, 'feature': 0},
				{'x': 2, 'y': 0, 'feature': -1},
				{'x': 4, 'y': 0, 'feature': -1},
			],
		 'links': [
			 {'x1': 1, 'y1': 3, 'x2': 0, 'y2': 2},
			 {'x1': 1, 'y1': 3, 'x2': 2, 'y2': 2},
			 {'x1': 2, 'y1': 2, 'x2': 1, 'y2': 1},
			 {'x1': 2, 'y1': 2, 'x2': 3, 'y2': 1},
			 {'x1': 3, 'y1': 1, 'x2': 2, 'y2': 0},
			 {'x1': 3, 'y1': 1, 'x2': 4, 'y2': 0},
		 ],
			'details': [
				{'x': 3, 'y': 1} 
			],
			'width': 4,
		}
	]

  var tree_width = 720, // default width
      tree_height = 400; // default height

	var margin = {top: 50, right: 30, bottom: 50, left: 60},
			width = tree_width - margin.left - margin.right,
			height = tree_height - margin.top - margin.bottom;

  function my(selection) {
		// set the dimensions and margins of the graph

		// append the svg object to the body of the page
		svg_amd = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr('class', 'center')
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Create data
		var feature_color_map = d3.scaleOrdinal().domain([-1, 0, 1])
			.range(["#444444", d3_settings.class1_clr, d3_settings.class2_clr])

		// each tree has a different width. The first and the second trees
		// span 3 nodes, and the third tree spans 4. These values are considered
		// to construct the x axis of each tree bellow
		var plot_margin = 100;
		var total_width = 0;
		var delta_width = width / 10;

		for(var idx = 0; idx < sub_trees.length; idx += 1) {
			// Add X axis
			var x_axis = d3.scaleLinear()
				.domain([0, sub_trees[idx].width])
				.range([
					total_width,
					total_width + (sub_trees[idx].width * delta_width) - plot_margin
				]);

			// Add Y axis
			var y_axis = d3.scaleLinear()
				.domain([0., 3.])
				.range([height, 0]);

			//add details first so they get behind everything
			svg_amd.append('g')
				.selectAll("amd_details_" + idx)
				.data(sub_trees[idx].details)
				.enter()
				.append("circle")
					.attr("cx", function (d) { return x_axis(d.x) } )
					.attr("cy", function (d) { return y_axis(d.y) } )
					.attr("r", 15 )
					.attr("fill", 'none' )
					.attr("stroke", "#ffeabc")


			// Add links
			links = svg_amd.append("g")
					.selectAll("amd_links_" + idx)
					.data(sub_trees[idx].links)
					.enter()
					.append('line')
						.attr('x1', function (d) { return x_axis(d.x1);  } )
						.attr('x2', function (d) { return x_axis(d.x2);  } )
						.attr('y1', function (d) { return y_axis(d.y1);  } )
						.attr('y2', function (d) { return y_axis(d.y2);  } )
						.attr("stroke", "#ffeabc")
						.attr("stroke-width", 1.5)

			nodes = svg_amd.append('g')
				.selectAll("amd_nodes_" + idx)
				.data(sub_trees[idx].points)
				.enter()
				.append("circle")
					.attr("cx", function (d) { return x_axis(d.x) } )
					.attr("cy", function (d) { return y_axis(d.y) } )
					.attr("r", 10 )
					.style("fill", (d) => feature_color_map(d.feature) )


			total_width += sub_trees[idx].width * delta_width
		}
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

var amd_selection = d3.select("#average_minimal_depth")
amd_chart = AMDChart().width(720).height(300)
amd_chart(amd_selection)
