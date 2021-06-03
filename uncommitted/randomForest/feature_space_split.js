// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 920 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#feature_space_split")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create data
var classes = [0, 1]
var myColor = d3.scaleOrdinal().domain(classes)
  .range(["#FF934F", "#577399"])

var hyperplanes = new Array();
hyperplanes.push(
	{value: -0.76, axis: 'x0', depth: 0},
	{value: -8.00, axis: 'x0', depth: 1},
	{value: -4.80, axis: 'x0', depth: 2},
	{value: -3.21, axis: 'x0', depth: 4},
	{value: -0.42, axis: 'x1', depth: 2},
)

var line = d3.line()
    .x(function(d) { return x(d.dwte); })
    .y(function(d) { return y(d.close); });

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
  dots = svg.append('g')
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
				.attr("stroke", "#ffeabc")
				.attr("stroke-width", 2)
				.attr("id" , function(d){
					return "line" + d.id;
				})

	for(var idx = 0; idx < 2; idx += 1) {
		var path = svg.select('#line' + idx)
		console.log(path)
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

//	svg.append('g')
//		.selectAll("line")
//		.data(hyperplanes)
//		.enter()
//		.append('line')
//			.attr('x1', function(d) { return (d.axis == 'x0' ? x_axis(d.value): 0) } )
//			.attr('x2', function(d) { return (d.axis == 'x0' ? x_axis(d.value): 0) } )
//			.attr('y1', function(d) { return (d.axis == 'x0' ? height: y_axis(d.value)) } )
//			.attr('y2', function(d) { return (d.axis == 'x0' ? height: y_axis(d.value)) } )
//      .attr("stroke", "#ffeabc")
//      .attr("stroke-width", 1.5)
//			.attr("opacity", 0.5)
//		.transition()
//			.duration(2000)
//			.delay(function(d){ return ( d.depth * 500) })
//			.attr('x2', function(d) { return (d.axis == 'x0' ? x_axis(d.value) : width) } )
//			.attr('y2', function(d) { return (d.axis == 'x0' ? 0 : y_axis(d.value)) } )
//
})

function colorPoints() {
	d3.selectAll("#scatter_dot").transition()
			.delay(function(d, i){return(i * 5)})
			.duration(100)
			.style("fill", function(d) { return myColor(d.y) } )
}  
