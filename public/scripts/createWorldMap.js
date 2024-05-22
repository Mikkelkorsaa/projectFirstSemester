// The svg
const mapSvg = d3.select(".map-container").append("svg").attr("class", "map").attr("width", "100%").attr("height", "100%");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(window.innerWidth / 12)
  .translate([window.innerWidth / 2.2, window.innerHeight / 2]);

const colorScale = d3.scaleSequential(d3.interpolateGreens);

const heatmapUrl = "http://localhost:4000/get-heatmap";

// Fetching data from the api
fetch(heatmapUrl).then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
  .then(data => {
   /*  for (let i = 0; i < data.length; i++) {
      heatData.push({ area_code: data[i].area_code, year_2021: data[i].year_2021 })
    } */
    makeHeatMap(data)
  })

function makeHeatMap(data) {
  d3.selectAll(".country").attr("fill", d => {
    const code = parseInt(d.properties.un_a3);
    const obj = data.find(o => o.area_code === code) || {};
    return colorScale(obj.year_2021 / 100) || 0;
  })

}

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/JoshYEn/geojson-world/master/world-geo-50m.json")
  .await(ready);

function ready(error, data) {
  const mouseOver = function (d) {

    // Hover effect
    d3.selectAll(".country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
  }

  const mouseLeave = function (d) {
    d3.selectAll(".country")
      .transition()
      .duration(200)
      .style("opacity", 1);
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
    .attr("fill", "grey")
    .attr("stroke", "black")
    .attr("stroke-width", 0.2)
    .attr("class", "country")
    .style("opacity", .8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave);
}

// Set the url for the api call
const powerPlantFuelsUrl = "http://localhost:4000/get-power-plant-fuels";

// Fetching data from the api
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

// Declaring the function for making the graphs
function makeGraphOnCountrys(data) {

  // Taking the data, and putting it in an array with objects
  const countries = [];
  for (const row of data) {
    const country = countries.find(c => c.countryPostal === row.country_postal);

    if (country) {
      country.fuelName.push(row.fuel_name);
      country.total.push(parseInt(row.total));
    } else {
      countries.push({
        countryPostal: row.country_postal,
        countryName: row.country_name,
        fuelName: [row.fuel_name],
        total: [parseInt(row.total)],
      });
    }
  }


  // Making click function for each country
  let click = function () {
    // Setting default values
    const w = 400;
    const h = 340;
    const padding = 35;

    // Get the location of the mouse, and data from the clicked country
    const location = d3.mouse(this);
    const clickedCountry = d3.select(this).data()[0].properties.iso_a3;
    const countryData = countries.find(c => c.countryPostal === clickedCountry);

    // Making the function to remove the graph when mouse leaves it
    const mouseLeave = function () {
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 0)
        .remove();
    }

    // Making a div at the right location, and making shure it doesnt go of the screen
    const graphBox = d3.select(".map-container")
      .append("div")
      .attr("id", "graph-box")
      .style("left", graphLocationX(location[0], w) + "px")
      .style("top", (location[1] - 1) + "px")
      .on("mouseleave", mouseLeave);

    // Check if there is any data to show, if not make a p element that says so
    if (countryData === undefined) {
      graphBox
        .append("p")
        .attr("class", "no-data")
        .text("There is no data for this country :(");
    }

    // If there is any data, make a graph that shows it
    else {
      graphBox
        .append("h2")
        .text(countryData.countryName)
        .attr("class", "graph-header")

      // Make a svg in the graphbox
      const graphSvg = graphBox.append("svg").attr("class", "country-graph").attr("width", "100%").attr("height", "100%");

      // Defining the scaleband for the x scale
      const xScale = d3.scaleBand()
        .domain(d3.range(countryData.total.length))
        .rangeRound([padding, w])
        .paddingInner(0.1);

      // Definging the scalelinear for the y scale
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(countryData.total) + 20])
        .range([h - padding, padding]);

      // Defining the x axis
      const xAxis = d3.axisBottom()
        .scale(xScale).tickFormat(function (i) { return countryData.fuelName[i]; });

      // Defining the y axis
      const yAxis = d3.axisLeft()
        .scale(yScale).ticks(5);

      // Making the bars
      graphSvg
        .append("g")
        .selectAll("rect")
        .data(countryData.total)
        .enter()
        .append("rect")
        .attr("class", "map-graph-bar")
        .attr("x", function (d, i) {
          return xScale(i);
        })
        .attr("y", function (d) {
          return yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) {
          return h - padding - yScale(d);
        })
        .attr("fill", "#355E3B");

      // Making the label for the graph
      graphSvg.append('text')
        .attr('x', 5)
        .attr('y', 20)
        .attr('text-anchor', 'left')
        .style('font-family', 'Helvetica')
        .style('font-size', 'small')
        .text('Number of fuel usage');

      // Making y axis appear
      graphSvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

      // Making x axis appear
      graphSvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

      // Making the numbers on top of each bars
      graphSvg.append("g")
        .selectAll("text")
        .data(countryData.total)
        .enter()
        .append("text")
        .attr("class", "map-graph-num")
        .attr("x", function (d, i) {
          return xScale(i) + ((xScale.bandwidth() / 2) - 10);
        })
        .attr("y", d => yScale(d) - 5)
        .text(d => d)
    }
  }

  // Giving the click function to all countries
  d3.selectAll(".country").on("click", click);
}

// Function to find out if the graph needs to be on the right or the left of the cursor
function graphLocationX(xValue, boxWidth) {
  if (xValue > window.innerWidth / 2) {
    return (xValue - boxWidth) + 1
  } else {
    return xValue - 1
  }

}