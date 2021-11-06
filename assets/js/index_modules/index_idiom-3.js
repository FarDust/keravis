/* eslint-disable require-jsdoc */

class Idiom3 extends Idiom {
  constructor(source, selector) {
    super(source, selector);
  }

  initilize() {
    if (!this.initilized) {
      super.initilize();
      const configs = config.d3Configs.nodes;
      const nodeGroup = this.svgSelector.append('g').attr('name', 'nodes');
      const layers = configs.layers;
      const input = this.svgSelector
          .append('g')
          .attr('name', 'input_layer');
      const xOffset = 100;
      const yOffset = 100;
      const yNodeSeparation = 50;
      const baseRadius = 10;
      const center = ((yOffset+((configs.result_length)*50))/2);
      this.createNetworkLayer(
          input, xOffset, center,
          configs.input.width,
          configs.input.height
      );

      const links = [
        {
          xStart: xOffset + configs.input.width,
          yStart: center,
          xEnd: xOffset + 100,
          yEnd: yOffset,
        },
        {
          xStart: xOffset + configs.input.width,
          yStart: center + configs.input.height,
          xEnd: xOffset + 100,
          yEnd: yOffset + (layers.length-1)*yNodeSeparation,
        },
      ];
      const secondaryLinks = [];
      for (let index = 0; index < layers.length; index++) {
        this.createNetworkNode(nodeGroup, xOffset + 100, yOffset + (index * yNodeSeparation), baseRadius, layers[index], 'conv1_layer');
        this.createNetworkNode(nodeGroup, xOffset + 200, yOffset + (index * yNodeSeparation), baseRadius, 'null_layer');
        for (let jIndex = 0; jIndex < layers.length; jIndex++) {
          links.push({
            xStart: xOffset + 100,
            yStart: yOffset + (index * yNodeSeparation),
            xEnd: xOffset + 200,
            yEnd: yOffset + (jIndex * yNodeSeparation),
          });
        }
      }
      for (let index = 0; index < configs.result_length; index++) {
        this.createNetworkNode(nodeGroup, xOffset + 300, center + (index * yNodeSeparation), baseRadius, `action-${index}`, 'output_layer')
            .classed('node-output', true);
        for (let jIndex = 0; jIndex < layers.length; jIndex++) {
          secondaryLinks.push({
            xStart: xOffset + 200,
            yStart: yOffset + (jIndex * yNodeSeparation),
            xEnd: xOffset + 300,
            yEnd: center + (index * yNodeSeparation),
          });
        }
      }

      const nodes = d3.selectAll('#network > svg g g[name=output_layer]').select('circle')
          .on('mouseenter',
              () => d3.select(this.simulationControl.outputNodes).each(Events.mouseOver)
          )
          .on('mouseout', Events.mouseOut);
      d3.selectAll('#network > svg g g[name=conv1_layer]')
          .on('mouseenter', Events.mouseOverImage);
      this.createLinks(links.concat(secondaryLinks));
    }
    this.initilized = true;
  }

  setSimulation() {
    this.simulationControl = {
      baseColor: d3.hsl('#23d160'),
      outputNodes: '#network > svg g g circle.node-output',
      convNodes: '#network > svg g g[name=conv1_layer]',
    };
  }

  nextSimulationStep() {
    if (this.data) {
      if (this.state.focusTime == this.data.length) {
        this.reset();
      } else {
        this.simulate();
      }
    } else {
      console.warn('Simulation started before data was acquired!');
    }
    this.setState('focusTime', this.state.focusTime + 1);
  }

  simulate() {
    const game = this.data[this.state.focusTime];
    const lightScale = d3.scaleLinear()
        .domain([Math.min(...game.action), Math.max(...game.action)])
        .range([0.8, 0.2]);
    this.updateNodes(this.simulationControl.outputNodes,
        lightScale,
        this.simulationControl.baseColor,
        game.action);
    const dataLayers = [];
    config.d3Configs.nodes.layers.forEach((layerName) => {
      dataLayers.push(game[layerName]);
    });
    d3.selectAll(this.simulationControl.convNodes)
        .data(dataLayers)
        .enter();
    d3.selectAll(this.simulationControl.outputNodes);
    // .each(Events.mouseOver).call(Events.mouseOut);
  }

  updateConv(selector) {

  }

  updateNodes(selector, scale, color, data) {
    const nodes = d3.selectAll(selector).data(data)
        // .enter()
        .attr('fill', (d) => {
          color.s = scale(d);
          return color + '';
        }).attr('value', (d) => d);
  }

  createNetworkNode(selector, cx, cy, r,
      id = 'null_layer', nameGroup = 'null_layer') {
    return selector.append('g')
        .attr('transform', `translate( ${cx} , ${cy} )`)
        .attr('name', nameGroup)
        .append('circle')
        .classed('node', true)
        .attr('fill', '#23d160')
        .attr('name', id)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', r);
  }

  createNetworkLayer(selector, x, y, width, height) {
    return selector.append('rect')
        .classed('layer', true)
        .attr('x', x)
        .attr('y', y)
        .attr('width', width)
        .attr('height', height);
  }

  createLinks(links) {
    const lines = this.svgSelector.selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .style('stroke', '#aaa');
    lines.attr('x1', (d) => d.xStart)
        .attr('y1', (d) => d.yStart)
        .attr('x2', (d) => d.xEnd)
        .attr('y2', (d)=> d.yEnd);
  }
}

