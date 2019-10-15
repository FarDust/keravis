const SOURCE = '/data/data.json';

const MARGINS = { top: 10, right: 30, bottom: 30, left: 60 };

const BASE_DIMS = {
    WIDTH: 450, HEIGHT: 400
}

const DIMENSIONS = {
    WIDTH: BASE_DIMS.WIDTH - MARGINS.left - MARGINS.right,
    HEIGHT: BASE_DIMS.HEIGHT - MARGINS.top - MARGINS.bottom
};

const SVG = d3.select("#scatter").append("svg")
    .attr("width", DIMENSIONS.WIDTH + MARGINS.left + MARGINS.right)
    .attr("height", DIMENSIONS.HEIGHT + MARGINS.top + MARGINS.bottom)
    .append("g")
    .attr("transform",
        "translate(" + MARGINS.left + "," + MARGINS.top + ")");



d3.json(SOURCE).then((data) => {

    console.log('====================================');
    console.log(data);
    console.log('====================================');

    const yMin = Math.min(...Array.from(data.data).map(d => d.score));
    const yMax = Math.max(...Array.from(data.data).map(d => d.score));

    const y = d3.scaleLinear()
        .domain([yMin, yMax + 20])
        .range([DIMENSIONS.HEIGHT, 0]);
    SVG.append("g")
        .call(d3.axisLeft(y));

    const xMin = Math.min(...Array.from(data.data).map(d => d.round));
    const xMax = Math.max(...Array.from(data.data).map(d => d.round));
    const x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, DIMENSIONS.WIDTH]);


    SVG.append("g")
        .attr("transform", "translate(0," + DIMENSIONS.HEIGHT + ")")
        .call(d3.axisBottom(x));

    SVG.append("g")
        .selectAll("dot")
        .data(data.data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.round))
        .attr("cy", d => y(d.score))
        .attr("r", 5)
        .attr("fill", "#2fe07f")
        .attr("cid", d => d.round)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    function mouseout(point) {
        const circle = d3.select(`[cid="${point.round}"]`);
        circle.attr("r", 5);
        d3.selectAll("#tooltip").remove();

    }

    function mouseover(point) {
        let content = `
                        <article class="media">
                          <div class="media-content">
                            <div class="content">
                              <p>
                                <strong>Round ${point.round}</strong>
                                <br>
                                <strong>Timestamp</strong>: ${point.timestamp}
                                <br>
                                <strong>Score</strong>: ${point.score}
                              </p>
                            </div>
                          </div>
                        </article>
        `

        const circle = d3.select(`[cid="${point.round}"]`);
        circle.attr("r", 10);

        const div = d3
            .select("#scatter")
            .append("div")
            .attr("class", "box")
            .attr("id", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute");

        div
            .transition()
            .duration(200)
        div
            .html(content)
            .style("left", (d3.event.layerX) + "px")
            .style("opacity", 1)
            .style("top", (d3.event.layerY) + "px");

    }
});
