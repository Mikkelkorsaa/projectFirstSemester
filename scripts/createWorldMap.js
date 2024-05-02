// The svg
let svg = d3.select(".container").append("svg").attr("width", "100%").attr("height", "100%");

// Map and projection
let path = d3.geoPath();
let projection = d3.geoMercator()
  .scale(window.innerWidth/12)
  .translate([window.innerWidth / 2.2, window.innerHeight / 2]);

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/JoshYEn/geojson-world/master/world-geo-50m.json")
  .await(ready);

function ready(error, topo) {

  let mouseOver = function (d) {
    d3.selectAll(".country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
  }

  let mouseLeave = function (d) {
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", .8)
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
    .attr("stroke", "black")
    .attr("stroke-width", 0.2)
    .attr("class", "country")
    .style("opasity", .8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)

}