var chart = lineChart()
	.x(function(d) { return +d.X; })
	.y(function(d) { return +d.y; });

d3.csv("https://raw.githubusercontent.com/ArielYssou/Site/master/uncommitted/d3/data/data_1.csv", function(data) {
	d3.select("#chart1")
	.datum(data)
	.call(chart)
})

