// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 440;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;


var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
var labelsGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("/assets/data/data.csv").then( healthData => {
    healthData.forEach( d => {
        d.smokes = +d.smokes;
        d.age = +d.age;
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    })
    var smokerData = healthData.map(d => d.smokes);
    var ageData = healthData.map(d => d.age);

    var xScaleAge = d3.scaleLinear()
        .domain([d3.min(ageData)-1, d3.max(ageData)])
        .range([0, width]);

    var yScaleSmokes = d3.scaleLinear()
        .domain([d3.min(smokerData)-1, d3.max(smokerData)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScaleAge);
    var leftAxis = d3.axisLeft(yScaleSmokes);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    
    //need to work on styling these
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xScaleAge(d.age))
        .attr("cy", d => yScaleSmokes(d.smokes))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("opacity", ".75")
        .attr("stroke", "red");
    
    var stateLabels = labelsGroup.selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("color", "white")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("font-family", "monospace")
        .attr("x", d => xScaleAge(d.age)-6)
        .attr("y", d => yScaleSmokes(d.smokes)+3);

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d){
            return (`${d.state} <br> Median Age: ${d.age} <br> Percent Smokers:${d.smokes}%`)
        });

    circlesGroup.call(toolTip);
    stateLabels.call(toolTip);

    circlesGroup.on("mouseover", function(d) {toolTip.show(d, this)})
        .on("mouseout", function(d){toolTip.hide(d, this)});
    stateLabels.on("mouseover", function(d) {toolTip.show(d, this)})
        .on("mouseout", function(d){toolTip.hide(d, this)});

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", -75 - (height / 2))
        .attr("dy", "1em")
        .attr("font-weight", "bold")
        .classed("axis-text", true)
        .text("Percentage of Smokers");
    
    chartGroup.append("text")
        .attr("transform", `translate(${width/2 - 40}, ${height + 20})`)
        .attr("font-weight", "bold")
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Median Age");
        
});