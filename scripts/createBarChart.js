let barChartSvg = d3.select(".bar-chart-container").append("svg").attr("width", "100%").attr("height", "100%");

d3.queue().defer(d3.csv, "../datasheets/powerplant_co2_and_deathrate.csv")
.await(barChart);

function barChart(error, topo){
    console.log(topo)
}




