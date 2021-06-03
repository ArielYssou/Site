// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 920 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#decision_tree")
  .append("svg")
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
    .domain([-42, 28])
    .range([0, (width / 2) - 10]);

  // Add Y axis
  var y_axis_tree = d3.scaleLinear()
    .domain([0, 40])
    .range([height, 0]);

  // Add X axis
  var x_axis_scatter = d3.scaleLinear()
    .domain([-15, 10])
    .range([(width / 2) + 10, width]);

  // Add Y axis
  var y_axis_scatter = d3.scaleLinear()
    .domain([-10, 20])
    .range([height, 0]);

  // Add dots
  dots = svg.append('g')
    .selectAll("dot")
    .data(tree.data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x_axis_scatter(d.x0); } )
      .attr("cy", function (d) { return y_axis_scatter(d.x1); } )
      .attr("r", 3.5)
      .style("fill", "#444444")


  // Add dots
  dots = svg.append('g')
    .selectAll("nodes")
    .data(tree.nodes)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x_axis_tree(d.pos_x); } )
      .attr("cy", function (d) { return y_axis_tree(d.pos_y); } )
      .attr("r", 10)
      .style("fill", "#ffffff")

})

function colorPoints() {
	console.log('hi')
	d3.selectAll("circle").transition()
			.delay(function(d, i){return(i * 5)})
			.duration(100)
			.style("fill", function(d) { return myColor(d.y) } )
}  
