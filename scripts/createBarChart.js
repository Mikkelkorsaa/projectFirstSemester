const svgWidth = window.innerWidth / 2;
const svgHeight = 300;
const padding = 10;
const barChartSvg = d3.select(".bar-chart-container").append("svg").attr("width", "100%").attr("height", "100%");

d3.queue().defer(d3.csv, "../datasheets/powerplant_co2_and_deathrate.csv")
    .await(barChart);


function barChart(error, topo) {
    const colNames = Object.keys(topo[0])
    init(topo, svgWidth, svgHeight, colNames[1])
    d3.selectAll("#deathrate, #co2_emission_in_tons").on("click", function () {
        let id = this.id;
        animateUpdateRects(id)
        animateUpdateLabels(id)
    })
}

function init(dataset, w, h, colName) {

    //Scatter plot
    barChartSvg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d) => {
            return 250;
        })
        .attr("y", (d, i) => {
            return (h / dataset.length) * i;
        })
        .attr("width", (d) => {
            return d[colName];
        })
        .attr("height", () => {
            return (h / dataset.length) - padding;
        })

    barChartSvg
        .selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) {
            return d.source;
        })
        .attr("x", function (d) {
            return 30
        })
        .attr("y", function (d, i) {
            return ((h / dataset.length) * i) + 20;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "25px")
        .attr("fill", "green")
        //Her tilføjes en class til labels, således at vi kan vælge dem senere og undgå at ændre på al tekst i svg'en
        .attr("class", "label");

    barChartSvg
        .selectAll("text.value")
        .data(dataset)
        .enter()
        .append("text")
        .text(function (d) {
            if (colName === "deathrate") {
                return d[colName] + " Deaths";
            } else if (colName === "co2_emission_in_tons") {
                return d[colName] + " Tons";
            }
        })
        .attr("x", function (d) {
            return parseInt(d[colName]) + 255;
        })
        .attr("y", function (d, i) {
            return ((h / dataset.length) * i) + 20;
        })
        .attr("fill", "green")
        .attr("class", "value")
}

function animateUpdateRects(colName) {
    let selectRects = barChartSvg.selectAll("rect");

    selectRects
        .transition()
        .duration(1500)
        .attr("width", d => {
            return d[colName]
        })

}

function animateUpdateLabels(colName) {
    let selectLabels = barChartSvg.selectAll(".value");

    selectLabels
        .transition()
        .duration(1500)
        .attr("x", d => {
            return parseInt(d[colName]) + 255;
        })
        .text(d => {
            if (colName === "deathrate") {
                return d[colName] + " Deaths";
            } else if (colName === "co2_emission_in_tons") {
                return d[colName] + " Tons";
            }
        })
}
