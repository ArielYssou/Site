function FimpChart() {

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

  var tree_width = 720, // default width
      tree_height = 600; // default height

	var margin = {top: 10, right: 30, bottom: 30, left: 60},
			width = tree_width - margin.left - margin.right,
			height = tree_height - margin.top - margin.bottom;

  function my(selection) {
		// set the dimensions and margins of the graph
		console.log(width)

		// append the svg object to the body of the page
		svg_vimp = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
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
			.domain([0., 4.])
			.range([height, 0]);

		// Add links
		links = svg_vimp.append("g")
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
		nodes = svg_vimp.append('g')
			.selectAll("feat_imp_nodes")
			.data(tree_data.points)
			.enter()
			.append("circle")
				.attr("cx", function (d) { return x_axis(d.x) } )
				.attr("cy", function (d) { return y_axis(d.y) } )
				.attr("r", function (d) { return d.value } )
				.style("fill", "#363530")
				.style("stroke", "#ffeabc")

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

var svg_fimp = d3.select("#feature_importance")

fimp_chart = FimpChart().width(720).height(400)
fimp_chart(svg_fimp)
