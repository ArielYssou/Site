function TreeChart() {
  var tree_width = 720, // default width
      tree_height = 600; // default height

	var margin = {top: 10, right: 30, bottom: 30, left: 60},
			width = tree_width - margin.left - margin.right,
			height = tree_height - margin.top - margin.bottom;

  function my(selection) {
		// set the dimensions and margins of the graph
		console.log(width)

		// append the svg object to the body of the page
		svg_tree = selection.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Create data
		var classes = [0, 1]
		var myColor = d3.scaleOrdinal().domain(classes)
			.range(["#FF934F", "#577399"])

		var line = d3.line()
				.x(function(d) { return x(d.dwte); })
				.y(function(d) { return y(d.close); });

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
				.domain([50, 0])
				.range([height, 20]);

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
				.append("circle")
					.attr("cx", function (d) { return x_axis_scatter(d.x0); } )
					.attr("cy", function (d) { return y_axis_scatter(d.x1); } )
					.attr("r", 3.5)
					.style("fill", "#444444")

			var node_width = 85
			var node_height = 30
			
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
					.style("stroke", "#ffeabc")

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
						.attr("font-size", 15)
						.text(function(d) { return d.is_leaf == 0 ? 'x' + d.feature + ' <=' + parseFloat(d.threshold).toFixed(2) : ''; })
			
			hyperplanes = svg_tree.append("g")
					.selectAll("tree_hyperplanes")
					.data(tree.hyperplanes)
					.enter()
					.append('line')
						.attr('x1', function (d) { return x_axis_scatter(d.x1);  } )
						.attr('x2', function (d) { return x_axis_scatter(d.x2);  } )
						.attr('y1', function (d) { return y_axis_scatter(d.y1);  } )
						.attr('y2', function (d) { return y_axis_scatter(d.y2);  } )
						.attr("stroke", "#ffeabc")
						.attr("stroke-width", 1.5)
						.attr("opacity", 0.5)
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

var svg_tree = d3.select("#decision_tree")

tree_chart = TreeChart().width(720).height(400)
tree_chart(svg_tree)
console.log(tree_chart)

