class Idiom {
  constructor(source, selector) {
    this.source = source;
    this.selector = selector;
    this.initilized = false;
    this.state = {

    }
  }

  createViewport() { 
    this.svgSelector = d3.select(this.selector)
      .append('svg')
      .attr("width", config.d3Configs.svgSize.width)
      .attr("height", config.d3Configs.svgSize.height)
  }

  initilize() {
    if (!this.initilized){
      this.createViewport()
    }
  }

  setState(target, value) {
    this.state[target] = value;
    this.update()
  }

  update() { 

  }
}

class Idiom2 extends Idiom {
  constructor(source, selector) {
    super(source, selector)
    this.data;
    this.source = source;
  }

  getData() { 
    d3.json(this.source, function(error, data) {
      if (error) throw error;
      
    }).then((data)=> this.data = data).then(() => this.startSimulation())
  }

  initilize() {
    if (!this.initilized) {
      super.initilize()
      const configs = config.d3Configs.nodes
      const nodeGroup = this.svgSelector.append('g').attr('name', 'nodes')
      const layers = configs.layers
      const input = this.svgSelector
        .append('g')
        .attr('name', 'input_layer')
      const xOffset = 100;
      const yOffset = 100;
      const yNodeSeparation = 50
      const baseRadius = 10;
      const center = ((yOffset+((configs.result_length)*50))/2)
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
          yEnd: yOffset
        },
        {
          xStart: xOffset + configs.input.width,
          yStart: center + configs.input.height,
          xEnd: xOffset + 100,
          yEnd: yOffset + (layers.length-1)*yNodeSeparation
        },
      ];
      const secondaryLinks = []
      for (let index = 0; index < layers.length; index++) {
        this.createNetworkNode(nodeGroup, xOffset + 100, yOffset + (index * yNodeSeparation), baseRadius, layers[index], 'conv1_layer')
        this.createNetworkNode(nodeGroup, xOffset + 200, yOffset + (index * yNodeSeparation), baseRadius, 'null_layer')
        for (let j_index = 0; j_index < layers.length; j_index++) {
          links.push({
            xStart: xOffset + 100,
            yStart: yOffset + (index * yNodeSeparation),
            xEnd: xOffset + 200,
            yEnd: yOffset + (j_index * yNodeSeparation)
          })
        }
      }
      for (let index = 0; index < configs.result_length; index++) {
        this.createNetworkNode(nodeGroup, xOffset + 300, center + (index * yNodeSeparation), baseRadius, `action-${index}`, 'output_layer')
          .classed('node-output', true)
        for (let j_index = 0; j_index < layers.length; j_index++) {
          secondaryLinks.push({
            xStart: xOffset + 200,
            yStart: yOffset + (j_index * yNodeSeparation),
            xEnd: xOffset + 300,
            yEnd: center + (index * yNodeSeparation),
          })
        }
      }
      let nodes = d3.selectAll('#network > svg g g[name=output_layer]').select('circle')
        .on('mouseenter', Events.mouseOver)
        .on('mouseout', Events.mouseOut)
      d3.selectAll('#network > svg g g[name=conv1_layer]')
        .on('mouseenter', Events.mouseOverImage)
        .on('mouseout', Events.mouseOut);
      this.createLinks(links.concat(secondaryLinks))
      this.getData();
    }
    this.initilized = true;
  }

  startSimulation() {
    let baseColor = d3.hsl("#23d160");
    let outputNodes = '#network > svg g g circle.node-output';
    let convNodes = '#network > svg g g[name=conv1_layer]'
    let timestep = 1000; 
    this.data.forEach( (game, index) => {
      setTimeout(() => {
        let lightScale = d3.scaleLinear()
          .domain([Math.min(...game.action), Math.max(...game.action)])
          .range([0.8, 0.2]);
        this.updateNodes(outputNodes, lightScale, baseColor, game.action)
        let data_layers = [];
        config.d3Configs.nodes.layers.forEach(layerName => {
          data_layers.push(game[layerName]);
        });
        d3.selectAll(convNodes)
          .data(data_layers)
          .enter()
      }, timestep*index);
    });
  }

  updateConv(selector) { 

  }

  updateNodes(selector, scale, color, data) {
    let nodes = d3.selectAll(selector).data(data)
      .attr('fill', (d) => {
        color.s = scale(d);
        return color + "";
      }).attr('value', d => d)
  }
  
  createNetworkNode(selector, cx, cy, r, id='null_layer', nameGroup='null_layer') {
    return selector.append('g')
      .attr("transform", `translate( ${cx} , ${cy} )`)
      .attr('name', nameGroup)
      .append('circle')
      .classed('node', true)
      .attr('fill', '#23d160')
      .attr('name', id)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', r)
  }

  createNetworkLayer(selector, x, y,  width, height) {
    return selector.append('rect')
        .classed('layer', true)
        .attr('x', x)
        .attr('y', y)
        .attr('width', width)
        .attr('height', height)
  }

  createLinks(links) {
    let lines = this.svgSelector.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#aaa')
    lines.attr('x1', d => d.xStart)
      .attr('y1', d => d.yStart)
      .attr('x2', d => d.xEnd)
      .attr('y2', d=> d.yEnd)
  }

}

let idiom = new Idiom2('../logs/history/network-15710788366707638.json', '#network')
idiom.initilize()