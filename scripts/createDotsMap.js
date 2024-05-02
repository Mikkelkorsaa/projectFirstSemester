const svg = d3.select(".container").select("svg");


d3.queue().defer(d3.csv, "../datasheets/global_power_plant_database.csv")
.await(start);

function start(error, topo){



}




