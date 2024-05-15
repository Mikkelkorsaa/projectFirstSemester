// The svg
const mapSvg = d3.select(".map-container").append("svg").attr("class", "map").attr("width", "100%").attr("height", "100%");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(window.innerWidth / 12)
  .translate([window.innerWidth / 2.2, window.innerHeight / 2]);

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/JoshYEn/geojson-world/master/world-geo-50m.json")
  .await(ready);

function ready(error, data) {
  const mouseOver = function (d) {
    d3.selectAll(".country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity",)
  }

  const mouseLeave = function (d) {
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", .8);
  }

  // Draw the map
  mapSvg.append("g")
    .selectAll("path")
    .data(data.features)
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
    .style("opacity", .8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave);
}

const powerPlantFuelsUrl = "http://localhost:4000/get-power-plant-fuels";

fetch(powerPlantFuelsUrl).then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
  .then(data => {
    makeGraphOnCountrys(data);
  })

const totalFuelsInCountrys = [];

function makeGraphOnCountrys(data) {

  const countries = [];
  for (const row of data) {
    const country = countries.find(c => c.countryPostal === row.country_postal);

    if (country) {
      country.fuelName.push(row.fuel_name);
      country.total.push(row.total);
    } else {
      countries.push({
        countryPostal: row.country_postal,
        fuelName: [row.fuel_name],
        total: [row.total],
      });
    }
  }

  let click = function (d) {
    const location = d3.mouse(this);
    const clickedCountry = d3.select(this).data()[0].properties.iso_a3;
    const countryData = countries.find(c => c.countryPostal === clickedCountry)

    if (countryData === undefined) {
      return
    } else {
      d3.selectAll(".graph-box").remove()
      const graphBox = d3.select(".map-container")
        .append("div")
        .attr("class", "graph-box")
        .style("left", location[0] + "px")
        .style("top", location[1] + "px")
        .data([countryData])
      
      graphBox.append("svg").attr("width", "100%").attr("height", "100%")
      
      console.log("clicked")
    }
  }
  d3.selectAll(".country").on("click", click);
}
