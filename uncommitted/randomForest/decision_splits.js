function DecisionChart() {
  var total_width = 720, // default width
      total_height = 200; // default height

	var margin = {top: 10, right: 30, bottom: 30, left: 60},
			width = total_width - margin.left - margin.right,
			height = total_height - margin.top - margin.bottom;

  function my(selection) {
		// set the dimensions and margins of the graph
		console.log(width)

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
				{'x': val}
			)
			splits.push(
				{'x': val + 0.5}
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
		xAxis = svg_chart.append("g")
				.attr("class", "x-axis")
				.attr("transform", "translate(" + 0 + "," + height / 2 + ")")

				.call(d3.axisBottom(x_axis));;

		svg_chart
				.append('path')
					.attr("transform", "translate(" + (width - 5) + "," + ((height / 2) - 5) + ")")
					.attr('d', 'M 0 0 L 5 5 L 0 10')
					.attr('stroke', 'black')
					.attr('stroke-width', 1)
					.attr('fill', 'none')
		// Labels
		svg_chart.append("text")
				.attr("class", "axis-title")
				.attr("transform", "translate(" + width + ", 0)")
				.attr("y", (height / 2) - 10)
				.attr('fill', '#ffeabc')
				.text("$x_0$")


		xAxis.select("path").attr("marker-end", "url(#arrowhead)");

		// Add dots
		dots = svg_chart.append('g')
			.selectAll("split_points")
			.data(points)
			.enter()
			.append("path")
				.attr("transform", d => "translate("+x_axis(d.x) + ',' + y_axis(0) + ")" )
				.attr("fill", '#ffeabc')
				.attr("d", d3.symbol().type(d3.symbols[0] ) )
		// Add dots
		dots = svg_chart.append('g')
			.selectAll("split_points")
			.data(splits)
			.enter()
			.append("path")
				.attr("transform", d => "translate("+x_axis(d.x) + ',' + y_axis(0) + ") rotate(-45)" )
				.attr("fill", '#ffeabc')
				.attr("d", d3.symbol().type(d3.symbols[1]) )

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
