d3.queue().defer(d3.csv, "../datasheets/global_power_plant_database.csv")
.await(start);

const points = [];

function start(error, topo){
  for (let i = 1; i < topo.length; i++){
    let newPoint = new Positions(
      topo[i].latitude,
      topo[i].longitude,
      topo[i].primary_fuel
    );
    points.push(newPoint);
  }

  mapSvg.append("g")
    .selectAll(".pin")
    .data(points)
    .enter().append("circle", ".pin")
    .attr("r", 1)
    .attr("transform", d => {
      if (d.primary_fuel == "Nuclear")
      return "translate(" + projection([
        d.longitude,
        d.latitude
      ]) + ")";
    })
}

function Positions(latitude, longitude, primary_fuel) {
  this.latitude = latitude;
  this.longitude = longitude;
  this.primary_fuel = primary_fuel;
}
