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
      .attr("width", '400')
      .attr("height",'400')
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
    d3.json(source, function(error, data) {
      if (error) throw error;
      
    }).then((data)=> this.data = data)
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
      const xOffset = 0;
      const yOffset = 100;
      const yNodeSeparation = 50
      const baseRadius = 10;
      const center = ((yOffset+((configs.result_length)*50))/2)
      this.createNetworkLayer(
        input, xOffset, center,
        configs.input.width,
        configs.input.height
        );

      for (let index = 0; index < layers.length; index++) {
        this.createNetworkNode(nodeGroup, xOffset+100, yOffset+(index*yNodeSeparation), baseRadius, layers[index])
        this.createNetworkNode(nodeGroup, xOffset+200, yOffset+(index*yNodeSeparation), baseRadius, 'null_layer')
      }
      for (let index = 0; index < configs.result_length; index++) {
        this.createNetworkNode(nodeGroup, xOffset + 300, center + (index * yNodeSeparation), baseRadius, `action-${index}`)
          .classed('node-output', true)
        
      }
    }
    this.initilized = true;
  }

  startSimulation() {
    let baseColor = d3.hsl("#23d160");
    let outputNodes = '#network > svg g g circle.node-output';
    let timestep = 1000; 
    this.data.forEach( (game, index) => {
      setTimeout(() => {
        let lightScale = d3.scaleLinear()
          .domain([Math.min(...game.action), Math.max(...game.action)])
          .range([0.7, 0.5]);
        this.updateNodes(outputNodes, lightScale, baseColor, game.action)
        console.log(index)
      }, timestep*index);
    });
  }

  updateNodes(selector, scale, color, data) {
    let nodes = d3.selectAll(selector).data(data)
      .attr('fill', (d) => {
        color.l = scale(d);
        return color + "";
      }).attr('value', d => d)
  }
  
  createNetworkNode(selector, cx, cy, r, name='null_layer') {
    return selector.append('g')
      .append('circle')
      .classed('node', true)
      .attr('fill', '#23d160')
      .attr('name', name)
      .attr('cx', cx)
      .attr('cy', cy)
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

}

let idiom = new Idiom2('logs/history/network-15710788366707638.json', '#network')
idiom.initilize()