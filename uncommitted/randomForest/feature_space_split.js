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

var hyperplanes = [
	[-3, 20],
	[-4.5, 20],
	[2, 20],
]

//Read the data
d3.csv("https://raw.githubusercontent.com/ArielYssou/Site/master/uncommitted/randomForest/example_data.csv", function(data) {

  // Add X axis
  var x_axis = d3.scaleLinear()
    .domain([-15, 10])
    .range([ 0, width]);

  svg.append("g")
		.attr("class", "axisDarkTheme")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x_axis));

	svg.append("text")
			.attr("class", "legend__label")
			.attr("text-anchor", "end")
			.attr("x", width)
			.attr("y", height - 6)
			.text("x1");

  // Add Y axis
  var y_axis = d3.scaleLinear()
    .domain([-10, 20])
    .range([ height, 0]);

	svg.append("g")
		.attr("class", "axisDarkTheme")
		.call(d3.axisLeft(y_axis));

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
})
