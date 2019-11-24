/* eslint-disable require-jsdoc */
class Events {
  static mouseOver(d, i) {
    const tooltipConfig = config.d3Configs.tooltips;
    const value = d;
    const tooltips = [
      `Actual value: ${value}`,
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
