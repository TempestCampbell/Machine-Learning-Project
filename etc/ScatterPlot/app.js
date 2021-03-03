var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//--------------------------------------------------------------------------
// Import Data
d3.csv("globalWinePoints.csv").then(function(globalWinePoints) {

temp=globalWinePoints
temp=temp.filter(c=>c.country=="Germany")
    plotDots(temp)
    function plotDots(dada){

    
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    dada.forEach(function(data) {
      data.price = +data.price;
      data.points = +data.points;
    });
//--------------------------------------------------------------------------

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([-50, d3.max(dada,function(d) { return d.price; })])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([75, d3.max(dada, d => d.points)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

//--------------------------------------------------------------------------

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(dada)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.price))
    .attr("cy", d => yLinearScale(d.points))
    .attr("r", "5")
    //Function to return color based on data?
    .attr("fill", function(d){
        yr=d.vintage.split("-")
        year=yr[0]
        if (year<=1950){
            return "red"}
        else {
            return "#380059"
        }  
    })
    .attr("opacity", ".25");

//--------------------------------------------------------------------------

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.title}<br>Price($): ${d.price}<br>Points: ${d.points}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

//--------------------------------------------------------------------------

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Points");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Price($)");}
  }).catch(function(error) {
    console.log(error);
   
  });
