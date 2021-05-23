// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
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
	{x1: , y1: , x2: , y2: ,depth: },
)

//Read the data
d3.csv("https://raw.githubusercontent.com/ArielYssou/Site/master/uncommitted/randomForest/data/example_data.csv", function(data) {

  // Add X axis
  var x_axis = d3.scaleLinear()
    .domain([-15, 10])
    .range([ 0, width]);

  // Add Y axis
  var y_axis = d3.scaleLinear()
    .domain([-10, 20])
    .range([ height, 0]);

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x_axis(d.x0); } )
      .attr("cy", function (d) { return y_axis(d.x1); } )
      .attr("r", 3.5)
      .style("fill", function(d) { return myColor(d.y) } )

	svg.append('g')
		.selectAll("line")
		.data(hyperplanes)
		.enter()
		.append('line')
			.attr('x1', function(d) { return x_axis(d.x1) } )
			.attr('y1', function(d) { return y_axis(d.y1) } )
			.attr('x2', function(d) { return x_axis(d.x2) } )
			.attr('y2', function(d) { return y_axis(d.y2) } )
})
