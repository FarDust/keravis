/* eslint-disable require-jsdoc */

const arrayToImageURI = (array) => {
  const width = array[0].length;
  const height = array[0][0].length;
  const buffer = new Uint8ClampedArray(width * height * 4);
  const max = d3.max(array[0], (d) => {
    return d3.max(d);
  });
  const min = d3.min(array[0], (d) => {
    return d3.min(d);
  });
  const scale = d3.scaleLinear().domain([min, max]).range([0, 255]);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = (y * width + x) * 4; // position in buffer based on x and y
      buffer[pos] = scale(array[0][x][y]); // some R value [0, 255]
      buffer[pos+1] = scale(array[0][x][y]); // some G value
      buffer[pos+2] = scale(array[0][x][y]); // some B value
      buffer[pos+3] = 255; // set alpha channel
    }
  }
  // create off-screen canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  // create imageData object
  const idata = ctx.createImageData(width, height);

  // set our buffer as source
  idata.data.set(buffer);

  // update canvas with new data
  ctx.putImageData(idata, 0, 0);

  ctx.scale(100, 100);
  const dataURI = canvas.toDataURL(); // produces a PNG file

  return dataURI;
};

class Events {
  static mouseOver(d, i) {
    const tooltipConfig = config.d3Configs.tooltips;
    const value = d;
    const tooltips = [
      `Actual value: ${Math.round((value + Number.EPSILON) * 1000) / 1000}`,
    ];
    const group = d3.select(this.parentNode)
        .raise()
        .insert('g')
        .classed('text-tooltip', true)
        .attr('name', 'temporal-text');
    group.append('rect')
        .attr('x', tooltipConfig.xDiference-tooltipConfig.padding)
        .attr('y', `${tooltipConfig.yBase*2}em`)
        .classed('text-tooltip-square', true)
        .attr('rx', `${tooltipConfig.viewport/tooltipConfig.vectorRadius}vw`)
        .attr('ry', `${tooltipConfig.viewport/tooltipConfig.vectorRadius}vw`)
        .attr('width', `${tooltipConfig.viewport}vw`)
        .attr('height', `${tooltips.length + .5}em`);
    group.tooltip = D3Utils.createTooltip;
    for (let index = 0; index < tooltips.length; index++) {
      group.tooltip(
          tooltips[index],
          tooltipConfig.xDiference, `${tooltipConfig.yBase + index}em`);
    }
  }

  static mouseOut(d, i) {
    d3.selectAll('g[name=temporal-text]')
        .transition()
        .duration(
            config.d3Configs.tooltips.timeLapse
        )
        .style('opacity', 0)
        .remove();
  }

  static mouseOverImage(d, i) {
    Events.mouseOut(d, i);
    const tooltipConfig = config.d3Configs.tooltips;
    d3.select(this.childNodes[0]).attr('r', 15);
    const group = d3.select(this.parentNode)
        .raise()
        .insert('g')
        .classed('text-tooltip', true)
        .attr('name', 'temporal-text');
    const image = group
        .append('svg:image')
        .attr('x', 400+tooltipConfig.xDiference-tooltipConfig.padding)
        .attr('y', `${-5*tooltipConfig.yBase}em`)
        .attr('width', 200 )
        .attr('height', 200 )
        .attr('xlink:href', 'img/loading.gif');
    /*
    This code was intended to load images from the server.

    fetch(
        config.d3Configs.nodes.url,
        {
          method: 'POST',
          body: JSON.stringify(d),
          headers: {
            'Content-Type': 'application/json',
          },
        }
    ).then((response) => response.blob()).then((blob) => {
      const outside = URL.createObjectURL(blob);
      image
          .attr('xlink:href', outside);
      d3.select(this.childNodes[0]).attr('r', 10);
    }
    );
    */
    image.attr('xlink:href', arrayToImageURI(d));
  }
}

class D3Utils {
  static createTooltip(fn, x=10, y='-1em') {
    this.append('text')
        .attr('x', x)
        .attr('y', y)
        .text(fn);
  }
}
