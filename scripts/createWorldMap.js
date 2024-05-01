// The svg
let svg = d3.select(".container").append("svg").attr("width", "100%").attr("height", "100%");

// Map and projection
let path = d3.geoPath();
let projection = d3.geoMercator()
  .scale(160)
  .center([0,-24])
  .translate([window.innerWidth / 2.2, window.innerHeight / 2]);

// Data and color scale
let colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/JoshYEn/geojson-world/master/world-geo-50m.json")
  .await(ready);

function ready(error, topo) {

  let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(20)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
  }
  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", "gray")
      .attr("stroke", "white")
      .attr("stroke-width", 0.2)
      .attr("class", "Country" )
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
}