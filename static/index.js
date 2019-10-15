function matrixTo1D(matrix) {
    let final_array = [];
    matrix.forEach(row => {
        row.forEach(element => {
            final_array.push(element);
        });
    });
    return final_array;
}
function matrixToImage(matrix) {
    const canvas = d3.select("#img").append("canvas");
    const width = 200;
    const height = 200;
    canvas.attr("width", width)
        .attr("height", height);
    const node = canvas.node();
    const ctx = node.getContext("2d");
    const imgData = ctx.createImageData(width, height);
    let j = 0;
    for (let i = 0; i < imgData.data.length; i += 4) {
        // Modify pixel data
        console.log('====================================');
        console.log(Math.floor(matrix[j] * 255));
        console.log('====================================');
        imgData.data[i + 0] = Math.floor(matrix[j] * 255);  // R value
        imgData.data[i + 1] = Math.floor(matrix[j] * 255);    // G value
        imgData.data[i + 2] = Math.floor(matrix[j] * 255);  // B value
        imgData.data[i + 3] = 0;  // A value

        j += 1;
    }
    ctx.putImageData(imgData, width, height);
}
const PATH = 'https://raw.githubusercontent.com/PUC-Infovis/proyecto-keravis/network-idiom/logs/history/network-15710788366707638.json?token=AHDRWGAP3EOQYJPW7MMK7225VY5UG'

d3.json(PATH).then(json => {
    const m = matrixTo1D(json[0].layer_0[0]);
    matrixToImage(m);
})

const SOURCE = 'https://gist.githubusercontent.com/naquiroz/1fd9d012a724632b0ca889576aef5701/raw/64dd1d5717bc58cba4e78907985c7c2eec82137b/data.json';

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
