d3.queue().defer(d3.csv, "../datasheets/global_power_plant_database.csv")
  .await(start);

const points = [];
const unique = [];

function start(error, topo) {
  for (let i = 1; i < topo.length; i++) {
    let newPoint = new Positions(
      topo[i].latitude,
      topo[i].longitude,
      topo[i].primary_fuel
    );
    points.push(newPoint);
    if (!unique.includes(topo[i].primary_fuel)) {
      unique.push(topo[i].primary_fuel)
    }
  }
  console.log(unique)

  d3.selectAll("#Coal, #Oil, #Gas, #Biomass, #Hydro, #Wind, #Nuclear, #Solar").on("click", function () {
    let id = this.id;

    mapSvg.selectAll(".pin").remove()

    mapSvg.append("g")
      .selectAll(".pin")
      .data(points)
      .enter()
      .filter(d => {return d.primary_fuel == id })
      .append("circle", ".pin")
      .attr("r", 1)
      .attr("transform", d => {
        return "translate(" + projection([
          d.longitude,
          d.latitude
        ]) + ")";
      })
      .attr("class", "pin")

  })
}

function Positions(latitude, longitude, primary_fuel) {
  this.latitude = latitude;
  this.longitude = longitude;
  this.primary_fuel = primary_fuel;
}
