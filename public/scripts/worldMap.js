let width = d3.select("#map-container").node().getBoundingClientRect().width
let height = 800
const sensitivity = 75

let projection = d3.geoOrthographic()
  .scale(250)
  .center([0, 0])
  .rotate([0, -30])
  .translate([width / 2, height / 2])

const colorScale = d3.scaleSequential(d3.interpolateGreens);

const initialScale = projection.scale()
let path = d3.geoPath().projection(projection)

let svg = d3.select("#map-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

let globe = svg.append("circle")
  .attr("fill", "#EEE")
  .attr("stroke", "#000")
  .attr("stroke-width", "0.2")
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("r", initialScale)

svg.call(d3.drag().on('drag', () => {
  const rotate = projection.rotate()
  const k = sensitivity / projection.scale()
  projection.rotate([
    rotate[0] + d3.event.dx * k,
    rotate[1] - d3.event.dy * k
  ])
  path = d3.geoPath().projection(projection)
  svg.selectAll("path").attr("d", path)
}))
  .call(d3.zoom().on('zoom', () => {
    if (d3.event.transform.k > 0.3) {
      projection.scale(initialScale * d3.event.transform.k)
      path = d3.geoPath().projection(projection)
      svg.selectAll("path").attr("d", path)
      globe.attr("r", projection.scale())
    }
    else {
      d3.event.transform.k = 0.3
    }
  }))

let map = svg.append("g")

d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/JoshYEn/geojson-world/master/world-geo-50m.json")
  .await(createMap);

function createMap(error, data) {
  map.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(data.features)
    .enter().append("path")
    .attr("class", d => "country " + d.properties.name.replace(" ", "-").toLowerCase())
    .attr("d", path)
    .attr("fill", "white")
    .style('stroke', 'black')
    .style('stroke-width', 0.3)
    .style("opacity", 0.8)

  //Optional rotate
  d3.timer(function (elapsed) {
    const rotate = projection.rotate()
    const k = sensitivity / projection.scale()
    projection.rotate([
      rotate[0] - 1 * k,
      rotate[1]
    ])
    path = d3.geoPath().projection(projection)
    svg.selectAll("path").attr("d", path)
  }, 200)
}
const heatmapUrl = "http://localhost:4000/get-heatmap";
const heatmapData = null;

// Fetching data from the api
fetch(heatmapUrl).then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
  .then(data => {
    makeHeatMap(data)
  })

function makeHeatMap(data) {
  d3.selectAll(".country").attr("fill", d => {
    const code = parseInt(d.properties.un_a3);
    const obj = data.find(o => o.area_code === code) || {};
    return colorScale(obj.year_2021 / 100) || 0;
  })
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
        .append("h2")
        .text(d3.select(this).data()[0].properties.name)
        .attr("class", "graph-header")
      
      graphBox
        .append("p")
        .text("There are no power plants for this country.")
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
        .attr("fill", "#355E3B  ");

      // Making the label for the graph
      graphSvg.append('text')
        .attr('x', 5)
        .attr('y', 20)
        .attr('text-anchor', 'left')
        .style('font-family', 'Helvetica')
        .style('font-size', 'small')
        .text('Total number of each powerplants');

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