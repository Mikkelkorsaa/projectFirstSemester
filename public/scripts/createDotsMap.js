/* d3.queue().defer(d3.csv, "../datasheets/global_power_plant_database.csv")
  .await(start); */

const pinsUrl = "http://localhost:4000/get-pins"

fetch(pinsUrl).then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
  .then(data => {
    start(data)
  })

const points = [];
const unique = [];

function start(data) {
  for (let i = 1; i < data.length; i++) {
    let newPoint = new Positions(
      data[i].latitude,
      data[i].longitude,
      data[i].fuel_name
    );
    points.push(newPoint);
    if (!unique.includes(data[i].primary_fuel)) {
      unique.push(data[i].primary_fuel)
    }
  }

  d3.selectAll("#Coal, #Oil, #Gas, #Biomass, #Hydro, #Wind, #Nuclear, #Solar, #Clear").on("click", function () {
    let id = this.id;
    console.log(id);

    if (id == "test") {
      mapSvg.selectAll(".pin").remove()
      return
    } else {
      mapSvg.selectAll(".pin").remove()

      mapSvg.append("g")
        .selectAll(".pin")
        .data(points)
        .enter()
        .filter((d) => { return d.primary_fuel == id })
        .append("circle", ".pin")
        .attr("r", 1)
        .attr("transform", (d) => {
          return "translate(" + projection([
            d.longitude,
            d.latitude
          ]) + ")";
        })
        .attr("class", "pin")
        .attr("fill", "#d24e21")
    }
  })
}

function Positions(latitude, longitude, primary_fuel) {
  this.latitude = latitude;
  this.longitude = longitude;
  this.primary_fuel = primary_fuel;
}

/*
function pinColor(id){
  if id=
}*/
