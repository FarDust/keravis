/* eslint-disable require-jsdoc */
class Idiom {
  constructor(sources, selector) {
    this.sources = sources;
    this.source = this.sources[0];
    this.selector = selector;
    this.data;
    this.nextSimulationStep = this.nextSimulationStep.bind(this);
    this.simulate = this.simulate.bind(this);
    this.reset = this.reset.bind(this);
    this.initilized = false;
    this.state = {
      focusSource: 0,
      focusTime: 0,
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
    }).then((data) => this.data = data);
  }

  initilize() {
    if (!this.initilized) {
      this.createViewport();
      this.getData();
    }
  }

  setState(target, value) {
    this.state[target] = value;
    this.update();
  }

  update() {

  }

  simulate() {

  }

  nextSimulationStep() {

  }

  nextSource() {
    if (this.state.focusSource === this.sources.length - 1) {
      this.setState('focusSource', 0);
    } else {
      this.setState('focusSource', this.state.focusSource + 1);
    }
    this.source = this.sources[this.state.focusSource];
    return this.source;
  }

  reset() {
    this.initilized = false;
    this.setState('focusTime', 0);
    this.source = this.nextSource();
    this.svgSelector.remove();
    this.initilize();
  }
}

