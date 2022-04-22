'use strict';

async function getData() {
    const res = await fetch('/api/data/', {
        method: 'GET',
        headers: { "Accept": "application/json" }
    })
    if (res.ok === true) {
        const data = await res.json()
        return data
    }
}

const createHistogram = (dataSet => {

    let { quantil25, quantil50, quantil75, mean, frequencies } = dataSet

    let margin = { top: 30, right: 30, bottom: 30, left: 40 },
        width = 950 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    let svg = d3.select("#histogram-wrap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate( ${margin.left} , ${margin.top} )`);

    let xScale = d3.scaleLinear()
        .domain([0, frequencies.length])
        .range([0, width])

    let xAxisGenerator = d3.axisBottom(xScale)
    xAxisGenerator
        .tickValues([quantil25, quantil50, quantil75, mean])
        .tickSize(-height)
        .tickFormat(d => d)
    let xAxis = svg.append('g')
        .call(xAxisGenerator)
        .attr("transform", `translate(0, ${height})`)

    xAxis.select(":nth-child(5) line")
        .attr("stroke", "green")
        .attr("stroke-width", "2")

    let topAxisGenerator = d3.axisTop(xScale)
    let topLabels = ['25%', '50%', '75%', 'prumer']
    topAxisGenerator.tickValues([quantil25, quantil50, quantil75, mean])
        .tickFormat((d, i) => topLabels[i])
    let xTopAxis = svg.append("g")
        .call(topAxisGenerator);

    xTopAxis.select(":nth-child(3) ")
        .style("text-anchor", "end")
    xTopAxis.select(":nth-child(5) ")
        .style("text-anchor", "start")

    xTopAxis.select(".domain").remove();

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(frequencies)])
        .range([height, 0]);
    svg.append('g')
        .call(d3.axisLeft(yScale))

    svg.append("path")
        .datum(frequencies)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x((d, i) => xScale(i))
            .y(d => yScale(d))
        )
})


window.onload = createHistogram(await getData())