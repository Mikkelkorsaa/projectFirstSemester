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
        if (id === "deathrate") {
            document.getElementById("bar-chart-text").innerHTML = "Measured as deaths per terawatt-hour of electricity production. <br/> 1 terawatt-hour is the anual electricity consumption of 150.000 people in the EU"
        } else if (id === "co2_emission_in_tons") {
            document.getElementById("bar-chart-text").innerHTML = "Measured in emissions of CO₂-equivalents per gigawatt-hour of electricity over the lifecycle of the power plant. <br/> 1 gigawatt-hour is the annual electricity consumption of 150 people in the EU."
        }
    })
}

function init(dataset, w, h, colName) {
    if (colName === "deathrate") {
        document.getElementById("bar-chart-text").innerHTML = "Measured as deaths per terawatt-hour of electricity production. <br/> 1 terawatt-hour is the anual electricity consumption of 150.000 people in the EU"
    } else if (colName === "co2_emission_in_tons") {
        document.getElementById("bar-chart-text").innerHTML = "Measured in emissions of CO₂-equivalents per gigawatt-hour of electricity over the lifecycle of the power plant. <br/> 1 gigawatt-hour is the annual electricity consumption of 150 people in the EU."
    }
    //Scatter plot
    barChartSvg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d) => {
            return 180;
        })
        .attr("y", (d, i) => {
            return (h / dataset.length) * i;
        })
        .attr("width", (d) => {
            return parseInt(d[colName]);
        })
        .attr("height", () => {
            return (h / dataset.length) - padding;
        })
        .attr("fill", "#355E3B")

    barChartSvg
        .selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text((d) => {
            return d.source;
        })
        .attr("x", (d) => {
            return 30
        })
        .attr("y", (d, i) => {
            return ((h / dataset.length) * i) + 20;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "25px")
        .attr("fill", "black")
        .attr("class", "label");

    barChartSvg
        .selectAll("text.value")
        .data(dataset)
        .enter()
        .append("text")
        .text((d) => {
            if (colName === "deathrate") {
                return d[colName] + " Deaths";
            } else if (colName === "co2_emission_in_tons") {
                return d[colName] + " Tons";
            }
        })
        .attr("x", (d) => {
            return parseInt(d[colName]) + 185;
        })
        .attr("y", (d, i) => {
            return ((h / dataset.length) * i) + 20;
        })
        .attr("fill", "black")
        .attr("class", "value")
}

function animateUpdateRects(colName) {
    let selectRects = barChartSvg.selectAll("rect");

    selectRects
        .transition()
        .duration(1500)
        .attr("width", (d) => {
            return d[colName];
        })

}

function animateUpdateLabels(colName) {
    let selectLabels = barChartSvg.selectAll(".value");

    selectLabels
        .transition()
        .duration(1500)
        .attr("x", (d) => {
            return parseInt(d[colName]) + 185;
        })
        .text((d) => {
            if (colName === "deathrate") {
                return d[colName] + " Deaths";
            } else if (colName === "co2_emission_in_tons") {
                return d[colName] + " Tons";
            }
        })
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("deathrate").innerHTML = "Deathrate";
    document.getElementById("co2_emission_in_tons").innerHTML = "CO2 Emission";
});

