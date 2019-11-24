/* eslint-disable require-jsdoc */
class Idiom {
  constructor(source, selector) {
    this.source = source;
    this.selector = selector;
    this.data;
    this.nextSimulationStep = this.nextSimulationStep.bind(this);
    this.simulate = this.simulate.bind(this);
    this.initilized = false;
    this.state = {

    };
  }

  createViewport() {
    const viewBox =
      `0 0 ${
        config.d3Configs.svgSize.width
      } ${
        config.d3Configs.svgSize.height
      }`;
    this.svgSelector = d3.select(this.selector)
        .append('svg')
        .attr('viewBox', viewBox);
  }

  getData() {
    return d3.json(this.source, function(error, data) {
      if (error) throw error;
    }).then((data) => this.data = data)
        .then(() => console.log('Data adquired!'));
  }

  initilize() {
    if (!this.initilized) {
      this.createViewport();
      console.debug(this, 'created');
      this.getData();
    }
  }

  setState(target, value) {
    this.state[target] = value;
    this.update();
  }

  update() {

  }

  simulate(index) {

  }

  nextSimulationStep(index) {

  }
}

