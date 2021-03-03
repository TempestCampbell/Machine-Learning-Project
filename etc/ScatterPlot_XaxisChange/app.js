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
      //NEW 
      var clip = graph.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("id", "clip-rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
// Add the line by appending an svg:path element with the data line we created above
      // do this AFTER the axes above so that the line is above the tick-lines
      var path = graph.append("svg:path")
        .attr("class","path")
        .attr("clip-path", "url(#clip)")
        .attr("d", line(data));

  function zoom(begin, end) {
    x.domain([begin, end - 1]);

    var t = graph.transition().duration(0);

    var size = end - begin;
    var step = size / 10;
    var ticks = [];
    for (var i = 0; i <= 10; i++) {
      ticks.push(Math.floor(begin + step * i));
    }

    xAxis.tickValues(ticks);

    t.select(".x.axis").call(xAxis);
    t.select('.path').attr("d", line(data));
  }

  $(function() {
        $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: 1000,
            values: [ 0, 1000 ],
            slide: function( event, ui ) {
              var begin = d3.min([ui.values[0], data.length]);
              var end = d3.max([ui.values[1], 0]);
              console.log("begin:", begin, "end:", end);

              zoom(begin, end);
            }
        });
    });
//END NEW*****************************************
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
